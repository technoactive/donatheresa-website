'use server'

import { createContactMessage } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: 'Please fill in all required fields'
    }
  }

  try {
    const contactMessage = await createContactMessage({
      name,
      email,
      phone: phone || undefined,
      subject,
      message
    })

    // Send email notifications (fire and forget - don't block contact form submission)
    try {
      const { EmailUtils } = await import('@/lib/email/email-service');
      
      // Send auto-reply to customer
      await EmailUtils.sendContactAutoReply(contactMessage);
      
      // Send notification to staff
      await EmailUtils.sendContactNotification(contactMessage);
      
    } catch (emailError) {
      // Log error but don't fail the contact form submission
      console.error('Email notification failed:', emailError);
    }

    revalidatePath('/contact')
    
    return {
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return {
      success: false,
      error: 'Failed to send message. Please try again or call us directly.'
    }
  }
} 