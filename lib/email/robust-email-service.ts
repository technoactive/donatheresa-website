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

    // Create email log
    const logId = await this.createEmailLog({
      templateKey: params.templateKey,
      recipientEmail: params.recipientEmail,
      recipientName: params.recipientName,
      subject,
      status: 'pending',
      bookingId: params.bookingId,
      contactId: params.contactId,
    });

    // Send email with timeout
    const emailData = {
      from: `${settings.sender_name} <${settings.sender_email}>`,
      to: [params.recipientEmail],
      subject,
      html: htmlContent,
      ...(settings.reply_to_email && { reply_to: settings.reply_to_email }),
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
      websiteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://donatheresa.com',
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
  }
}; 