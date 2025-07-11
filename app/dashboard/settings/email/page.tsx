'use client';

import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailSettingsForm } from '@/components/dashboard/email-settings-form';
import { getEmailSettings, getDailyEmailUsage } from './actions';
import { 
  Mail, 
  Settings, 
  Shield,
  BarChart3,
  Zap,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import type { EmailSettings } from '@/lib/email/types';

function EmailSettingsContent() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load both settings and daily usage in parallel
      const [settingsResult, usageResult] = await Promise.all([
        getEmailSettings(),
        getDailyEmailUsage()
      ]);
      
      if (settingsResult.error) {
        setError(settingsResult.error);
      } else {
        setSettings(settingsResult.data);
      }
      
      if (usageResult.error) {
        console.warn('Failed to load daily usage:', usageResult.error);
        // Don't set error for usage issues, just use defaults
      }
      
      setDailyUsage(usageResult.dailyUsage);
      setDailyLimit(usageResult.dailyLimit);
      
    } catch (error) {
      console.error('Failed to load email settings:', error);
      setError('Failed to load email settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading email settings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading email settings: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isConfigured = settings?.api_key_encrypted && settings?.sender_email;
  // const dailyUsage = settings?.emails_sent_today || 0; // This line is removed
  // const dailyLimit = settings?.max_daily_emails || 1000; // This line is removed

  return (
    <div className="space-y-6">
      {/* Service Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={isConfigured ? "default" : "secondary"}>
                {isConfigured ? "Active" : "Not Configured"}
              </Badge>
              {isConfigured && (
                <span className="text-sm text-muted-foreground">
                  {settings?.email_provider || 'Resend'}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isConfigured 
                ? "Email system is active and ready to send emails" 
                : "Configure your email provider to start sending emails"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyUsage}</div>
            <p className="text-xs text-muted-foreground">
              of {dailyLimit} emails sent today
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${Math.min((dailyUsage / dailyLimit) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>{Math.round((dailyUsage / dailyLimit) * 100)}%</span>
              <span>{dailyLimit}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settings?.email_provider ? 
                settings.email_provider.charAt(0).toUpperCase() + settings.email_provider.slice(1) : 
                'Resend'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Email service provider
            </p>
            {isConfigured && (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-green-600">
                  Configured & Ready
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      {!isConfigured && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Required:</strong> Configure your email provider settings below to start sending professional emails to your customers.
          </AlertDescription>
        </Alert>
      )}

      {isConfigured && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Email System Active:</strong> Your restaurant is ready to send booking confirmations, reminders, and staff notifications.
            <br />
            <span className="text-sm text-muted-foreground mt-1 block">
              Daily usage: {dailyUsage}/{dailyLimit} emails • Last reset: {new Date().toLocaleDateString('en-GB')}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Warning Alert */}
      {isConfigured && dailyUsage > dailyLimit * 0.8 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>High Usage Warning:</strong> You've used {Math.round((dailyUsage / dailyLimit) * 100)}% of your daily email limit. 
            Consider increasing your daily limit in the advanced settings below.
          </AlertDescription>
        </Alert>
      )}

      {/* Email Settings Form */}
      <EmailSettingsForm initialSettings={settings} />
    </div>
  );
}

export default function EmailSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
          <p className="text-muted-foreground">
            Configure email notifications, templates, and delivery settings for your restaurant
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Professional Email System
        </Badge>
      </div>

      {/* Settings Content */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading email settings...</span>
          </div>
        </div>
      }>
        <EmailSettingsContent />
      </Suspense>
    </div>
  );
} 