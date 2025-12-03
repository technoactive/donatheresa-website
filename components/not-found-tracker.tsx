'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ErrorTracker } from '@/lib/error-tracking'

export function NotFoundTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Get referrer information
    const referrer = typeof document !== 'undefined' ? document.referrer : null
    
    // Track 404 in Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: '404 - Page Not Found',
        page_location: window.location.href,
        page_path: pathname,
      })

      // Track as a specific 404 event for better analytics
      window.gtag('event', 'error', {
        error_type: '404_not_found',
        error_page: pathname,
        error_url: window.location.href,
        error_referrer: referrer || 'direct',
      })
    }

    // Use our error tracking system
    ErrorTracker.log404(window.location.href, referrer)

    // Check if it's a bot/scanner
    if (ErrorTracker.isLikelyBot(pathname)) {
      console.log('[404 Bot Detected] Likely bot/scanner attempt:', pathname)
    }

    // Log to console for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[404 Error] Page not found:', {
        pathname,
        referrer: referrer || 'direct access',
        fullUrl: window.location.href
      })
    }
  }, [pathname])

  return null
}
