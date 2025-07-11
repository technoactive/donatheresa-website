/**
 * Server Actions for Email Settings
 * Handle email configuration CRUD operations and analytics
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { EmailSettings, EmailAnalytics, EmailSettingsFormData } from '@/lib/email/types';

export interface EmailSettingsResponse {
  data: EmailSettings | null;
  error: string | null;
}

export interface EmailAnalyticsResponse {
  data: EmailAnalytics | null;
  error: string | null;
}

/**
 * Get current daily email usage with automatic reset
 */
export async function getDailyEmailUsage(): Promise<{ dailyUsage: number; dailyLimit: number; error?: string }> {
  try {
    const supabase = await createClient();
    
    // First reset the counter if it's a new day
    await supabase.rpc('reset_daily_email_count');
    
    // Get current usage and limit
    const { data: settings, error } = await supabase
      .from('email_settings')
      .select('emails_sent_today, max_daily_emails')
      .eq('user_id', 'admin')
      .single();

    if (error) {
      console.error('Failed to get daily email usage:', error);
      return { dailyUsage: 0, dailyLimit: 1000, error: error.message };
    }

    return {
      dailyUsage: settings?.emails_sent_today || 0,
      dailyLimit: settings?.max_daily_emails || 1000
    };
  } catch (error) {
    console.error('Error fetching daily email usage:', error);
    return { 
      dailyUsage: 0, 
      dailyLimit: 1000, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get current email settings
 */
export async function getEmailSettings(): Promise<EmailSettingsResponse> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Failed to get email settings:', error);
      return { data: null, error: error.message };
    }

    return { data: data as EmailSettings, error: null };
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update email settings
 */
export async function updateEmailSettings(formData: EmailSettingsFormData): Promise<EmailSettingsResponse> {
  try {
    const supabase = await createClient();

    // Get existing settings to preserve API key if not provided
    const { data: existingSettings } = await supabase
      .from('email_settings')
      .select('api_key_encrypted')
      .eq('user_id', 'admin')
      .single();

    // Prepare settings data
    const settingsData: any = {
      ...formData,
    };

    // Only update API key if a new one is provided
    if (formData.api_key && formData.api_key.trim() !== '') {
      settingsData.api_key_encrypted = formData.api_key;
      settingsData.api_key_last_updated = new Date().toISOString();
    } else {
      // Preserve existing API key
      settingsData.api_key_encrypted = existingSettings?.api_key_encrypted || null;
    }

    // Remove the plain api_key from the data (it's not a database column)
    delete settingsData.api_key;

    const { data, error } = await supabase
      .from('email_settings')
      .upsert(
        { user_id: 'admin', ...settingsData },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to update email settings:', error);
      return { data: null, error: error.message };
    }

    // Revalidate the settings page
    revalidatePath('/dashboard/settings/email');
    
    return { data: data as EmailSettings, error: null };
  } catch (error) {
    console.error('Error updating email settings:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get email analytics for the specified number of days
 */
export async function getEmailAnalytics(days: number = 30): Promise<EmailAnalyticsResponse> {
  try {
    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get accurate daily usage first
    const dailyUsageResult = await getDailyEmailUsage();

    // Get email logs for analytics
    const { data: logs, error } = await supabase
      .from('email_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get email logs:', error);
      return { data: null, error: error.message };
    }

    if (!logs || logs.length === 0) {
      // Return analytics with accurate daily usage even if no logs
      return {
        data: {
          totalSent: 0,
          totalDelivered: 0,
          totalOpened: 0,
          totalClicked: 0,
          totalBounced: 0,
          totalFailed: 0,
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0,
          bounceRate: 0,
          dailyStats: [],
          templateStats: [],
          recentEmails: [],
          // Add current daily usage info
          currentDailyUsage: dailyUsageResult.dailyUsage,
          currentDailyLimit: dailyUsageResult.dailyLimit
        },
        error: null
      };
    }

    // Calculate basic metrics
    const totalSent = logs.filter(log => 
      log.status === 'sent' || log.status === 'delivered' || log.status === 'opened' || log.status === 'clicked'
    ).length;
    
    const totalDelivered = logs.filter(log => 
      log.status === 'delivered' || log.status === 'opened' || log.status === 'clicked'
    ).length;
    
    const totalOpened = logs.filter(log => log.opened_at !== null).length;
    const totalClicked = logs.filter(log => log.clicked_at !== null).length;
    const totalBounced = logs.filter(log => log.status === 'bounced').length;
    const totalFailed = logs.filter(log => log.status === 'failed').length;

    // Calculate rates
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;

    // Calculate daily stats
    const dailyStatsMap = new Map<string, {
      date: string;
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
    }>();

    logs.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      const existing = dailyStatsMap.get(date) || {
        date,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      };

      if (log.status === 'sent' || log.status === 'delivered' || log.status === 'opened' || log.status === 'clicked') {
        existing.sent++;
      }
      if (log.status === 'delivered' || log.status === 'opened' || log.status === 'clicked') {
        existing.delivered++;
      }
      if (log.opened_at) {
        existing.opened++;
      }
      if (log.clicked_at) {
        existing.clicked++;
      }

      dailyStatsMap.set(date, existing);
    });

    const dailyStats = Array.from(dailyStatsMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate template stats
    const templateStatsMap = new Map<string, {
      template_key: string;
      template_name: string;
      sent: number;
      opened: number;
      clicked: number;
      open_rate: number;
      click_rate: number;
    }>();

    logs.forEach(log => {
      const existing = templateStatsMap.get(log.template_key) || {
        template_key: log.template_key,
        template_name: log.template_key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        sent: 0,
        opened: 0,
        clicked: 0,
        open_rate: 0,
        click_rate: 0
      };

      if (log.status === 'sent' || log.status === 'delivered' || log.status === 'opened' || log.status === 'clicked') {
        existing.sent++;
      }
      if (log.opened_at) {
        existing.opened++;
      }
      if (log.clicked_at) {
        existing.clicked++;
      }

      // Calculate rates
      existing.open_rate = existing.sent > 0 ? (existing.opened / existing.sent) * 100 : 0;
      existing.click_rate = existing.opened > 0 ? (existing.clicked / existing.opened) * 100 : 0;

      templateStatsMap.set(log.template_key, existing);
    });

    const templateStats = Array.from(templateStatsMap.values()).sort((a, b) => b.sent - a.sent);

    const analytics: EmailAnalytics & { currentDailyUsage?: number; currentDailyLimit?: number } = {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalBounced,
      totalFailed,
      deliveryRate,
      openRate,
      clickRate,
      bounceRate,
      dailyStats,
      templateStats,
      recentEmails: logs.slice(0, 10) as any[],
      // Add accurate daily usage
      currentDailyUsage: dailyUsageResult.dailyUsage,
      currentDailyLimit: dailyUsageResult.dailyLimit
    };

    return { data: analytics, error: null };
  } catch (error) {
    console.error('Error fetching email analytics:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get email templates
 */
export async function getEmailTemplates() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('category')
      .order('name');

    if (error) {
      console.error('Failed to get email templates:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(
  templateKey: string, 
  testEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Import email service here to avoid circular dependencies
    const { emailService } = await import('@/lib/email/email-service');
    
    const result = await emailService.sendEmail({
      templateKey,
      recipientEmail: testEmail,
      recipientName: 'Test User',
      data: {
        customerName: 'Test User',
        bookingDate: new Date().toLocaleDateString('en-GB'),
        bookingTime: '19:00',
        partySize: 2,
        bookingId: 'TEST-12345',
        specialRequests: 'This is a test email',
        subject: 'Test Contact Form Subject',
        message: 'This is a test message from the contact form to verify email delivery is working correctly.'
      }
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Revalidate to show updated analytics
    revalidatePath('/dashboard/settings/email');
    
    return { success: true };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Process email queue manually
 */
export async function processEmailQueue(): Promise<{ success: boolean; error?: string; processed?: number }> {
  try {
    // Import email service here to avoid circular dependencies
    const { emailService } = await import('@/lib/email/email-service');
    
    await emailService.processEmailQueue();
    
    // Revalidate to show updated status
    revalidatePath('/dashboard/settings/email');
    
    return { success: true };
  } catch (error) {
    console.error('Error processing email queue:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get email queue status
 */
export async function getEmailQueueStatus() {
  try {
    const supabase = await createClient();
    
    const [
      { count: pending },
      { count: processing },
      { count: failed }
    ] = await Promise.all([
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('email_queue').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    return {
      data: {
        pending: pending || 0,
        processing: processing || 0,
        failed: failed || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching email queue status:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 