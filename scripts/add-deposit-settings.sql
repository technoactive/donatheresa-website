-- Add Deposit Settings to booking_config table
-- Run this in your Supabase SQL Editor

-- Add deposit configuration columns to booking_config
ALTER TABLE booking_config 
ADD COLUMN IF NOT EXISTS deposit_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_min_party_size INTEGER NOT NULL DEFAULT 6,
ADD COLUMN IF NOT EXISTS deposit_amount_per_person INTEGER NOT NULL DEFAULT 1000, -- Amount in pence (£10.00)
ADD COLUMN IF NOT EXISTS deposit_cancellation_hours INTEGER NOT NULL DEFAULT 48, -- Hours before booking for full refund
ADD COLUMN IF NOT EXISTS deposit_late_cancel_charge_percent INTEGER NOT NULL DEFAULT 100; -- Percentage to charge for late cancellation

-- Add deposit fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS deposit_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_amount INTEGER, -- Amount in pence
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'none' CHECK (deposit_status IN ('none', 'pending', 'authorized', 'captured', 'cancelled', 'refunded', 'partially_refunded')),
ADD COLUMN IF NOT EXISTS deposit_captured_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deposit_refunded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deposit_refund_amount INTEGER; -- Amount refunded in pence

-- Create deposit_transactions table for audit trail
CREATE TABLE IF NOT EXISTS deposit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_refund_id TEXT,
  amount INTEGER NOT NULL, -- Amount in pence
  action TEXT NOT NULL CHECK (action IN ('created', 'authorized', 'captured', 'cancelled', 'refunded', 'partial_refund', 'failed')),
  reason TEXT,
  performed_by TEXT, -- 'system', 'dashboard', or user email
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for deposit queries
CREATE INDEX IF NOT EXISTS idx_bookings_deposit_status ON bookings(deposit_status);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent ON bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_deposit_transactions_booking ON deposit_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_deposit_transactions_stripe_pi ON deposit_transactions(stripe_payment_intent_id);

-- Enable RLS on deposit_transactions
ALTER TABLE deposit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deposit_transactions
CREATE POLICY "Enable read access for all users" ON deposit_transactions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON deposit_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON deposit_transactions FOR UPDATE USING (true);

-- Add comment for documentation
COMMENT ON TABLE deposit_transactions IS 'Audit trail for all deposit-related transactions including payments, captures, and refunds';
COMMENT ON COLUMN booking_config.deposit_enabled IS 'Whether deposit collection is enabled';
COMMENT ON COLUMN booking_config.deposit_min_party_size IS 'Minimum party size that requires a deposit';
COMMENT ON COLUMN booking_config.deposit_amount_per_person IS 'Deposit amount per person in pence (e.g., 1000 = £10.00)';
COMMENT ON COLUMN booking_config.deposit_cancellation_hours IS 'Hours before booking time for free cancellation';
COMMENT ON COLUMN booking_config.deposit_late_cancel_charge_percent IS 'Percentage of deposit to charge for late cancellation (0-100)';
