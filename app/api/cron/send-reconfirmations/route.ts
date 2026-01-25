import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Cron job to send reconfirmation emails to upcoming large party bookings
 * Should be triggered daily (e.g., every morning at 9 AM)
 * 
 * Set up in Vercel Cron or external cron service:
 * Path: /api/cron/send-reconfirmations
 * Schedule: 0 9 * * * (every day at 9 AM)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow requests without auth in development or if no secret is set
      if (process.env.NODE_ENV === 'production' && cronSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const supabase = await createClient()

    // Get reconfirmation settings
    const { data: config, error: configError } = await supabase
      .from('booking_config')
      .select(`
        reconfirmation_enabled,
        reconfirmation_min_party_size,
        reconfirmation_days_before,
        reconfirmation_deadline_hours
      `)
      .eq('id', 1)
      .single()

    if (configError) {
      console.error("Error fetching reconfirmation config:", configError)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch configuration" 
      }, { status: 500 })
    }

    // Check if reconfirmation is enabled
    if (!config?.reconfirmation_enabled) {
      return NextResponse.json({ 
        success: true, 
        message: "Reconfirmation system is disabled",
        sent: 0 
      })
    }

    const minPartySize = config.reconfirmation_min_party_size || 6
    const daysBefore = config.reconfirmation_days_before || 2
    const deadlineHours = config.reconfirmation_deadline_hours || 24

    // Get bookings that need reconfirmation emails
    const { data: bookings, error: bookingsError } = await supabase
      .rpc('get_bookings_needing_reconfirmation', {
        p_min_party_size: minPartySize,
        p_days_before: daysBefore
      })

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch bookings" 
      }, { status: 500 })
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No bookings need reconfirmation today",
        sent: 0 
      })
    }

    console.log(`Found ${bookings.length} bookings needing reconfirmation`)

    // Send reconfirmation emails using the robust email service
    const { RobustEmailUtils } = await import('@/lib/email/robust-email-service')
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://donatheresa.com'
    
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const booking of bookings) {
      try {
        // Generate reconfirmation link
        const reconfirmationLink = `${baseUrl}/reconfirm-booking?token=${booking.reconfirmation_token}`

        // Prepare customer object for the email utility
        const customer = {
          email: booking.customer_email,
          name: booking.customer_name
        }

        // Send reconfirmation email using RobustEmailUtils
        const emailResult = await RobustEmailUtils.sendReconfirmationRequest(
          booking,
          customer,
          reconfirmationLink,
          deadlineHours
        )

        if (emailResult.success) {
          // Mark reconfirmation as sent
          await supabase.rpc('mark_reconfirmation_sent', {
            p_booking_id: booking.id,
            p_deadline_hours: deadlineHours
          })

          // Create notification for tracking
          await supabase
            .from('notifications')
            .insert({
              type: 'reconfirmation_sent',
              title: 'Reconfirmation Email Sent',
              message: `Sent reconfirmation request to ${booking.customer_name} for booking on ${new Date(booking.booking_date).toLocaleDateString('en-GB')}`,
              data: {
                booking_id: booking.id,
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                party_size: booking.party_size,
                booking_date: booking.booking_date
              }
            })

          results.sent++
          console.log(`✅ Reconfirmation sent to ${booking.customer_email}`)
        } else {
          results.failed++
          results.errors.push(`Failed to send to ${booking.customer_email}: ${emailResult.error}`)
          console.error(`❌ Failed to send reconfirmation to ${booking.customer_email}:`, emailResult.error)
        }
      } catch (error) {
        results.failed++
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`Error processing ${booking.customer_email}: ${errorMsg}`)
        console.error(`❌ Error processing booking ${booking.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${bookings.length} bookings`,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    })

  } catch (error) {
    console.error("Error in send-reconfirmations cron:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
