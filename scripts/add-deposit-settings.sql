-- ============================================
-- DEPOSIT SYSTEM DATABASE SCHEMA
-- Dona Theresa Restaurant Booking System
-- ============================================
-- Run this in your Supabase SQL Editor
-- This script is idempotent (safe to run multiple times)

-- ============================================
-- 1. ADD DEPOSIT CONFIGURATION TO booking_config
-- ============================================
ALTER TABLE booking_config 
ADD COLUMN IF NOT EXISTS deposit_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_min_party_size INTEGER NOT NULL DEFAULT 6,
ADD COLUMN IF NOT EXISTS deposit_amount_per_person INTEGER NOT NULL DEFAULT 1000, -- Amount in pence (£10.00)
ADD COLUMN IF NOT EXISTS deposit_cancellation_hours INTEGER NOT NULL DEFAULT 48, -- Hours before booking for full refund
ADD COLUMN IF NOT EXISTS deposit_late_cancel_charge_percent INTEGER NOT NULL DEFAULT 100; -- Percentage to charge for late cancellation

-- Add constraints for valid values
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_deposit_min_party_size') THEN
    ALTER TABLE booking_config ADD CONSTRAINT chk_deposit_min_party_size 
      CHECK (deposit_min_party_size >= 1 AND deposit_min_party_size <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_deposit_amount_per_person') THEN
    ALTER TABLE booking_config ADD CONSTRAINT chk_deposit_amount_per_person 
      CHECK (deposit_amount_per_person >= 50 AND deposit_amount_per_person <= 50000); -- £0.50 to £500
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_deposit_cancellation_hours') THEN
    ALTER TABLE booking_config ADD CONSTRAINT chk_deposit_cancellation_hours 
      CHECK (deposit_cancellation_hours >= 0 AND deposit_cancellation_hours <= 168); -- 0 to 7 days
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_deposit_late_cancel_percent') THEN
    ALTER TABLE booking_config ADD CONSTRAINT chk_deposit_late_cancel_percent 
      CHECK (deposit_late_cancel_charge_percent >= 0 AND deposit_late_cancel_charge_percent <= 100);
  END IF;
END $$;

-- ============================================
-- 2. ADD DEPOSIT FIELDS TO BOOKINGS TABLE
-- ============================================

-- First, drop the old check constraint if it exists (to update with new status values)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_deposit_status_check') THEN
    ALTER TABLE bookings DROP CONSTRAINT bookings_deposit_status_check;
  END IF;
END $$;

-- Add deposit columns to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS deposit_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_amount INTEGER, -- Amount in pence
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS deposit_captured_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deposit_refunded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deposit_refund_amount INTEGER DEFAULT 0; -- Total amount refunded in pence

-- Add the new constraint with all status values including 'expired'
ALTER TABLE bookings ADD CONSTRAINT bookings_deposit_status_check 
  CHECK (deposit_status IN ('none', 'pending', 'authorized', 'captured', 'cancelled', 'refunded', 'partially_refunded', 'expired', 'failed'));

-- Add constraint for deposit amount
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_booking_deposit_amount') THEN
    ALTER TABLE bookings ADD CONSTRAINT chk_booking_deposit_amount 
      CHECK (deposit_amount IS NULL OR (deposit_amount >= 50 AND deposit_amount <= 1000000)); -- £0.50 to £10,000
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_booking_refund_amount') THEN
    ALTER TABLE bookings ADD CONSTRAINT chk_booking_refund_amount 
      CHECK (deposit_refund_amount >= 0 AND (deposit_amount IS NULL OR deposit_refund_amount <= deposit_amount));
  END IF;
END $$;

-- ============================================
-- 3. CREATE DEPOSIT_TRANSACTIONS AUDIT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deposit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL, -- SET NULL to preserve audit trail
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_refund_id TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0), -- Amount in pence, must be positive
  action TEXT NOT NULL CHECK (action IN ('created', 'authorized', 'captured', 'cancelled', 'refunded', 'partial_refund', 'failed', 'expired')),
  reason TEXT,
  performed_by TEXT NOT NULL, -- 'system', 'stripe_webhook', or user email
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_deposit_status ON bookings(deposit_status) WHERE deposit_required = true;
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent ON bookings(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deposit_transactions_booking ON deposit_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_deposit_transactions_stripe_pi ON deposit_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_deposit_transactions_created ON deposit_transactions(created_at DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE deposit_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON deposit_transactions;
DROP POLICY IF EXISTS "Enable insert for system and authenticated users" ON deposit_transactions;
DROP POLICY IF EXISTS "Enable read access for all users" ON deposit_transactions;
DROP POLICY IF EXISTS "Enable insert for all users" ON deposit_transactions;
DROP POLICY IF EXISTS "Enable update for all users" ON deposit_transactions;

-- Create policies (read for authenticated, insert for all - webhooks need to insert)
CREATE POLICY "Enable read access for authenticated users" ON deposit_transactions 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for system operations" ON deposit_transactions 
  FOR INSERT 
  WITH CHECK (true); -- Allow inserts from webhooks and system

-- ============================================
-- 6. DOCUMENTATION COMMENTS
-- ============================================
COMMENT ON TABLE deposit_transactions IS 'Audit trail for all deposit-related transactions including payments, captures, refunds, and failures';
COMMENT ON COLUMN deposit_transactions.action IS 'Type of transaction: created, authorized, captured, cancelled, refunded, partial_refund, failed, expired';
COMMENT ON COLUMN deposit_transactions.performed_by IS 'Who performed this action: system, stripe_webhook, or user email address';
COMMENT ON COLUMN deposit_transactions.metadata IS 'Additional data like IP address, user ID, error details';

COMMENT ON COLUMN booking_config.deposit_enabled IS 'Whether deposit collection is enabled for new bookings';
COMMENT ON COLUMN booking_config.deposit_min_party_size IS 'Minimum party size that requires a deposit (1-100)';
COMMENT ON COLUMN booking_config.deposit_amount_per_person IS 'Deposit amount per person in pence (50-50000 = £0.50-£500)';
COMMENT ON COLUMN booking_config.deposit_cancellation_hours IS 'Hours before booking time for free cancellation (0-168)';
COMMENT ON COLUMN booking_config.deposit_late_cancel_charge_percent IS 'Percentage of deposit to charge for late cancellation (0-100)';

COMMENT ON COLUMN bookings.deposit_status IS 'Current deposit status: none, pending, authorized, captured, cancelled, refunded, partially_refunded, expired, failed';
COMMENT ON COLUMN bookings.deposit_refund_amount IS 'Total amount refunded in pence (for tracking partial refunds)';

-- ============================================
-- 7. FUNCTION TO CHECK EXPIRED AUTHORIZATIONS
-- ============================================
-- Stripe authorizations expire after 7 days
-- This function can be called periodically to mark expired authorizations

CREATE OR REPLACE FUNCTION check_expired_deposit_authorizations()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE bookings
  SET deposit_status = 'expired'
  WHERE deposit_status = 'authorized'
    AND deposit_required = true
    AND stripe_payment_intent_id IS NOT NULL
    AND booking_date < CURRENT_DATE - INTERVAL '7 days';
    
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log expired authorizations
  IF expired_count > 0 THEN
    INSERT INTO deposit_transactions (booking_id, stripe_payment_intent_id, amount, action, reason, performed_by)
    SELECT id, stripe_payment_intent_id, deposit_amount, 'expired', 'Authorization expired after 7 days', 'system'
    FROM bookings
    WHERE deposit_status = 'expired'
      AND NOT EXISTS (
        SELECT 1 FROM deposit_transactions dt 
        WHERE dt.booking_id = bookings.id AND dt.action = 'expired'
      );
  END IF;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_expired_deposit_authorizations() IS 'Marks deposit authorizations as expired after 7 days. Call periodically via cron job.';

-- ============================================
-- USAGE NOTES
-- ============================================
-- 
-- DEPOSIT STATUS FLOW:
-- 1. none -> pending (payment intent created)
-- 2. pending -> authorized (customer completes payment)
-- 3. authorized -> captured (no-show, charge the card)
--    OR authorized -> cancelled (guest attended, release hold)
--    OR authorized -> expired (7 days passed without action)
-- 4. captured -> refunded (full refund issued)
--    OR captured -> partially_refunded (partial refund issued)
--
-- IMPORTANT:
-- - Set STRIPE_WEBHOOK_SECRET for production security
-- - Run check_expired_deposit_authorizations() daily via cron
-- - Monitor deposit_transactions for audit trail
