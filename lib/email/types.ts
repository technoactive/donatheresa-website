/**
 * TypeScript Types for Email System
 */

export interface EmailSettings {
  id: string;
  user_id: string;
  
  // Provider Configuration
  email_provider: 'resend' | 'sendgrid' | 'ses' | 'postmark';
  api_key_encrypted: string | null;
  sender_email: string;
  sender_name: string;
  reply_to_email: string | null;
  
  // Customer Email Settings
  booking_confirmation_enabled: boolean;
  booking_reminder_enabled: boolean;
  booking_reminder_hours: number;
  booking_cancellation_enabled: boolean;
  booking_modification_enabled: boolean;
  welcome_email_enabled: boolean;
  
  // Advanced Reminder Settings
  reminder_large_party_enabled: boolean;
  reminder_large_party_hours: number;
  reminder_large_party_size: number;
  reminder_same_day_enabled: boolean;
  reminder_same_day_hours: number;
  reminder_weekend_enabled: boolean;
  reminder_weekend_hours: number;
  reminder_weekday_enabled: boolean;
  reminder_weekday_hours: number;
  reminder_special_events_enabled: boolean;
  reminder_special_events_hours: number;
  reminder_vip_enabled: boolean;
  reminder_vip_hours: number;
  reminder_second_enabled: boolean;
  reminder_second_hours: number;
  reminder_cutoff_hours: number;
  
  // Staff Email Settings
  staff_booking_alerts: boolean;
  staff_cancellation_alerts: boolean;
  staff_contact_alerts: boolean;
  staff_daily_summary: boolean;
  staff_vip_alerts: boolean;
  
  // Contact Form Settings
  contact_auto_reply_enabled: boolean;
  contact_staff_notification: boolean;
  
  // Email Addresses
  restaurant_email: string;
  manager_email: string | null;
  backup_email: string | null;
  
  // Template Settings
  custom_logo_url: string | null;
  brand_color: string;
  
  // Booking Reference Settings
  booking_ref_prefix: string;
  booking_ref_length: number;
  booking_ref_counter: number;
  
  // Advanced Settings
  max_daily_emails: number;
  rate_limit_per_hour: number;
  retry_failed_emails: boolean;
  max_retry_attempts: number;
  track_opens: boolean;
  track_clicks: boolean;
  
  // Security
  api_key_last_updated: string | null;
  emails_sent_today: number;
  last_email_reset_date: string;
  
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  description: string | null;
  category: 'booking' | 'contact' | 'staff' | 'marketing' | 'system';
  
  // Template Content
  subject: string;
  html_content: string;
  text_content: string | null;
  preview_text: string | null;
  
  // Template Settings
  is_active: boolean;
  is_default: boolean;
  version: number;
  language_code: string;
  
  // Variables
  available_variables: string[];
  
  // Metadata
  created_by: string;
  last_used_at: string | null;
  usage_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  
  // Email Details
  template_key: string;
  recipient_email: string;
  recipient_name: string | null;
  sender_email: string;
  subject: string;
  
  // Status Tracking
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'spam' | 'unsubscribed';
  provider_message_id: string | null;
  error_message: string | null;
  retry_count: number;
  
  // Related Records
  booking_id: string | null;
  contact_id: string | null;
  
  // Email Analytics
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  
  // Tracking
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  open_count: number;
  click_count: number;
  
  // Metadata
  email_size_bytes: number | null;
  processing_time_ms: number | null;
  cost_in_cents: number;
  
  created_at: string;
  updated_at: string;
}

export interface EmailQueue {
  id: string;
  
  // Email Details
  template_key: string;
  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  email_data: Record<string, any>;
  
  // Scheduling
  scheduled_for: string;
  priority: number;
  max_attempts: number;
  current_attempts: number;
  
  // Status
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';
  
  // Related Records
  booking_id: string | null;
  contact_id: string | null;
  
