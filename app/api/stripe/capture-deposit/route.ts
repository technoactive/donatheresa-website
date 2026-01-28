import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route captures a deposit (charges the customer's card)
// Called when a booking is marked as no-show

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

    if (booking.deposit_status === 'captured') {
      return NextResponse.json(
        { error: 'Deposit has already been captured' },
        { status: 400 }
      )
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Capture the payment
    const paymentIntent = await stripe.paymentIntents.capture(
      booking.stripe_payment_intent_id
    )

    // Update booking status
    await supabase
      .from('bookings')
      .update({
        deposit_status: 'captured',
        deposit_captured_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    // Log the transaction
    await supabase
      .from('deposit_transactions')
      .insert({
        booking_id: bookingId,
        stripe_payment_intent_id: booking.stripe_payment_intent_id,
        stripe_charge_id: paymentIntent.latest_charge as string,
        amount: booking.deposit_amount,
        action: 'captured',
        reason: reason || 'No-show - deposit captured',
        performed_by: 'dashboard'
      })

    return NextResponse.json({
      success: true,
      message: 'Deposit captured successfully',
      amount: booking.deposit_amount
    })

  } catch (error) {
    console.error('Error capturing deposit:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to capture deposit' },
      { status: 500 }
    )
  }
}
