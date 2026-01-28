import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route refunds a captured deposit (returns money to customer)
// Used when you want to give a refund after the deposit was already charged

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Stripe minimum amount is 50p (50 pence)
const STRIPE_MINIMUM_AMOUNT = 50

export async function POST(request: NextRequest) {
  try {
    // Check authentication - must be logged in
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to the dashboard' },
        { status: 401 }
      )
    }

    const { bookingId, amount, reason } = await request.json()

    // Validate booking ID
    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    if (!isValidUUID(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      )
    }

    // Validate amount if provided
    if (amount !== undefined && amount !== null) {
      if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < STRIPE_MINIMUM_AMOUNT) {
        return NextResponse.json(
          { error: `Refund amount must be at least £${(STRIPE_MINIMUM_AMOUNT / 100).toFixed(2)}` },
          { status: 400 }
        )
      }
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Get booking with payment intent
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('stripe_payment_intent_id, deposit_amount, deposit_status, deposit_refund_amount')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (!booking.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: 'No payment found for this booking' },
        { status: 400 }
      )
    }

    // Check current status - can only refund captured or partially_refunded
    if (booking.deposit_status !== 'captured' && booking.deposit_status !== 'partially_refunded') {
      if (booking.deposit_status === 'authorized' || booking.deposit_status === 'pending') {
        return NextResponse.json(
          { error: 'Deposit has not been charged yet. Use "Release Authorization" instead of refund.' },
          { status: 400 }
        )
      }
      if (booking.deposit_status === 'refunded') {
        return NextResponse.json(
          { error: 'Deposit has already been fully refunded' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Cannot refund - deposit is in state: ' + booking.deposit_status },
        { status: 400 }
      )
    }

    // Determine refund amount
    const refundAmount = amount || booking.deposit_amount
    const alreadyRefunded = booking.deposit_refund_amount || 0
    const maxRefundable = booking.deposit_amount - alreadyRefunded

    if (maxRefundable <= 0) {
      return NextResponse.json(
        { error: 'No remaining amount to refund' },
        { status: 400 }
      )
    }

    if (refundAmount > maxRefundable) {
      return NextResponse.json(
        { error: `Cannot refund more than £${(maxRefundable / 100).toFixed(2)}. Already refunded: £${(alreadyRefunded / 100).toFixed(2)}` },
        { status: 400 }
      )
    }

    if (refundAmount < STRIPE_MINIMUM_AMOUNT && refundAmount < maxRefundable) {
      return NextResponse.json(
        { error: `Minimum refund amount is £${(STRIPE_MINIMUM_AMOUNT / 100).toFixed(2)}` },
        { status: 400 }
      )
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Generate idempotency key
    const idempotencyKey = `refund_${bookingId}_${refundAmount}_${Date.now()}`

    try {
      // Create refund with idempotency key
      const refund = await stripe.refunds.create(
        {
          payment_intent: booking.stripe_payment_intent_id,
          amount: refundAmount,
          reason: 'requested_by_customer',
          metadata: {
            booking_id: bookingId,
            custom_reason: reason || 'Refund requested',
            performed_by: user.email || 'dashboard'
          }
        },
        { idempotencyKey }
      )

      // Calculate new totals
      const newTotalRefunded = alreadyRefunded + refundAmount
      const isFullyRefunded = newTotalRefunded >= booking.deposit_amount

      // Update booking status with optimistic locking
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          deposit_status: isFullyRefunded ? 'refunded' : 'partially_refunded',
          deposit_refunded_at: new Date().toISOString(),
          deposit_refund_amount: newTotalRefunded
        })
        .eq('id', bookingId)
        .in('deposit_status', ['captured', 'partially_refunded'])

      if (updateError) {
        console.error('Failed to update booking status:', updateError)
        // Refund was processed but DB update failed - log for manual reconciliation
      }

      // Log the transaction with full audit info
      await supabase
        .from('deposit_transactions')
        .insert({
          booking_id: bookingId,
          stripe_payment_intent_id: booking.stripe_payment_intent_id,
          stripe_refund_id: refund.id,
          amount: refundAmount,
          action: isFullyRefunded ? 'refunded' : 'partial_refund',
          reason: reason || 'Refund processed',
          performed_by: user.email || 'dashboard',
          metadata: {
            user_id: user.id,
            total_refunded: newTotalRefunded,
            original_amount: booking.deposit_amount,
            refunded_at: new Date().toISOString(),
            ip_address: request.headers.get('x-forwarded-for') || 'unknown'
          }
        })

      return NextResponse.json({
        success: true,
        message: isFullyRefunded ? 'Full refund processed' : 'Partial refund processed',
        refundedAmount: refundAmount,
        totalRefunded: newTotalRefunded,
        remainingAmount: booking.deposit_amount - newTotalRefunded,
        refundId: refund.id
      })

    } catch (stripeError: any) {
      console.error('Stripe refund error:', stripeError)

      // Handle specific Stripe errors
      if (stripeError.code === 'charge_already_refunded') {
        return NextResponse.json(
          { error: 'This charge has already been refunded' },
          { status: 400 }
        )
      }

      if (stripeError.code === 'amount_too_large') {
        return NextResponse.json(
          { error: 'Refund amount exceeds the original charge' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to process refund. Please try again or contact support.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error refunding deposit:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
