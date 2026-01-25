/**
 * Robust Email Service with Guaranteed Delivery
 * Fixes the critical issue where emails are logged but never sent
 */

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import type { EmailResult, SendEmailParams } from './types';

interface RobustEmailConfig {
  maxRetries: number;
  retryDelay: number;
  timeoutMs: number;
}

class RobustEmailService {
  private resend: Resend | null = null;
  private config: RobustEmailConfig = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    timeoutMs: 30000 // 30 seconds
  };

  /**
   * Initialize email service with robust error handling
   */
  private async initialize(): Promise<boolean> {
    try {
      if (this.resend) return true;

      const supabase = await createClient();
      const { data: settings } = await supabase
        .from('email_settings')
        .select('api_key_encrypted, email_provider, sender_email, sender_name')
        .eq('user_id', 'admin')
        .single();

      if (!settings?.api_key_encrypted) {
        console.error('🚨 Email service: No API key configured');
        return false;
      }

      if (!settings.sender_email) {
        console.error('🚨 Email service: No sender email configured');
        return false;
      }

      this.resend = new Resend(settings.api_key_encrypted);
      console.log('✅ Email service initialized successfully');
      return true;
    } catch (error) {
      console.error('🚨 Email service initialization failed:', error);
      return false;
    }
  }

  /**
   * Send email with guaranteed delivery or queue for retry
   */
  async sendEmailRobust(params: SendEmailParams): Promise<EmailResult> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    // Try immediate sending with retries
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`📧 Attempt ${attempt}/${this.config.maxRetries} sending email to ${params.recipientEmail}`);
        
        const result = await this.sendEmailAttempt(params);
        
        if (result.success) {
          const duration = Date.now() - startTime;
          console.log(`✅ Email sent successfully in ${duration}ms (attempt ${attempt})`);
          
          // Update log to sent status
          if (result.logId) {
            await this.updateEmailStatus(result.logId, 'sent', result.messageId);
          }
          
          return result;
        } else {
          lastError = new Error(result.error || 'Unknown error');
          console.warn(`⚠️ Attempt ${attempt} failed: ${result.error}`);
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`❌ Attempt ${attempt} threw error:`, error);
      }

      // Wait before retry (exponential backoff)
      if (attempt < this.config.maxRetries) {
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        await this.delay(delay);
      }
    }

    // If all attempts failed, queue for later processing
    console.error(`🚨 All ${this.config.maxRetries} attempts failed. Queueing email for later processing.`);
    
    const queueResult = await this.queueEmailForRetry(params, lastError?.message || 'Max retries exceeded');
    
    return {
      success: false,
      error: `Failed after ${this.config.maxRetries} attempts. Queued for retry.`,
      logId: queueResult.logId
    };
  }

  /**
   * Single email sending attempt
   */
  private async sendEmailAttempt(params: SendEmailParams): Promise<EmailResult> {
    // Check daily limit first
    const canSend = await this.checkDailyLimit();
    if (!canSend) {
      throw new Error('Daily email limit reached');
    }

    // Initialize if needed
    if (!(await this.initialize())) {
      throw new Error('Email service initialization failed');
    }

    if (!this.resend) {
      throw new Error('Resend client not available');
    }

    // Get email settings and template
    const supabase = await createClient();
    
    const [settingsResult, templateResult] = await Promise.all([
      supabase.from('email_settings').select('*').eq('user_id', 'admin').single(),
      supabase.from('email_templates').select('*').eq('template_key', params.templateKey).eq('is_active', true).single()
    ]);

    if (settingsResult.error || !settingsResult.data) {
      throw new Error('Email settings not found');
    }

    if (templateResult.error || !templateResult.data) {
      throw new Error(`Template ${params.templateKey} not found`);
    }

    const settings = settingsResult.data;
    const template = templateResult.data;

    // Generate template data with restaurant info
    const templateData = await this.prepareTemplateData(params.data || {}, settings);

    // Render template
    const subject = this.renderTemplate(template.subject, templateData);
    const htmlContent = this.renderTemplate(template.html_content, templateData);

    // Create email log (use snake_case for database columns)
    const logId = await this.createEmailLog({
      template_key: params.templateKey,
      recipient_email: params.recipientEmail,
      recipient_name: params.recipientName,
      subject,
      status: 'pending',
      booking_id: params.bookingId,
      contact_id: params.contactId,
    });

    // Send email with timeout
    const emailData = {
      from: `${settings.sender_name} <${settings.sender_email}>`,
      to: [params.recipientEmail],
      subject,
      html: htmlContent,
      ...(settings.reply_to_email && { replyTo: settings.reply_to_email }),
    };

    // Send with timeout
    const sendPromise = this.resend.emails.send(emailData);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout')), this.config.timeoutMs);
    });

    const result = await Promise.race([sendPromise, timeoutPromise]) as any;

    if (result.error) {
      // Update log with error
      if (logId) {
        await this.updateEmailStatus(logId, 'failed', null, result.error.message);
      }
      throw new Error(result.error.message);
    }

    // Success - update daily email count
    console.log('✅ Email sent successfully, updating daily count...');
    
    // Update daily email counter
    await this.updateDailyEmailCount();

    return {
      success: true,
      messageId: result.data?.id,
      logId: logId !== null ? logId : undefined
    };
  }

  /**
   * Queue email for later retry
   */
  private async queueEmailForRetry(params: SendEmailParams, error: string): Promise<{ logId: string | null }> {
    try {
      const supabase = await createClient();
      
      // Insert into email queue
      const { data, error: queueError } = await supabase
        .from('email_queue')
        .insert({
          template_key: params.templateKey,
          recipient_email: params.recipientEmail,
          recipient_name: params.recipientName,
          subject: `${params.templateKey} for ${params.recipientName || params.recipientEmail}`,
          email_data: params.data || {},
          scheduled_for: new Date().toISOString(),
          priority: 5, // High priority for failed immediate sends
          booking_id: params.bookingId,
          contact_id: params.contactId,
          error_message: error,
          current_attempts: this.config.maxRetries
        })
        .select('id')
        .single();

      if (queueError) {
        console.error('Failed to queue email:', queueError);
        return { logId: null };
      }

      console.log(`📥 Email queued for retry: ${data.id}`);
      return { logId: data.id };
    } catch (error) {
      console.error('Error queueing email:', error);
      return { logId: null };
    }
  }

  /**
   * Process email queue (for pending emails)
   */
  async processEmailQueue(): Promise<{ processed: number; success: number; failed: number }> {
    try {
      const supabase = await createClient();
      
      // Get pending emails
      const { data: queuedEmails } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(20); // Process in batches

      if (!queuedEmails?.length) {
        return { processed: 0, success: 0, failed: 0 };
      }

      let successCount = 0;
      let failedCount = 0;

      for (const email of queuedEmails) {
        try {
          // Mark as processing
          await supabase
            .from('email_queue')
            .update({ status: 'processing' })
            .eq('id', email.id);

          // Attempt to send
          const result = await this.sendEmailAttempt({
            templateKey: email.template_key,
            recipientEmail: email.recipient_email,
            recipientName: email.recipient_name,
            data: email.email_data,
            bookingId: email.booking_id,
            contactId: email.contact_id,
          });

          if (result.success) {
            // Mark as sent
            await supabase
              .from('email_queue')
              .update({ status: 'sent' })
              .eq('id', email.id);
            successCount++;
            console.log(`✅ Queue processed email: ${email.recipient_email}`);
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          // Handle failure
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          if (email.current_attempts >= 5) {
            // Max attempts reached
            await supabase
              .from('email_queue')
              .update({ 
                status: 'failed',
                error_message: errorMessage
              })
              .eq('id', email.id);
            console.error(`❌ Email permanently failed: ${email.recipient_email}`);
          } else {
            // Retry later
            const nextAttempt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            await supabase
              .from('email_queue')
              .update({ 
                status: 'pending',
                current_attempts: email.current_attempts + 1,
                error_message: errorMessage,
                process_after: nextAttempt.toISOString()
              })
              .eq('id', email.id);
            console.warn(`⚠️ Email retry scheduled: ${email.recipient_email}`);
          }
        }
      }

      return { processed: queuedEmails.length, success: successCount, failed: failedCount };
    } catch (error) {
      console.error('Email queue processing failed:', error);
      return { processed: 0, success: 0, failed: 0 };
    }
  }

  /**
   * Process all stuck pending emails from email_logs
   */
  async processPendingEmails(): Promise<{ processed: number; success: number; failed: number }> {
    try {
      const supabase = await createClient();
      
      // Get stuck pending emails
      const { data: pendingEmails } = await supabase
        .from('email_logs')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(10); // Process in small batches

      if (!pendingEmails?.length) {
        return { processed: 0, success: 0, failed: 0 };
      }

      let successCount = 0;
      let failedCount = 0;

      for (const email of pendingEmails) {
        try {
          // Try to resend the email
          const result = await this.sendEmailAttempt({
            templateKey: email.template_key,
            recipientEmail: email.recipient_email,
            recipientName: email.recipient_name,
            bookingId: email.booking_id,
            contactId: email.contact_id,
            data: {
              customerName: email.recipient_name,
              // Add basic data - the template will handle missing fields
            }
          });

          if (result.success) {
            // Update original log
            await this.updateEmailStatus(email.id, 'sent', result.messageId);
            successCount++;
            console.log(`✅ Processed pending email: ${email.recipient_email}`);
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          await this.updateEmailStatus(email.id, 'failed', null, errorMessage);
          console.error(`❌ Failed to process pending email: ${email.recipient_email}`, errorMessage);
        }
      }

      return { processed: pendingEmails.length, success: successCount, failed: failedCount };
    } catch (error) {
      console.error('Pending email processing failed:', error);
      return { processed: 0, success: 0, failed: 0 };
    }
  }

  // Helper methods
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template;
    rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
    return rendered;
  }

  private async prepareTemplateData(data: Record<string, any>, settings: any): Promise<Record<string, any>> {
    // Get locale settings for footer
    const supabase = await createClient();
    const { data: localeSettings } = await supabase
      .from('locale_settings')
      .select('*')
      .eq('id', 1)
      .single();

    const customFooter = localeSettings ? 
      `${localeSettings.restaurant_name} | ${localeSettings.restaurant_address}, ${localeSettings.restaurant_city} ${localeSettings.restaurant_postal_code} | ${localeSettings.restaurant_phone}` :
      'Dona Theresa | 451 Uxbridge Road, Pinner HA5 4JR';

    return {
      restaurantName: localeSettings?.restaurant_name || 'Dona Theresa',
      restaurantPhone: localeSettings?.restaurant_phone || '+44 20 8421 5550',
      restaurantEmail: (settings.restaurant_email || settings.reply_to_email || 'donatheresahatchend@gmail.com') as string,
      restaurantAddress: localeSettings?.restaurant_address || '451 Uxbridge Road, Pinner HA5 4JR',
      brandColor: settings.brand_color || '#1e3a8a',
      customFooter,
      websiteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.donatheresa.com',
      guestText: (Number(data.partySize) === 1) ? 'guest' : 'guests',
      createdAt: new Date().toLocaleString('en-GB'),
      ...data
    };
  }

  private async createEmailLog(params: any): Promise<string | null> {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('email_logs')
        .insert(params)
        .select('id')
        .single();
      return data?.id || null;
    } catch (error) {
      console.error('Failed to create email log:', error);
      return null;
    }
  }

  private async updateEmailStatus(logId: string, status: string, messageId?: string | null, errorMessage?: string): Promise<void> {
    try {
      const supabase = await createClient();
      const updates: any = { status };
      
      if (messageId) updates.provider_message_id = messageId;
      if (errorMessage) updates.error_message = errorMessage;
      if (status === 'sent') updates.sent_at = new Date().toISOString();

      await supabase
        .from('email_logs')
        .update(updates)
        .eq('id', logId);
    } catch (error) {
      console.error('Failed to update email status:', error);
    }
  }

  /**
   * Update daily email count after successful send
   */
  private async updateDailyEmailCount(): Promise<void> {
    try {
      console.log('📊 Updating daily email count...');
      const supabase = await createClient();
      
      // Manually increment the email count
      // First reset count if it's a new day, then increment
      await supabase.rpc('reset_daily_email_count');
      
      // Get current count and increment it
      const { data: currentSettings, error: selectError } = await supabase
        .from('email_settings')
        .select('emails_sent_today')
        .eq('user_id', 'admin')
        .single();
      
      if (selectError) {
        console.error('❌ Failed to get current email count:', selectError);
        return;
      }
      
      const newCount = (currentSettings?.emails_sent_today || 0) + 1;
      
      const { error } = await supabase
        .from('email_settings')
        .update({ 
          emails_sent_today: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', 'admin');
      
      if (error) {
        console.error('❌ Failed to update daily email count:', error);
      } else {
        console.log(`✅ Daily email count updated: ${newCount}`);
      }
    } catch (error) {
      console.error('💥 Error updating daily email count:', error);
    }
  }

  /**
   * Check if within daily email limit
   */
  private async checkDailyLimit(): Promise<boolean> {
    try {
      const supabase = await createClient();
      
      // Reset counter if new day
      await supabase.rpc('reset_daily_email_count');
      
      const { data: settings, error } = await supabase
        .from('email_settings')
        .select('emails_sent_today, max_daily_emails')
        .eq('user_id', 'admin')
        .single();
      
      if (error) {
        console.error('❌ Failed to check daily limit:', error);
        return true; // Allow sending if we can't check
      }
      
      const currentCount = settings?.emails_sent_today || 0;
      const dailyLimit = settings?.max_daily_emails || 1000;
      
      console.log(`📊 Daily email usage: ${currentCount}/${dailyLimit}`);
      
      if (currentCount >= dailyLimit) {
        console.warn(`⚠️ Daily email limit reached: ${currentCount}/${dailyLimit}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('💥 Error checking daily limit:', error);
      return true; // Allow sending if check fails
    }
  }
}

// Export singleton instance
export const robustEmailService = new RobustEmailService();

// Booking-specific utilities
export const RobustEmailUtils = {
  async sendBookingConfirmation(booking: any, customer: any): Promise<EmailResult> {
    // Build cancellation link using the booking's cancellation token
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://donatheresa.com';
    const cancellationLink = booking.cancellation_token 
      ? `${baseUrl}/cancel-booking?token=${booking.cancellation_token}`
      : null;

    return robustEmailService.sendEmailRobust({
      templateKey: 'booking_confirmation',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        bookingId: booking.booking_reference || booking.id,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        specialRequests: booking.special_requests || '',
        cancellationLink: cancellationLink,
        hasCancellationLink: !!cancellationLink,
      }
    });
  },

  async sendStaffBookingAlert(booking: any, customer: any, staffEmail: string): Promise<EmailResult> {
    return robustEmailService.sendEmailRobust({
      templateKey: 'staff_booking_alert',
      recipientEmail: staffEmail,
      recipientName: 'Restaurant Staff',
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || '',
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        specialRequests: booking.special_requests || '',
        bookingId: booking.booking_reference || booking.id,
        customerSegment: customer.customer_segment || 'new',
        isVipCustomer: customer.customer_segment === 'vip',
        totalBookings: customer.total_bookings || 0,
        bookingSource: booking.source || 'website',
        createdAt: new Date().toLocaleString('en-GB'),
        guestText: (Number(booking.party_size) === 1) ? 'guest' : 'guests',
      }
    });
  },

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellation(booking: any, customer: any): Promise<EmailResult> {
    return robustEmailService.sendEmailRobust({
      templateKey: 'booking_cancellation',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        bookingId: booking.booking_reference || booking.id,
        guestText: (Number(booking.party_size) === 1) ? 'guest' : 'guests',
      }
    });
  },

  /**
   * Send booking reconfirmation request email
   */
  async sendReconfirmationRequest(booking: any, customer: any, reconfirmationLink: string, deadlineHours: number): Promise<EmailResult> {
    return robustEmailService.sendEmailRobust({
      templateKey: 'booking_reconfirmation_request',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        bookingReference: booking.booking_reference || booking.id,
        reconfirmationLink: reconfirmationLink,
        confirmLink: `${reconfirmationLink}&action=confirm`,
        cancelLink: reconfirmationLink, // Points to same page where they can click "Cancel My Booking"
        deadlineHours: deadlineHours,
        specialRequests: booking.special_requests || '',
        guestText: (Number(booking.party_size) === 1) ? 'guest' : 'guests',
      }
    });
  },

  /**
   * Send urgent reconfirmation reminder email
   */
  async sendReconfirmationReminder(booking: any, customer: any, reconfirmationLink: string, deadlineHours: number): Promise<EmailResult> {
    return robustEmailService.sendEmailRobust({
      templateKey: 'booking_reconfirmation_reminder',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        confirmLink: `${reconfirmationLink}&action=confirm`,
        deadlineHours: deadlineHours,
        guestText: (Number(booking.party_size) === 1) ? 'guest' : 'guests',
      }
    });
  },

  // Process stuck emails
  async processStuckEmails(): Promise<{ processed: number; success: number; failed: number }> {
    const pendingResult = await robustEmailService.processPendingEmails();
    const queueResult = await robustEmailService.processEmailQueue();
    
    return {
      processed: pendingResult.processed + queueResult.processed,
      success: pendingResult.success + queueResult.success,
      failed: pendingResult.failed + queueResult.failed
    };
  },

  /**
   * Send contact form notification to staff
   */
  async sendContactNotification(contact: any): Promise<EmailResult> {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (!settings?.contact_staff_notification || !settings.restaurant_email) {
      return { success: false, error: 'Contact alerts disabled or no email configured' };
    }

    return robustEmailService.sendEmailRobust({
      templateKey: 'staff_contact_notification',
      recipientEmail: settings.restaurant_email,
      recipientName: 'Restaurant Staff',
      contactId: contact.id,
      data: {
        customerName: contact.name,
        customerEmail: contact.email,
        customerPhone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        submittedAt: new Date(contact.created_at).toLocaleString('en-GB'),
      }
    });
  },

  /**
   * Send contact auto-reply to customer
   */
  async sendContactAutoReply(contact: any): Promise<EmailResult> {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (!settings?.contact_auto_reply_enabled) {
      return { success: false, error: 'Auto-reply disabled' };
    }

    return robustEmailService.sendEmailRobust({
      templateKey: 'contact_auto_reply',
      recipientEmail: contact.email,
      recipientName: contact.name,
      contactId: contact.id,
      data: {
        customerName: contact.name,
        subject: contact.subject,
        message: contact.message,
        sentAt: new Date(contact.created_at).toLocaleString('en-GB'),
      }
    });
  },

  /**
   * Send staff alert when customer doesn't respond to reconfirmation
   */
  async sendStaffReconfirmationAlert(booking: any, alertType: 'no_response' | 'auto_cancelled'): Promise<EmailResult> {
    // Get email settings from database
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('email_settings')
      .select('restaurant_email, sender_name, sender_email')
      .eq('user_id', 'admin')
      .single();

    const staffEmail = settings?.restaurant_email;
    const senderName = settings?.sender_name || 'Dona Theresa Restaurant';
    const senderEmail = settings?.sender_email || 'reservations@donatheresa.com';
    
    if (!staffEmail) {
      console.error('No restaurant email configured in settings');
      return { success: false, error: 'No restaurant email configured' };
    }
    
    const isAutoCancelled = alertType === 'auto_cancelled';
    const subject = isAutoCancelled 
      ? `🚨 BOOKING AUTO-CANCELLED - ${booking.customer_name} (${booking.party_size} guests)`
      : `⚠️ ACTION REQUIRED - No Reconfirmation from ${booking.customer_name}`;

    const bookingDate = new Date(booking.booking_date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isAutoCancelled ? 'Booking Auto-Cancelled' : 'Reconfirmation Alert'}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${isAutoCancelled ? '#dc2626' : '#f59e0b'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">${isAutoCancelled ? '🚨 Booking Auto-Cancelled' : '⚠️ Reconfirmation Alert'}</h1>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      ${isAutoCancelled 
        ? `A booking has been <strong style="color: #dc2626;">automatically cancelled</strong> because the customer did not respond to the reconfirmation request.`
        : `A customer has <strong style="color: #f59e0b;">not responded</strong> to the reconfirmation email. Please call them to confirm.`
      }
    </p>
    
    <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid ${isAutoCancelled ? '#dc2626' : '#f59e0b'};">
      <h2 style="margin: 0 0 15px 0; color: #333;">Booking Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%;">Customer Name:</td>
          <td style="padding: 8px 0;">${booking.customer_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${booking.customer_phone}" style="color: #2563eb;">${booking.customer_phone || 'Not provided'}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${booking.customer_email}" style="color: #2563eb;">${booking.customer_email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Date:</td>
          <td style="padding: 8px 0;">${bookingDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Time:</td>
          <td style="padding: 8px 0;">${booking.booking_time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Party Size:</td>
          <td style="padding: 8px 0;">${booking.party_size} guests</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Reference:</td>
          <td style="padding: 8px 0;">${booking.booking_reference || booking.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Status:</td>
          <td style="padding: 8px 0;">
            <span style="background: ${isAutoCancelled ? '#dc2626' : '#f59e0b'}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;">
              ${isAutoCancelled ? 'CANCELLED' : 'NEEDS FOLLOW-UP'}
            </span>
          </td>
        </tr>
      </table>
    </div>
    
    ${!isAutoCancelled ? `
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #f59e0b;">
      <h3 style="margin: 0 0 10px 0; color: #92400e;">📞 Action Required</h3>
      <p style="margin: 0; color: #92400e;">Please call <strong>${booking.customer_name}</strong> at <a href="tel:${booking.customer_phone}" style="color: #92400e; font-weight: bold;">${booking.customer_phone}</a> to confirm their booking.</p>
    </div>
    ` : ''}
    
    <p style="margin-top: 20px; font-size: 14px; color: #666;">
      This is an automated alert from your Dona Theresa booking system.
    </p>
  </div>
</body>
</html>`;

    // Send email via Resend
    try {
      const Resend = (await import('resend')).Resend;
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const result = await resend.emails.send({
        from: `${senderName} <${senderEmail}>`,
        to: [staffEmail],
        subject: subject,
        html: htmlContent,
      });

      if (result.error) {
        console.error('Failed to send staff reconfirmation alert:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log(`✅ Staff alert email sent to ${staffEmail} for booking ${booking.booking_reference}`);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Error sending staff reconfirmation alert:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Send staff notification when customer confirms or cancels via reconfirmation page
   */
  async sendStaffBookingStatusNotification(
    booking: any, 
    customer: any, 
    action: 'confirmed' | 'cancelled'
  ): Promise<EmailResult> {
    // Get email settings from database
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('email_settings')
      .select('restaurant_email, sender_name, sender_email')
      .eq('user_id', 'admin')
      .single();

    const staffEmail = settings?.restaurant_email;
    const senderName = settings?.sender_name || 'Dona Theresa Restaurant';
    const senderEmail = settings?.sender_email || 'reservations@donatheresa.com';
    
    if (!staffEmail) {
      console.error('No restaurant email configured in settings');
      return { success: false, error: 'No restaurant email configured' };
    }

    const isConfirmed = action === 'confirmed';
    const bookingDate = new Date(booking.booking_date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const subject = isConfirmed
      ? `✅ BOOKING CONFIRMED - ${customer.name} (${booking.party_size} guests) - ${bookingDate}`
      : `❌ BOOKING CANCELLED - ${customer.name} (${booking.party_size} guests) - ${bookingDate}`;

    const headerColor = isConfirmed ? '#16a34a' : '#dc2626';
    const statusText = isConfirmed ? 'CONFIRMED' : 'CANCELLED';
    const emoji = isConfirmed ? '✅' : '❌';
    const message = isConfirmed
      ? `Great news! <strong>${customer.name}</strong> has confirmed their booking via the reconfirmation link.`
      : `<strong>${customer.name}</strong> has cancelled their booking via the reconfirmation link.`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking ${statusText}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: ${headerColor}; color: white; padding: 25px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">${emoji}</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Booking ${statusText}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Via Reconfirmation System</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 25px;">
      <p style="font-size: 16px; margin: 0 0 20px 0; color: #444;">
        ${message}
      </p>
      
      <!-- Booking Details Card -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid ${headerColor};">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 Booking Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; width: 40%; border-bottom: 1px solid #e5e7eb;">Customer</td>
            <td style="padding: 10px 0; color: #333; border-bottom: 1px solid #e5e7eb;">${customer.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; border-bottom: 1px solid #e5e7eb;">📞 Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="tel:${customer.phone}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${customer.phone || 'Not provided'}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; border-bottom: 1px solid #e5e7eb;">📧 Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${customer.email}" style="color: #2563eb; text-decoration: none;">${customer.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; border-bottom: 1px solid #e5e7eb;">📅 Date</td>
            <td style="padding: 10px 0; color: #333; font-weight: 500; border-bottom: 1px solid #e5e7eb;">${bookingDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; border-bottom: 1px solid #e5e7eb;">🕐 Time</td>
            <td style="padding: 10px 0; color: #333; font-weight: 500; border-bottom: 1px solid #e5e7eb;">${booking.booking_time}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; border-bottom: 1px solid #e5e7eb;">👥 Party Size</td>
            <td style="padding: 10px 0; color: #333; font-weight: 500; border-bottom: 1px solid #e5e7eb;">${booking.party_size} guests</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555; border-bottom: 1px solid #e5e7eb;">🔖 Reference</td>
            <td style="padding: 10px 0; color: #333; font-family: monospace; border-bottom: 1px solid #e5e7eb;">${booking.booking_reference || booking.id}</td>
          </tr>
          ${booking.special_requests ? `
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #555;">📝 Notes</td>
            <td style="padding: 10px 0; color: #666; font-style: italic;">${booking.special_requests}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <!-- Status Badge -->
      <div style="text-align: center; margin-top: 20px;">
        <span style="display: inline-block; background: ${headerColor}; color: white; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
          ${statusText}
        </span>
      </div>
      
      ${!isConfirmed ? `
      <!-- Cancellation Notice -->
      <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #fecaca;">
        <p style="margin: 0; color: #991b1b; font-size: 14px;">
          <strong>Note:</strong> This table is now available for other guests. The customer has been sent a cancellation confirmation email.
        </p>
      </div>
      ` : `
      <!-- Confirmation Notice -->
      <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #bbf7d0;">
        <p style="margin: 0; color: #166534; font-size: 14px;">
          <strong>Great!</strong> This booking is now confirmed. The table is secured for ${customer.name}.
        </p>
      </div>
      `}
    </div>
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 15px 25px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
        This is an automated notification from your Dona Theresa booking system.<br>
        <a href="https://donatheresa.com/dashboard/bookings" style="color: #2563eb;">View all bookings in dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send email via Resend
    try {
      const Resend = (await import('resend')).Resend;
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const result = await resend.emails.send({
        from: `${senderName} <${senderEmail}>`,
        to: [staffEmail],
        subject: subject,
        html: htmlContent,
      });

      if (result.error) {
        console.error('Failed to send staff booking notification:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log(`✅ Staff ${action} notification sent to ${staffEmail} for booking ${booking.booking_reference}`);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Error sending staff booking notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}; 