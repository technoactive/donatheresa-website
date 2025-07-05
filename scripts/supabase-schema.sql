-- Dona Theresa Restaurant Database Schema
-- Run this in your Supabase SQL Editor

-- Enable RLS (Row Level Security)
-- This will be enabled per table as needed

-- 1. Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 20),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create booking_settings table (for dashboard configuration)
CREATE TABLE IF NOT EXISTS booking_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_settings_key ON booking_settings(key);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_settings_updated_at 
  BEFORE UPDATE ON booking_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at 
  BEFORE UPDATE ON contact_messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default booking settings
INSERT INTO booking_settings (key, value) VALUES
  ('booking_enabled', '"true"'::jsonb),
  ('max_advance_days', '30'::jsonb),
  ('max_party_size', '8'::jsonb),
  ('available_times', '["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]'::jsonb),
  ('closed_dates', '[]'::jsonb),
  ('suspension_message', '""'::jsonb),
  ('maintenance_mode', '"false"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create a view for booking details with customer information
CREATE OR REPLACE VIEW booking_details AS
SELECT 
  b.id,
  b.date,
  b.time,
  b.guests,
  b.status,
  b.special_requests,
  b.created_at,
  b.updated_at,
  c.id as customer_id,
  c.name as customer_name,
  c.email as customer_email,
  c.phone as customer_phone,
  c.notes as customer_notes
FROM bookings b
JOIN customers c ON b.customer_id = c.id;

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a restaurant booking system)
-- In a real application, you might want more restrictive policies

-- Customers policies
CREATE POLICY "Allow public read access to customers" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to customers" ON customers
  FOR UPDATE USING (true);

-- Bookings policies  
CREATE POLICY "Allow public read access to bookings" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to bookings" ON bookings
  FOR UPDATE USING (true);

-- Booking settings policies
CREATE POLICY "Allow public read access to booking_settings" ON booking_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update to booking_settings" ON booking_settings
  FOR UPDATE USING (true);

-- Contact messages policies
CREATE POLICY "Allow public insert to contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to contact_messages" ON contact_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public update to contact_messages" ON contact_messages
  FOR UPDATE USING (true);

-- Create a function to upsert customers
CREATE OR REPLACE FUNCTION upsert_customer(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  customer_id UUID;
BEGIN
  -- Try to update existing customer
  UPDATE customers 
  SET 
    name = p_name,
    phone = COALESCE(p_phone, phone),
    notes = COALESCE(p_notes, notes),
    updated_at = NOW()
  WHERE email = p_email
  RETURNING id INTO customer_id;
  
  -- If no customer was updated, insert a new one
  IF customer_id IS NULL THEN
    INSERT INTO customers (name, email, phone, notes)
    VALUES (p_name, p_email, p_phone, p_notes)
    RETURNING id INTO customer_id;
  END IF;
  
  RETURN customer_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get booking settings
CREATE OR REPLACE FUNCTION get_booking_settings()
RETURNS JSONB AS $$
DECLARE
  settings JSONB;
BEGIN
  SELECT jsonb_object_agg(key, value) INTO settings
  FROM booking_settings;
  
  RETURN COALESCE(settings, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Create a function to update booking settings
CREATE OR REPLACE FUNCTION update_booking_setting(
  p_key TEXT,
  p_value JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO booking_settings (key, value)
  VALUES (p_key, p_value)
  ON CONFLICT (key) 
  DO UPDATE SET 
    value = p_value,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql; 