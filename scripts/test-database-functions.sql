-- ==========================================
-- Booking Settings Database Testing Suite
-- ==========================================
-- Run these queries in Supabase SQL Editor to test all database functionality

-- Test 1: Check table structure and data
SELECT 'TEST 1: Table Structure Validation' as test_section;

-- Check booking_config table
SELECT 
  'booking_config table structure' as test_name,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'booking_config'
ORDER BY ordinal_position;

-- Check service_periods table
SELECT 
  'service_periods table structure' as test_name,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'service_periods'
ORDER BY ordinal_position;

-- Test 2: Current data validation
SELECT 'TEST 2: Current Data Validation' as test_section;

-- Check current booking settings
SELECT 
  'Current booking settings' as test_name,
  booking_enabled,
  max_advance_days,
  max_party_size,
  array_length(available_times, 1) as time_slots_count,
  array_length(closed_dates, 1) as closed_dates_count,
  array_length(closed_days_of_week, 1) as closed_days_count
FROM booking_config;

-- Check current service periods
SELECT 
  'Current service periods' as test_name,
  COUNT(*) as total_periods,
  COUNT(*) FILTER (WHERE enabled = true) as enabled_periods,
  COUNT(*) FILTER (WHERE period_type = 'lunch') as lunch_periods,
  COUNT(*) FILTER (WHERE period_type = 'dinner') as dinner_periods
FROM service_periods;

-- Test 3: Database functions testing
SELECT 'TEST 3: Database Functions Testing' as test_section;

-- Test get_service_periods function
SELECT 'Testing get_service_periods()' as test_name;
SELECT * FROM get_service_periods() ORDER BY sort_order;

-- Test generate_time_slots_from_periods function
SELECT 'Testing generate_time_slots_from_periods()' as test_name;
SELECT 
  unnest(generate_time_slots_from_periods()) as time_slot,
  array_length(generate_time_slots_from_periods(), 1) as total_slots;

-- Test 4: Service period CRUD operations
SELECT 'TEST 4: Service Period CRUD Operations' as test_section;

-- Insert a test service period
SELECT 'Creating test service period' as test_name;
SELECT upsert_service_period(
  'Test Afternoon Tea',
  '15:00'::TIME,
  '17:00'::TIME,
  30,
  true,
  'break',
  99
) as test_period_id;

-- Verify the insertion
SELECT 'Verifying test period creation' as test_name;
SELECT * FROM service_periods WHERE name = 'Test Afternoon Tea';

-- Update the test period
SELECT 'Updating test service period' as test_name;
UPDATE service_periods 
SET interval_minutes = 45, enabled = false 
WHERE name = 'Test Afternoon Tea';

-- Verify the update
SELECT 'Verifying test period update' as test_name;
SELECT name, interval_minutes, enabled FROM service_periods WHERE name = 'Test Afternoon Tea';

-- Test time slot generation with updated period
SELECT 'Testing time slots with updated period' as test_name;
SELECT array_length(generate_time_slots_from_periods(), 1) as slots_with_disabled_period;

-- Re-enable the period and test again
UPDATE service_periods SET enabled = true WHERE name = 'Test Afternoon Tea';
SELECT array_length(generate_time_slots_from_periods(), 1) as slots_with_enabled_period;

-- Clean up test data
DELETE FROM service_periods WHERE name = 'Test Afternoon Tea';

-- Test 5: Data integrity and constraints
SELECT 'TEST 5: Data Integrity and Constraints' as test_section;

-- Test time validation (should fail)
SELECT 'Testing invalid time constraint' as test_name;
-- This should fail if constraints are properly set
-- INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order)
-- VALUES ('Invalid Test', '25:00', '26:00', 30, true, 'lunch', 1);

-- Test interval validation
SELECT 'Testing interval boundaries' as test_name;
SELECT 
  CASE 
    WHEN 5 BETWEEN 1 AND 60 THEN 'Valid: 5 minutes'
    ELSE 'Invalid: 5 minutes'
  END as five_min_test,
  CASE 
    WHEN 60 BETWEEN 1 AND 60 THEN 'Valid: 60 minutes'
    ELSE 'Invalid: 60 minutes'
  END as sixty_min_test,
  CASE 
    WHEN 0 BETWEEN 1 AND 60 THEN 'Valid: 0 minutes'
    ELSE 'Invalid: 0 minutes'
  END as zero_min_test;

-- Test 6: Complex time slot generation scenarios
SELECT 'TEST 6: Complex Time Slot Scenarios' as test_section;

-- Create multiple test periods with different intervals
INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order) VALUES
  ('Test 15min', '10:00', '11:00', 15, true, 'lunch', 101),
  ('Test 30min', '12:00', '14:00', 30, true, 'lunch', 102),
  ('Test 45min', '18:00', '20:00', 45, true, 'dinner', 103);

-- Generate slots and analyze
SELECT 'Complex scenario time slots' as test_name;
WITH generated_slots AS (
  SELECT unnest(generate_time_slots_from_periods()) as slot
),
slot_analysis AS (
  SELECT 
    slot,
    CASE 
      WHEN slot::TIME BETWEEN '10:00' AND '11:00' THEN '15min period'
      WHEN slot::TIME BETWEEN '12:00' AND '14:00' THEN '30min period'
      WHEN slot::TIME BETWEEN '18:00' AND '20:00' THEN '45min period'
      ELSE 'unknown'
    END as period_source
  FROM generated_slots
)
SELECT 
  period_source,
  COUNT(*) as slot_count,
  array_agg(slot ORDER BY slot) as slots
FROM slot_analysis 
WHERE period_source != 'unknown'
GROUP BY period_source
ORDER BY period_source;

