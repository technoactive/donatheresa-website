/**
 * Email Health Cron Job
 * Automatically monitors and processes stuck emails every 5 minutes
 * Prevents emails from getting stuck in pending status
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Starting scheduled email health check...');
    
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    // Check for stuck emails
    const { count: stuckEmails } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', new Date(Date.now() - 2 * 60 * 1000).toISOString()); // Older than 2 minutes
    
    let processedResults = null;
    
    if (stuckEmails && stuckEmails > 0) {
      console.log(`⚠️ Found ${stuckEmails} stuck emails, processing...`);
      
      // Process stuck emails
      const { RobustEmailUtils } = await import('@/lib/email/robust-email-service');
      processedResults = await RobustEmailUtils.processStuckEmails();
      
      console.log(`✅ Processed ${processedResults.processed} emails: ${processedResults.success} successful, ${processedResults.failed} failed`);
    }
    
    // Get current health status
    const [
      { count: pendingLogs },
      { count: sentLogs },
      { count: failedLogs }
    ] = await Promise.all([
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed')
    ]);
    
    const totalEmails = (pendingLogs || 0) + (sentLogs || 0) + (failedLogs || 0);
    const successRate = totalEmails > 0 ? Math.round(((sentLogs || 0) / totalEmails) * 100) : 100;
    
    const health = {
      status: (pendingLogs || 0) > 10 ? 'critical' : (pendingLogs || 0) > 0 ? 'warning' : 'healthy',
      pending_emails: pendingLogs || 0,
      sent_emails: sentLogs || 0,
      failed_emails: failedLogs || 0,
      success_rate: successRate,
      processing_results: processedResults
    };
    
    // Log health status
    if (health.status === 'critical') {
      console.error('🚨 EMAIL SYSTEM CRITICAL:', health);
    } else if (health.status === 'warning') {
      console.warn('⚠️ EMAIL SYSTEM WARNING:', health);
    } else {
      console.log('✅ EMAIL SYSTEM HEALTHY:', health);
    }
    
    return NextResponse.json({
      success: true,
      health,
      cron_execution: {
        timestamp: new Date().toISOString(),
        stuck_emails_found: stuckEmails || 0,
        processed: processedResults?.processed || 0,
        next_check: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Next check in 5 minutes
      }
    });
    
  } catch (error) {
    console.error('🚨 Email health cron failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Same as GET for flexibility
  return await GET(request);
} 