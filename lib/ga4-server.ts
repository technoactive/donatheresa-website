/**
 * Google Analytics 4 Server-Side Tracking
 * 
 * Uses the GA4 Measurement Protocol to send events directly from the server.
 * This ensures conversions are tracked even if:
 * - User has ad blockers
 * - User hasn't accepted cookies
 * - Browser closes before client-side event fires
 * 
 * @see https://developers.google.com/analytics/devguides/collection/protocol/ga4
 */

import { createClient } from '@/lib/supabase/server'

interface GA4Event {
  name: string
  params: Record<string, string | number | boolean | undefined>
}

interface GA4Payload {
  client_id: string
  user_id?: string
  timestamp_micros?: string
  non_personalized_ads?: boolean
  events: GA4Event[]
}

interface BookingConversionData {
  bookingId: string
  bookingReference: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  partySize: number
  bookingDate: string
  bookingTime: string
  specialRequests?: string
  clientId?: string // From client-side if available
}

interface ContactConversionData {
  messageId: string
  customerName: string
  customerEmail: string
  subject?: string
  clientId?: string
}

/**
 * Get GA4 settings from database
 */
async function getGA4Settings(): Promise<{ measurementId: string | null; apiSecret: string | null; enabled: boolean }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('google_analytics_settings')
      .select('measurement_id, api_secret, enabled')
      .single()
    
    if (error || !data) {
      console.log('[GA4 Server] No settings found or error:', error?.message)
      return { measurementId: null, apiSecret: null, enabled: false }
    }
    
    return {
      measurementId: data.measurement_id,
      apiSecret: data.api_secret,
      enabled: data.enabled
    }
  } catch (error) {
    console.error('[GA4 Server] Error fetching settings:', error)
    return { measurementId: null, apiSecret: null, enabled: false }
  }
}

/**
 * Generate a server-side client ID if none provided
 * Format: timestamp.random (similar to GA4 client ID format)
 */
function generateServerClientId(): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const random = Math.floor(Math.random() * 1000000000)
  return `${timestamp}.${random}`
}

/**
 * Send event to GA4 via Measurement Protocol
 */
async function sendGA4Event(payload: GA4Payload): Promise<boolean> {
  const settings = await getGA4Settings()
  
  if (!settings.enabled || !settings.measurementId) {
    console.log('[GA4 Server] Tracking disabled or no measurement ID')
    return false
  }
  
  if (!settings.apiSecret) {
    console.warn('[GA4 Server] No API secret configured - server-side tracking disabled')
    console.warn('[GA4 Server] To enable: Go to GA4 Admin → Data Streams → Your Stream → Measurement Protocol API secrets')
    return false
  }
  
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${settings.measurementId}&api_secret=${settings.apiSecret}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    // GA4 Measurement Protocol returns 204 No Content on success
    if (response.status === 204 || response.ok) {
      console.log('[GA4 Server] Event sent successfully:', payload.events[0]?.name)
      return true
    } else {
      const text = await response.text()
      console.error('[GA4 Server] Failed to send event:', response.status, text)
      return false
    }
  } catch (error) {
    console.error('[GA4 Server] Error sending event:', error)
    return false
  }
}

/**
 * Track a booking conversion (server-side)
 * This is the main function to call when a booking is confirmed
 */
