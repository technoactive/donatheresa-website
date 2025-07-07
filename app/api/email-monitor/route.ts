/**
 * Email Monitoring & Auto-Retry System
 * Automatically monitors email health and processes stuck emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { RobustEmailUtils } from '@/lib/email/robust-email-service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    if (action === 'health') {
      return await getEmailHealth();
    } else if (action === 'auto-process') {
      return await autoProcessEmails();
    } else {
      return await getEmailHealth();
    }
  } catch (error) {
    console.error('🚨 Email monitor error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function getEmailHealth() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  
  // Get comprehensive email statistics
  const [
    { count: pendingLogs },
    { count: failedLogs },
    { count: sentLogs },
    { count: queuePending },
    { count: queueFailed },
    { data: recentBookings },
    { data: recentEmails }
  ] = await Promise.all([
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
    supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('bookings').select('id, created_at').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).limit(10),
    supabase.from('email_logs').select('template_key, status, created_at').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).order('created_at', { ascending: false }).limit(20)
  ]);
  
  const totalEmails = (pendingLogs || 0) + (failedLogs || 0) + (sentLogs || 0);
  const successRate = totalEmails > 0 ? Math.round(((sentLogs || 0) / totalEmails) * 100) : 100;
  
  // Health assessment
  const criticalIssues = (pendingLogs || 0) > 5 || (queuePending || 0) > 10;
  const warningIssues = (pendingLogs || 0) > 0 || successRate < 95;
  
  const health = {
    status: criticalIssues ? 'critical' : warningIssues ? 'warning' : 'healthy',
    email_logs: {
      pending: pendingLogs || 0,
      failed: failedLogs || 0,
      sent: sentLogs || 0,
      total: totalEmails
    },
    email_queue: {
      pending: queuePending || 0,
      failed: queueFailed || 0,
      total: (queuePending || 0) + (queueFailed || 0)
    },
    metrics: {
      success_rate: successRate,
      recent_bookings: recentBookings?.length || 0,
      recent_emails: recentEmails?.length || 0,
      last_24h_emails: recentEmails?.filter(e => e.status === 'sent').length || 0
    },
    recommendations: []
  };
  
  // Generate recommendations
  if (criticalIssues) {
    health.recommendations.push('🚨 URGENT: Process email queue immediately');
    health.recommendations.push('🔧 Check email service configuration');
  }
  
  if ((pendingLogs || 0) > 0) {
    health.recommendations.push(`📧 ${pendingLogs} pending emails need processing`);
  }
  
  if ((queuePending || 0) > 0) {
    health.recommendations.push(`📥 ${queuePending} emails in queue`);
  }
  
  if (successRate < 95 && totalEmails > 10) {
    health.recommendations.push(`📊 Success rate ${successRate}% is below optimal (95%)`);
  }
  
  if (health.recommendations.length === 0) {
    health.recommendations.push('✅ Email system is operating optimally');
  }
  
  return NextResponse.json({
    success: true,
    health,
    monitoring: {
      auto_process_url: '/api/email-monitor?action=auto-process',
      last_check: new Date().toISOString(),
      next_recommended_check: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    }
  });
}

async function autoProcessEmails() {
  const startTime = Date.now();
  let processed = 0;
  let successful = 0;
  let failed = 0;
  
  try {
    // Check if processing is needed
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    const { count: pendingCount } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (!pendingCount || pendingCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No emails need processing',
        results: { processed: 0, successful: 0, failed: 0 },
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🔄 Auto-processing ${pendingCount} stuck emails...`);
    
    // Process emails
    const result = await RobustEmailUtils.processStuckEmails();
    processed = result.processed;
    successful = result.success;
    failed = result.failed;
    
    const duration = Date.now() - startTime;
    const response = {
      success: true,
      message: 'Auto-processing completed',
      results: {
        processed,
        successful,
        failed,
        duration_ms: duration,
        success_rate: processed > 0 ? Math.round((successful / processed) * 100) : 100
      },
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Auto-processing completed in ${duration}ms:`, response.results);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('🚨 Auto-processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: { processed, successful, failed },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Force process emails immediately
  return await autoProcessEmails();
} 