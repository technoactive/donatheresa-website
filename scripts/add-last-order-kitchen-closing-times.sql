-- Migration: Add last_order_time and kitchen_closing_time to service_periods table
-- Run this script in your Supabase SQL Editor to update existing tables

-- Add new columns to service_periods table
ALTER TABLE service_periods 
ADD COLUMN IF NOT EXISTS last_order_time TIME,
ADD COLUMN IF NOT EXISTS kitchen_closing_time TIME;

-- Set default values for existing records
-- For existing records without these values, we'll set:
-- - last_order_time: 30 minutes before the current end_time
-- - kitchen_closing_time: same as current end_time

UPDATE service_periods 
SET 
  last_order_time = (end_time - INTERVAL '30 minutes')::TIME,
  kitchen_closing_time = end_time
WHERE last_order_time IS NULL OR kitchen_closing_time IS NULL;

-- Add constraints to ensure logical time ordering
ALTER TABLE service_periods 
ADD CONSTRAINT check_time_order 
CHECK (
  start_time < last_order_time AND 
  last_order_time <= kitchen_closing_time AND
  kitchen_closing_time <= end_time
);

-- Update the get_service_periods function to include new fields
CREATE OR REPLACE FUNCTION get_service_periods()
RETURNS TABLE (
  id UUID,
  name TEXT,
  start_time TIME,
  end_time TIME,
  last_order_time TIME,
  kitchen_closing_time TIME,
  interval_minutes INTEGER,
  enabled BOOLEAN,
  period_type TEXT,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id, sp.name, sp.start_time, sp.end_time, 
    sp.last_order_time, sp.kitchen_closing_time,
    sp.interval_minutes, sp.enabled, sp.period_type, sp.sort_order
  FROM service_periods sp
  ORDER BY sp.sort_order, sp.start_time;
END;
$$ LANGUAGE plpgsql;

-- Update the upsert_service_period function to handle new fields
CREATE OR REPLACE FUNCTION upsert_service_period(
  p_id UUID,
  p_name TEXT,
  p_start_time TIME,
  p_end_time TIME,
  p_last_order_time TIME,
  p_kitchen_closing_time TIME,
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
    INSERT INTO service_periods (
      name, start_time, end_time, last_order_time, kitchen_closing_time, 
      interval_minutes, enabled, period_type, sort_order
    )
    VALUES (
      p_name, p_start_time, p_end_time, p_last_order_time, p_kitchen_closing_time,
      p_interval_minutes, p_enabled, p_period_type, p_sort_order
    )
    RETURNING id INTO result_id;
  ELSE
    -- Update existing service period
    UPDATE service_periods 
    SET 
      name = p_name,
      start_time = p_start_time,
      end_time = p_end_time,
      last_order_time = p_last_order_time,
      kitchen_closing_time = p_kitchen_closing_time,
      interval_minutes = p_interval_minutes,
      enabled = p_enabled,
      period_type = p_period_type,
      sort_order = p_sort_order,
      updated_at = NOW()
    WHERE id = p_id
    RETURNING id INTO result_id;
    
    -- If no rows were updated, insert new one
    IF result_id IS NULL THEN
      INSERT INTO service_periods (
        name, start_time, end_time, last_order_time, kitchen_closing_time,
        interval_minutes, enabled, period_type, sort_order
      )
      VALUES (
        p_name, p_start_time, p_end_time, p_last_order_time, p_kitchen_closing_time,
        p_interval_minutes, p_enabled, p_period_type, p_sort_order
      )
      RETURNING id INTO result_id;
    END IF;
  END IF;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql;

-- Update the generate_time_slots_from_periods function to use last_order_time
CREATE OR REPLACE FUNCTION generate_time_slots_from_periods()
RETURNS TEXT[] AS $$
DECLARE
  period_record RECORD;
  time_slots TEXT[] := ARRAY[]::TEXT[];
  current_time TIME;
  last_order_time TIME;
  interval_minutes INTEGER;
  time_string TEXT;
BEGIN
  -- Get all enabled service periods
  FOR period_record IN 
    SELECT start_time, last_order_time, interval_minutes 
    FROM service_periods 
    WHERE enabled = true
    ORDER BY start_time
  LOOP
    current_time := period_record.start_time;
    last_order_time := period_record.last_order_time;
    interval_minutes := period_record.interval_minutes;
    
    -- Generate time slots from start_time to last_order_time (inclusive)
    WHILE current_time <= last_order_time LOOP
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

-- Update default service periods with the new fields
INSERT INTO service_periods (
  name, start_time, end_time, last_order_time, kitchen_closing_time,
  interval_minutes, enabled, period_type, sort_order
) VALUES
  ('Lunch Service', '12:00:00', '15:00:00', '14:30:00', '15:00:00', 30, true, 'lunch', 1),
  ('Dinner Service', '18:00:00', '22:00:00', '21:30:00', '22:00:00', 30, true, 'dinner', 2)
ON CONFLICT (name) DO UPDATE SET
  last_order_time = EXCLUDED.last_order_time,
  kitchen_closing_time = EXCLUDED.kitchen_closing_time;

-- Verify the changes
SELECT 'Migration completed successfully!' as status;
SELECT 'Updated service periods:' as info;
SELECT name, start_time, last_order_time, kitchen_closing_time, end_time 
FROM service_periods 
ORDER BY sort_order; 