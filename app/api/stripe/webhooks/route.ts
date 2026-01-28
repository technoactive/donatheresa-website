import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Stripe webhook handler
// Receives events from Stripe about payment status changes

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeSecretKey) {
      console.error('Stripe secret key not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Dynamically import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    let event: any

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    } else {
      // If no webhook secret, parse the body directly (not recommended for production)
      event = JSON.parse(body)
      console.warn('⚠️ Webhook secret not configured - signature not verified')
    }

    const supabase = await createClient()

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log('💰 Payment intent succeeded:', paymentIntent.id)

        // Update booking deposit status to authorized
        await supabase
          .from('bookings')
          .update({ deposit_status: 'authorized' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        // Log transaction
        await supabase
          .from('deposit_transactions')
          .insert({
            booking_id: paymentIntent.metadata?.booking_id,
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            action: 'authorized',
            reason: 'Card authorized successfully',
            performed_by: 'system'
          })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('❌ Payment intent failed:', paymentIntent.id)

        // Update booking deposit status
        await supabase
          .from('bookings')
          .update({ deposit_status: 'none', deposit_required: false })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        // Log transaction
        await supabase
          .from('deposit_transactions')
          .insert({
            booking_id: paymentIntent.metadata?.booking_id,
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            action: 'failed',
            reason: paymentIntent.last_payment_error?.message || 'Payment failed',
            performed_by: 'system'
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
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object
        console.log('💸 Charge refunded:', charge.id)

        // Update booking if we can find it
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
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Disable body parsing for webhooks (Stripe requires raw body)
export const config = {
  api: {
    bodyParser: false,
  },
}
