// Spam detection utilities for contact forms

interface SpamCheckResult {
  isSpam: boolean
  reasons: string[]
  score: number
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()

export class SpamDetector {
  // Check if text contains random character patterns typical of spam
  static hasRandomCharacterPattern(text: string): boolean {
    if (!text) return false
    
    // Check for excessive uppercase/lowercase mixing
    const mixedCasePattern = /([A-Z][a-z]){5,}|([a-z][A-Z]){5,}/
    if (mixedCasePattern.test(text)) return true
    
    // Check for random character sequences (e.g., "yaowFHCRtNaPMcXFhoXweQ")
    // Looks for strings with high entropy and mixed case
    const words = text.split(/\s+/)
    for (const word of words) {
      if (word.length > 10) {
        // Count transitions between upper/lower case
        let transitions = 0
        for (let i = 1; i < word.length; i++) {
          const prevIsUpper = /[A-Z]/.test(word[i - 1])
          const currIsUpper = /[A-Z]/.test(word[i])
          if (prevIsUpper !== currIsUpper) transitions++
        }
        // If more than 40% of characters are case transitions, likely spam
        if (transitions > word.length * 0.4) return true
      }
    }
    
    // Check for strings that are all consonants or have unusual letter patterns
    const consonantOnlyPattern = /^[bcdfghjklmnpqrstvwxyz]{8,}$/i
    if (consonantOnlyPattern.test(text.replace(/\s+/g, ''))) return true
    
    return false
  }
  
  // Check for suspicious email patterns
  static hasSuspiciousEmail(email: string): boolean {
    const suspiciousPatterns = [
      /\d{4,}@/, // Many numbers before @
      /@(guerrillamail|mailinator|10minutemail|tempmail)\./, // Known temp email services
      /^[a-z0-9]{20,}@/, // Very long random username
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(email.toLowerCase()))
  }
  
  // Check message content for spam indicators
  static checkMessageContent(message: string): { isSpam: boolean; score: number } {
    let score = 0
    
    // Very short messages with random characters
    if (message.length < 30 && this.hasRandomCharacterPattern(message)) {
      score += 50
    }
    
    // Check for typical spam keywords
    const spamKeywords = [
      /\b(viagra|cialis|casino|lottery|winner|prize|click here|buy now|limited time)\b/i,
      /\b(earn money|work from home|lose weight|enlargement|miracle|guaranteed)\b/i,
      /https?:\/\/[^\s]+/g, // URLs in first contact
    ]
    
    spamKeywords.forEach(keyword => {
      if (keyword.test(message)) score += 30
    })
    
    // Check for excessive special characters
    const specialCharCount = (message.match(/[!@#$%^&*()]/g) || []).length
    if (specialCharCount > message.length * 0.1) score += 20
    
    // Messages that are just random characters
    if (message.length > 10 && /^[a-zA-Z0-9]+$/.test(message) && this.hasRandomCharacterPattern(message)) {
      score += 80
    }
    
    return { isSpam: score >= 50, score }
  }
  
  // Check rate limiting (basic implementation)
  static checkRateLimit(identifier: string, maxRequests: number = 3, windowMinutes: number = 60): boolean {
    const now = Date.now()
    const window = windowMinutes * 60 * 1000
    
    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.timestamp > window) {
        rateLimitStore.delete(key)
      }
    }
    
    const existing = rateLimitStore.get(identifier)
    
    if (!existing) {
      rateLimitStore.set(identifier, { count: 1, timestamp: now })
      return true
    }
    
    if (now - existing.timestamp > window) {
      rateLimitStore.set(identifier, { count: 1, timestamp: now })
      return true
    }
    
    if (existing.count >= maxRequests) {
      return false
    }
    
    existing.count++
    return true
  }
  
  // Main spam detection function
  static async detectSpam(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    honeypot?: string
    ipAddress?: string
  }): Promise<SpamCheckResult> {
    const reasons: string[] = []
    let totalScore = 0
    
    // 1. Check honeypot field (if filled, it's definitely a bot)
    if (data.honeypot && data.honeypot.length > 0) {
      reasons.push('Honeypot field filled')
      totalScore += 100
    }
    
    // 2. Check name for random patterns
    if (this.hasRandomCharacterPattern(data.name)) {
      reasons.push('Name contains random character pattern')
      totalScore += 40
    }
    
    // 3. Check email
    if (this.hasSuspiciousEmail(data.email)) {
      reasons.push('Suspicious email pattern')
      totalScore += 30
    }
    
    // 4. Check message content
    const messageCheck = this.checkMessageContent(data.message)
    if (messageCheck.isSpam) {
      reasons.push('Message content appears to be spam')
      totalScore += messageCheck.score
    }
    
    // 5. Check if name and message have similar random patterns
    if (this.hasRandomCharacterPattern(data.name) && this.hasRandomCharacterPattern(data.message)) {
      reasons.push('Both name and message have random patterns')
      totalScore += 30
    }
    
    // 6. Rate limiting check
    const rateLimitKey = data.ipAddress || data.email
    if (!this.checkRateLimit(rateLimitKey)) {
      reasons.push('Rate limit exceeded')
      totalScore += 50
    }
    
    // 7. Check for very generic subjects with random content
    if (data.subject === 'general' && this.hasRandomCharacterPattern(data.message)) {
      reasons.push('Generic subject with random message')
      totalScore += 20
    }
    
    // 8. Check phone number format (if provided)
    if (data.phone) {
      // Check if phone is just random numbers
      if (/^\d{10,}$/.test(data.phone) && !data.phone.startsWith('0')) {
        reasons.push('Suspicious phone number format')
        totalScore += 15
      }
    }
    
    return {
      isSpam: totalScore >= 50,
      reasons,
      score: totalScore
    }
  }
  
  // Sanitize form data to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }
}
