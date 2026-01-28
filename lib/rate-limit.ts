/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 * 
 * Note: For production at scale, use Redis-based rate limiting
 * This works well for moderate traffic on Vercel
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (resets on cold start)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

interface RateLimitConfig {
  // Maximum requests allowed in the window
  limit: number
  // Time window in seconds
  windowSeconds: number
  // Optional: identifier prefix for different rate limit buckets
  prefix?: string
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  limit: number
}

/**
 * Check rate limit for a given identifier (usually IP or user ID)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowSeconds, prefix = 'default' } = config
  const key = `${prefix}:${identifier}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  
  const entry = rateLimitStore.get(key)
  
  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
      limit,
    }
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
      limit,
    }
  }
  
  // Increment count
  entry.count++
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetTime,
    limit,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.reset / 1000).toString(),
  }
}

// Preset configurations for common use cases
export const RateLimitPresets = {
  // General API: 100 requests per minute
  api: { limit: 100, windowSeconds: 60, prefix: 'api' },
  
  // Strict: 20 requests per minute (for sensitive endpoints)
  strict: { limit: 20, windowSeconds: 60, prefix: 'strict' },
  
  // Auth: 5 attempts per 15 minutes (for login/auth endpoints)
  auth: { limit: 5, windowSeconds: 900, prefix: 'auth' },
  
  // Booking: 10 bookings per hour per IP
  booking: { limit: 10, windowSeconds: 3600, prefix: 'booking' },
  
  // Contact form: 5 submissions per hour
  contact: { limit: 5, windowSeconds: 3600, prefix: 'contact' },
  
  // Email: 3 emails per minute (for transactional emails)
  email: { limit: 3, windowSeconds: 60, prefix: 'email' },
}
