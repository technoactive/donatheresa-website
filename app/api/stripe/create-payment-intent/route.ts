import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route creates a Stripe PaymentIntent for deposit collection
// The payment is authorized but NOT captured until marked as no-show

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, customerEmail, customerName, partySize, bookingDate, bookingTime } = await request.json()

    // Validate required fields
    if (!bookingId || !amount || !partySize) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 503 }
      )
    }

    // Dynamically import Stripe (only if keys are available)
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Create a PaymentIntent with manual capture
    // This authorizes the card but doesn't charge until we capture
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in pence
      currency: 'gbp',
      capture_method: 'manual', // Important: Don't capture immediately
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_id: bookingId,
        party_size: partySize.toString(),
        booking_date: bookingDate,
        booking_time: bookingTime,
        type: 'restaurant_deposit'
      },
      receipt_email: customerEmail || undefined,
      description: `Deposit for table booking at Dona Theresa - ${partySize} guests on ${bookingDate} at ${bookingTime}`,
      statement_descriptor: 'DONA THERESA DEP',
      statement_descriptor_suffix: 'DEPOSIT',
    })

    // Update booking with payment intent ID
    const supabase = await createClient()
    await supabase
      .from('bookings')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        deposit_status: 'pending',
        deposit_amount: amount,
        deposit_required: true
      })
      .eq('id', bookingId)

    // Log the transaction
    await supabase
      .from('deposit_transactions')
      .insert({
        booking_id: bookingId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount,
        action: 'created',
        reason: 'Payment intent created for deposit',
        performed_by: 'system',
        metadata: {
          party_size: partySize,
          booking_date: bookingDate,
          booking_time: bookingTime
        }
      })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
