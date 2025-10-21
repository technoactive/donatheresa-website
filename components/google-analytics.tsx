'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface GoogleAnalyticsSettings {
  measurement_id: string | null
  enabled: boolean
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export function GoogleAnalytics() {
  const [settings, setSettings] = useState<GoogleAnalyticsSettings | null>(null)
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

  // Fetch GA settings from the database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/google-analytics-settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch Google Analytics settings:', error)
      }
    }

    fetchSettings()
  }, [])

  // Track page views when route changes
  useEffect(() => {
    if (settings?.enabled && settings?.measurement_id && hasConsent && window.gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      window.gtag('config', settings.measurement_id, {
        page_path: url,
      })
    }
  }, [pathname, searchParams, settings, hasConsent])

  // Don't render anything if GA is not enabled, no measurement ID, or no consent
  if (!settings?.enabled || !settings?.measurement_id || !hasConsent) {
    return null
  }

  const gaMeasurementId = settings.measurement_id

  return (
    <>
      {/* Google Analytics Scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Set consent mode
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'functionality_storage': 'granted',
              'personalization_storage': 'granted',
              'ad_storage': 'denied'
            });
            
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
              cookie_flags: 'max-age=7200;secure;samesite=none'
            });
          `,
        }}
      />
    </>
  )
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