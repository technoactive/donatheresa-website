// Error tracking utilities for monitoring 404s and other issues

interface ErrorLog {
  type: '404' | 'error'
  url: string
  referrer: string | null
  timestamp: string
  userAgent?: string
}

export class ErrorTracker {
  // In production, this would send to an analytics service
  static async log404(url: string, referrer: string | null) {
    const errorLog: ErrorLog = {
      type: '404',
      url,
      referrer,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[404 Tracking]', errorLog)
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', '404_error', {
        page_location: url,
        page_referrer: referrer || 'direct',
        error_type: '404_not_found'
      })
    }

    // In production, you could send this to a logging service
    // await fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorLog) })
  }

  // Common 404 patterns to watch for
  static getCommon404Patterns() {
    return [
      { pattern: /\/wp-admin/i, description: 'WordPress admin attempts' },
      { pattern: /\.php$/i, description: 'PHP file requests' },
      { pattern: /\/admin/i, description: 'Admin panel attempts' },
      { pattern: /favicon\.ico$/i, description: 'Missing favicon' },
      { pattern: /robots\.txt$/i, description: 'Robots.txt requests' },
      { pattern: /sitemap\.xml$/i, description: 'Sitemap requests' },
      { pattern: /\.env/i, description: 'Environment file attempts' },
      { pattern: /\.(asp|aspx|jsp)$/i, description: 'Non-Next.js file requests' },
    ]
  }

  // Analyze if 404 is from a bot/scanner
  static isLikelyBot(url: string): boolean {
    const botPatterns = this.getCommon404Patterns()
    return botPatterns.some(({ pattern }) => pattern.test(url))
  }
}
