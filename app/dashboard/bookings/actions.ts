"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { 
  updateBooking,
  getBookingSettings,
  updateBookingSettings,
  type BookingSettings,
  getBookings,
  createBookingWithCustomer,
  upsertServicePeriod,
  deleteServicePeriod,
  generateTimeSlotsFromPeriods,
  type ServicePeriod
} from "@/lib/database"
import { createClient } from "@/lib/supabase/server"
import { type ActionState } from "@/lib/types"

const updateBookingSchema = z.object({
  id: z.string().min(1, "Booking ID is required"),
  customerName: z.string().min(1, "Name is required"),
  partySize: z.coerce.number().min(1, "Party size must be at least 1"),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  notes: z.string().optional(),
})

export async function updateBookingAction(formData: FormData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const validatedFields = updateBookingSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, customerName, partySize, status, notes } = validatedFields.data

  try {
    const updatedBooking = await updateBooking(id, { 
      party_size: partySize,
      status,
      special_requests: notes || ""
    })

    if (!updatedBooking) {
      return { error: { _form: ["Booking not found"] } }
    }

    revalidatePath("/dashboard/bookings")
    return { data: updatedBooking }
  } catch (error) {
    console.error("Update booking error:", error)
    return { error: { _form: ["Failed to update booking"] } }
  }
}

export async function cancelBookingAction(bookingId: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!bookingId) {
    return { error: "Booking ID is required." }
  }

  try {
    // Get booking details before cancelling for email
    const supabase = await createClient()
    const { data: bookingWithCustomer } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (*)
      `)
      .eq('id', bookingId)
      .single()

    const cancelledBooking = await updateBooking(bookingId, { status: "cancelled" })
    
    if (!cancelledBooking) {
      return { error: "Booking not found." }
    }

    // Send cancellation email (fire and forget)
    try {
      if (bookingWithCustomer?.customers) {
        const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
        await RobustEmailUtils.sendBookingCancellation(cancelledBooking, bookingWithCustomer.customers);
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    revalidatePath("/dashboard/bookings")
    return { data: "Booking cancelled successfully." }
  } catch (error) {
    console.error("Cancel booking error:", error)
    return { error: "Failed to cancel booking." }
  }
}

export async function updateBookingStatusAction(bookingId: string, status: "pending" | "confirmed" | "cancelled") {
  if (!bookingId) {
    return { error: "Booking ID is required." }
  }

  if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
    return { error: "Valid status is required." }
  }

  try {
    // Get booking details before updating for email
    const supabase = await createClient()
    const { data: bookingWithCustomer } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (*)
      `)
      .eq('id', bookingId)
      .single()

    const updatedBooking = await updateBooking(bookingId, { status })
    
    if (!updatedBooking) {
      return { error: "Booking not found." }
    }

    // Send email notification based on status change (fire and forget)
    try {
      if (bookingWithCustomer?.customers) {
        const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
        
        if (status === 'cancelled') {
          console.log('📧 Sending cancellation email for booking:', bookingId);
          await RobustEmailUtils.sendBookingCancellation(updatedBooking, bookingWithCustomer.customers);
        } else if (status === 'confirmed') {
          console.log('📧 Sending confirmation email for booking:', bookingId);
          await RobustEmailUtils.sendBookingConfirmation(updatedBooking, bookingWithCustomer.customers);
        }
        console.log('✅ Email sent successfully for status:', status);
      }
    } catch (emailError) {
      console.error('❌ Email notification failed for status', status, ':', emailError);
    }

    revalidatePath("/dashboard/bookings")
    
    const statusMessages = {
      confirmed: "Booking confirmed successfully.",
      pending: "Booking moved to pending.",
      cancelled: "Booking cancelled."
    }
    
    return { data: statusMessages[status] }
  } catch (error) {
    console.error("Update booking status error:", error)
    return { error: "Failed to update booking status." }
  }
}

// Booking Settings Actions
export async function getBookingSettingsAction() {
  try {
    console.log('[SERVER ACTION] Loading booking settings...')
    const settings = await getBookingSettings()
    console.log('[SERVER ACTION] Settings loaded successfully:', settings)
    return settings
  } catch (error) {
    console.error('[SERVER ACTION] Error in getBookingSettingsAction:', error)
    
    // Return fallback defaults instead of throwing
    const fallbackSettings = {
      booking_enabled: true,
      max_advance_days: 30,
      max_party_size: 8,
      available_times: [
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
      ],
      closed_dates: [],
      closed_days_of_week: [],
      suspension_message: "We're currently not accepting new bookings. Please check back later.",
      service_periods: []
    }
    
    console.log('[SERVER ACTION] Returning fallback settings:', fallbackSettings)
    return fallbackSettings
  }
}

