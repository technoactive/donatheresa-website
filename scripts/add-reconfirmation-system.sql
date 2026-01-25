-- Reconfirmation System Migration
-- Adds fields to booking_config and bookings tables for automated reconfirmation

-- =====================================================
-- 1. ADD RECONFIRMATION SETTINGS TO BOOKING_CONFIG
-- =====================================================

-- Add reconfirmation settings columns to booking_config
ALTER TABLE booking_config
ADD COLUMN IF NOT EXISTS reconfirmation_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS reconfirmation_min_party_size INTEGER NOT NULL DEFAULT 6,
ADD COLUMN IF NOT EXISTS reconfirmation_days_before INTEGER NOT NULL DEFAULT 2,
ADD COLUMN IF NOT EXISTS reconfirmation_deadline_hours INTEGER NOT NULL DEFAULT 24,
ADD COLUMN IF NOT EXISTS reconfirmation_no_response_action TEXT NOT NULL DEFAULT 'flag_only' 
  CHECK (reconfirmation_no_response_action IN ('auto_cancel', 'flag_only', 'second_reminder'));

-- =====================================================
-- 2. ADD RECONFIRMATION FIELDS TO BOOKINGS TABLE
-- =====================================================

-- Add reconfirmation tracking columns to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS reconfirmation_status TEXT NOT NULL DEFAULT 'not_required'
  CHECK (reconfirmation_status IN ('not_required', 'pending', 'sent', 'reminder_sent', 'confirmed', 'no_response', 'auto_cancelled')),
ADD COLUMN IF NOT EXISTS reconfirmation_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reconfirmation_responded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reconfirmation_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS reconfirmation_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reconfirmation_reminder_count INTEGER NOT NULL DEFAULT 0;

-- Create index for efficient queries on reconfirmation status
CREATE INDEX IF NOT EXISTS idx_bookings_reconfirmation_status ON bookings(reconfirmation_status);
CREATE INDEX IF NOT EXISTS idx_bookings_reconfirmation_token ON bookings(reconfirmation_token);
CREATE INDEX IF NOT EXISTS idx_bookings_reconfirmation_deadline ON bookings(reconfirmation_deadline);

-- =====================================================
-- 3. FUNCTION: GET BOOKING BY RECONFIRMATION TOKEN
-- =====================================================

DROP FUNCTION IF EXISTS get_booking_by_reconfirmation_token(UUID);