  // Processing
  process_after: string;
  last_attempt_at: string | null;
  error_message: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface CustomerEmailPreferences {
  id: string;
  customer_id: string;
  
  // Email Preferences
  marketing_emails_enabled: boolean;
  booking_confirmations_enabled: boolean;
  booking_reminders_enabled: boolean;
  promotional_emails_enabled: boolean;
  
  // Contact Preferences
  preferred_language: string;
  email_frequency: 'minimal' | 'normal' | 'frequent';
  
  // Unsubscribe tracking
  unsubscribed_at: string | null;
  unsubscribe_reason: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface EmailAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalFailed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  
  // Time series data
  dailyStats: {
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }[];
  
  // Template performance
  templateStats: {
    template_key: string;
    template_name: string;
    sent: number;
    opened: number;
    clicked: number;
    open_rate: number;
    click_rate: number;
  }[];
  
  // Recent activity
  recentEmails: EmailLog[];
}

export interface SendEmailParams {
  templateKey: string;
  recipientEmail: string;
  recipientName?: string;
  data?: TemplateData;
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
  
  // Additional data
  [key: string]: any;
}

export interface EmailProvider {
  send(params: EmailSendParams): Promise<EmailProviderResult>;
  getDeliveryStatus(messageId: string): Promise<EmailDeliveryStatus>;
  validateEmail(email: string): Promise<boolean>;
}

export interface EmailSendParams {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface EmailProviderResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailDeliveryStatus {
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
  timestamp?: Date;
  error?: string;
}

// Form types for settings
export interface EmailSettingsFormData {
  // Provider Configuration
  email_provider: 'resend' | 'sendgrid' | 'ses' | 'postmark';
  api_key: string;
  sender_email: string;
  sender_name: string;
  reply_to_email?: string;
  
  // Customer Email Settings
  booking_confirmation_enabled: boolean;
  booking_reminder_enabled: boolean;
  booking_reminder_hours: number;
  booking_cancellation_enabled: boolean;
  booking_modification_enabled: boolean;
  welcome_email_enabled: boolean;
  
  // Advanced Reminder Settings
  reminder_large_party_enabled: boolean;
  reminder_large_party_hours: number;
  reminder_large_party_size: number;
  reminder_same_day_enabled: boolean;
  reminder_same_day_hours: number;
  reminder_weekend_enabled: boolean;
  reminder_weekend_hours: number;
  reminder_weekday_enabled: boolean;
  reminder_weekday_hours: number;
  reminder_special_events_enabled: boolean;
  reminder_special_events_hours: number;
  reminder_vip_enabled: boolean;
  reminder_vip_hours: number;
  reminder_second_enabled: boolean;
  reminder_second_hours: number;
  reminder_cutoff_hours: number;
  
  // Staff Email Settings
  staff_booking_alerts: boolean;
  staff_cancellation_alerts: boolean;
  staff_contact_alerts: boolean;
  staff_daily_summary: boolean;
  staff_vip_alerts: boolean;
  
  // Contact Form Settings
  contact_auto_reply_enabled: boolean;
  contact_staff_notification: boolean;
  
  // Email Addresses
  restaurant_email: string;
  manager_email?: string;
  backup_email?: string;
  
  // Template Settings
  custom_logo_url?: string;
  brand_color: string;
  
  // Booking Reference Settings
  booking_ref_prefix: string;
  booking_ref_length: number;
  
  // Advanced Settings
  max_daily_emails: number;
  rate_limit_per_hour: number;
  retry_failed_emails: boolean;
  max_retry_attempts: number;
  track_opens: boolean;
  track_clicks: boolean;
}

export interface EmailTemplateFormData {
  template_key: string;
  name: string;
  description?: string;
  category: 'booking' | 'contact' | 'staff' | 'marketing' | 'system';
  subject: string;
  html_content: string;
  text_content?: string;
  preview_text?: string;
  is_active: boolean;
  language_code: string;
}

// API Response types
export interface EmailSettingsResponse {
  data: EmailSettings | null;
  error: string | null;
}

export interface EmailTemplatesResponse {
  data: EmailTemplate[] | null;
  error: string | null;
}

export interface EmailLogsResponse {
  data: EmailLog[] | null;
  error: string | null;
  count?: number;
}

export interface EmailAnalyticsResponse {
  data: EmailAnalytics | null;
  error: string | null;
} 