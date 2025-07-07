/**
 * Email Queue Processing API
 * Processes stuck pending emails and queued emails for reliable delivery
 */

import { NextRequest, NextResponse } from 'next/server';
import { RobustEmailUtils } from '@/lib/email/robust-email-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting email queue processing...');
    
    // Process all stuck emails
    const result = await RobustEmailUtils.processStuckEmails();
    
    const response = {
      success: true,
      message: 'Email processing completed',
      results: {
        processed: result.processed,
        successful: result.success,
        failed: result.failed,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('✅ Email processing completed:', response.results);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('🚨 Email processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get email queue status for monitoring
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    const [
      { count: pendingLogs },
      { count: failedLogs },
      { count: sentLogs },
      { count: queuePending },
      { count: queueFailed }
    ] = await Promise.all([
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'failed')
    ]);
    
    const status = {
      email_logs: {
        pending: pendingLogs || 0,
        failed: failedLogs || 0,
        sent: sentLogs || 0,
        total: (pendingLogs || 0) + (failedLogs || 0) + (sentLogs || 0)
      },
      email_queue: {
        pending: queuePending || 0,
        failed: queueFailed || 0,
        total: (queuePending || 0) + (queueFailed || 0)
      },
      health: {
        critical_issues: (pendingLogs || 0) > 10 || (queuePending || 0) > 10,
        success_rate: sentLogs && (sentLogs + failedLogs) > 0 
          ? Math.round((sentLogs / (sentLogs + failedLogs)) * 100) 
          : 0
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      status,
      recommendations: status.health.critical_issues 
        ? ['Process email queue immediately', 'Check email service configuration']
        : ['Email system is healthy']
    });
  } catch (error) {
    console.error('🚨 Email status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 