export async function trackBookingConversion(data: BookingConversionData): Promise<boolean> {
  const clientId = data.clientId || generateServerClientId()
  
  // Calculate estimated booking value (£25 per person average spend)
  const bookingValue = data.partySize * 25
  
  // Determine booking characteristics
  const bookingDateTime = new Date(`${data.bookingDate}T${data.bookingTime}:00`)
  const hour = bookingDateTime.getHours()
  const dayOfWeek = bookingDateTime.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const isPeakTime = (hour >= 18 && hour <= 21) || (hour >= 12 && hour <= 14)
  const isVipBooking = data.partySize >= 8
  
  const payload: GA4Payload = {
    client_id: clientId,
    // Use email as user_id for cross-device tracking (if available)
    user_id: data.customerEmail ? hashEmail(data.customerEmail) : undefined,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: data.bookingId,
          value: bookingValue,
          currency: 'GBP',
          affiliation: 'Dona Theresa Website',
          // Booking-specific parameters
          booking_reference: data.bookingReference,
          booking_date: data.bookingDate,
          booking_time: data.bookingTime,
          booking_day_of_week: bookingDateTime.toLocaleDateString('en-GB', { weekday: 'long' }),
          party_size: data.partySize,
          is_vip_booking: isVipBooking,
          is_peak_time: isPeakTime,
          is_weekend: isWeekend,
          has_special_requests: !!data.specialRequests,
          booking_source: 'website_server',
          // Items array as JSON string (GA4 MP limitation)
          items: JSON.stringify([{
            item_id: 'table_reservation',
            item_name: `Table for ${data.partySize}`,
            item_brand: 'Dona Theresa',
            item_category: 'Restaurant Booking',
            price: 25,
            quantity: data.partySize
          }])
        }
      },
      // Also send a simpler custom event for easier tracking
      {
        name: 'booking_complete_server',
        params: {
          booking_id: data.bookingId,
          booking_reference: data.bookingReference,
          party_size: data.partySize,
          booking_date: data.bookingDate,
          booking_time: data.bookingTime,
          is_vip: isVipBooking,
          is_weekend: isWeekend,
          is_peak: isPeakTime,
          value: bookingValue
        }
      }
    ]
  }
  
  console.log('[GA4 Server] Tracking booking conversion:', {
    bookingId: data.bookingId,
    reference: data.bookingReference,
    partySize: data.partySize,
    value: bookingValue
  })
  
  return sendGA4Event(payload)
}

/**
 * Track a contact form submission (server-side)
 */
export async function trackContactConversion(data: ContactConversionData): Promise<boolean> {
  const clientId = data.clientId || generateServerClientId()
  
  const payload: GA4Payload = {
    client_id: clientId,
    user_id: hashEmail(data.customerEmail),
    events: [
      {
        name: 'generate_lead',
        params: {
          lead_source: 'website_contact_form',
          form_type: 'contact',
          message_id: data.messageId,
          subject: data.subject || 'General Enquiry',
          currency: 'GBP',
          value: 10 // Estimated lead value
        }
      }
    ]
  }
  
  console.log('[GA4 Server] Tracking contact conversion:', {
    messageId: data.messageId,
    subject: data.subject
  })
  
  return sendGA4Event(payload)
}

/**
 * Track a booking cancellation (server-side)
 */
export async function trackBookingCancellation(data: {
  bookingId: string
  bookingReference: string
  partySize: number
  bookingDate: string
  bookingTime: string
  cancellationReason?: string
  clientId?: string
}): Promise<boolean> {
  const clientId = data.clientId || generateServerClientId()
  
  const payload: GA4Payload = {
    client_id: clientId,
    events: [
      {
        name: 'booking_cancelled',
        params: {
          booking_id: data.bookingId,
          booking_reference: data.bookingReference,
          party_size: data.partySize,
          booking_date: data.bookingDate,
          booking_time: data.bookingTime,
          cancellation_reason: data.cancellationReason || 'customer_request',
          lost_value: data.partySize * 25 // Estimated lost revenue
        }
      }
    ]
  }
  
  console.log('[GA4 Server] Tracking booking cancellation:', {
    bookingId: data.bookingId,
    reference: data.bookingReference
  })
  
  return sendGA4Event(payload)
}

/**
 * Simple hash function for email (for user_id)
 * This provides some privacy while still allowing cross-device tracking
 */
function hashEmail(email: string): string {
  let hash = 0
  const str = email.toLowerCase().trim()
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `user_${Math.abs(hash).toString(16)}`
}

/**
 * Validate GA4 event using the debug endpoint
 * Use this during development to check event format
 */
export async function validateGA4Event(payload: GA4Payload): Promise<{ valid: boolean; errors?: string[] }> {
  const settings = await getGA4Settings()
  
  if (!settings.measurementId || !settings.apiSecret) {
    return { valid: false, errors: ['Missing measurement ID or API secret'] }
  }
  
  const url = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${settings.measurementId}&api_secret=${settings.apiSecret}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    const result = await response.json()
    
    if (result.validationMessages && result.validationMessages.length > 0) {
      return {
        valid: false,
        errors: result.validationMessages.map((m: any) => m.description)
      }
    }
    
    return { valid: true }
  } catch (error) {
    return { valid: false, errors: [(error as Error).message] }
  }
}