CREATE OR REPLACE FUNCTION get_booking_by_reconfirmation_token(p_token UUID)
RETURNS TABLE (
  id UUID,
  booking_date DATE,
  booking_time TIME,
  party_size INTEGER,
  status TEXT,
  special_requests TEXT,
  booking_reference TEXT,
  reconfirmation_status TEXT,
  reconfirmation_deadline TIMESTAMP WITH TIME ZONE,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(255)
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.party_size,
    b.status,
    b.special_requests,
    b.booking_reference,
    b.reconfirmation_status,
    b.reconfirmation_deadline,
    c.name::VARCHAR(255) as customer_name,
    c.email::VARCHAR(255) as customer_email,
    c.phone::VARCHAR(255) as customer_phone
  FROM public.bookings b
  JOIN public.customers c ON b.customer_id = c.id
  WHERE b.reconfirmation_token = p_token;
END;
$$;

-- =====================================================
-- 4. FUNCTION: CONFIRM BOOKING BY RECONFIRMATION TOKEN
-- =====================================================

DROP FUNCTION IF EXISTS confirm_booking_by_reconfirmation_token(UUID);

CREATE OR REPLACE FUNCTION confirm_booking_by_reconfirmation_token(p_token UUID)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  booking_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_booking_id UUID;
  v_current_status TEXT;
  v_reconfirmation_status TEXT;
BEGIN
  -- Get the booking
  SELECT b.id, b.status, b.reconfirmation_status 
  INTO v_booking_id, v_current_status, v_reconfirmation_status
  FROM public.bookings b
  WHERE b.reconfirmation_token = p_token;

  -- Check if booking exists
  IF v_booking_id IS NULL THEN
    RETURN QUERY SELECT false, 'Booking not found or invalid token'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Check if booking is already cancelled
  IF v_current_status = 'cancelled' THEN
    RETURN QUERY SELECT false, 'This booking has already been cancelled'::TEXT, v_booking_id;
    RETURN;
  END IF;

  -- Check if already confirmed
  IF v_reconfirmation_status = 'confirmed' THEN
    RETURN QUERY SELECT true, 'Booking already confirmed'::TEXT, v_booking_id;
    RETURN;
  END IF;

  -- Update the booking
  UPDATE public.bookings
  SET 
    reconfirmation_status = 'confirmed',
    reconfirmation_responded_at = NOW(),
    status = 'confirmed',
    updated_at = NOW()
  WHERE id = v_booking_id;

  RETURN QUERY SELECT true, 'Booking confirmed successfully'::TEXT, v_booking_id;
END;
$$;

-- =====================================================
-- 5. FUNCTION: GET BOOKINGS NEEDING RECONFIRMATION
-- =====================================================

DROP FUNCTION IF EXISTS get_bookings_needing_reconfirmation(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_bookings_needing_reconfirmation(
  p_min_party_size INTEGER,
  p_days_before INTEGER
)
RETURNS TABLE (
  id UUID,
  booking_date DATE,
  booking_time TIME,
  party_size INTEGER,
  status TEXT,
  special_requests TEXT,
  booking_reference TEXT,
  reconfirmation_token UUID,
  customer_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.party_size,
    b.status,
    b.special_requests,
    b.booking_reference,
    b.reconfirmation_token,
    c.id as customer_id,
    c.name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone
  FROM public.bookings b
  JOIN public.customers c ON b.customer_id = c.id
  WHERE 
    b.status IN ('pending', 'confirmed')
    AND b.reconfirmation_status = 'not_required'
    AND b.party_size >= p_min_party_size
    AND b.booking_date = CURRENT_DATE + p_days_before
  ORDER BY b.booking_time;
END;
$$;

-- =====================================================
-- 6. FUNCTION: GET EXPIRED RECONFIRMATIONS
-- =====================================================

DROP FUNCTION IF EXISTS get_expired_reconfirmations();

CREATE OR REPLACE FUNCTION get_expired_reconfirmations()
RETURNS TABLE (
  id UUID,
  booking_date DATE,
  booking_time TIME,
  party_size INTEGER,
  status TEXT,
  booking_reference TEXT,
  reconfirmation_status TEXT,
  reconfirmation_deadline TIMESTAMP WITH TIME ZONE,
  reconfirmation_reminder_count INTEGER,
  customer_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.party_size,
    b.status,
    b.booking_reference,
    b.reconfirmation_status,
    b.reconfirmation_deadline,
    b.reconfirmation_reminder_count,
    c.id as customer_id,
    c.name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone
  FROM public.bookings b
  JOIN public.customers c ON b.customer_id = c.id
  WHERE 
    b.status IN ('pending', 'confirmed')
    AND b.reconfirmation_status IN ('sent', 'reminder_sent')
    AND b.reconfirmation_deadline IS NOT NULL
    AND b.reconfirmation_deadline < NOW()
  ORDER BY b.reconfirmation_deadline;
END;
$$;

-- =====================================================
-- 7. FUNCTION: MARK BOOKING AS RECONFIRMATION SENT
-- =====================================================

DROP FUNCTION IF EXISTS mark_reconfirmation_sent(UUID, INTEGER);

CREATE OR REPLACE FUNCTION mark_reconfirmation_sent(
  p_booking_id UUID,
  p_deadline_hours INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.bookings
  SET 
    reconfirmation_status = 'sent',
    reconfirmation_sent_at = NOW(),
    reconfirmation_deadline = NOW() + (p_deadline_hours || ' hours')::INTERVAL,
    reconfirmation_reminder_count = 0,
    updated_at = NOW()
  WHERE id = p_booking_id;

  RETURN FOUND;
END;
$$;

-- =====================================================
-- 8. FUNCTION: HANDLE EXPIRED RECONFIRMATION
-- =====================================================

DROP FUNCTION IF EXISTS handle_expired_reconfirmation(UUID, TEXT);

CREATE OR REPLACE FUNCTION handle_expired_reconfirmation(
  p_booking_id UUID,
  p_action TEXT -- 'auto_cancel', 'flag_only', 'second_reminder'
)
RETURNS TABLE (
  success BOOLEAN,
  action_taken TEXT,
  booking_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_status TEXT;
  v_reminder_count INTEGER;
BEGIN
  -- Get current state
  SELECT b.reconfirmation_status, b.reconfirmation_reminder_count
  INTO v_current_status, v_reminder_count
  FROM public.bookings b
  WHERE b.id = p_booking_id;

  IF v_current_status IS NULL THEN
    RETURN QUERY SELECT false, 'Booking not found'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Handle based on action
  IF p_action = 'auto_cancel' THEN
    UPDATE public.bookings
    SET 
      status = 'cancelled',
      reconfirmation_status = 'auto_cancelled',
      updated_at = NOW()
    WHERE id = p_booking_id;
    
    RETURN QUERY SELECT true, 'auto_cancelled'::TEXT, p_booking_id;
    
  ELSIF p_action = 'second_reminder' AND v_reminder_count < 1 THEN
    -- Send second reminder - extend deadline by 12 hours
    UPDATE public.bookings
    SET 
      reconfirmation_status = 'reminder_sent',
      reconfirmation_deadline = NOW() + INTERVAL '12 hours',
      reconfirmation_reminder_count = v_reminder_count + 1,
      updated_at = NOW()
    WHERE id = p_booking_id;
    
    RETURN QUERY SELECT true, 'second_reminder_sent'::TEXT, p_booking_id;
    
  ELSE
    -- Flag only or max reminders reached
    UPDATE public.bookings
    SET 
      reconfirmation_status = 'no_response',
      updated_at = NOW()
    WHERE id = p_booking_id;
    
    RETURN QUERY SELECT true, 'flagged_no_response'::TEXT, p_booking_id;
  END IF;
END;
$$;

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_booking_by_reconfirmation_token(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION confirm_booking_by_reconfirmation_token(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_bookings_needing_reconfirmation(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_expired_reconfirmations() TO authenticated;
GRANT EXECUTE ON FUNCTION mark_reconfirmation_sent(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_expired_reconfirmation(UUID, TEXT) TO authenticated;

-- =====================================================
-- 10. INSERT EMAIL TEMPLATES FOR RECONFIRMATION
-- =====================================================

-- Reconfirmation Request Email Template
INSERT INTO email_templates (
  template_key,
  name,
  subject,
  html_content,
  text_content,
  is_active,
  description
) VALUES (
  'booking_reconfirmation_request',
  'Booking Reconfirmation Request',
  'Action Required: Please Confirm Your Booking at {{restaurantName}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Please Confirm Your Booking</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Action Required</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Please confirm your upcoming reservation</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Dear {{customerName}},
              </p>
              <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Your reservation is coming up and we want to make sure we have everything prepared for you. Please confirm you''re still planning to join us:
              </p>
              
              <!-- Booking Details Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 12px; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">📅 Date</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">{{bookingDate}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">⏰ Time</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">{{bookingTime}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">👥 Party Size</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">{{partySize}} guests</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">🔖 Reference</span><br>
                          <span style="color: #111827; font-size: 14px; font-family: monospace;">{{bookingReference}}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Deadline Warning -->
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 25px 0; text-align: center;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  ⏰ Please respond within {{deadlineHours}} hours
                </p>
              </div>
              
              <!-- CTA Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="{{confirmLink}}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      ✓ Yes, I''m Coming!
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="{{cancelLink}}" style="display: inline-block; background-color: #ffffff; color: #dc2626; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 14px; font-weight: 500; border: 2px solid #dc2626;">
                      Cancel My Booking
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Need to make changes? Call us at <a href="tel:{{restaurantPhone}}" style="color: #f59e0b; text-decoration: none; font-weight: 500;">{{restaurantPhone}}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 5px 0; color: #111827; font-size: 14px; font-weight: 600;">{{restaurantName}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">{{restaurantAddress}}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'Dear {{customerName}},

Your reservation is coming up! Please confirm you''re still planning to join us.

BOOKING DETAILS:
📅 Date: {{bookingDate}}
⏰ Time: {{bookingTime}}
👥 Party Size: {{partySize}} guests
🔖 Reference: {{bookingReference}}

⏰ Please respond within {{deadlineHours}} hours.

To CONFIRM your booking, visit:
{{confirmLink}}

To CANCEL your booking, visit:
{{cancelLink}}

Need to make changes? Call us at {{restaurantPhone}}

{{restaurantName}}
{{restaurantAddress}}',
  true,
  'Sent to customers to reconfirm their large party booking before the reservation date'
) ON CONFLICT (template_key) DO NOTHING;

-- Reconfirmation Reminder Email Template (Second Reminder)
INSERT INTO email_templates (
  template_key,
  name,
  subject,
  html_content,
  text_content,
  is_active,
  description
) VALUES (
  'booking_reconfirmation_reminder',
  'Booking Reconfirmation Reminder (Urgent)',
  '⚠️ URGENT: Final Reminder to Confirm Your Booking',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urgent: Please Confirm Your Booking</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">⚠️ Final Reminder</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your booking needs confirmation</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Dear {{customerName}},
              </p>
              <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                We haven''t heard back from you about your upcoming reservation. <strong>This is your final reminder</strong> - please confirm within the next {{deadlineHours}} hours or your booking may be cancelled.
              </p>
              
              <!-- Booking Details Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">📅 Date</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">{{bookingDate}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">⏰ Time</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">{{bookingTime}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">👥 Party Size</span><br>
                          <span style="color: #111827; font-size: 16px; font-weight: 600;">{{partySize}} guests</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="{{confirmLink}}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-size: 18px; font-weight: 700;">
                      ✓ CONFIRM NOW
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Questions? Call us at <a href="tel:{{restaurantPhone}}" style="color: #f59e0b; text-decoration: none; font-weight: 500;">{{restaurantPhone}}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 5px 0; color: #111827; font-size: 14px; font-weight: 600;">{{restaurantName}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">{{restaurantAddress}}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'URGENT: Final Reminder to Confirm Your Booking

Dear {{customerName}},

We haven''t heard back from you! This is your FINAL REMINDER.

Please confirm within {{deadlineHours}} hours or your booking may be cancelled.

📅 Date: {{bookingDate}}
⏰ Time: {{bookingTime}}
👥 Party Size: {{partySize}} guests

CONFIRM NOW: {{confirmLink}}

Questions? Call {{restaurantPhone}}

{{restaurantName}}',
  true,
  'Urgent second reminder sent when customer hasn''t responded to first reconfirmation request'
) ON CONFLICT (template_key) DO NOTHING;

-- =====================================================
-- Done! Run this script in Supabase SQL Editor
-- =====================================================
