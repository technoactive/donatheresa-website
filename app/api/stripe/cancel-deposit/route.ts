import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route cancels a deposit authorization (releases the hold on customer's card)
// Called when a booking is marked as attended or cancelled with enough notice

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

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

    const { bookingId, reason } = await request.json()

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
      .select('stripe_payment_intent_id, deposit_amount, deposit_status')
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
        { error: 'No deposit authorization found for this booking' },
        { status: 400 }
      )
    }

    // Check current status
    if (booking.deposit_status === 'cancelled') {
      return NextResponse.json(
        { error: 'Authorization has already been cancelled' },
        { status: 400 }
      )
    }

    if (booking.deposit_status === 'captured') {
      return NextResponse.json(
        { error: 'Cannot cancel - deposit has already been charged. Use refund instead.' },
        { status: 400 }
      )
    }

    if (booking.deposit_status === 'refunded' || booking.deposit_status === 'partially_refunded') {
      return NextResponse.json(
        { error: 'Cannot cancel - deposit has already been processed' },
        { status: 400 }
      )
    }

    if (booking.deposit_status !== 'authorized' && booking.deposit_status !== 'pending') {
      return NextResponse.json(
        { error: 'Deposit is not in a cancellable state. Current status: ' + booking.deposit_status },
        { status: 400 }
      )
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Generate idempotency key
    const idempotencyKey = `cancel_${bookingId}_${Date.now()}`

    try {
      // Cancel the payment intent (releases the authorization)
      await stripe.paymentIntents.cancel(
        booking.stripe_payment_intent_id,
        {},
        { idempotencyKey }
      )

      // Update booking status with optimistic locking
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          deposit_status: 'cancelled'
        })
        .eq('id', bookingId)
        .in('deposit_status', ['authorized', 'pending'])

      if (updateError) {
        console.error('Failed to update booking status:', updateError)
      }

      // Log the transaction with full audit info
      await supabase
        .from('deposit_transactions')
        .insert({
          booking_id: bookingId,
          stripe_payment_intent_id: booking.stripe_payment_intent_id,
          amount: booking.deposit_amount,
          action: 'cancelled',
          reason: reason || 'Authorization cancelled - no charge applied',
          performed_by: user.email || 'dashboard',
          metadata: {
            user_id: user.id,
            cancelled_at: new Date().toISOString(),
            ip_address: request.headers.get('x-forwarded-for') || 'unknown'
          }
        })

      return NextResponse.json({
        success: true,
        message: 'Deposit authorization cancelled - customer will not be charged'
      })

    } catch (stripeError: any) {
      console.error('Stripe cancel error:', stripeError)

      // Handle specific Stripe errors
      if (stripeError.code === 'payment_intent_unexpected_state') {
        // Already cancelled or in wrong state
        await supabase
          .from('bookings')
          .update({ deposit_status: 'cancelled' })
          .eq('id', bookingId)

        return NextResponse.json({
          success: true,
          message: 'Authorization was already cancelled'
        })
      }

      return NextResponse.json(
        { error: 'Failed to cancel authorization. Please try again or contact support.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error cancelling deposit:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
