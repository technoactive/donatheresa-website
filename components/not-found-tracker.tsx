'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function NotFoundTracker() {
  const pathname = usePathname()

  useEffect(() => {
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
      })
    }

    // Log to console for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[404 Error] Page not found:', pathname)
    }
  }, [pathname])

  return null
}