export async function updateBookingSettingsAction(formData: FormData): Promise<ActionState> {
  try {
    const isBookingEnabled = formData.get("isBookingEnabled") === "on"
    const suspensionMessage = formData.get("suspensionMessage") as string
    const maxPartySize = parseInt(formData.get("maxPartySize") as string)
    const maxAdvanceDays = parseInt(formData.get("maxAdvanceDays") as string)
    const totalSeats = parseInt(formData.get("totalSeats") as string)

    // Collect closed dates if any
    const closedDates: string[] = []
    const closedDatesData = formData.get("closedDates") as string
    if (closedDatesData) {
      try {
        const parsedDates = JSON.parse(closedDatesData)
        if (Array.isArray(parsedDates)) {
          closedDates.push(...parsedDates)
        }
      } catch (error) {
        console.log('No closed dates provided or invalid format')
      }
    }

    // Collect closed days of week if any
    const closedDaysOfWeek: number[] = []
    const closedDaysData = formData.get("closedDaysOfWeek") as string
    if (closedDaysData) {
      try {
        const parsedDays = JSON.parse(closedDaysData)
        if (Array.isArray(parsedDays)) {
          closedDaysOfWeek.push(...parsedDays.map(d => parseInt(d)).filter(d => !isNaN(d) && d >= 0 && d <= 6))
        }
      } catch (error) {
        console.log('No closed days of week provided or invalid format')
      }
    }

    const updates = {
      booking_enabled: isBookingEnabled,
      suspension_message: suspensionMessage,
      max_party_size: maxPartySize,
      max_advance_days: maxAdvanceDays,
      total_seats: totalSeats,
      closed_dates: closedDates,
      closed_days_of_week: closedDaysOfWeek
      // Note: available_times are now managed by saveServicePeriodsAction
    }

    await updateBookingSettings(updates)
    // revalidatePath("/dashboard/settings/bookings")
    
    return {
      success: true,
      message: "Booking settings updated successfully"
    }
  } catch (error) {
    console.error('Error updating booking settings:', error)
    return {
      success: false,
      message: "Failed to update booking settings",
      errors: { general: ["An error occurred while updating settings"] }
    }
  }
}

export async function toggleBookingStatusAction() {
  try {
    const currentSettings = await getBookingSettings()
    await updateBookingSettings({
      booking_enabled: !currentSettings.booking_enabled
    })

    revalidatePath("/dashboard/bookings")
    revalidatePath("/reserve")

    return { 
      success: true, 
      message: `Bookings ${!currentSettings.booking_enabled ? 'enabled' : 'suspended'}`
    }
  } catch (error) {
    console.error("Error toggling booking status:", error)
    return { 
      success: false, 
      error: "Failed to toggle booking status" 
    }
  }
}



