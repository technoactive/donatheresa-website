import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route cancels a deposit authorization (releases the hold on customer's card)
// Called when a booking is marked as attended or cancelled with enough notice

export async function POST(request: NextRequest) {
  try {
    const { bookingId, reason } = await request.json()

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
        { error: 'No payment intent found for this booking' },
        { status: 400 }
      )
    }

    if (booking.deposit_status === 'cancelled') {
      return NextResponse.json(
        { error: 'Deposit authorization has already been cancelled' },
        { status: 400 }
      )
    }

    if (booking.deposit_status === 'captured') {
      return NextResponse.json(
        { error: 'Cannot cancel - deposit has already been captured. Use refund instead.' },
        { status: 400 }
      )
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Cancel the payment intent (releases the authorization)
    await stripe.paymentIntents.cancel(booking.stripe_payment_intent_id)

    // Update booking status
    await supabase
      .from('bookings')
      .update({
        deposit_status: 'cancelled'
      })
      .eq('id', bookingId)

    // Log the transaction
    await supabase
      .from('deposit_transactions')
      .insert({
        booking_id: bookingId,
        stripe_payment_intent_id: booking.stripe_payment_intent_id,
        amount: booking.deposit_amount,
        action: 'cancelled',
        reason: reason || 'Authorization cancelled - no charge applied',
        performed_by: 'dashboard'
      })

    return NextResponse.json({
      success: true,
      message: 'Deposit authorization cancelled - customer will not be charged'
    })

  } catch (error) {
    console.error('Error cancelling deposit:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to cancel deposit' },
      { status: 500 }
    )
  }
}
