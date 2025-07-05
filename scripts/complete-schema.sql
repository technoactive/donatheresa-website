-- Complete Database Schema for Dona Theresa Restaurant Booking System
-- Run this in your Supabase SQL Editor

-- 1. Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 2. Create booking_settings table
CREATE TABLE IF NOT EXISTS booking_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    max_capacity INTEGER NOT NULL DEFAULT 50,
    current_bookings INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster lookups
CREATE INDEX IF NOT EXISTS idx_booking_settings_date ON booking_settings(date);

-- 3. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(date, time);

-- 4. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for contact messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for customers table
CREATE POLICY "Enable read access for all users" ON customers FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON customers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON customers FOR DELETE USING (true);

-- 7. Create RLS policies for booking_settings table
CREATE POLICY "Enable read access for all users" ON booking_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON booking_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON booking_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON booking_settings FOR DELETE USING (true);

-- 8. Create RLS policies for bookings table
CREATE POLICY "Enable read access for all users" ON bookings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON bookings FOR DELETE USING (true);

-- 9. Create RLS policies for contact_messages table
CREATE POLICY "Enable read access for all users" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON contact_messages FOR DELETE USING (true);

-- 10. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Create triggers to automatically update updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_settings_updated_at BEFORE UPDATE ON booking_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Create function to update booking capacity
CREATE OR REPLACE FUNCTION update_booking_capacity()
RETURNS TRIGGER AS $$
BEGIN
    -- When a booking is inserted or status changes to confirmed
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'confirmed' AND OLD.status != 'confirmed') THEN
        INSERT INTO booking_settings (date, current_bookings)
        VALUES (NEW.date, NEW.party_size)
        ON CONFLICT (date) 
        DO UPDATE SET current_bookings = booking_settings.current_bookings + NEW.party_size;
    END IF;
    
    -- When a booking is deleted or status changes from confirmed
    IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed') THEN
        UPDATE booking_settings 
        SET current_bookings = GREATEST(0, current_bookings - COALESCE(OLD.party_size, 0))
        WHERE date = OLD.date;
    END IF;
    
    -- When party size is updated for confirmed booking
    IF TG_OP = 'UPDATE' AND NEW.status = 'confirmed' AND OLD.status = 'confirmed' AND NEW.party_size != OLD.party_size THEN
        UPDATE booking_settings 
        SET current_bookings = current_bookings - OLD.party_size + NEW.party_size
        WHERE date = NEW.date;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 13. Create trigger for booking capacity management
CREATE TRIGGER manage_booking_capacity
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_booking_capacity();

-- 14. Insert some initial booking settings for the next 30 days
INSERT INTO booking_settings (date, max_capacity, current_bookings, is_available)
SELECT 
    (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29))::DATE as date,
    50 as max_capacity,
    0 as current_bookings,
    true as is_available
ON CONFLICT (date) DO NOTHING;

-- 15. Insert some sample data for testing (optional - remove if not needed)
-- Sample customers
INSERT INTO customers (name, email, phone) VALUES
    ('John Doe', 'john.doe@example.com', '+1234567890'),
    ('Jane Smith', 'jane.smith@example.com', '+1234567891'),
    ('Maria Garcia', 'maria.garcia@example.com', '+1234567892')
ON CONFLICT (email) DO NOTHING;

-- Sample contact message
INSERT INTO contact_messages (name, email, phone, subject, message) VALUES
    ('Test User', 'test@example.com', '+1234567890', 'General Inquiry', 'This is a test message to verify the contact form is working properly.')
ON CONFLICT DO NOTHING; 