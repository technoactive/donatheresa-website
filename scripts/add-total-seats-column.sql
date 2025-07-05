-- Migration: Add total_seats column to booking_config table
-- Run this in your Supabase SQL Editor

-- Add total_seats column to booking_config table
ALTER TABLE booking_config 
ADD COLUMN IF NOT EXISTS total_seats INTEGER NOT NULL DEFAULT 50;

-- Add a comment to document the column
COMMENT ON COLUMN booking_config.total_seats IS 'Total seating capacity of the restaurant for occupancy calculations';

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'booking_config' 
AND column_name = 'total_seats';

-- Show the updated table structure
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'booking_config' 
ORDER BY ordinal_position; 