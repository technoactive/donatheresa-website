/**
 * Professional Email Service for Restaurant Booking System
 * Features: Resend integration, template rendering, error handling, analytics
 */

import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types';

// Types
export interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  preview_text: string | null;
  available_variables: string[];
}

export interface EmailSettings {
  id: string;
  email_provider: string;
  api_key_encrypted: string | null;
  sender_email: string;
  sender_name: string;
  reply_to_email: string | null;
  restaurant_email: string;
  manager_email: string | null;
  backup_email: string | null;
  brand_color: string;
  custom_footer: string | null;
  max_daily_emails: number;
  emails_sent_today: number;
  track_opens: boolean;
  track_clicks: boolean;
}

export interface SendEmailParams {
  templateKey: string;
  recipientEmail: string;
  recipientName?: string;
  data?: Record<string, any>;
  bookingId?: string;
  contactId?: string;
  scheduledFor?: Date;
  priority?: number;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  logId?: string;
}

export interface TemplateData {
  // Customer data
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Booking data
  bookingId?: string;
  bookingDate?: string;
  bookingTime?: string;
  partySize?: number;
  guestText?: string;
  specialRequests?: string;
  bookingSource?: string;
  
  // Customer analytics
  customerSegment?: string;
  segmentColor?: string;
  isVipCustomer?: boolean;
  totalBookings?: number;
  
  // Restaurant data
  restaurantName?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  restaurantAddress?: string;
  businessHours?: string;
  
  // Branding
  logoUrl?: string;
  brandColor?: string;
  customFooter?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  dashboardUrl?: string;
  calendarLink?: string;
  
  // Contact form data
  subject?: string;
  message?: string;
  submittedAt?: string;
  
  // System data
  createdAt?: string;
  totalCoversToday?: number;
  
  // Dates
  [key: string]: any;
}

class EmailService {
  private resend: Resend | null = null;
  private supabase = createClient();

  /**
   * Initialize Resend client with API key from settings
   */
  private async initializeResend(): Promise<boolean> {
    try {
      if (this.resend) return true;

      const { data: settings } = await this.supabase
        .from('email_settings')
        .select('api_key_encrypted, email_provider')
        .eq('user_id', 'admin')
        .single();

      if (!settings?.api_key_encrypted) {
        console.error('Email service: No API key configured');
        return false;
      }

      // In production, decrypt the API key
      // For now, assume it's stored as plaintext (should be encrypted)
      const apiKey = settings.api_key_encrypted;
      
      if (settings.email_provider === 'resend') {
        this.resend = new Resend(apiKey);
      }

      return true;
    } catch (error) {
      console.error('Email service initialization failed:', error);
      return false;
    }
  }

  /**
   * Get email settings from database
   */
  private async getEmailSettings(): Promise<EmailSettings | null> {
    try {
      const { data, error } = await this.supabase
        .from('email_settings')
        .select('*')
        .eq('user_id', 'admin')
        .single();

      if (error) {
        console.error('Failed to get email settings:', error);
        return null;
      }

      return data as EmailSettings;
    } catch (error) {
      console.error('Error fetching email settings:', error);
      return null;
    }
  }

