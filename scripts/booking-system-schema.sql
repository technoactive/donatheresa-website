-- Dona Theresa Restaurant Booking System - Database Schema
-- This schema matches the application code expectations
-- Run this in your Supabase SQL Editor

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
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create booking_config table (main booking settings)
CREATE TABLE IF NOT EXISTS booking_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  booking_enabled BOOLEAN NOT NULL DEFAULT true,
  max_advance_days INTEGER NOT NULL DEFAULT 30,
  max_party_size INTEGER NOT NULL DEFAULT 8,
  available_times JSONB NOT NULL DEFAULT '["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]'::jsonb,
  closed_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  closed_days_of_week JSONB NOT NULL DEFAULT '[]'::jsonb,
  suspension_message TEXT NOT NULL DEFAULT 'We are currently not accepting new bookings. Please check back later.',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row_constraint CHECK (id = 1)
);

-- 4. Create service_periods table
CREATE TABLE IF NOT EXISTS service_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  interval_minutes INTEGER NOT NULL CHECK (interval_minutes > 0 AND interval_minutes <= 60),
  enabled BOOLEAN NOT NULL DEFAULT true,
  period_type TEXT NOT NULL CHECK (period_type IN ('lunch', 'dinner', 'break', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PostgreSQL Functions that the application expects

-- Function to get service periods
CREATE OR REPLACE FUNCTION get_service_periods()
RETURNS TABLE (
  id UUID,
  name TEXT,
  start_time TIME,
  end_time TIME,
  interval_minutes INTEGER,
  enabled BOOLEAN,
  period_type TEXT,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id, sp.name, sp.start_time, sp.end_time, 
    sp.interval_minutes, sp.enabled, sp.period_type, sp.sort_order
  FROM service_periods sp
  ORDER BY sp.sort_order, sp.start_time;
END;
$$ LANGUAGE plpgsql;

-- Function to upsert service period
CREATE OR REPLACE FUNCTION upsert_service_period(
  p_id UUID,
  p_name TEXT,
  p_start_time TIME,
  p_end_time TIME,
  p_interval_minutes INTEGER,
  p_enabled BOOLEAN,
  p_period_type TEXT,
  p_sort_order INTEGER
)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
BEGIN
  IF p_id IS NULL THEN
    -- Insert new service period
    INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order)
    VALUES (p_name, p_start_time, p_end_time, p_interval_minutes, p_enabled, p_period_type, p_sort_order)
    RETURNING id INTO result_id;
  ELSE
    -- Update existing service period
    UPDATE service_periods 
    SET 
      name = p_name,
      start_time = p_start_time,
      end_time = p_end_time,
      interval_minutes = p_interval_minutes,
      enabled = p_enabled,
      period_type = p_period_type,
      sort_order = p_sort_order,
      updated_at = NOW()
    WHERE id = p_id
    RETURNING id INTO result_id;
    
    -- If no rows were updated, insert new one
    IF result_id IS NULL THEN
      INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order)
      VALUES (p_name, p_start_time, p_end_time, p_interval_minutes, p_enabled, p_period_type, p_sort_order)
      RETURNING id INTO result_id;
    END IF;
  END IF;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql;

-- Function to delete service period
CREATE OR REPLACE FUNCTION delete_service_period(p_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  DELETE FROM service_periods WHERE id = p_id;
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to generate time slots from periods
CREATE OR REPLACE FUNCTION generate_time_slots_from_periods()
RETURNS TEXT[] AS $$
DECLARE
  period_record RECORD;
  time_slots TEXT[] := ARRAY[]::TEXT[];
  current_time TIME;
  end_time TIME;
  interval_minutes INTEGER;
  time_string TEXT;
BEGIN
  -- Get all enabled service periods
  FOR period_record IN 
    SELECT start_time, end_time, interval_minutes 
    FROM service_periods 
    WHERE enabled = true
    ORDER BY start_time
  LOOP
    current_time := period_record.start_time;
    end_time := period_record.end_time;
    interval_minutes := period_record.interval_minutes;
    
    -- Generate time slots for this period
    WHILE current_time < end_time LOOP
      time_string := TO_CHAR(current_time, 'HH24:MI');
      
      -- Add time slot if not already exists
      IF NOT (time_string = ANY(time_slots)) THEN
        time_slots := array_append(time_slots, time_string);
      END IF;
      
      -- Add interval
      current_time := current_time + (interval_minutes || ' minutes')::INTERVAL;
    END LOOP;
  END LOOP;
  
  -- Sort the time slots
  SELECT array_agg(slot ORDER BY slot::TIME) INTO time_slots
  FROM unnest(time_slots) AS slot;
  
  RETURN time_slots;
END;
$$ LANGUAGE plpgsql;

-- Insert default booking configuration
INSERT INTO booking_config (
  id, booking_enabled, max_advance_days, max_party_size, 
  available_times, closed_dates, closed_days_of_week, suspension_message, maintenance_mode
) VALUES (
  1, true, 30, 8,
  '["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]'::jsonb,
  '[]'::jsonb, '[]'::jsonb,
  'We are currently not accepting new bookings. Please check back later.',
  false
) ON CONFLICT (id) DO NOTHING;

-- Insert default service periods
INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order) VALUES
  ('Lunch Service', '12:00:00', '15:00:00', 30, true, 'lunch', 1),
  ('Dinner Service', '18:00:00', '22:00:00', 30, true, 'dinner', 2)
ON CONFLICT DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_periods ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to customers" ON customers
  FOR SELECT USING (true);
CREATE POLICY "Allow public insert to customers" ON customers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to customers" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to bookings" ON bookings
  FOR SELECT USING (true);
CREATE POLICY "Allow public insert to bookings" ON bookings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to bookings" ON bookings
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to booking_config" ON booking_config
  FOR SELECT USING (true);
CREATE POLICY "Allow public update to booking_config" ON booking_config
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to service_periods" ON service_periods
  FOR SELECT USING (true);
CREATE POLICY "Allow public insert to service_periods" ON service_periods
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to service_periods" ON service_periods
  FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to service_periods" ON service_periods
  FOR DELETE USING (true);
