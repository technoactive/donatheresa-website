-- Create notifications table for the Dona Theresa Restaurant Booking System
-- This table stores all notifications for real-time updates

CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL DEFAULT 'admin',
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'new_booking',
        'booking_cancelled', 
        'booking_updated',
        'vip_booking',
        'peak_time_booking',
        'customer_message',
        'system_alert'
    )),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN NOT NULL DEFAULT false,
    dismissed BOOLEAN NOT NULL DEFAULT false,
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contact_messages(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_dismissed ON notifications(dismissed);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_booking_id ON notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_contact_id ON notifications(contact_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_notifications_user_composite
ON notifications(user_id, dismissed, read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_type_composite
ON notifications(user_id, type, read, created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications table
CREATE POLICY "Enable read access for all users" ON notifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON notifications FOR DELETE USING (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_notifications_updated_at 
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up old notifications (optional)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    -- Delete dismissed notifications older than 30 days
    DELETE FROM notifications 
    WHERE dismissed = true 
    AND created_at < NOW() - INTERVAL '30 days';
    
    -- Delete read notifications older than 7 days (except critical ones)
    DELETE FROM notifications 
    WHERE read = true 
    AND dismissed = false
    AND priority != 'critical'
    AND created_at < NOW() - INTERVAL '7 days';
END;
$$ language 'plpgsql';

-- Optional: Create a scheduled job to clean up old notifications
-- You can run this manually or set up a cron job
-- SELECT cleanup_old_notifications(); 