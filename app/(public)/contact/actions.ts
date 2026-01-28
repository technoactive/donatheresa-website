'use server'

import { createContactMessage } from '@/lib/database'
import { revalidatePath } from 'next/cache'
import { SpamDetector } from '@/lib/spam-detection'
import { headers } from 'next/headers'
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit'

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string
  const honeypot = formData.get('website') as string // Honeypot field

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: 'Please fill in all required fields'
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Please enter a valid email address'
    }
  }

  // Get IP address for rate limiting (in production environment)
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  // Rate limiting: 5 submissions per hour per IP
  const rateLimit = checkRateLimit(ipAddress, RateLimitPresets.contact)
  if (!rateLimit.success) {
    console.warn(`Rate limit exceeded for contact form: ${ipAddress}`)
    return {
      success: false,
      error: 'Too many submissions. Please try again later.'
    }
  }

  // Perform spam detection
  const spamCheck = await SpamDetector.detectSpam({
    name,
    email,
    phone,
    subject,
    message,
    honeypot,
    ipAddress
  })

  if (spamCheck.isSpam) {
    console.log('Spam detected:', {
      email,
      reasons: spamCheck.reasons,
      score: spamCheck.score
    })
    
    // Return success to avoid giving spammers information
    // but don't actually process the message
    return {
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
    }
  }

  // Sanitize inputs to prevent XSS
  const sanitizedData = {
    name: SpamDetector.sanitizeInput(name),
    email: SpamDetector.sanitizeInput(email),
    phone: phone ? SpamDetector.sanitizeInput(phone) : undefined,
    subject: SpamDetector.sanitizeInput(subject),
    message: SpamDetector.sanitizeInput(message)
  }

  try {
    const contactMessage = await createContactMessage({
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      subject: sanitizedData.subject,
      message: sanitizedData.message
    })

    // Send email notifications (fire and forget - don't block contact form submission)
    try {
      const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
      
      // Send auto-reply to customer
      await RobustEmailUtils.sendContactAutoReply(contactMessage);
      
      // Send notification to staff
      await RobustEmailUtils.sendContactNotification(contactMessage);
      
    } catch (emailError) {
      // Log error but don't fail the contact form submission
      console.error('Email notification failed:', emailError);
    }

    revalidatePath('/contact')
    
    return {
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
      // Include conversion data for client-side tracking
      conversionData: {
        messageId: contactMessage.id,
        subject: sanitizedData.subject,
        contactType: 'contact_form'
      }
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return {
      success: false,
      error: 'Failed to send message. Please try again or call us directly.'
    }
  }
} 