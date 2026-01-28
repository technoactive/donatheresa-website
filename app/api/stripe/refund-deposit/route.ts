import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route refunds a captured deposit (returns money to customer)
// Used when you want to give a refund after the deposit was already charged

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, reason } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      )
    }

    const supabase = await createClient()

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
        { error: 'No payment intent found for this booking' },
        { status: 400 }
      )
    }

    if (booking.deposit_status !== 'captured') {
      return NextResponse.json(
        { error: 'Can only refund captured deposits. Use cancel for uncaptured authorizations.' },
        { status: 400 }
      )
    }

    // Determine refund amount
    const refundAmount = amount || booking.deposit_amount
    const alreadyRefunded = booking.deposit_refund_amount || 0
    const maxRefundable = booking.deposit_amount - alreadyRefunded

    if (refundAmount > maxRefundable) {
      return NextResponse.json(
        { error: `Cannot refund more than £${(maxRefundable / 100).toFixed(2)}` },
        { status: 400 }
      )
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent_id,
      amount: refundAmount,
      reason: 'requested_by_customer',
      metadata: {
        booking_id: bookingId,
        custom_reason: reason || 'Refund requested'
      }
    })

    // Calculate new totals
    const newTotalRefunded = alreadyRefunded + refundAmount
    const isFullyRefunded = newTotalRefunded >= booking.deposit_amount

    // Update booking status
    await supabase
      .from('bookings')
      .update({
        deposit_status: isFullyRefunded ? 'refunded' : 'partially_refunded',
        deposit_refunded_at: new Date().toISOString(),
        deposit_refund_amount: newTotalRefunded
      })
      .eq('id', bookingId)

    // Log the transaction
    await supabase
      .from('deposit_transactions')
      .insert({
        booking_id: bookingId,
        stripe_payment_intent_id: booking.stripe_payment_intent_id,
        stripe_refund_id: refund.id,
        amount: refundAmount,
        action: isFullyRefunded ? 'refunded' : 'partial_refund',
        reason: reason || 'Refund processed',
        performed_by: 'dashboard',
        metadata: {
          total_refunded: newTotalRefunded,
          original_amount: booking.deposit_amount
        }
      })

    return NextResponse.json({
      success: true,
      message: isFullyRefunded ? 'Full refund processed' : 'Partial refund processed',
      refundedAmount: refundAmount,
      totalRefunded: newTotalRefunded,
      refundId: refund.id
    })

  } catch (error) {
    console.error('Error refunding deposit:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refund deposit' },
      { status: 500 }
    )
  }
}
