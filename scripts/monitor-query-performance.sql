-- Database Query Performance Monitoring Script
-- Run this periodically to monitor query performance issues

-- ===================================================================
-- 1. CURRENT SLOW QUERIES (> 1000ms)
-- ===================================================================
SELECT 
  'SLOW QUERIES (>1000ms)' as check_type,
  query,
  calls,
  total_time,
  mean_time,
  (total_time/calls) as avg_ms_per_call
FROM pg_stat_statements 
WHERE mean_time > 1000  -- queries averaging over 1 second
ORDER BY mean_time DESC
LIMIT 10;

-- ===================================================================
-- 2. HIGH-IMPACT QUERIES (Most total time consumed)
-- ===================================================================
SELECT 
  'HIGH IMPACT QUERIES' as check_type,
  substring(query, 1, 100) || '...' as query_snippet,
  calls,
  total_time,
  mean_time,
  (total_time / (SELECT sum(total_time) FROM pg_stat_statements) * 100)::numeric(5,2) as percent_of_total_time
FROM pg_stat_statements 
ORDER BY total_time DESC
LIMIT 10;

-- ===================================================================
-- 3. SCHEMA INTROSPECTION MONITORING
-- ===================================================================
SELECT 
  'SCHEMA QUERIES' as check_type,
  substring(query, 1, 80) || '...' as query_snippet,
  calls,
  mean_time,
  total_time
FROM pg_stat_statements 
WHERE query ILIKE '%pg_get_tabledef%' 
   OR query ILIKE '%information_schema%'
   OR query ILIKE '%pg_class%'
   OR query ILIKE '%pg_namespace%'
ORDER BY mean_time DESC;

-- ===================================================================
-- 4. REALTIME SYSTEM PERFORMANCE CHECK
-- ===================================================================
SELECT 
  'REALTIME PERFORMANCE' as check_type,
  'realtime.list_changes' as query_type,
  calls,
  mean_time,
  CASE 
    WHEN mean_time < 5 THEN '✅ EXCELLENT'
    WHEN mean_time < 10 THEN '⚠️ WARNING' 
    ELSE '🚨 CRITICAL'
  END as status
FROM pg_stat_statements 
WHERE query ILIKE '%realtime.list_changes%';

-- ===================================================================
-- 5. INDEX USAGE VERIFICATION (Our optimized indexes)
-- ===================================================================
SELECT 
  'INDEX USAGE' as check_type,
  schemaname,
  tablename,
  indexname,
  idx_scan as times_used,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
  AND indexname IN (
    'email_queue_status_idx',
    'email_queue_scheduled_idx', 
    'idx_email_queue_priority'
  )
ORDER BY idx_scan DESC;

-- ===================================================================
-- 6. TABLE STATISTICS SUMMARY
-- ===================================================================
SELECT 
  'TABLE STATS' as check_type,
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  seq_scan as sequential_scans,
  idx_scan as index_scans,
  CASE 
    WHEN seq_scan > idx_scan * 2 THEN '⚠️ High seq scans'
    ELSE '✅ Good'
  END as scan_ratio_status
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;

-- ===================================================================
-- 7. CURRENT ACTIVE CONNECTIONS
-- ===================================================================
SELECT 
  'ACTIVE CONNECTIONS' as check_type,
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active_queries,
  count(*) FILTER (WHERE state = 'idle') as idle_connections,
  count(*) FILTER (WHERE usename = 'authenticator') as app_connections,
  count(*) FILTER (WHERE usename = 'postgres') as admin_connections
FROM pg_stat_activity;

-- ===================================================================
-- 8. LONG RUNNING QUERIES (Currently executing > 30 seconds)
-- ===================================================================
SELECT 
  'LONG RUNNING QUERIES' as check_type,
  pid,
  now() - pg_stat_activity.query_start AS duration,
  usename,
  substring(query, 1, 100) || '...' as query_snippet,
  state
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '30 seconds'
  AND state != 'idle';

-- ===================================================================
-- USAGE INSTRUCTIONS
-- ===================================================================
/*
MONITORING RECOMMENDATIONS:

1. Run this script weekly to track performance trends
2. Focus on queries with mean_time > 500ms 
3. Alert if realtime queries exceed 5ms average
4. Monitor schema query frequency increases
5. Watch for new entries in slow queries section

ALERT THRESHOLDS:
- Schema queries > 1000ms: Immediate attention
- Realtime queries > 5ms: Monitor closely  
- New slow queries appearing: Investigate
- High sequential scan ratios: Consider indexing

TO RESET STATISTICS (after optimization):
SELECT pg_stat_statements_reset();
*/ 