-- Fix Database Performance Issues
-- Generated from Supabase performance advisors

-- =====================================================
-- Add missing indexes for foreign keys
-- =====================================================

-- Index for email_logs.contact_id foreign key
CREATE INDEX IF NOT EXISTS idx_email_logs_contact_id 
ON public.email_logs(contact_id);

-- Index for email_queue.booking_id foreign key
CREATE INDEX IF NOT EXISTS idx_email_queue_booking_id 
ON public.email_queue(booking_id);

-- Index for email_queue.contact_id foreign key
CREATE INDEX IF NOT EXISTS idx_email_queue_contact_id 
ON public.email_queue(contact_id);

-- Index for notifications.booking_id foreign key
CREATE INDEX IF NOT EXISTS idx_notifications_booking_id 
ON public.notifications(booking_id);

-- Index for notifications.contact_id foreign key
CREATE INDEX IF NOT EXISTS idx_notifications_contact_id 
ON public.notifications(contact_id);

-- =====================================================
-- Remove unused indexes (commented out for safety)
-- =====================================================
-- These indexes have never been used according to Supabase.
-- Uncomment to remove them if you're sure they won't be needed.

-- DROP INDEX IF EXISTS public.idx_email_queue_priority;
-- DROP INDEX IF EXISTS public.email_queue_status_idx;
-- DROP INDEX IF EXISTS public.email_queue_scheduled_idx;
-- DROP INDEX IF EXISTS public.idx_notifications_type;
-- DROP INDEX IF EXISTS public.idx_notifications_read;
-- DROP INDEX IF EXISTS public.idx_notifications_dismissed;
-- DROP INDEX IF EXISTS public.idx_notifications_timestamp;
-- DROP INDEX IF EXISTS public.idx_notifications_priority;

-- =====================================================
-- Alternative: Create composite indexes for better performance
-- =====================================================
-- These composite indexes can serve multiple query patterns

-- For email_queue table - covers status-based queries with scheduling
CREATE INDEX IF NOT EXISTS idx_email_queue_status_scheduled_composite 
ON public.email_queue(status, scheduled_for, created_at) 
WHERE status IN ('pending', 'scheduled');

-- For notifications table - covers common query patterns
CREATE INDEX IF NOT EXISTS idx_notifications_user_composite 
ON public.notifications(user_id, dismissed, read, created_at DESC) 
WHERE dismissed = false;

-- For notifications table - covers type-specific queries
CREATE INDEX IF NOT EXISTS idx_notifications_type_composite 
ON public.notifications(user_id, type, read, created_at DESC) 
WHERE dismissed = false;

-- =====================================================
-- Analyze tables after index changes
-- =====================================================
ANALYZE public.email_logs;
ANALYZE public.email_queue;
ANALYZE public.notifications; 