  /**
   * Get email template by key
   */
  private async getTemplate(templateKey: string): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await this.supabase
        .from('email_templates')
        .select('*')
        .eq('template_key', templateKey)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error(`Failed to get template ${templateKey}:`, error);
        return null;
      }

      return data as EmailTemplate;
    } catch (error) {
      console.error(`Error fetching template ${templateKey}:`, error);
      return null;
    }
  }

  /**
   * Simple template engine (Handlebars-like)
   */
  private renderTemplate(template: string, data: TemplateData): string {
    let rendered = template;

    // Replace {{variable}} with data values
    rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });

    // Handle {{#if condition}}...{{/if}} blocks
    rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, key, content) => {
      return data[key] ? content : '';
    });

    return rendered;
  }

  /**
   * Prepare template data with defaults
   */
  private async prepareTemplateData(
    data: TemplateData = {},
    settings: EmailSettings
  ): Promise<TemplateData> {
    // Get restaurant info from locale settings
    const { data: localeSettings } = await this.supabase
      .from('locale_settings')
      .select('*')
      .eq('id', 1)
      .single();

    const baseData: TemplateData = {
      // Restaurant branding
      restaurantName: localeSettings?.restaurant_name || 'Dona Theresa Restaurant',
      restaurantPhone: localeSettings?.restaurant_phone || '+44 20 8421 5550',
      restaurantEmail: settings.restaurant_email,
      restaurantAddress: `${localeSettings?.restaurant_address}, ${localeSettings?.restaurant_city} ${localeSettings?.restaurant_postal_code}`,
      businessHours: 'Mon-Sun: 12:00 PM - 11:00 PM',
      
      // Branding
      logoUrl: '/placeholder-logo.png', // Should be full URL in production
      brandColor: settings.brand_color,
      customFooter: settings.custom_footer,
      websiteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://donateresa.com',
      bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reserve`,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      
      // Helper text
      guestText: data.partySize === 1 ? 'guest' : 'guests',
      
      // Dates
      createdAt: new Date().toLocaleString('en-GB'),
      
      ...data
    };

    return baseData;
  }

  /**
   * Create email log entry
   */
  private async createEmailLog(params: {
    templateKey: string;
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    status: string;
    providerMessageId?: string;
    bookingId?: string;
    contactId?: string;
    errorMessage?: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('email_logs')
        .insert({
          template_key: params.templateKey,
          recipient_email: params.recipientEmail,
          recipient_name: params.recipientName,
          sender_email: (await this.getEmailSettings())?.sender_email || 'noreply@donateresa.com',
          subject: params.subject,
          status: params.status,
          provider_message_id: params.providerMessageId,
          booking_id: params.bookingId,
          contact_id: params.contactId,
          error_message: params.errorMessage,
          sent_at: params.status === 'sent' ? new Date().toISOString() : null,
        })
        .select('id')
        .single();

      return data?.id || null;
    } catch (error) {
      console.error('Failed to create email log:', error);
      return null;
    }
  }

  /**
   * Update email log status
   */
  private async updateEmailLog(logId: string, updates: {
    status?: string;
    providerMessageId?: string;
    errorMessage?: string;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
  }): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('email_logs')
        .update(updates)
        .eq('id', logId);

      return !error;
    } catch (error) {
      console.error('Failed to update email log:', error);
      return false;
    }
  }

  /**
   * Check if within daily email limit
   */
  private async checkDailyLimit(): Promise<boolean> {
    const settings = await this.getEmailSettings();
    if (!settings) return false;

    return settings.emails_sent_today < settings.max_daily_emails;
  }

  /**
   * Send email using Resend
   */
  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      // Initialize Resend
      if (!(await this.initializeResend())) {
        return { success: false, error: 'Email service not configured' };
      }

      // Check daily limit
      if (!(await this.checkDailyLimit())) {
        return { success: false, error: 'Daily email limit exceeded' };
      }

      // Get settings and template
      const [settings, template] = await Promise.all([
        this.getEmailSettings(),
        this.getTemplate(params.templateKey)
      ]);

      if (!settings) {
        return { success: false, error: 'Email settings not found' };
      }

      if (!template) {
        return { success: false, error: `Template ${params.templateKey} not found` };
      }

      // Prepare template data
      const templateData = await this.prepareTemplateData(params.data, settings);

      // Render template
      const subject = this.renderTemplate(template.subject, templateData);
      const htmlContent = this.renderTemplate(template.html_content, templateData);
      const textContent = template.text_content 
        ? this.renderTemplate(template.text_content, templateData)
        : undefined;

      // Create log entry
      const logId = await this.createEmailLog({
        templateKey: params.templateKey,
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName,
        subject,
        status: 'pending',
        bookingId: params.bookingId,
        contactId: params.contactId,
      });

      // Send email
      if (!this.resend) {
        throw new Error('Resend client not initialized');
      }

      const emailData: any = {
        from: `${settings.sender_name} <${settings.sender_email}>`,
        to: [params.recipientEmail],
        subject,
        html: htmlContent,
        ...(textContent && { text: textContent }),
        ...(template.preview_text && { text: template.preview_text }),
        ...(settings.reply_to_email && { reply_to: settings.reply_to_email }),
      };

      // Add tracking if enabled
      if (settings.track_opens || settings.track_clicks) {
        emailData.headers = {
          'X-Entity-Ref-ID': logId,
        };
      }

      const result = await this.resend.emails.send(emailData);

      if (result.error) {
        // Update log with error
        if (logId) {
          await this.updateEmailLog(logId, {
            status: 'failed',
            errorMessage: result.error.message,
          });
        }

        return { 
          success: false, 
          error: result.error.message,
          logId: logId || undefined 
        };
      }

      // Update log with success
      if (logId) {
        await this.updateEmailLog(logId, {
          status: 'sent',
          providerMessageId: result.data?.id,
        });
      }

      // Update template usage
      await this.supabase
        .from('email_templates')
        .update({ 
          usage_count: template.usage_count + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', template.id);

      return {
        success: true,
        messageId: result.data?.id,
        logId: logId || undefined
      };

    } catch (error) {
      console.error('Email send failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Try to update log if we have an ID
      if (params.templateKey) {
        const logId = await this.createEmailLog({
          templateKey: params.templateKey,
          recipientEmail: params.recipientEmail,
          recipientName: params.recipientName,
          subject: 'Failed to render',
          status: 'failed',
          errorMessage,
          bookingId: params.bookingId,
          contactId: params.contactId,
        });
        
        return { success: false, error: errorMessage, logId: logId || undefined };
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Schedule email for later delivery
   */
  async scheduleEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      const settings = await this.getEmailSettings();
      const template = await this.getTemplate(params.templateKey);

      if (!settings || !template) {
        return { success: false, error: 'Settings or template not found' };
      }

      // Prepare template data for preview
      const templateData = await this.prepareTemplateData(params.data, settings);
      const subject = this.renderTemplate(template.subject, templateData);

      // Insert into email queue
      const { data, error } = await this.supabase
        .from('email_queue')
        .insert({
          template_key: params.templateKey,
          recipient_email: params.recipientEmail,
          recipient_name: params.recipientName,
          subject,
          email_data: templateData,
          scheduled_for: params.scheduledFor?.toISOString() || new Date().toISOString(),
          priority: params.priority || 0,
          booking_id: params.bookingId,
          contact_id: params.contactId,
        })
        .select('id')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, logId: data.id };

    } catch (error) {
      console.error('Email scheduling failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Process email queue (to be called by a background job)
   */
  async processEmailQueue(): Promise<void> {
    try {
      const { data: queuedEmails } = await this.supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('priority', { ascending: false })
        .order('scheduled_for', { ascending: true })
        .limit(10);

      if (!queuedEmails?.length) return;

      for (const email of queuedEmails) {
        try {
          // Mark as processing
          await this.supabase
            .from('email_queue')
            .update({ status: 'processing', current_attempts: email.current_attempts + 1 })
            .eq('id', email.id);

          // Send email
          const result = await this.sendEmail({
            templateKey: email.template_key,
            recipientEmail: email.recipient_email,
            recipientName: email.recipient_name,
            data: email.email_data,
            bookingId: email.booking_id,
            contactId: email.contact_id,
          });

          // Update queue status
          if (result.success) {
            await this.supabase
              .from('email_queue')
              .update({ status: 'sent' })
              .eq('id', email.id);
          } else {
            if (email.current_attempts >= email.max_attempts) {
              await this.supabase
                .from('email_queue')
                .update({ 
                  status: 'failed',
                  error_message: result.error 
                })
                .eq('id', email.id);
            } else {
              // Retry later
              await this.supabase
                .from('email_queue')
                .update({ 
                  status: 'pending',
                  error_message: result.error,
                  process_after: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min delay
                })
                .eq('id', email.id);
            }
          }

        } catch (error) {
          console.error(`Failed to process email ${email.id}:`, error);
          
          // Mark as failed if max attempts reached
          if (email.current_attempts >= email.max_attempts) {
            await this.supabase
              .from('email_queue')
              .update({ 
                status: 'failed',
                error_message: error instanceof Error ? error.message : 'Unknown error'
              })
              .eq('id', email.id);
          }
        }
      }

    } catch (error) {
      console.error('Email queue processing failed:', error);
    }
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get email analytics
   */
  async getEmailAnalytics(days: number = 30): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    recentEmails: any[];
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: logs } = await this.supabase
        .from('email_logs')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (!logs?.length) {
        return {
          totalSent: 0,
          totalDelivered: 0,
          totalOpened: 0,
          totalClicked: 0,
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0,
          recentEmails: []
        };
      }

      const totalSent = logs.filter(log => log.status === 'sent' || log.status === 'delivered').length;
      const totalDelivered = logs.filter(log => log.status === 'delivered').length;
      const totalOpened = logs.filter(log => log.opened_at).length;
      const totalClicked = logs.filter(log => log.clicked_at).length;

      return {
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
        openRate: totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0,
        clickRate: totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0,
        recentEmails: logs.slice(0, 10)
      };

    } catch (error) {
      console.error('Failed to get email analytics:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const emailService = new EmailService();

// Utility functions for common email types
export const EmailUtils = {
  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(booking: any, customer: any): Promise<EmailResult> {
    return emailService.sendEmail({
      templateKey: 'booking_confirmation',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        bookingId: booking.id,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        specialRequests: booking.special_requests,
        calendarLink: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${booking.booking_date.replace(/-/g, '')}T${booking.booking_time.replace(':', '')}00
SUMMARY:Dinner at Dona Theresa Restaurant
DESCRIPTION:Reservation for ${booking.party_size} people
LOCATION:451 Uxbridge Road, Pinner, London HA5 1AA
END:VEVENT
END:VCALENDAR`
      }
    });
  },

  /**
   * Schedule booking reminder email
   */
  async scheduleBookingReminder(booking: any, customer: any): Promise<EmailResult> {
    const reminderDate = new Date(booking.booking_date);
    reminderDate.setDate(reminderDate.getDate() - 1); // 24 hours before

    return emailService.scheduleEmail({
      templateKey: 'booking_reminder',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      scheduledFor: reminderDate,
      data: {
        customerName: customer.name,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        bookingId: booking.id,
      }
    });
  },

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellation(booking: any, customer: any): Promise<EmailResult> {
    return emailService.sendEmail({
      templateKey: 'booking_cancellation',
      recipientEmail: customer.email,
      recipientName: customer.name,
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        bookingId: booking.id,
      }
    });
  },

  /**
   * Send staff new booking alert
   */
  async sendStaffBookingAlert(booking: any, customer: any): Promise<EmailResult> {
    const settings = await emailService.getEmailSettings();
    if (!settings?.staff_booking_alerts || !settings.restaurant_email) {
      return { success: false, error: 'Staff alerts disabled or no email configured' };
    }

    return emailService.sendEmail({
      templateKey: 'staff_new_booking',
      recipientEmail: settings.restaurant_email,
      recipientName: 'Restaurant Staff',
      bookingId: booking.id,
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB'),
        bookingTime: booking.booking_time,
        partySize: booking.party_size,
        specialRequests: booking.special_requests,
        bookingId: booking.id,
        customerSegment: customer.customer_segment || 'new',
        segmentColor: customer.customer_segment === 'vip' ? '#ffc107' : 
                     customer.customer_segment === 'regular' ? '#28a745' : 
                     customer.customer_segment === 'inactive' ? '#6c757d' : '#17a2b8',
        isVipCustomer: customer.customer_segment === 'vip',
        totalBookings: customer.total_bookings || 0,
        bookingSource: booking.source || 'website',
      }
    });
  },

  /**
   * Send contact form notification to staff
   */
  async sendContactNotification(contact: any): Promise<EmailResult> {
    const settings = await emailService.getEmailSettings();
    if (!settings?.contact_staff_notification || !settings.restaurant_email) {
      return { success: false, error: 'Contact alerts disabled or no email configured' };
    }

    return emailService.sendEmail({
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
    const settings = await emailService.getEmailSettings();
    if (!settings?.contact_auto_reply_enabled) {
      return { success: false, error: 'Auto-reply disabled' };
    }

    return emailService.sendEmail({
      templateKey: 'contact_auto_reply',
      recipientEmail: contact.email,
      recipientName: contact.name,
      contactId: contact.id,
      data: {
        customerName: contact.name,
        subject: contact.subject,
      }
    });
  }
}; 