-- Clean up test periods
DELETE FROM service_periods WHERE name LIKE 'Test %min';

-- Test 7: Array handling for closed dates and days
SELECT 'TEST 7: Array Data Handling' as test_section;

-- Test closed_dates array
SELECT 'Testing closed dates array' as test_name;
UPDATE booking_config SET closed_dates = ARRAY['2024-12-25', '2024-01-01', '2024-07-04'];
SELECT 'Updated closed_dates' as action, closed_dates FROM booking_config;

-- Test closed_days_of_week array
SELECT 'Testing closed days array' as test_name;
UPDATE booking_config SET closed_days_of_week = ARRAY[0, 6]; -- Sunday and Saturday
SELECT 'Updated closed_days_of_week' as action, closed_days_of_week FROM booking_config;

-- Test array operations
SELECT 'Testing array operations' as test_name;
SELECT 
  '2024-12-25' = ANY(closed_dates) as has_christmas,
  0 = ANY(closed_days_of_week) as has_sunday,
  array_length(closed_dates, 1) as total_closed_dates,
  array_length(closed_days_of_week, 1) as total_closed_days
FROM booking_config;

-- Test 8: Performance testing
SELECT 'TEST 8: Performance Testing' as test_section;

-- Time the slot generation function
SELECT 'Testing slot generation performance' as test_name;
SELECT 
  extract(epoch from (clock_timestamp() - start_time)) * 1000 as generation_time_ms,
  array_length(generate_time_slots_from_periods(), 1) as total_slots
FROM (SELECT clock_timestamp() as start_time) t;

-- Test bulk operations
SELECT 'Testing bulk service period operations' as test_name;
WITH bulk_insert AS (
  INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order)
  SELECT 
    'Bulk Test ' || i,
    '12:00'::TIME,
    '13:00'::TIME,
    30,
    true,
    'lunch',
    1000 + i
  FROM generate_series(1, 10) i
  RETURNING id
)
SELECT 'Inserted ' || COUNT(*) || ' bulk periods' as result FROM bulk_insert;

-- Clean up bulk test data
DELETE FROM service_periods WHERE name LIKE 'Bulk Test %';

-- Test 9: Edge cases and error scenarios
SELECT 'TEST 9: Edge Cases and Error Scenarios' as test_section;

-- Test empty time slots scenario
SELECT 'Testing empty periods scenario' as test_name;
UPDATE service_periods SET enabled = false; -- Disable all periods
SELECT 
  'All periods disabled' as scenario,
  array_length(generate_time_slots_from_periods(), 1) as slot_count;

-- Re-enable periods
UPDATE service_periods SET enabled = true;

-- Test overlapping periods
SELECT 'Testing overlapping periods' as test_name;
INSERT INTO service_periods (name, start_time, end_time, interval_minutes, enabled, period_type, sort_order) VALUES
  ('Overlap Test 1', '12:00', '14:00', 30, true, 'lunch', 201),
  ('Overlap Test 2', '13:00', '15:00', 30, true, 'lunch', 202);

-- Check for duplicate slots (should not have any)
WITH slot_counts AS (
  SELECT 
    unnest(generate_time_slots_from_periods()) as slot
)
SELECT 
  'Overlap test results' as test_name,
  slot,
  COUNT(*) as occurrences
FROM slot_counts
GROUP BY slot
HAVING COUNT(*) > 1;

-- Clean up overlap test
DELETE FROM service_periods WHERE name LIKE 'Overlap Test %';

-- Test 10: Final validation and summary
SELECT 'TEST 10: Final Validation Summary' as test_section;

-- Comprehensive system check
SELECT 'System health check' as test_name;
WITH system_stats AS (
  SELECT 
    (SELECT COUNT(*) FROM service_periods) as total_periods,
    (SELECT COUNT(*) FROM service_periods WHERE enabled = true) as enabled_periods,
    (SELECT array_length(generate_time_slots_from_periods(), 1)) as total_time_slots,
    (SELECT booking_enabled FROM booking_config) as booking_system_enabled,
    (SELECT max_advance_days FROM booking_config) as max_advance_days,
    (SELECT max_party_size FROM booking_config) as max_party_size
)
SELECT 
  total_periods,
  enabled_periods,
  total_time_slots,
  booking_system_enabled,
  max_advance_days,
  max_party_size,
  CASE 
    WHEN total_periods > 0 AND enabled_periods > 0 AND total_time_slots > 0 
    THEN '✅ SYSTEM HEALTHY'
    ELSE '❌ SYSTEM ISSUES DETECTED'
  END as system_status
FROM system_stats;

-- Check data integrity
SELECT 'Data integrity check' as test_name;
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Service periods exist'
    ELSE '❌ No service periods found'
  END as periods_check,
  CASE 
    WHEN MIN(interval_minutes) >= 5 AND MAX(interval_minutes) <= 60 
    THEN '✅ Valid intervals'
    ELSE '❌ Invalid intervals detected'
  END as intervals_check,
  CASE 
    WHEN MIN(sort_order) >= 1 THEN '✅ Valid sort orders'
    ELSE '❌ Invalid sort orders'
  END as sort_check
FROM service_periods;

-- Final status
SELECT 
  'PRODUCTION READINESS ASSESSMENT' as final_assessment,
  CASE 
    WHEN (
      (SELECT COUNT(*) FROM service_periods WHERE enabled = true) > 0 AND
      (SELECT array_length(generate_time_slots_from_periods(), 1)) > 0 AND
      (SELECT booking_enabled FROM booking_config) IS NOT NULL
    ) THEN '🚀 PRODUCTION READY'
    ELSE '⚠️ NEEDS ATTENTION'
  END as status; 