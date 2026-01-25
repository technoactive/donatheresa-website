import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Cron job to process expired reconfirmations
 * Should be triggered hourly to check for expired deadlines
 * 
 * Set up in Vercel Cron or external cron service:
 * Path: /api/cron/process-reconfirmations
 * Schedule: 0 * * * * (every hour)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
        reconfirmation_no_response_action,
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
        processed: 0 
      })
    }

    const noResponseAction = config.reconfirmation_no_response_action || 'flag_only'
    const deadlineHours = config.reconfirmation_deadline_hours || 24

    // Get expired reconfirmations
    const { data: expiredBookings, error: bookingsError } = await supabase
      .rpc('get_expired_reconfirmations')

    if (bookingsError) {
      console.error("Error fetching expired reconfirmations:", bookingsError)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to fetch expired reconfirmations" 
      }, { status: 500 })
    }

    if (!expiredBookings || expiredBookings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No expired reconfirmations to process",
        processed: 0 
      })
    }

    console.log(`Found ${expiredBookings.length} expired reconfirmations to process`)

    const { emailService } = await import('@/lib/email/email-service')
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://donatheresa.com'
    
    const results = {
      autoCancelled: 0,
      flagged: 0,
      secondReminderSent: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const booking of expiredBookings) {
      try {
        // Handle the expired reconfirmation based on action setting
        const { data: result, error: handleError } = await supabase
          .rpc('handle_expired_reconfirmation', {
            p_booking_id: booking.id,
            p_action: noResponseAction
          })
          .single()

        if (handleError) {
          throw handleError
        }

        if (!result.success) {
          results.failed++
          results.errors.push(`Failed to process ${booking.id}: ${result.action_taken}`)
          continue
        }

        const actionTaken = result.action_taken

        // Handle post-processing based on action
        if (actionTaken === 'auto_cancelled') {
          results.autoCancelled++
          
          // Send cancellation email
          try {
            const { RobustEmailUtils } = await import('@/lib/email/robust-email-service')
            await RobustEmailUtils.sendBookingCancellation(
              {
                id: booking.id,
                booking_date: booking.booking_date,
                booking_time: booking.booking_time,
                party_size: booking.party_size,
                booking_reference: booking.booking_reference
              },
              {
                name: booking.customer_name,
                email: booking.customer_email,
                phone: booking.customer_phone
              }
            )
          } catch (emailError) {
            console.error("Failed to send auto-cancellation email:", emailError)
          }

          // Create notification
          await supabase
            .from('notifications')
            .insert({
              type: 'booking_auto_cancelled',
              title: 'Booking Auto-Cancelled',
              message: `Booking for ${booking.customer_name} (${booking.party_size} guests on ${new Date(booking.booking_date).toLocaleDateString('en-GB')}) was auto-cancelled due to no reconfirmation response`,
              data: {
                booking_id: booking.id,
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                party_size: booking.party_size,
                booking_date: booking.booking_date,
                reason: 'no_reconfirmation_response'
              }
            })

          // SEND EMAIL ALERT TO RESTAURANT STAFF ABOUT AUTO-CANCELLATION
          try {
            const { RobustEmailUtils } = await import('@/lib/email/robust-email-service')
            await RobustEmailUtils.sendStaffReconfirmationAlert(booking, 'auto_cancelled')
            console.log(`📧 Sent staff auto-cancellation alert for booking ${booking.id}`)
          } catch (emailError) {
            console.error("Failed to send staff auto-cancellation alert:", emailError)
          }

          console.log(`🚫 Auto-cancelled booking ${booking.id} for ${booking.customer_name}`)

        } else if (actionTaken === 'second_reminder_sent') {
          results.secondReminderSent++
          
          // Send second reminder email
          try {
            const reconfirmationLink = `${baseUrl}/reconfirm-booking?token=${booking.reconfirmation_token}`

            await emailService.sendEmail({
              templateKey: 'booking_reconfirmation_reminder',
              recipientEmail: booking.customer_email,
              recipientName: booking.customer_name,
              bookingId: booking.id,
              data: {
                customerName: booking.customer_name,
                bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }),
                bookingTime: booking.booking_time,
                partySize: booking.party_size,
                bookingReference: booking.booking_reference || booking.id,
                reconfirmationLink: reconfirmationLink,
                confirmLink: `${reconfirmationLink}&action=confirm`,
                isUrgent: true,
                deadlineHours: 12 // Second reminder has shorter deadline
              }
            })
          } catch (emailError) {
            console.error("Failed to send second reminder email:", emailError)
          }

          console.log(`📧 Sent second reminder for booking ${booking.id}`)

        } else if (actionTaken === 'flagged_no_response') {
          results.flagged++
          
          // Create notification for staff to manually follow up
          await supabase
            .from('notifications')
            .insert({
              type: 'reconfirmation_no_response',
              title: 'Reconfirmation No Response',
              message: `${booking.customer_name} hasn't responded to reconfirmation for ${booking.party_size} guests on ${new Date(booking.booking_date).toLocaleDateString('en-GB')}. Manual follow-up needed.`,
              data: {
                booking_id: booking.id,
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                customer_phone: booking.customer_phone,
                party_size: booking.party_size,
                booking_date: booking.booking_date,
                booking_time: booking.booking_time,
                action_required: 'manual_follow_up'
              }
            })

          // SEND EMAIL ALERT TO RESTAURANT STAFF
          try {
            const { RobustEmailUtils } = await import('@/lib/email/robust-email-service')
            await RobustEmailUtils.sendStaffReconfirmationAlert(booking, 'no_response')
            console.log(`📧 Sent staff alert email for booking ${booking.id}`)
          } catch (emailError) {
            console.error("Failed to send staff alert email:", emailError)
          }

          console.log(`⚠️ Flagged booking ${booking.id} for manual follow-up`)
        }

      } catch (error) {
        results.failed++
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`Error processing ${booking.id}: ${errorMsg}`)
        console.error(`❌ Error processing booking ${booking.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${expiredBookings.length} expired reconfirmations`,
      processed: expiredBookings.length,
      autoCancelled: results.autoCancelled,
      flagged: results.flagged,
      secondReminderSent: results.secondReminderSent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    })

  } catch (error) {
    console.error("Error in process-reconfirmations cron:", error)
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
