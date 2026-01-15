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
        customer_phone: booking.customer_phone
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
        }
      )
    } catch (emailError) {
      // Log but don't fail the cancellation
      console.error('Failed to send cancellation email:', emailError)
    }

    // Create a notification for staff about the cancellation
    try {
      await supabase.from('notifications').insert({
        user_id: 'admin',
        type: 'booking_cancelled',
        title: `❌ Booking Cancelled: ${booking.customer_name}`,
        message: `${booking.customer_name} has cancelled their booking for ${new Date(booking.booking_date).toLocaleDateString('en-GB')} at ${booking.booking_time} (${booking.party_size} guests). Cancelled by customer via email link.`,
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

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Cancel booking POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
