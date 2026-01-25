import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Fetch booking details by reconfirmation token
export async function GET(request: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400, headers })
    }

    const supabase = await createClient()
    
    // Get booking by reconfirmation token
    const { data: booking, error } = await supabase
      .rpc('get_booking_by_reconfirmation_token', { p_token: token })
      .single()

    if (error) {
      console.error("Error fetching booking:", error)
      return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500, headers })
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or invalid token" }, { status: 404, headers })
    }

    return NextResponse.json({ booking }, { headers })
  } catch (error) {
    console.error("Error in reconfirm-booking GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers })
  }
}

// POST - Confirm or cancel booking by reconfirmation token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, action } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    if (!action || !["confirm", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Valid action (confirm/cancel) is required" }, { status: 400 })
    }

    const supabase = await createClient()

    if (action === "confirm") {
      // Confirm the booking
      const { data: result, error } = await supabase
        .rpc('confirm_booking_by_reconfirmation_token', { p_token: token })
        .single()

      if (error) {
        console.error("Error confirming booking:", error)
        return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 })
      }

      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 })
      }

      // Send confirmation email to customer
      try {
        // Get booking details for email
        const { data: booking } = await supabase
          .from('bookings')
          .select(`
            *,
            customers (*)
          `)
          .eq('id', result.booking_id)
          .single()

        if (booking?.customers) {
          // Create notification for staff
          await supabase
            .from('notifications')
            .insert({
              type: 'booking_confirmed',
              title: 'Booking Reconfirmed',
              message: `${booking.customers.name} has confirmed their booking for ${booking.party_size} guests on ${new Date(booking.booking_date).toLocaleDateString('en-GB')} at ${booking.booking_time}`,
              data: {
                booking_id: booking.id,
                customer_name: booking.customers.name,
                party_size: booking.party_size,
                booking_date: booking.booking_date,
                booking_time: booking.booking_time
              }
            })
        }
      } catch (emailError) {
        console.error("Failed to send confirmation notification:", emailError)
        // Don't fail the request - the booking was still confirmed
      }

      return NextResponse.json({ 
        success: true, 
        message: "Booking confirmed successfully" 
      })
    }

    if (action === "cancel") {
      // Cancel the booking using the RPC function (bypasses RLS)
      const { data: cancelResult, error: cancelError } = await supabase
        .rpc('cancel_booking_by_reconfirmation_token', { p_token: token })
        .single()

      if (cancelError) {
        console.error("Error cancelling booking:", cancelError)
        return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
      }

      if (!cancelResult.success) {
        return NextResponse.json({ error: cancelResult.message }, { status: 400 })
      }

      const booking = { id: cancelResult.booking_id }

      // Send cancellation email and notification
      try {
        // Get full booking details
        const { data: fullBooking } = await supabase
          .from('bookings')
          .select(`
            *,
            customers (*)
          `)
          .eq('id', booking.id)
          .single()

        if (fullBooking?.customers) {
          // Send cancellation email
          const { RobustEmailUtils } = await import('@/lib/email/robust-email-service')
          await RobustEmailUtils.sendBookingCancellation(fullBooking, fullBooking.customers)

          // Create notification for staff
          await supabase
            .from('notifications')
            .insert({
              type: 'booking_cancelled',
              title: 'Booking Cancelled (Reconfirmation)',
              message: `${fullBooking.customers.name} cancelled their booking for ${fullBooking.party_size} guests on ${new Date(fullBooking.booking_date).toLocaleDateString('en-GB')} at ${fullBooking.booking_time} via reconfirmation link`,
              data: {
                booking_id: fullBooking.id,
                customer_name: fullBooking.customers.name,
                party_size: fullBooking.party_size,
                booking_date: fullBooking.booking_date,
                booking_time: fullBooking.booking_time,
                reason: 'customer_cancelled_via_reconfirmation'
              }
            })
        }
      } catch (emailError) {
        console.error("Failed to send cancellation email:", emailError)
        // Don't fail the request
      }

      return NextResponse.json({ 
        success: true, 
        message: "Booking cancelled successfully" 
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in reconfirm-booking POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
