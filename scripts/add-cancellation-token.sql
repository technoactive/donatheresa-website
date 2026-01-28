-- ============================================================================
-- ADD CANCELLATION TOKEN TO BOOKINGS
-- This script adds the cancellation_token column and associated functions
-- ============================================================================

-- 1. Add cancellation_token column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS cancellation_token UUID DEFAULT gen_random_uuid();

-- 2. Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_bookings_cancellation_token 
ON bookings(cancellation_token);

-- 3. Create function to get booking by cancellation token (secure function)
-- NOTE: Explicit ::TEXT casts are required because bookings.status and customers columns
-- are VARCHAR, but the function returns TEXT. PostgreSQL is strict about type matching.
DROP FUNCTION IF EXISTS get_booking_by_cancellation_token(uuid);
CREATE OR REPLACE FUNCTION get_booking_by_cancellation_token(p_token UUID)
RETURNS TABLE (
  id UUID,
  booking_date DATE,
  booking_time TIME,
  party_size INTEGER,
  status TEXT,
  special_requests TEXT,
  booking_reference TEXT,
  customer_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_date,
    b.booking_time,
    b.party_size,
    b.status::TEXT,
    b.special_requests,
    b.booking_reference,
    c.id as customer_id,
    c.name::TEXT as customer_name,
    c.email::TEXT as customer_email,
    c.phone::TEXT as customer_phone
  FROM bookings b
  JOIN customers c ON b.customer_id = c.id
  WHERE b.cancellation_token = p_token;
END;
$$;

-- 4. Create trigger function to auto-generate cancellation_token on insert
CREATE OR REPLACE FUNCTION auto_generate_cancellation_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only generate if no token is set
  IF NEW.cancellation_token IS NULL THEN
    NEW.cancellation_token := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Create trigger for auto-generating cancellation_token
DROP TRIGGER IF EXISTS auto_generate_cancellation_token_trigger ON bookings;
CREATE TRIGGER auto_generate_cancellation_token_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION auto_generate_cancellation_token();

-- 6. Create function to cancel booking by token (secure function)
CREATE OR REPLACE FUNCTION cancel_booking_by_token(p_token UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id UUID;
  v_status TEXT;
BEGIN
  -- Get booking ID and current status
  SELECT id, status INTO v_booking_id, v_status
  FROM bookings
  WHERE cancellation_token = p_token;
  
  -- If no booking found, return false
  IF v_booking_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- If already cancelled, return false
  IF v_status = 'cancelled' THEN
    RETURN FALSE;
  END IF;
  
  -- Cancel the booking
  UPDATE bookings
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = v_booking_id;
  
  RETURN TRUE;
END;
$$;

-- 7. Generate cancellation tokens for existing bookings that don't have one
UPDATE bookings 
SET cancellation_token = gen_random_uuid() 
WHERE cancellation_token IS NULL;

-- ============================================================================
-- VERIFICATION:
-- After running this script, verify with:
-- SELECT id, booking_reference, cancellation_token FROM bookings LIMIT 5;
-- ============================================================================
