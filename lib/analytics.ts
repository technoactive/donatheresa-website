// Google Analytics 4 Event Tracking Utilities

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      targetOrAction: string,
      parameters?: Record<string, any>
    ) => void
  }
}

// GA4 Event Names (following Google's recommended naming conventions)
export const GA_EVENTS = {
  // E-commerce/Booking Events
  VIEW_ITEM: 'view_item',                    // View menu item
  ADD_TO_CART: 'add_to_cart',               // Start booking process
  BEGIN_CHECKOUT: 'begin_checkout',          // Begin reservation
  PURCHASE: 'purchase',                      // Complete reservation
  
  // Custom Events
  FORM_START: 'form_start',                  // Start filling form
  FORM_SUBMIT: 'form_submit',                // Submit form
  GENERATE_LEAD: 'generate_lead',            // Contact form submission
  
  // Engagement Events
  SEARCH: 'search',                          // Site search
  SELECT_CONTENT: 'select_content',          // Click important content
  SHARE: 'share',                            // Share content
  
  // Navigation Events
  CLICK_CTA: 'click_cta',                    // Click call-to-action
  CLICK_PHONE: 'click_phone',                // Click phone number
  CLICK_EMAIL: 'click_email',                // Click email
  VIEW_MENU: 'view_menu',                    // View menu pages
} as const

export type GAEventName = typeof GA_EVENTS[keyof typeof GA_EVENTS]

interface BookingEventParams {
  booking_date?: string
  booking_time?: string
  party_size?: number
  special_requests?: boolean
  value?: number
  currency?: string
}

interface ContactEventParams {
  contact_type?: string
  subject?: string
}

// Track custom events
export function trackEvent(
  eventName: GAEventName | string,
  parameters?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('[GA4 Event]', eventName, parameters)
    window.gtag('event', eventName, parameters)
  }
}

// Track reservation-related events
export function trackReservationEvent(
  stage: 'view' | 'start' | 'complete',
  params?: BookingEventParams
) {
  let eventName: GAEventName
  let eventParams: Record<string, any> = {}

  switch (stage) {
    case 'view':
      eventName = GA_EVENTS.VIEW_ITEM
      eventParams = {
        item_name: 'Table Reservation',
        item_category: 'Bookings',
        ...params
      }
      break
      
    case 'start':
      eventName = GA_EVENTS.BEGIN_CHECKOUT
      eventParams = {
        value: 0, // Could be deposit amount
        currency: 'GBP',
        items: [{
          item_id: 'table_reservation',
          item_name: 'Table Reservation',
          item_category: 'Bookings',
          quantity: params?.party_size || 1,
        }],
        ...params
      }
      break
      
    case 'complete':
      eventName = GA_EVENTS.PURCHASE
      eventParams = {
        transaction_id: `booking_${Date.now()}`,
        value: params?.value || 0,
        currency: 'GBP',
        items: [{
          item_id: 'table_reservation',
          item_name: 'Table Reservation',
          item_category: 'Bookings',
          quantity: params?.party_size || 1,
          price: params?.value || 0
        }],
        ...params
      }
      break
  }

  trackEvent(eventName, eventParams)
}

// Track contact form events
export function trackContactFormEvent(
  stage: 'start' | 'submit',
  params?: ContactEventParams
) {
  if (stage === 'start') {
    trackEvent(GA_EVENTS.FORM_START, {
      form_type: 'contact',
      ...params
    })
  } else {
    trackEvent(GA_EVENTS.GENERATE_LEAD, {
      form_type: 'contact',
      lead_source: 'website_contact_form',
      ...params
    })
  }
}

// Track menu views with enhanced ecommerce data
export function trackMenuView(menuType: string) {
  trackEvent(GA_EVENTS.VIEW_ITEM, {
    item_name: `${menuType} Menu`,
    item_category: 'Menu',
    item_list_name: 'Menu Pages',
  })
}

// Track CTA clicks
export function trackCTAClick(
  ctaName: string,
  ctaLocation: string,
  destination?: string
) {
  trackEvent(GA_EVENTS.CLICK_CTA, {
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_destination: destination
  })
}

// Track phone clicks
export function trackPhoneClick(phoneNumber: string, location: string) {
  trackEvent(GA_EVENTS.CLICK_PHONE, {
    phone_number: phoneNumber,
    click_location: location
  })
}

// Track search
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent(GA_EVENTS.SEARCH, {
    search_term: searchTerm,
    results_count: resultsCount
  })
}

// Helper to track page timing
export function trackPageTiming(pageName: string, loadTime: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: 'page_load',
      value: Math.round(loadTime),
      event_category: 'Performance',
      event_label: pageName
    })
  }
}

// Initialize enhanced ecommerce tracking
export function initializeAnalytics() {
  if (typeof window !== 'undefined' && window.gtag) {
    // Set up enhanced ecommerce
    window.gtag('set', {
      'currency': 'GBP',
      'country': 'GB'
    })
    
    // Track web vitals
    if ('web-vital' in window) {
      window.addEventListener('web-vital', (event: any) => {
        const { name, value } = event.detail
        trackEvent('web_vitals', {
          metric_name: name,
          metric_value: value,
          metric_rating: event.detail.rating
        })
      })
    }
  }
}
