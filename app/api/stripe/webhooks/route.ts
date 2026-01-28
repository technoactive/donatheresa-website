import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Stripe webhook handler
// Receives events from Stripe about payment status changes
// IMPORTANT: This endpoint uses raw body parsing - do not use JSON middleware

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey) {
      console.error('❌ Stripe secret key not configured')
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 })
    }

    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature in webhook request')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    let event: any

    // Verify webhook signature - CRITICAL for security
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err: any) {
        console.error('❌ Webhook signature verification failed:', err.message)
        return NextResponse.json(
          { error: 'Invalid signature - webhook rejected' },
          { status: 400 }
        )
      }
    } else {
      // DEVELOPMENT ONLY - should never happen in production
      console.warn('⚠️ SECURITY WARNING: Webhook secret not configured - signature not verified')
      console.warn('⚠️ Set STRIPE_WEBHOOK_SECRET in production!')
      try {
        event = JSON.parse(body)
      } catch (parseError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      }
    }

    const supabase = await createClient()

    // Log all incoming events for debugging
    console.log(`📥 Webhook received: ${event.type}`, {
      eventId: event.id,
      timestamp: new Date().toISOString()
    })

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log('💳 Payment intent succeeded:', paymentIntent.id)

        // For manual capture, 'succeeded' means authorized (not captured)
        const newStatus = paymentIntent.capture_method === 'manual' ? 'authorized' : 'captured'

        // Update booking deposit status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ 
            deposit_status: newStatus,
            ...(newStatus === 'captured' && { deposit_captured_at: new Date().toISOString() })
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Failed to update booking from webhook:', updateError)
        }

        // Log transaction
        await supabase
          .from('deposit_transactions')
          .insert({
            booking_id: paymentIntent.metadata?.booking_id || null,
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            action: newStatus,
            reason: `Card ${newStatus === 'authorized' ? 'authorized' : 'charged'} successfully via Stripe`,
            performed_by: 'stripe_webhook',
            metadata: {
              event_id: event.id,
              capture_method: paymentIntent.capture_method
            }
          })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('❌ Payment intent failed:', paymentIntent.id)

        // Update booking deposit status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ 
            deposit_status: 'none',
            deposit_required: false 
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Failed to update booking from webhook:', updateError)
        }

        // Log transaction
        await supabase
          .from('deposit_transactions')
          .insert({
            booking_id: paymentIntent.metadata?.booking_id || null,
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            action: 'failed',
            reason: paymentIntent.last_payment_error?.message || 'Payment failed',
            performed_by: 'stripe_webhook',
            metadata: {
              event_id: event.id,
              error_code: paymentIntent.last_payment_error?.code,
              decline_code: paymentIntent.last_payment_error?.decline_code
            }
          })
        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object
        console.log('🚫 Payment intent canceled:', paymentIntent.id)

        await supabase
          .from('bookings')
          .update({ deposit_status: 'cancelled' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        await supabase
          .from('deposit_transactions')
          .insert({
            booking_id: paymentIntent.metadata?.booking_id || null,
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            action: 'cancelled',
            reason: 'Authorization cancelled via Stripe',
            performed_by: 'stripe_webhook',
            metadata: { event_id: event.id }
          })
        break
      }

      case 'payment_intent.amount_capturable_updated': {
        // This fires when the authorization amount changes or when authorization is confirmed
        const paymentIntent = event.data.object
        console.log('💰 Amount capturable updated:', paymentIntent.id, paymentIntent.amount_capturable)
        
        if (paymentIntent.amount_capturable > 0) {
          // Authorization confirmed
          await supabase
            .from('bookings')
            .update({ deposit_status: 'authorized' })
            .eq('stripe_payment_intent_id', paymentIntent.id)
        }
        break
      }

      case 'charge.captured': {
        const charge = event.data.object
        console.log('💵 Charge captured:', charge.id)

        if (charge.payment_intent) {
          await supabase
            .from('bookings')
            .update({ 
              deposit_status: 'captured',
              deposit_captured_at: new Date().toISOString()
            })
            .eq('stripe_payment_intent_id', charge.payment_intent)

          await supabase
            .from('deposit_transactions')
            .insert({
              stripe_payment_intent_id: charge.payment_intent as string,
              stripe_charge_id: charge.id,
              amount: charge.amount,
              action: 'captured',
              reason: 'Deposit captured via Stripe',
              performed_by: 'stripe_webhook',
              metadata: { event_id: event.id }
            })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object
        console.log('💸 Charge refunded:', charge.id)

        if (charge.payment_intent) {
          const isFullRefund = charge.amount_refunded >= charge.amount
          
          await supabase
            .from('bookings')
            .update({ 
              deposit_status: isFullRefund ? 'refunded' : 'partially_refunded',
              deposit_refund_amount: charge.amount_refunded,
              deposit_refunded_at: new Date().toISOString()
            })
            .eq('stripe_payment_intent_id', charge.payment_intent)

          await supabase
            .from('deposit_transactions')
            .insert({
              stripe_payment_intent_id: charge.payment_intent as string,
              stripe_charge_id: charge.id,
              amount: charge.amount_refunded,
              action: isFullRefund ? 'refunded' : 'partial_refund',
              reason: 'Refund processed via Stripe',
              performed_by: 'stripe_webhook',
              metadata: { 
                event_id: event.id,
                original_amount: charge.amount,
                refunded_amount: charge.amount_refunded
              }
            })
        }
        break
      }

      case 'charge.dispute.created': {
        // Handle disputes - important for fraud prevention
        const dispute = event.data.object
        console.log('⚠️ Dispute created:', dispute.id)

        // TODO: Send notification to admin about dispute
        // TODO: Update booking status to reflect dispute
        break
      }

      default:
        // Log unhandled events but don't fail
        console.log(`ℹ️ Unhandled webhook event type: ${event.type}`)
    }

    // Always return 200 to acknowledge receipt
    // Stripe will retry on non-2xx responses
    return NextResponse.json({ 
      received: true,
      eventType: event.type,
      eventId: event.id
    })

  } catch (error) {
    console.error('❌ Webhook handler error:', error)
    // Return 500 so Stripe will retry
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
