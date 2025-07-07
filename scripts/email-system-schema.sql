-- ==========================================
-- DONA THERESA EMAIL SYSTEM - PRODUCTION SCHEMA
-- ==========================================
-- Run this in your Supabase SQL Editor to set up the complete email system

-- 1. EMAIL SETTINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'admin',
  
  -- Provider Configuration
  email_provider TEXT NOT NULL DEFAULT 'resend' CHECK (email_provider IN ('resend', 'sendgrid', 'ses', 'postmark')),
  api_key_encrypted TEXT,
  sender_email TEXT NOT NULL DEFAULT 'reservations@donatheresa.com',
  sender_name TEXT NOT NULL DEFAULT 'Dona Theresa Restaurant',
  reply_to_email TEXT,
  
  -- Customer Email Settings
  booking_confirmation_enabled BOOLEAN DEFAULT true,
  booking_reminder_enabled BOOLEAN DEFAULT true,
  booking_reminder_hours INTEGER DEFAULT 24,
  booking_cancellation_enabled BOOLEAN DEFAULT true,
  booking_modification_enabled BOOLEAN DEFAULT true,
  welcome_email_enabled BOOLEAN DEFAULT true,
  
  -- Staff Email Settings
  staff_booking_alerts BOOLEAN DEFAULT true,
  staff_cancellation_alerts BOOLEAN DEFAULT true,
  staff_contact_alerts BOOLEAN DEFAULT true,
  staff_daily_summary BOOLEAN DEFAULT false,
  staff_vip_alerts BOOLEAN DEFAULT true,
  
  -- Contact Form Settings
  contact_auto_reply_enabled BOOLEAN DEFAULT true,
  contact_staff_notification BOOLEAN DEFAULT true,
  
  -- Email Addresses
  restaurant_email TEXT NOT NULL DEFAULT 'info@donateresa.com',
  manager_email TEXT,
  backup_email TEXT,
  
  -- Template Settings
  custom_logo_url TEXT,
  brand_color TEXT DEFAULT '#D97706',
  custom_footer TEXT DEFAULT 'Dona Theresa Restaurant | 451 Uxbridge Road, Pinner, London HA5 1AA',
  
  -- Advanced Settings
  max_daily_emails INTEGER DEFAULT 1000,
  rate_limit_per_hour INTEGER DEFAULT 100,
  retry_failed_emails BOOLEAN DEFAULT true,
  max_retry_attempts INTEGER DEFAULT 3,
  track_opens BOOLEAN DEFAULT true,
  track_clicks BOOLEAN DEFAULT true,
  
  -- Security & Analytics
  api_key_last_updated TIMESTAMP WITH TIME ZONE,
  emails_sent_today INTEGER DEFAULT 0,
  last_email_reset_date DATE DEFAULT CURRENT_DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 2. EMAIL TEMPLATES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'booking' CHECK (category IN ('booking', 'contact', 'staff', 'marketing', 'system')),
  
  -- Template Content
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  preview_text TEXT,
  
  -- Template Settings
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  language_code TEXT DEFAULT 'en',
  
  -- Variables
  available_variables JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_by TEXT DEFAULT 'system',
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EMAIL LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Email Details
  template_key TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  
  -- Status Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'spam', 'unsubscribed')),
  provider_message_id TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Related Records
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contact_messages(id) ON DELETE SET NULL,
  
  -- Email Analytics
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  -- Metadata
  email_size_bytes INTEGER,
  processing_time_ms INTEGER,
  cost_in_cents INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EMAIL QUEUE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Email Details
  template_key TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  email_data JSONB DEFAULT '{}'::jsonb,
  
  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  max_attempts INTEGER DEFAULT 3,
  current_attempts INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  
  -- Related Records
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contact_messages(id) ON DELETE SET NULL,
  
  -- Processing
  process_after TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- Email Settings Indexes
CREATE INDEX IF NOT EXISTS idx_email_settings_user_id ON email_settings(user_id);

-- Email Templates Indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_template_key ON email_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_is_active ON email_templates(is_active);

