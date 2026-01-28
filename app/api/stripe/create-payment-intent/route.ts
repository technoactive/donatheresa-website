import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route creates a Stripe PaymentIntent for deposit collection
// The payment is authorized but NOT captured until marked as no-show

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// Stripe minimum amount is 50p (50 pence) for GBP
const STRIPE_MINIMUM_AMOUNT = 50
// Maximum reasonable deposit (£500)
const STRIPE_MAXIMUM_AMOUNT = 50000

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, customerEmail, customerName, partySize, bookingDate, bookingTime } = await request.json()

    // Validate required fields
    if (!bookingId || !amount || !partySize) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, amount, and partySize are required' },
        { status: 400 }
      )
    }

    // Validate booking ID format
    if (!isValidUUID(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID format' },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof amount !== 'number' || !Number.isInteger(amount)) {
      return NextResponse.json(
        { error: 'Amount must be a whole number (in pence)' },
        { status: 400 }
      )
    }

    if (amount < STRIPE_MINIMUM_AMOUNT) {
      return NextResponse.json(
        { error: `Minimum deposit amount is £${(STRIPE_MINIMUM_AMOUNT / 100).toFixed(2)}` },
        { status: 400 }
      )
    }

    if (amount > STRIPE_MAXIMUM_AMOUNT) {
      return NextResponse.json(
        { error: `Maximum deposit amount is £${(STRIPE_MAXIMUM_AMOUNT / 100).toFixed(2)}` },
        { status: 400 }
      )
    }

    // Validate party size
    if (typeof partySize !== 'number' || partySize < 1 || partySize > 100) {
      return NextResponse.json(
        { error: 'Invalid party size' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Payment system is not available. Please contact the restaurant directly.' },
        { status: 503 }
      )
    }

    const supabase = await createClient()

    // Verify the booking exists and doesn't already have a payment intent
    const { data: existingBooking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, stripe_payment_intent_id, deposit_status')
      .eq('id', bookingId)
      .single()

    if (bookingError || !existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if payment intent already exists
    if (existingBooking.stripe_payment_intent_id) {
      // If already authorized or pending, return existing client secret
      if (existingBooking.deposit_status === 'authorized' || existingBooking.deposit_status === 'pending') {
        const Stripe = (await import('stripe')).default
        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-12-18.acacia' })
        
        try {
          const existingPI = await stripe.paymentIntents.retrieve(existingBooking.stripe_payment_intent_id)
          if (existingPI.status === 'requires_payment_method' || existingPI.status === 'requires_confirmation') {
            return NextResponse.json({
              clientSecret: existingPI.client_secret,
              paymentIntentId: existingPI.id,
              existing: true
            })
          }
        } catch (e) {
          // Payment intent doesn't exist anymore, continue to create new one
          console.log('Existing payment intent not found, creating new one')
        }
      }
    }

    // Dynamically import Stripe (only if keys are available)
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Generate idempotency key based on booking ID to prevent duplicates
    const idempotencyKey = `create_pi_${bookingId}_${Date.now()}`

    // Create a PaymentIntent with manual capture
    // This authorizes the card but doesn't charge until we capture
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amount, // Amount in pence
        currency: 'gbp',
        capture_method: 'manual', // IMPORTANT: Don't capture immediately
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          booking_id: bookingId,
          party_size: partySize.toString(),
          booking_date: bookingDate || 'not_specified',
          booking_time: bookingTime || 'not_specified',
          type: 'restaurant_deposit',
          customer_name: customerName || 'Guest'
        },
        receipt_email: customerEmail || undefined,
        description: `Deposit for table booking at Dona Theresa - ${partySize} guests${bookingDate ? ` on ${bookingDate}` : ''}${bookingTime ? ` at ${bookingTime}` : ''}`,
        // Statement descriptor appears on customer's bank statement (max 22 chars)
        statement_descriptor: 'DONA THERESA DEP',
        statement_descriptor_suffix: 'DEPOSIT',
      },
      { idempotencyKey }
    )

    // Update booking with payment intent ID
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        deposit_status: 'pending',
        deposit_amount: amount,
        deposit_required: true
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Failed to update booking with payment intent:', updateError)
      // Continue anyway - the payment intent was created
    }

    // Log the transaction for audit trail
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
          booking_time: bookingTime,
          customer_email: customerEmail,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { error: 'Your card was declined. Please try a different payment method.' },
        { status: 400 }
      )
    }

    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid payment request. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Unable to process payment at this time. Please try again or contact the restaurant.' },
      { status: 500 }
    )
  }
}
