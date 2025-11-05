'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
    GA_MEASUREMENT_ID: string | undefined
  }
}

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Check for cookie consent
  useEffect(() => {
    const checkConsent = () => {
      const preferences = localStorage.getItem('dona-theresa-cookie-preferences')
      if (preferences) {
        const parsed = JSON.parse(preferences)
        setHasConsent(parsed.analytics === true)
      }
    }

    checkConsent()
    
    // Listen for storage changes (when user updates consent)
    const handleStorageChange = () => {
      checkConsent()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Set initial consent mode and update when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // First, set default consent mode (on initial load)
      window.gtag('consent', 'default', {
        'analytics_storage': hasConsent ? 'granted' : 'denied',
        'functionality_storage': hasConsent ? 'granted' : 'denied',
        'personalization_storage': hasConsent ? 'granted' : 'denied',
        'ad_storage': 'denied'
      })
      
      // Then update if consent changes
      if (hasConsent) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'functionality_storage': 'granted', 
          'personalization_storage': 'granted'
        })
        console.log('Google Analytics consent granted')
      } else {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'functionality_storage': 'denied',
          'personalization_storage': 'denied'
        })
        console.log('Google Analytics consent denied')
      }
    }
  }, [hasConsent])

  // Track page views when route changes (only if consent given)
  useEffect(() => {
    if (hasConsent && window.gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      // Use the measurement ID from the database (already configured in server component)
      window.gtag('event', 'page_view', {
        page_path: url,
      })
    }
  }, [pathname, searchParams, hasConsent])

  // This component now only handles consent and tracking, not script loading
  return null
}

// Event tracking utilities
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// E-commerce tracking
export const trackPurchase = (transactionData: {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', transactionData)
  }
}

// Reservation tracking
export const trackReservation = (reservationData: {
  reservation_id: string
  party_size: number
  date: string
  time: string
  source?: string
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'reservation_made', {
      event_category: 'engagement',
      event_label: reservationData.source || 'website',
      custom_parameters: {
        reservation_id: reservationData.reservation_id,
        party_size: reservationData.party_size,
        reservation_date: reservationData.date,
        reservation_time: reservationData.time,
      }
    })
  }
} 