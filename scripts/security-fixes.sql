-- Security Migration: Fix Function Search Path Vulnerabilities
-- Applied: 2024 (via Supabase migration: secure_function_search_paths_fixed)
-- 
-- ISSUE: Supabase Database Linter detected 4 functions with mutable search paths
-- This creates a security vulnerability that could allow search path confusion attacks
--
-- FUNCTIONS FIXED:
-- 1. reset_daily_email_count
-- 2. increment_email_count  
-- 3. generate_booking_reference
-- 4. auto_generate_booking_reference
--
-- SOLUTION: Added "SET search_path = public" to all functions to lock the search path
-- 
-- ============================================================================

-- Security Fix: Secure function search paths to prevent search path confusion attacks
-- Drop triggers first, then functions, then recreate with secure search paths

-- Drop existing triggers
DROP TRIGGER IF EXISTS track_daily_email_sends ON email_logs;
DROP TRIGGER IF EXISTS increment_email_count_trigger ON email_logs;
DROP TRIGGER IF EXISTS auto_generate_booking_reference_trigger ON bookings;

-- Drop existing functions
DROP FUNCTION IF EXISTS increment_email_count() CASCADE;
DROP FUNCTION IF EXISTS auto_generate_booking_reference() CASCADE;
DROP FUNCTION IF EXISTS generate_booking_reference() CASCADE;
DROP FUNCTION IF EXISTS reset_daily_email_count() CASCADE;

-- 1. Create reset_daily_email_count function with secure search path
CREATE OR REPLACE FUNCTION reset_daily_email_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- 🔒 SECURITY FIX: Lock search path
AS $$
BEGIN
    UPDATE email_settings 
    SET emails_sent_today = 0, last_email_reset_date = CURRENT_DATE
    WHERE last_email_reset_date < CURRENT_DATE;
END;
$$;

-- 2. Create increment_email_count function with secure search path
CREATE OR REPLACE FUNCTION increment_email_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- 🔒 SECURITY FIX: Lock search path
AS $$
BEGIN
    IF NEW.status = 'sent' AND OLD.status != 'sent' THEN
        -- Reset count if it's a new day
        PERFORM reset_daily_email_count();
        
        -- Increment counter
        UPDATE email_settings 
        SET emails_sent_today = emails_sent_today + 1
        WHERE user_id = 'admin';
    END IF;
    
    RETURN NEW;
END;
$$;

-- 3. Create generate_booking_reference function with secure search path
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- 🔒 SECURITY FIX: Lock search path
AS $$
DECLARE
    settings RECORD;
    new_counter INTEGER;
    reference TEXT;
BEGIN
    -- Get current settings
    SELECT booking_ref_prefix, booking_ref_length, booking_ref_counter 
    INTO settings
    FROM email_settings 
    WHERE user_id = 'admin'
    LIMIT 1;
    
    -- If no settings found, use defaults
    IF settings IS NULL THEN
        settings.booking_ref_prefix := 'DT';
        settings.booking_ref_length := 5;
        settings.booking_ref_counter := 1;
    END IF;
    
    -- Increment counter
    new_counter := settings.booking_ref_counter + 1;
    
    -- Update counter in database
    UPDATE email_settings 
    SET booking_ref_counter = new_counter 
    WHERE user_id = 'admin';
    
    -- Generate reference with leading zeros
    reference := settings.booking_ref_prefix || '-' || LPAD(new_counter::TEXT, settings.booking_ref_length, '0');
    
    RETURN reference;
END;
$$;

-- 4. Create auto_generate_booking_reference function with secure search path
CREATE OR REPLACE FUNCTION auto_generate_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- 🔒 SECURITY FIX: Lock search path
AS $$
BEGIN
    -- Only generate if no reference is set
    IF NEW.booking_reference IS NULL THEN
        NEW.booking_reference := generate_booking_reference();
    END IF;
    RETURN NEW;
END;
$$;

-- Recreate triggers with proper naming
CREATE TRIGGER increment_email_count_trigger
    BEFORE UPDATE ON email_logs
    FOR EACH ROW EXECUTE FUNCTION increment_email_count();

CREATE TRIGGER auto_generate_booking_reference_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION auto_generate_booking_reference();

-- ============================================================================
-- VERIFICATION:
-- After applying this migration, run: SELECT routine_name, security_type FROM information_schema.routines WHERE routine_schema = 'public';
-- All functions should show proper security context and no mutable search path warnings
-- ============================================================================ 