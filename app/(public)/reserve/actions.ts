"use server"

import { z } from "zod"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"
import { createBookingWithCustomer, getBookingSettings, getLocaleSettings } from "@/lib/database"
import { isDateInRestaurantPast, isDateWithinAdvanceLimit, formatDateWithLocale } from "@/lib/locale-utils"
import { headers } from "next/headers"
import { checkRateLimit, RateLimitPresets } from "@/lib/rate-limit"

const bookingSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.union([
    z.string().email({ message: "Invalid email address." }),
    z.literal("")
  ]).optional(),
  phone: z.string().min(1, { message: "Phone number is required." }),
  partySize: z.coerce.number().min(1, { message: "Party size must be at least 1." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  notes: z.string().optional(),
})

export async function createBooking(prevState: any, formData: FormData) {
  // Get IP address for rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  // Rate limiting: 10 bookings per hour per IP
  const rateLimit = checkRateLimit(ipAddress, RateLimitPresets.booking)
  if (!rateLimit.success) {
    console.warn(`Rate limit exceeded for booking: ${ipAddress}`)
    return {
      message: "Too many booking attempts.",
      description: "Please wait a while before trying again, or call us directly.",
      success: false,
    }
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const validatedFields = bookingSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { name, email, phone, partySize, date, time, notes } = validatedFields.data

  try {
    // Check booking settings first
    const settings = await getBookingSettings()
    const localeSettings = await getLocaleSettings()
    
    if (!settings.booking_enabled) {
      return {
        message: "Booking is currently suspended.",
        description: settings.suspension_message || "Please call us directly to make a reservation.",
        success: false,
      }
    }

    if (settings.maintenance_mode) {
      return {
        message: "Booking system is under maintenance.",
        description: "Please try again later or call us directly.",
        success: false,
      }
    }

    // Validate party size
    if (partySize > settings.max_party_size) {
      return {
        message: `Maximum party size is ${settings.max_party_size} people.`,
        description: "For larger groups, please call us directly.",
        success: false,
      }
    }

    // Validate booking date using restaurant timezone
    if (isDateInRestaurantPast(date, localeSettings.restaurant_timezone)) {
      return {
        message: "Cannot book dates in the past.",
        description: "Please select a future date for your reservation.",
        success: false,
      }
    }

    if (!isDateWithinAdvanceLimit(date, localeSettings.restaurant_timezone, settings.max_advance_days)) {
      return {
        message: `Bookings can only be made up to ${settings.max_advance_days} days in advance.`,
        success: false,
      }
    }

    // Validate time slot is available
    if (!settings.available_times.includes(time)) {
      return {
        message: "Selected time slot is not available.",
        success: false,
      }
    }

    // Check if date is closed
    if (settings.closed_dates.includes(date)) {
      return {
        message: "Restaurant is closed on the selected date.",
        success: false,
      }
    }

    // Check if day of week is closed
    const bookingDate = new Date(date)
    const dayOfWeek = bookingDate.getDay() // 0 = Sunday, 1 = Monday, etc.
    if (settings.closed_days_of_week && settings.closed_days_of_week.includes(dayOfWeek)) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return {
        message: `Restaurant is closed on ${dayNames[dayOfWeek]}s.`,
        description: "Please select a different day for your reservation.",
        success: false,
      }
    }

    // Check for duplicate booking (same phone number on same date)
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    // First check if customer exists with this phone
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .single()
    
    if (existingCustomer) {
      // Check if they already have a booking on this date
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id, booking_time')
        .eq('customer_id', existingCustomer.id)
        .eq('booking_date', date)
        .neq('status', 'cancelled')
        .single()
      
      if (existingBooking) {
        return {
          message: "You already have a booking on this date.",
          description: `You have an existing reservation at ${existingBooking.booking_time}. Please call us at 020 8421 5550 if you need to modify your booking.`,
          success: false,
        }
      }
    }

    // Create customer and booking
    const { customer, booking } = await createBookingWithCustomer({
      customer: {
        name,
        email: email || `${phone.replace(/\s/g, '')}@phone-only.local`,
        phone
      },
      booking: {
        booking_date: date,
        booking_time: time,
        party_size: partySize,
        special_requests: notes || "",
        source: 'website' // Mark as website booking
      }
    })

    // 🚨 ROBUST EMAIL NOTIFICATIONS - GUARANTEED DELIVERY
    // Replace the broken fire-and-forget approach with reliable email sending
    try {
      console.log('📧 Starting email notifications for booking:', booking.id);
      
      // Import robust email service
      const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
      
      // Get email settings for staff notifications
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data: emailSettings } = await supabase
        .from('email_settings')
        .select('restaurant_email, staff_booking_alerts')
        .eq('user_id', 'admin')
        .single();
      
      // Send emails with proper error handling and retry logic
      const emailPromises: Promise<any>[] = [];
      
      // Customer confirmation email (if valid email provided)
      if (email && email.includes('@') && !email.includes('phone-only.local')) {
        console.log('📧 Sending customer confirmation to:', email);
        emailPromises.push(
          RobustEmailUtils.sendBookingConfirmation(booking, customer)
            .then(result => ({ type: 'customer_confirmation', result }))
            .catch(error => ({ type: 'customer_confirmation', error: error.message }))
        );
      }
      
      // Staff alert email
      if (emailSettings?.restaurant_email && emailSettings.staff_booking_alerts) {
        console.log('📧 Sending staff alert to:', emailSettings.restaurant_email);
        emailPromises.push(
          RobustEmailUtils.sendStaffBookingAlert(booking, customer, emailSettings.restaurant_email)
            .then(result => ({ type: 'staff_alert', result }))
            .catch(error => ({ type: 'staff_alert', error: error.message }))
        );
      }
      
      // Wait for all emails to complete (with timeout)
      const timeoutPromise = new Promise(resolve => 
        setTimeout(() => resolve([{ type: 'timeout', error: 'Email timeout' }]), 10000)
      );
      
      const emailResults = await Promise.race([
        Promise.allSettled(emailPromises),
        timeoutPromise
      ]) as any[];
      
      // Log email results
      emailResults.forEach(result => {
        if (result.type === 'timeout') {
          console.warn('⚠️ Email sending timeout - emails may be queued for retry');
        } else if (result.error) {
          console.error(`❌ Email ${result.type} failed:`, result.error);
        } else if (result.result?.success) {
          console.log(`✅ Email ${result.type} sent successfully`);
        } else {
          console.warn(`⚠️ Email ${result.type} queued for retry:`, result.result?.error);
        }
      });
      
    } catch (emailError) {
      // Log error but don't fail the booking
      console.error('🚨 Email notification system error:', emailError);
      
      // Fallback: Try to queue emails for later processing
      try {
        const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
        
        // Try to queue the emails
        if (email && email.includes('@') && !email.includes('phone-only.local')) {
          await RobustEmailUtils.sendBookingConfirmation(booking, customer);
        }
        
        // Try to send staff alert with a fallback email
        const fallbackStaffEmail = process.env.RESTAURANT_EMAIL || 'reservations@donatheresa.co.uk';
        await RobustEmailUtils.sendStaffBookingAlert(booking, customer, fallbackStaffEmail);
        
        console.log('📥 Emails queued for later delivery due to system error');
      } catch (fallbackError) {
        console.error('🚨 CRITICAL: Both email sending and queuing failed:', fallbackError);
      }
    }

    const bookingDateTime = new Date(`${date}T${time}:00`)
    const formattedDate = formatDateWithLocale(bookingDateTime, localeSettings.date_format, localeSettings.language_code)
    const formattedTime = format(bookingDateTime, localeSettings.time_format === 'HH:mm' ? 'HH:mm' : 'h:mm a')
    
    // Build confirmation message with booking reference
    const bookingRef = booking.booking_reference || booking.id.substring(0, 8).toUpperCase()
    
    // 📊 SERVER-SIDE CONVERSION TRACKING (GA4 Measurement Protocol)
    // This ensures conversions are tracked even if user has ad blockers or closes browser
    try {
      const { trackBookingConversion } = await import('@/lib/ga4-server')
      await trackBookingConversion({
        bookingId: booking.id,
        bookingReference: bookingRef,
        customerName: name,
        customerEmail: email || undefined,
        customerPhone: phone,
        partySize,
        bookingDate: date,
        bookingTime: time,
        specialRequests: notes || undefined
      })
      console.log('✅ Server-side conversion tracked for booking:', bookingRef)
    } catch (trackingError) {
      // Don't fail the booking if tracking fails
      console.error('⚠️ Server-side conversion tracking failed:', trackingError)
    }
    
    return {
      message: `Booking confirmed for ${name}!`,
      description: `Thank you, ${name}. Your reservation (Ref: ${bookingRef}) for ${partySize} ${partySize === 1 ? 'person' : 'people'} on ${formattedDate} at ${formattedTime} is confirmed. ${email && email.includes('@') && !email.includes('phone-only.local') ? "You'll receive a confirmation email shortly." : "We'll contact you if we need to discuss any special requests."}`,
      success: true,
      bookingId: booking.id,
      bookingReference: bookingRef,
      // Include conversion data for client-side tracking (as backup)
      conversionData: {
        bookingId: booking.id,
        partySize,
        bookingDate: date,
        bookingTime: time,
      }
    }
  } catch (error) {
    console.error("Booking creation error:", error)
    return {
      message: "Sorry, there was an error processing your booking. Please try again or call us directly.",
      success: false,
    }
  }
}

// Server action to get booking settings for the client
export async function getBookingSettingsForClient() {
  try {
    const settings = await getBookingSettings()
  return {
    success: true,
      settings
    }
  } catch (error) {
    console.error("Error fetching booking settings:", error)
    return {
      success: false,
      error: "Failed to load booking settings"
    }
  }
}
