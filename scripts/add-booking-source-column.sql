-- Add source column to bookings table
-- This tracks whether a booking was made via 'website' or 'dashboard'

-- Add the source column with default value 'website' for existing bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'dashboard'));

-- Add index for better performance when filtering by source
CREATE INDEX IF NOT EXISTS idx_bookings_source ON bookings(source);

-- Update existing bookings to have 'website' as source (already set by default)
-- This ensures consistency for any existing data

-- Add comment to document the column
COMMENT ON COLUMN bookings.source IS 'Tracks the origin of the booking: website (public form) or dashboard (manual entry)'; 