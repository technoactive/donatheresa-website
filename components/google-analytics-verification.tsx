'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface GoogleAnalyticsSettings {
  measurement_id: string | null
  enabled: boolean
}

export function GoogleAnalyticsVerification() {
  const [settings, setSettings] = useState<GoogleAnalyticsSettings | null>(null)

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

  // Don't render anything if GA is not enabled or no measurement ID
  if (!settings?.enabled || !settings?.measurement_id) {
    return null
  }

  const gaMeasurementId = settings.measurement_id

  // This version loads GA without consent check for verification purposes
  // It sets consent to "denied" by default, so no tracking happens
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-verification"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Set consent mode to denied by default (no tracking)
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            // This config is just for Google to detect the tag
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
              send_page_view: false // Don't send page view without consent
            });
            
            console.log('Google Analytics verification tag loaded with ID:', '${gaMeasurementId}');
          `,
        }}
      />
    </>
  )
}
