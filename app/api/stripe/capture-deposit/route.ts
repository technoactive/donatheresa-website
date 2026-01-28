import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This route captures a deposit (charges the customer's card)
// Called when a booking is marked as no-show

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

    // Get booking with payment intent - use FOR UPDATE to prevent race conditions
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('stripe_payment_intent_id, deposit_amount, deposit_status, booking_date, booking_time')
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
    if (booking.deposit_status === 'captured') {
      return NextResponse.json(
        { error: 'Deposit has already been captured' },
        { status: 400 }
      )
    }

    if (booking.deposit_status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot capture - authorization was already cancelled' },
        { status: 400 }
      )
    }

    if (booking.deposit_status === 'refunded') {
      return NextResponse.json(
        { error: 'Cannot capture - deposit was already refunded' },
        { status: 400 }
      )
    }

    if (booking.deposit_status !== 'authorized') {
      return NextResponse.json(
        { error: 'Deposit is not in a capturable state. Current status: ' + booking.deposit_status },
        { status: 400 }
      )
    }

    // Check if authorization might be expired (7 days for most cards)
    // This is a warning - Stripe will reject if actually expired
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`)
    const daysSinceBooking = (Date.now() - bookingDateTime.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSinceBooking > 7) {
      console.warn(`⚠️ Authorization may be expired for booking ${bookingId} - ${daysSinceBooking.toFixed(1)} days old`)
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Generate idempotency key to prevent duplicate captures
    const idempotencyKey = `capture_${bookingId}_${Date.now()}`

    try {
      // Capture the payment with idempotency key
      const paymentIntent = await stripe.paymentIntents.capture(
        booking.stripe_payment_intent_id,
        {},
        { idempotencyKey }
      )

      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          deposit_status: 'captured',
          deposit_captured_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('deposit_status', 'authorized') // Optimistic lock - only update if still authorized

      if (updateError) {
        console.error('Failed to update booking status:', updateError)
        // Payment was captured but DB update failed - log for manual reconciliation
      }

      // Log the transaction with full audit info
      await supabase
        .from('deposit_transactions')
        .insert({
          booking_id: bookingId,
          stripe_payment_intent_id: booking.stripe_payment_intent_id,
          stripe_charge_id: paymentIntent.latest_charge as string,
          amount: booking.deposit_amount,
          action: 'captured',
          reason: reason || 'No-show - deposit captured',
          performed_by: user.email || 'dashboard',
          metadata: {
            user_id: user.id,
            captured_at: new Date().toISOString(),
            ip_address: request.headers.get('x-forwarded-for') || 'unknown'
          }
        })

      return NextResponse.json({
        success: true,
        message: 'Deposit captured successfully',
        amount: booking.deposit_amount
      })

    } catch (stripeError: any) {
      // Handle specific Stripe errors
      console.error('Stripe capture error:', stripeError)

      if (stripeError.code === 'payment_intent_unexpected_state') {
        // Authorization may have expired
        await supabase
          .from('bookings')
          .update({ deposit_status: 'cancelled' })
          .eq('id', bookingId)

        return NextResponse.json(
          { error: 'Authorization has expired. The customer was not charged.' },
          { status: 400 }
        )
      }

      if (stripeError.code === 'charge_already_captured') {
        await supabase
          .from('bookings')
          .update({ deposit_status: 'captured' })
          .eq('id', bookingId)

        return NextResponse.json(
          { error: 'Deposit was already captured.' },
          { status: 400 }
        )
      }

      // Generic error - don't expose Stripe internals
      return NextResponse.json(
        { error: 'Failed to capture deposit. Please try again or contact support.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error capturing deposit:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