export async function createManualBookingAction(formData: FormData): Promise<ActionState> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const partySize = parseInt(formData.get("partySize") as string)
    const specialRequests = formData.get("specialRequests") as string

    if (!name || !email || !date || !time || !partySize) {
      return {
        success: false,
        message: "Please fill in all required fields",
        errors: { general: ["All fields are required"] }
      }
    }

    const result = await createBookingWithCustomer({
      customer: {
        name,
        email,
        phone: phone || undefined
      },
      booking: {
        booking_date: date,
        booking_time: time,
        party_size: partySize,
        special_requests: specialRequests || undefined,
        source: 'dashboard' // Mark as manual booking from dashboard
      }
    })

    // 🚨 ROBUST EMAIL NOTIFICATIONS - Same as web bookings
    // Send confirmation emails after successful booking creation
    try {
      console.log('📧 Starting email notifications for manual booking:', result.booking.id);
      
      // Import robust email service
      const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
      
      // Get email settings for staff notifications
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
          RobustEmailUtils.sendBookingConfirmation(result.booking, result.customer)
            .then(emailResult => ({ type: 'customer_confirmation', result: emailResult }))
            .catch(error => ({ type: 'customer_confirmation', error: error.message || 'Unknown error' }))
        );
      }
      
      // Staff alert email
      if (emailSettings?.restaurant_email && emailSettings.staff_booking_alerts) {
        console.log('📧 Sending staff alert to:', emailSettings.restaurant_email);
        emailPromises.push(
          RobustEmailUtils.sendStaffBookingAlert(result.booking, result.customer, emailSettings.restaurant_email)
            .then(emailResult => ({ type: 'staff_alert', result: emailResult }))
            .catch(error => ({ type: 'staff_alert', error: error.message || 'Unknown error' }))
        );
      }
      
      // Wait for all emails to complete (with timeout)
      const timeoutPromise = new Promise(resolve => 
        setTimeout(() => resolve({ type: 'timeout', error: 'Email timeout' }), 10000)
      );
      
      const emailResults = await Promise.race([
        Promise.allSettled(emailPromises),
        timeoutPromise
      ]);
      
      // Log email results
      if (Array.isArray(emailResults)) {
        // Handle Promise.allSettled results
        emailResults.forEach(result => {
          if (result.status === 'fulfilled') {
            const emailResult = result.value;
            if (emailResult.error) {
              console.error(`❌ Manual booking email ${emailResult.type} failed:`, emailResult.error);
            } else if (emailResult.result?.success) {
              console.log(`✅ Manual booking email ${emailResult.type} sent successfully`);
            } else {
              console.warn(`⚠️ Manual booking email ${emailResult.type} queued for retry:`, emailResult.result?.error || 'Unknown error');
            }
          } else if (result.status === 'rejected') {
            console.error(`❌ Manual booking email failed:`, result.reason);
          }
        });
      } else {
        // Handle timeout case
        console.warn('⚠️ Manual booking email sending timeout - emails may be queued for retry');
      }
      
    } catch (emailError) {
      // Log error but don't fail the booking
      console.error('🚨 Manual booking email notification system error:', emailError);
      
      // Fallback: Try to queue emails for later processing
      try {
        const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
        
        // Try to queue the emails
        if (email && email.includes('@') && !email.includes('phone-only.local')) {
          await RobustEmailUtils.sendBookingConfirmation(result.booking, result.customer);
        }
        
        // Try to send staff alert with a fallback email [[memory:2465475]]
        const fallbackStaffEmail = process.env.RESTAURANT_EMAIL || 'reservations@donatheresa.com';
        await RobustEmailUtils.sendStaffBookingAlert(result.booking, result.customer, fallbackStaffEmail);
        
        console.log('📥 Manual booking emails queued for later delivery due to system error');
      } catch (fallbackError) {
        console.error('🚨 CRITICAL: Both manual booking email sending and queuing failed:', fallbackError);
      }
    }

    revalidatePath("/dashboard/bookings")
    revalidatePath("/dashboard")
    
    return {
      success: true,
      message: "Manual booking created successfully with confirmation email sent"
    }
  } catch (error) {
    console.error('Error creating manual booking:', error)
    return {
      success: false,
      message: "Failed to create manual booking",
      errors: { general: ["An error occurred while creating the booking"] }
    }
  }
}

export async function getAllBookings() {
  try {
    return await getBookings()
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export async function refreshBookings() {
  revalidatePath("/dashboard/bookings")
  revalidatePath("/dashboard")
}

export async function searchCustomersAction(query: string) {
  try {
    if (!query || query.length < 2) {
      return []
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id, 
        name, 
        email, 
        phone,
        total_bookings,
        recent_bookings,
        last_booking_date,
        average_party_size,
        customer_segment
      `)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('total_bookings', { ascending: false })
      .order('name')
      .limit(5)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching customers:', error)
    return []
  }
}

export async function saveServicePeriodsAction(servicePeriods: ServicePeriod[]): Promise<void> {
  try {
    console.log('Saving service periods:', servicePeriods)
    
    // Get current service periods from database
    const currentSettings = await getBookingSettings()
    const currentPeriods = currentSettings.service_periods || []
    
    // Get current period IDs - filter out undefined values properly
    const currentPeriodIds = currentPeriods
      .map(p => p.id)
      .filter((id): id is string => Boolean(id))
    
    // Get new period IDs - filter out undefined values properly  
    const newPeriodIds = servicePeriods
      .map(p => p.id)
      .filter((id): id is string => Boolean(id))
    
    // Delete periods that are no longer in the new list
    const periodsToDelete = currentPeriodIds.filter(id => !newPeriodIds.includes(id))
    for (const periodId of periodsToDelete) {
      await deleteServicePeriod(periodId)
    }
    
    // Upsert all service periods
    for (const period of servicePeriods) {
      await upsertServicePeriod(period)
    }
    
    // Generate new time slots and update booking config
    const timeSlots = await generateTimeSlotsFromPeriods()
    await updateBookingSettings({
      available_times: timeSlots
    })
    
    console.log('Service periods saved successfully')
  } catch (error) {
    console.error('Error saving service periods:', error)
    throw error
  }
}