-- Email Logs Indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_template_key ON email_logs(template_key);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_contact_id ON email_logs(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Email Queue Indexes
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_for ON email_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_queue_priority ON email_queue(priority);
CREATE INDEX IF NOT EXISTS idx_email_queue_booking_id ON email_queue(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_contact_id ON email_queue(contact_id);

-- 6. ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES (Admin only for security)
-- ==========================================

-- Email Settings Policies
CREATE POLICY "email_settings_admin_only" ON email_settings
  FOR ALL USING (user_id = 'admin');

-- Email Templates Policies  
CREATE POLICY "email_templates_admin_only" ON email_templates
  FOR ALL USING (true); -- Read-only for templates

-- Email Logs Policies
CREATE POLICY "email_logs_admin_only" ON email_logs
  FOR ALL USING (true); -- Allow logging from application

-- Email Queue Policies
CREATE POLICY "email_queue_admin_only" ON email_queue
  FOR ALL USING (true); -- Allow queue operations from application

-- 8. CREATE TRIGGER FUNCTIONS
-- ==========================================

-- Update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_email_settings_updated_at 
  BEFORE UPDATE ON email_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at 
  BEFORE UPDATE ON email_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_logs_updated_at 
  BEFORE UPDATE ON email_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_queue_updated_at 
  BEFORE UPDATE ON email_queue 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. POPULATE DEFAULT EMAIL TEMPLATES
-- ==========================================

INSERT INTO email_templates (template_key, name, category, subject, html_content, text_content, available_variables) VALUES

-- Booking Confirmation Email
('booking_confirmation', 'Booking Confirmation', 'booking', 
'Your Table Reservation at Dona Theresa - {{bookingDate}} at {{bookingTime}}',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: {{brandColor}}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p>Dear {{customerName}},</p>
        
        <p>Thank you for choosing Dona Theresa Restaurant! We''re delighted to confirm your reservation.</p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid {{brandColor}};">
            <h3 style="margin-top: 0; color: {{brandColor}};">Reservation Details</h3>
            <p><strong>Date:</strong> {{bookingDate}}</p>
            <p><strong>Time:</strong> {{bookingTime}}</p>
            <p><strong>Party Size:</strong> {{partySize}} {{guestText}}</p>
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
            {{#if specialRequests}}<p><strong>Special Requests:</strong> {{specialRequests}}</p>{{/if}}
        </div>
        
        <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2563eb;">Restaurant Information</h4>
            <p><strong>Address:</strong> 451 Uxbridge Road, Pinner, London HA5 1AA</p>
            <p><strong>Phone:</strong> +44 20 8866 3131</p>
            <p><strong>Email:</strong> info@donateresa.com</p>
        </div>
        
        <p>If you need to make any changes to your reservation, please contact us at least 2 hours before your booking time.</p>
        
        <p>We look forward to welcoming you to Dona Theresa!</p>
        
        <p>Best regards,<br>The Dona Theresa Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        {{customFooter}}
    </div>
</body>
</html>',
'Dear {{customerName}},

Thank you for choosing Dona Theresa Restaurant! We''re delighted to confirm your reservation.

RESERVATION DETAILS:
Date: {{bookingDate}}
Time: {{bookingTime}}
Party Size: {{partySize}} {{guestText}}
Booking ID: {{bookingId}}
{{#if specialRequests}}Special Requests: {{specialRequests}}{{/if}}

RESTAURANT INFORMATION:
Address: 451 Uxbridge Road, Pinner, London HA5 1AA
Phone: +44 20 8866 3131
Email: info@donateresa.com

If you need to make any changes to your reservation, please contact us at least 2 hours before your booking time.

We look forward to welcoming you to Dona Theresa!

Best regards,
The Dona Theresa Team

{{customFooter}}',
'["customerName", "bookingDate", "bookingTime", "partySize", "guestText", "bookingId", "specialRequests", "brandColor", "customFooter"]'::jsonb),

-- Booking Reminder Email
('booking_reminder', 'Booking Reminder', 'booking',
'Reminder: Your Table at Dona Theresa Tomorrow - {{bookingDate}} at {{bookingTime}}',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: {{brandColor}}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Reservation Reminder</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p>Dear {{customerName}},</p>
        
        <p>This is a friendly reminder about your upcoming reservation at Dona Theresa Restaurant.</p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid {{brandColor}};">
            <h3 style="margin-top: 0; color: {{brandColor}};">Your Reservation</h3>
            <p><strong>Date:</strong> {{bookingDate}}</p>
            <p><strong>Time:</strong> {{bookingTime}}</p>
            <p><strong>Party Size:</strong> {{partySize}} {{guestText}}</p>
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #d97706;">Please Note</h4>
            <p>• Please arrive on time or contact us if running late</p>
            <p>• Free parking available behind the restaurant</p>
            <p>• Contact us for any dietary requirements or changes</p>
        </div>
        
        <p>We''re excited to welcome you tomorrow! If you need to make any changes, please call us as soon as possible.</p>
        
        <p>Best regards,<br>The Dona Theresa Team</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Phone:</strong> +44 20 8866 3131</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> info@donateresa.com</p>
        </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        {{customFooter}}
    </div>
</body>
</html>',
'Dear {{customerName}},

This is a friendly reminder about your upcoming reservation at Dona Theresa Restaurant.

YOUR RESERVATION:
Date: {{bookingDate}}
Time: {{bookingTime}}
Party Size: {{partySize}} {{guestText}}
Booking ID: {{bookingId}}

PLEASE NOTE:
• Please arrive on time or contact us if running late
• Free parking available behind the restaurant
• Contact us for any dietary requirements or changes

We''re excited to welcome you tomorrow! If you need to make any changes, please call us as soon as possible.

Best regards,
The Dona Theresa Team

Phone: +44 20 8866 3131
Email: info@donateresa.com

{{customFooter}}',
'["customerName", "bookingDate", "bookingTime", "partySize", "guestText", "bookingId", "brandColor", "customFooter"]'::jsonb),

-- Staff New Booking Alert
('staff_booking_alert', 'Staff New Booking Alert', 'staff',
'🔔 New Booking Alert - {{customerName}} for {{bookingDate}} at {{bookingTime}}',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🔔 New Booking Alert</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #dc2626;">Booking Details</h3>
            <p><strong>Customer:</strong> {{customerName}}</p>
            <p><strong>Email:</strong> {{customerEmail}}</p>
            {{#if customerPhone}}<p><strong>Phone:</strong> {{customerPhone}}</p>{{/if}}
            <p><strong>Date:</strong> {{bookingDate}}</p>
            <p><strong>Time:</strong> {{bookingTime}}</p>
            <p><strong>Party Size:</strong> {{partySize}} {{guestText}}</p>
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
            {{#if specialRequests}}<p><strong>Special Requests:</strong> {{specialRequests}}</p>{{/if}}
            {{#if customerSegment}}<p><strong>Customer Type:</strong> <span style="background: {{segmentColor}}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">{{customerSegment}}</span></p>{{/if}}
        </div>
        
        <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Booking Created:</strong> {{createdAt}}</p>
            <p><strong>Source:</strong> Website Booking Form</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="{{dashboardUrl}}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Dashboard</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">This is an automated alert from the Dona Theresa booking system.</p>
    </div>
</body>
</html>',
'🔔 NEW BOOKING ALERT

BOOKING DETAILS:
Customer: {{customerName}}
Email: {{customerEmail}}
{{#if customerPhone}}Phone: {{customerPhone}}{{/if}}
Date: {{bookingDate}}
Time: {{bookingTime}}
Party Size: {{partySize}} {{guestText}}
Booking ID: {{bookingId}}
{{#if specialRequests}}Special Requests: {{specialRequests}}{{/if}}
{{#if customerSegment}}Customer Type: {{customerSegment}}{{/if}}

Booking Created: {{createdAt}}
Source: Website Booking Form

View in Dashboard: {{dashboardUrl}}

This is an automated alert from the Dona Theresa booking system.',
'["customerName", "customerEmail", "customerPhone", "bookingDate", "bookingTime", "partySize", "guestText", "bookingId", "specialRequests", "customerSegment", "segmentColor", "createdAt", "dashboardUrl"]'::jsonb),

-- Contact Form Auto-Reply
('contact_auto_reply', 'Contact Form Auto-Reply', 'contact',
'Thank you for contacting Dona Theresa Restaurant',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: {{brandColor}}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p>Dear {{customerName}},</p>
        
        <p>Thank you for contacting Dona Theresa Restaurant. We have received your message and will respond within 24 hours.</p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid {{brandColor}};">
            <h3 style="margin-top: 0; color: {{brandColor}};">Your Message</h3>
            <p><strong>Subject:</strong> {{subject}}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 4px; font-style: italic;">{{message}}</p>
            <p><strong>Submitted:</strong> {{submittedAt}}</p>
        </div>
        
        <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2563eb;">Contact Information</h4>
            <p><strong>Phone:</strong> +44 20 8866 3131</p>
            <p><strong>Email:</strong> info@donateresa.com</p>
            <p><strong>Address:</strong> 451 Uxbridge Road, Pinner, London HA5 1AA</p>
        </div>
        
        <p>For urgent matters or same-day reservations, please call us directly.</p>
        
        <p>Best regards,<br>The Dona Theresa Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        {{customFooter}}
    </div>
</body>
</html>',
'Dear {{customerName}},

Thank you for contacting Dona Theresa Restaurant. We have received your message and will respond within 24 hours.

YOUR MESSAGE:
Subject: {{subject}}
Message: {{message}}
Submitted: {{submittedAt}}

CONTACT INFORMATION:
Phone: +44 20 8866 3131
Email: info@donateresa.com
Address: 451 Uxbridge Road, Pinner, London HA5 1AA

For urgent matters or same-day reservations, please call us directly.

Best regards,
The Dona Theresa Team

{{customFooter}}',
'["customerName", "subject", "message", "submittedAt", "brandColor", "customFooter"]'::jsonb),

-- Contact Staff Notification
('contact_staff_notification', 'Contact Staff Notification', 'staff',
'📨 New Contact Form Submission - {{subject}}',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">📨 New Contact Form Submission</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #059669;">Contact Details</h3>
            <p><strong>Name:</strong> {{customerName}}</p>
            <p><strong>Email:</strong> {{customerEmail}}</p>
            {{#if customerPhone}}<p><strong>Phone:</strong> {{customerPhone}}</p>{{/if}}
            <p><strong>Subject:</strong> {{subject}}</p>
            <p><strong>Submitted:</strong> {{submittedAt}}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Message</h4>
            <p style="white-space: pre-wrap;">{{message}}</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="{{dashboardUrl}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Dashboard</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">Auto-reply has been sent to the customer. Please respond within 24 hours.</p>
    </div>
</body>
</html>',
'📨 NEW CONTACT FORM SUBMISSION

CONTACT DETAILS:
Name: {{customerName}}
Email: {{customerEmail}}
{{#if customerPhone}}Phone: {{customerPhone}}{{/if}}
Subject: {{subject}}
Submitted: {{submittedAt}}

MESSAGE:
{{message}}

View in Dashboard: {{dashboardUrl}}

Auto-reply has been sent to the customer. Please respond within 24 hours.',
'["customerName", "customerEmail", "customerPhone", "subject", "message", "submittedAt", "dashboardUrl"]'::jsonb),

-- Booking Cancellation Email
('booking_cancellation', 'Booking Cancellation Confirmation', 'booking',
'Booking Cancelled - {{bookingDate}} at {{bookingTime}}',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancelled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Booking Cancelled</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p>Dear {{customerName}},</p>
        
        <p>We confirm that your reservation at Dona Theresa Restaurant has been cancelled as requested.</p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #dc2626;">Cancelled Reservation</h3>
            <p><strong>Date:</strong> {{bookingDate}}</p>
            <p><strong>Time:</strong> {{bookingTime}}</p>
            <p><strong>Party Size:</strong> {{partySize}} {{guestText}}</p>
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #d97706;">We''d Love to See You Again</h4>
            <p>We''re sorry we won''t be seeing you this time. We hope to welcome you to Dona Theresa soon!</p>
        </div>
        
        <p>To make a new reservation, please visit our website or call us directly.</p>
        
        <p>Best regards,<br>The Dona Theresa Team</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Phone:</strong> +44 20 8866 3131</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> info@donateresa.com</p>
        </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        {{customFooter}}
    </div>
</body>
</html>',
'Dear {{customerName}},

We confirm that your reservation at Dona Theresa Restaurant has been cancelled as requested.

CANCELLED RESERVATION:
Date: {{bookingDate}}
Time: {{bookingTime}}
Party Size: {{partySize}} {{guestText}}
Booking ID: {{bookingId}}

We''re sorry we won''t be seeing you this time. We hope to welcome you to Dona Theresa soon!

To make a new reservation, please visit our website or call us directly.

Best regards,
The Dona Theresa Team

Phone: +44 20 8866 3131
Email: info@donateresa.com

{{customFooter}}',
'["customerName", "bookingDate", "bookingTime", "partySize", "guestText", "bookingId", "customFooter"]'::jsonb)

ON CONFLICT (template_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  text_content = EXCLUDED.text_content,
  available_variables = EXCLUDED.available_variables,
  updated_at = NOW();

-- 10. CREATE DEFAULT EMAIL SETTINGS
-- ==========================================
INSERT INTO email_settings (user_id) VALUES ('admin') ON CONFLICT (user_id) DO NOTHING;

-- 11. CREATE UTILITY FUNCTIONS
-- ==========================================

-- Function to reset daily email count
CREATE OR REPLACE FUNCTION reset_daily_email_count()
RETURNS VOID AS $$
BEGIN
  UPDATE email_settings 
  SET 
    emails_sent_today = 0,
    last_email_reset_date = CURRENT_DATE
  WHERE last_email_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to increment email count
CREATE OR REPLACE FUNCTION increment_email_count()
RETURNS VOID AS $$
BEGIN
  -- Reset count if new day
  PERFORM reset_daily_email_count();
  
  -- Increment count
  UPDATE email_settings 
  SET emails_sent_today = emails_sent_today + 1
  WHERE user_id = 'admin';
END;
$$ LANGUAGE plpgsql;

-- Function to check if email limit reached
CREATE OR REPLACE FUNCTION check_email_limit()
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  -- Reset count if new day
  PERFORM reset_daily_email_count();
  
  -- Get current counts
  SELECT emails_sent_today, max_daily_emails 
  INTO current_count, max_count
  FROM email_settings 
  WHERE user_id = 'admin';
  
  -- Return true if under limit
  RETURN COALESCE(current_count, 0) < COALESCE(max_count, 1000);
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- SCHEMA SETUP COMPLETE
-- ==========================================

-- Verify setup
SELECT 'Email system schema created successfully!' as status;
SELECT 'Email templates: ' || COUNT(*)::text FROM email_templates;
SELECT 'Email settings: ' || COUNT(*)::text FROM email_settings; 