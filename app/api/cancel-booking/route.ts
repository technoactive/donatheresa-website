import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch booking details by cancellation token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing cancellation token' }, { status: 400 })
    }

    // Validate token format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(token)) {
      return NextResponse.json({ error: 'Invalid cancellation link' }, { status: 400 })
    }

    const supabase = await createClient()

    // Use the secure function to get booking details
    const { data, error } = await supabase.rpc('get_booking_by_cancellation_token', {
      p_token: token
    })

    if (error) {
      console.error('Error fetching booking:', error)
      return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Booking not found or link has expired' }, { status: 404 })
    }

    const booking = data[0]

    // Get deposit info for this booking
    const { data: bookingDetails } = await supabase
      .from('bookings')
      .select('deposit_required, deposit_amount, deposit_status')
      .eq('id', booking.id)
      .single()

    // Get deposit and cancellation policy settings
    const { data: configData } = await supabase
      .from('booking_config')
      .select('deposit_cancellation_hours, deposit_late_cancel_charge_percent')
      .single()

    const cancellationHours = configData?.deposit_cancellation_hours || 48
    const lateCancelPercent = configData?.deposit_late_cancel_charge_percent || 100

    // Calculate if this is a late cancellation
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`)
    const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60)
    const isLateCancellation = hoursUntilBooking < cancellationHours

    // Show deposit info if THIS BOOKING has an authorized deposit
    // (regardless of whether deposits are currently enabled - the customer already paid!)
    const showDepositInfo = bookingDetails?.deposit_required && bookingDetails?.deposit_status === 'authorized'

    return NextResponse.json({
      booking: {
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        party_size: booking.party_size,
        status: booking.status,
        special_requests: booking.special_requests,
        booking_reference: booking.booking_reference,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        // Deposit info - only if deposits are enabled
        deposit_required: showDepositInfo ? bookingDetails?.deposit_required : false,
        deposit_amount: showDepositInfo ? bookingDetails?.deposit_amount : null,
        deposit_status: showDepositInfo ? bookingDetails?.deposit_status : 'none',
        // Cancellation policy info
        is_late_cancellation: isLateCancellation,
        hours_until_booking: Math.round(hoursUntilBooking),
        free_cancellation_hours: cancellationHours,
        late_cancel_charge_percent: lateCancelPercent
      }
    })

  } catch (error) {
    console.error('Cancel booking GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Cancel the booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'Missing cancellation token' }, { status: 400 })
    }

    // Validate token format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(token)) {
      return NextResponse.json({ error: 'Invalid cancellation link' }, { status: 400 })
    }

    const supabase = await createClient()

    // First get the booking details for the cancellation email
    const { data: bookingData } = await supabase.rpc('get_booking_by_cancellation_token', {
      p_token: token
    })

    if (!bookingData || bookingData.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const booking = bookingData[0]

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'This booking has already been cancelled' }, { status: 400 })
    }

    // Get full booking details including deposit info
    const { data: fullBooking } = await supabase
      .from('bookings')
      .select('deposit_required, deposit_amount, deposit_status, stripe_payment_intent_id')
      .eq('id', booking.id)
      .single()

    // Get deposit settings and cancellation policy
    const { data: configData } = await supabase
      .from('booking_config')
      .select('deposit_cancellation_hours, deposit_late_cancel_charge_percent')
      .single()

    const cancellationHours = configData?.deposit_cancellation_hours || 48
    const lateCancelPercent = configData?.deposit_late_cancel_charge_percent || 100

    // Calculate if this is a late cancellation
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`)
    const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60)
    const isLateCancellation = hoursUntilBooking < cancellationHours

    // ========================================
    // HANDLE DEPOSIT BASED ON CANCELLATION POLICY
    // Process if THIS BOOKING has an authorized deposit
    // (regardless of current deposit_enabled setting - customer already paid!)
    // ========================================
    let depositAction = 'none'
    let depositMessage = ''
    
    // Handle deposit if: This booking has an authorized deposit
    if (fullBooking?.deposit_required && 
        fullBooking?.stripe_payment_intent_id && 
        fullBooking?.deposit_status === 'authorized') {
      
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY
      
      if (stripeSecretKey) {
        const Stripe = (await import('stripe')).default
        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-12-18.acacia' })
        
        try {
          if (!isLateCancellation || lateCancelPercent === 0) {
            // FREE CANCELLATION - Release the authorization
            await stripe.paymentIntents.cancel(fullBooking.stripe_payment_intent_id)
            
            await supabase
              .from('bookings')
              .update({ deposit_status: 'cancelled' })
              .eq('id', booking.id)
            
            // Log the transaction
            await supabase.from('deposit_transactions').insert({
              booking_id: booking.id,
              stripe_payment_intent_id: fullBooking.stripe_payment_intent_id,
              amount: fullBooking.deposit_amount,
              action: 'cancelled',
              reason: `Free cancellation - ${Math.round(hoursUntilBooking)} hours notice (policy: ${cancellationHours}h)`,
              performed_by: 'customer_cancellation'
            })
            
            depositAction = 'released'
            depositMessage = 'Your deposit hold has been released. No charge will appear on your card.'
            console.log(`✅ Deposit released for booking ${booking.id} - free cancellation`)
            
          } else if (lateCancelPercent === 100) {
            // LATE CANCELLATION - FULL CHARGE - Capture the full deposit
            await stripe.paymentIntents.capture(fullBooking.stripe_payment_intent_id)
            
            await supabase
              .from('bookings')
              .update({ 
                deposit_status: 'captured',
                deposit_captured_at: new Date().toISOString()
              })
              .eq('id', booking.id)
            
            // Log the transaction
            await supabase.from('deposit_transactions').insert({
              booking_id: booking.id,
              stripe_payment_intent_id: fullBooking.stripe_payment_intent_id,
              amount: fullBooking.deposit_amount,
              action: 'captured',
              reason: `Late cancellation - only ${Math.round(hoursUntilBooking)} hours notice (policy: ${cancellationHours}h required)`,
              performed_by: 'customer_cancellation'
            })
            
            depositAction = 'charged'
            depositMessage = `Due to late cancellation (less than ${cancellationHours} hours notice), your deposit of £${(fullBooking.deposit_amount / 100).toFixed(2)} has been charged.`
            console.log(`💰 Deposit captured for booking ${booking.id} - late cancellation`)
            
          } else {
            // LATE CANCELLATION - PARTIAL CHARGE
            const chargeAmount = Math.round(fullBooking.deposit_amount * (lateCancelPercent / 100))
            
            // Capture partial amount
            await stripe.paymentIntents.capture(fullBooking.stripe_payment_intent_id, {
              amount_to_capture: chargeAmount
            })
            
            await supabase
              .from('bookings')
              .update({ 
                deposit_status: 'captured',
                deposit_amount: chargeAmount, // Update to actual charged amount
                deposit_captured_at: new Date().toISOString()
              })
              .eq('id', booking.id)
            
            // Log the transaction
            await supabase.from('deposit_transactions').insert({
              booking_id: booking.id,
              stripe_payment_intent_id: fullBooking.stripe_payment_intent_id,
              amount: chargeAmount,
              action: 'captured',
              reason: `Late cancellation - ${lateCancelPercent}% charge (${Math.round(hoursUntilBooking)}h notice, policy: ${cancellationHours}h)`,
              performed_by: 'customer_cancellation',
              metadata: {
                original_amount: fullBooking.deposit_amount,
                charge_percent: lateCancelPercent
              }
            })
            
            depositAction = 'partial_charged'
            depositMessage = `Due to late cancellation, ${lateCancelPercent}% of your deposit (£${(chargeAmount / 100).toFixed(2)}) has been charged.`
            console.log(`💰 Partial deposit captured for booking ${booking.id} - ${lateCancelPercent}%`)
          }
        } catch (stripeError: any) {
          console.error('Error processing deposit during cancellation:', stripeError)
          // Don't fail the cancellation, just log the error
          depositAction = 'error'
          depositMessage = 'There was an issue processing your deposit. Our team will contact you.'
        }
      }
    }

    // Cancel the booking using the secure function
    const { data: success, error } = await supabase.rpc('cancel_booking_by_token', {
      p_token: token
    })

    if (error) {
      console.error('Error cancelling booking:', error)
      return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
    }

    if (!success) {
      return NextResponse.json({ error: 'Unable to cancel booking' }, { status: 400 })
    }

    // Send cancellation confirmation email (fire and forget)
    try {
      const { EmailUtils } = await import('@/lib/email/email-service')
      await EmailUtils.sendBookingCancellation(
        {
          id: booking.id,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          party_size: booking.party_size,
          booking_reference: booking.booking_reference
        },
        {
          name: booking.customer_name,
          email: booking.customer_email
        },
        // Include deposit info in email
        depositAction !== 'none' ? {
          action: depositAction,
          message: depositMessage,
          amount: fullBooking?.deposit_amount
        } : undefined
      )
    } catch (emailError) {
      // Log but don't fail the cancellation
      console.error('Failed to send cancellation email:', emailError)
    }

    // Create a notification for staff about the cancellation
    try {
      let depositNote = ''
      if (depositAction === 'released') {
        depositNote = ' Deposit authorization released.'
      } else if (depositAction === 'charged') {
        depositNote = ` Deposit of £${(fullBooking?.deposit_amount / 100).toFixed(2)} charged (late cancellation).`
      } else if (depositAction === 'partial_charged') {
        depositNote = ` Partial deposit charged (${lateCancelPercent}%).`
      }

      await supabase.from('notifications').insert({
        user_id: 'admin',
        type: 'booking_cancelled',
        title: `❌ Booking Cancelled: ${booking.customer_name}`,
        message: `${booking.customer_name} has cancelled their booking for ${new Date(booking.booking_date).toLocaleDateString('en-GB')} at ${booking.booking_time} (${booking.party_size} guests). Cancelled by customer via email link.${depositNote}`,
        priority: 'medium',
        booking_id: booking.id,
        action_url: '/dashboard/bookings',
        action_label: 'View Bookings',
        read: false,
        dismissed: false
      })
    } catch (notificationError) {
      console.error('Failed to create cancellation notification:', notificationError)
    }

    // 📊 SERVER-SIDE CANCELLATION TRACKING (GA4 Measurement Protocol)
    try {
      const { trackBookingCancellation } = await import('@/lib/ga4-server')
      await trackBookingCancellation({
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        partySize: booking.party_size,
        bookingDate: booking.booking_date,
        bookingTime: booking.booking_time,
        cancellationReason: isLateCancellation ? 'customer_late_cancellation' : 'customer_self_service'
      })
      console.log('✅ Server-side cancellation tracked for booking:', booking.booking_reference)
    } catch (trackingError) {
      console.error('⚠️ Server-side cancellation tracking failed:', trackingError)
    }

    return NextResponse.json({ 
      success: true,
      deposit: {
        action: depositAction,
        message: depositMessage
      }
    })

  } catch (error) {
    console.error('Cancel booking POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
