/**
 * Email Settings Form Component
 * Comprehensive form for configuring email settings
 */

'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateEmailSettings } from '@/app/dashboard/settings/email/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Save, 
  Mail, 
  Settings, 
  Users, 
  MessageSquare, 
  Palette, 
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import type { EmailSettings } from '@/lib/email/types';

// Validation schema
const emailSettingsSchema = z.object({
  // Provider Configuration
  email_provider: z.enum(['resend', 'sendgrid', 'ses', 'postmark']),
  api_key: z.string().min(1, 'API key is required'),
  sender_email: z.string().email('Invalid email address'),
  sender_name: z.string().min(1, 'Sender name is required'),
  reply_to_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  
  // Customer Email Settings
  booking_confirmation_enabled: z.boolean(),
  booking_reminder_enabled: z.boolean(),
  booking_reminder_hours: z.number().min(1).max(168), // 1 hour to 1 week
  booking_cancellation_enabled: z.boolean(),
  booking_modification_enabled: z.boolean(),
  welcome_email_enabled: z.boolean(),
  
  // Staff Email Settings
  staff_booking_alerts: z.boolean(),
  staff_cancellation_alerts: z.boolean(),
  staff_contact_alerts: z.boolean(),
  staff_daily_summary: z.boolean(),
  staff_vip_alerts: z.boolean(),
  
  // Contact Form Settings
  contact_auto_reply_enabled: z.boolean(),
  contact_staff_notification: z.boolean(),
  
  // Email Addresses
  restaurant_email: z.string().email('Invalid email address'),
  manager_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  backup_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  
  // Template Settings
  custom_logo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  brand_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  custom_footer: z.string().optional(),
  
  // Advanced Settings
  max_daily_emails: z.number().min(1).max(10000),
  rate_limit_per_hour: z.number().min(1).max(1000),
  retry_failed_emails: z.boolean(),
  max_retry_attempts: z.number().min(0).max(10),
  track_opens: z.boolean(),
  track_clicks: z.boolean(),
});

type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

interface EmailSettingsFormProps {
  initialSettings: EmailSettings | null;
}

export function EmailSettingsForm({ initialSettings }: EmailSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { toast } = useToast();

  const form = useForm<EmailSettingsFormData>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      // Provider Configuration
      email_provider: initialSettings?.email_provider || 'resend',
      api_key: '', // Don't prefill for security
      sender_email: initialSettings?.sender_email || 'reservations@donateresa.com',
      sender_name: initialSettings?.sender_name || 'Dona Theresa Restaurant',
      reply_to_email: initialSettings?.reply_to_email || '',
      
      // Customer Email Settings
      booking_confirmation_enabled: initialSettings?.booking_confirmation_enabled ?? true,
      booking_reminder_enabled: initialSettings?.booking_reminder_enabled ?? true,
      booking_reminder_hours: initialSettings?.booking_reminder_hours || 24,
      booking_cancellation_enabled: initialSettings?.booking_cancellation_enabled ?? true,
      booking_modification_enabled: initialSettings?.booking_modification_enabled ?? true,
      welcome_email_enabled: initialSettings?.welcome_email_enabled ?? true,
      
      // Staff Email Settings
      staff_booking_alerts: initialSettings?.staff_booking_alerts ?? true,
      staff_cancellation_alerts: initialSettings?.staff_cancellation_alerts ?? true,
      staff_contact_alerts: initialSettings?.staff_contact_alerts ?? true,
      staff_daily_summary: initialSettings?.staff_daily_summary ?? false,
      staff_vip_alerts: initialSettings?.staff_vip_alerts ?? true,
      
      // Contact Form Settings
      contact_auto_reply_enabled: initialSettings?.contact_auto_reply_enabled ?? true,
      contact_staff_notification: initialSettings?.contact_staff_notification ?? true,
      
      // Email Addresses
      restaurant_email: initialSettings?.restaurant_email || 'info@donateresa.com',
      manager_email: initialSettings?.manager_email || '',
      backup_email: initialSettings?.backup_email || '',
      
      // Template Settings
      custom_logo_url: initialSettings?.custom_logo_url || '',
      brand_color: initialSettings?.brand_color || '#D97706',
      custom_footer: initialSettings?.custom_footer || 'Dona Theresa Restaurant | 451 Uxbridge Road, Pinner, London HA5 1AA',
      
      // Advanced Settings
      max_daily_emails: initialSettings?.max_daily_emails || 1000,
      rate_limit_per_hour: initialSettings?.rate_limit_per_hour || 100,
      retry_failed_emails: initialSettings?.retry_failed_emails ?? true,
      max_retry_attempts: initialSettings?.max_retry_attempts || 3,
      track_opens: initialSettings?.track_opens ?? true,
      track_clicks: initialSettings?.track_clicks ?? true,
    },
  });

  const onSubmit = (data: EmailSettingsFormData) => {
    startTransition(async () => {
      setSaveStatus('saving');
      
      try {
        const result = await updateEmailSettings(data);
        
        if (result.error) {
          setSaveStatus('error');
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        } else {
          setSaveStatus('saved');
          toast({
            title: 'Settings saved',
            description: 'Email settings have been updated successfully.',
          });
          
          // Reset save status after 3 seconds
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      } catch (error) {
        setSaveStatus('error');
        toast({
          title: 'Error',
          description: 'Failed to save settings. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Provider Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Provider Configuration
          </CardTitle>
          <CardDescription>
            Configure your email service provider and basic settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email_provider">Email Provider</Label>
              <Select 
                value={form.watch('email_provider')} 
                onValueChange={(value) => form.setValue('email_provider', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">Resend (Recommended)</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                  <SelectItem value="postmark">Postmark</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.email_provider && (
                <p className="text-sm text-red-500">{form.formState.errors.email_provider.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                placeholder="Enter your email provider API key"
                {...form.register('api_key')}
              />
              {form.formState.errors.api_key && (
                <p className="text-sm text-red-500">{form.formState.errors.api_key.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sender_email">Sender Email</Label>
              <Input
                id="sender_email"
                type="email"
                placeholder="reservations@donateresa.com"
                {...form.register('sender_email')}
              />
              {form.formState.errors.sender_email && (
                <p className="text-sm text-red-500">{form.formState.errors.sender_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender_name">Sender Name</Label>
              <Input
                id="sender_name"
                placeholder="Dona Theresa Restaurant"
                {...form.register('sender_name')}
              />
              {form.formState.errors.sender_name && (
                <p className="text-sm text-red-500">{form.formState.errors.sender_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply_to_email">Reply-To Email (Optional)</Label>
            <Input
              id="reply_to_email"
              type="email"
              placeholder="info@donateresa.com"
              {...form.register('reply_to_email')}
            />
            {form.formState.errors.reply_to_email && (
              <p className="text-sm text-red-500">{form.formState.errors.reply_to_email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Email Settings
          </CardTitle>
          <CardDescription>
            Configure automatic emails sent to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Confirmations</Label>
                <p className="text-sm text-muted-foreground">Send confirmation emails when bookings are made</p>
              </div>
              <Switch 
                checked={form.watch('booking_confirmation_enabled')}
                onCheckedChange={(checked) => form.setValue('booking_confirmation_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Reminders</Label>
                <p className="text-sm text-muted-foreground">Send reminder emails before bookings</p>
              </div>
              <Switch 
                checked={form.watch('booking_reminder_enabled')}
                onCheckedChange={(checked) => form.setValue('booking_reminder_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cancellation Confirmations</Label>
                <p className="text-sm text-muted-foreground">Send emails when bookings are cancelled</p>
              </div>
              <Switch 
                checked={form.watch('booking_cancellation_enabled')}
                onCheckedChange={(checked) => form.setValue('booking_cancellation_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Welcome Emails</Label>
                <p className="text-sm text-muted-foreground">Send welcome emails to new customers</p>
              </div>
              <Switch 
                checked={form.watch('welcome_email_enabled')}
                onCheckedChange={(checked) => form.setValue('welcome_email_enabled', checked)}
              />
            </div>
          </div>

          {form.watch('booking_reminder_enabled') && (
            <div className="space-y-2">
              <Label htmlFor="booking_reminder_hours">Reminder Timing (hours before booking)</Label>
              <Input
                id="booking_reminder_hours"
                type="number"
                min="1"
                max="168"
                {...form.register('booking_reminder_hours', { valueAsNumber: true })}
              />
              {form.formState.errors.booking_reminder_hours && (
                <p className="text-sm text-red-500">{form.formState.errors.booking_reminder_hours.message}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Staff Email Settings
          </CardTitle>
          <CardDescription>
            Configure email alerts sent to restaurant staff
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Booking Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert staff when new bookings are made</p>
              </div>
              <Switch 
                checked={form.watch('staff_booking_alerts')}
                onCheckedChange={(checked) => form.setValue('staff_booking_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cancellation Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert staff when bookings are cancelled</p>
              </div>
              <Switch 
                checked={form.watch('staff_cancellation_alerts')}
                onCheckedChange={(checked) => form.setValue('staff_cancellation_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Contact Form Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert staff about contact form submissions</p>
              </div>
              <Switch 
                checked={form.watch('staff_contact_alerts')}
                onCheckedChange={(checked) => form.setValue('staff_contact_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>VIP Customer Alerts</Label>
                <p className="text-sm text-muted-foreground">Special alerts for VIP customer bookings</p>
              </div>
              <Switch 
                checked={form.watch('staff_vip_alerts')}
                onCheckedChange={(checked) => form.setValue('staff_vip_alerts', checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant_email">Primary Restaurant Email</Label>
              <Input
                id="restaurant_email"
                type="email"
                placeholder="info@donateresa.com"
                {...form.register('restaurant_email')}
              />
              {form.formState.errors.restaurant_email && (
                <p className="text-sm text-red-500">{form.formState.errors.restaurant_email.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manager_email">Manager Email (Optional)</Label>
                <Input
                  id="manager_email"
                  type="email"
                  placeholder="manager@donateresa.com"
                  {...form.register('manager_email')}
                />
                {form.formState.errors.manager_email && (
                  <p className="text-sm text-red-500">{form.formState.errors.manager_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_email">Backup Email (Optional)</Label>
                <Input
                  id="backup_email"
                  type="email"
                  placeholder="backup@donateresa.com"
                  {...form.register('backup_email')}
                />
                {form.formState.errors.backup_email && (
                  <p className="text-sm text-red-500">{form.formState.errors.backup_email.message}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Form Settings
          </CardTitle>
          <CardDescription>
            Configure email responses for contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Reply to Customers</Label>
                <p className="text-sm text-muted-foreground">Send automatic thank you emails</p>
              </div>
              <Switch 
                checked={form.watch('contact_auto_reply_enabled')}
                onCheckedChange={(checked) => form.setValue('contact_auto_reply_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Staff Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify staff about new submissions</p>
              </div>
              <Switch 
                checked={form.watch('contact_staff_notification')}
                onCheckedChange={(checked) => form.setValue('contact_staff_notification', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Email Branding
          </CardTitle>
          <CardDescription>
            Customize the appearance of your email templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand_color">Brand Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="brand_color"
                  type="color"
                  className="w-16 h-10"
                  {...form.register('brand_color')}
                />
                <Input
                  type="text"
                  placeholder="#D97706"
                  className="flex-1"
                  {...form.register('brand_color')}
                />
              </div>
              {form.formState.errors.brand_color && (
                <p className="text-sm text-red-500">{form.formState.errors.brand_color.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom_logo_url">Logo URL (Optional)</Label>
              <Input
                id="custom_logo_url"
                type="url"
                placeholder="https://example.com/logo.png"
                {...form.register('custom_logo_url')}
              />
              {form.formState.errors.custom_logo_url && (
                <p className="text-sm text-red-500">{form.formState.errors.custom_logo_url.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_footer">Email Footer</Label>
            <Textarea
              id="custom_footer"
              placeholder="Dona Theresa Restaurant | 451 Uxbridge Road, Pinner, London HA5 1AA"
              className="min-h-[80px]"
              {...form.register('custom_footer')}
            />
            {form.formState.errors.custom_footer && (
              <p className="text-sm text-red-500">{form.formState.errors.custom_footer.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Configure rate limits, tracking, and retry behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_daily_emails">Daily Email Limit</Label>
              <Input
                id="max_daily_emails"
                type="number"
                min="1"
                max="10000"
                {...form.register('max_daily_emails', { valueAsNumber: true })}
              />
              {form.formState.errors.max_daily_emails && (
                <p className="text-sm text-red-500">{form.formState.errors.max_daily_emails.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate_limit_per_hour">Hourly Rate Limit</Label>
              <Input
                id="rate_limit_per_hour"
                type="number"
                min="1"
                max="1000"
                {...form.register('rate_limit_per_hour', { valueAsNumber: true })}
              />
              {form.formState.errors.rate_limit_per_hour && (
                <p className="text-sm text-red-500">{form.formState.errors.rate_limit_per_hour.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Track Email Opens</Label>
                <p className="text-sm text-muted-foreground">Monitor when emails are opened</p>
              </div>
              <Switch 
                checked={form.watch('track_opens')}
                onCheckedChange={(checked) => form.setValue('track_opens', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Track Link Clicks</Label>
                <p className="text-sm text-muted-foreground">Monitor link clicks in emails</p>
              </div>
              <Switch 
                checked={form.watch('track_clicks')}
                onCheckedChange={(checked) => form.setValue('track_clicks', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Retry Failed Emails</Label>
                <p className="text-sm text-muted-foreground">Automatically retry failed deliveries</p>
              </div>
              <Switch 
                checked={form.watch('retry_failed_emails')}
                onCheckedChange={(checked) => form.setValue('retry_failed_emails', checked)}
              />
            </div>

            {form.watch('retry_failed_emails') && (
              <div className="space-y-2">
                <Label htmlFor="max_retry_attempts">Max Retry Attempts</Label>
                <Input
                  id="max_retry_attempts"
                  type="number"
                  min="0"
                  max="10"
                  {...form.register('max_retry_attempts', { valueAsNumber: true })}
                />
                {form.formState.errors.max_retry_attempts && (
                  <p className="text-sm text-red-500">{form.formState.errors.max_retry_attempts.message}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {saveStatus === 'saved' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Settings saved successfully</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Failed to save settings</span>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="min-w-[120px]"
        >
          {isPending ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* API Key Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your API key is encrypted and stored securely. For security reasons, we don't show existing API keys. 
          Only enter a new API key if you want to change it.
        </AlertDescription>
      </Alert>
    </form>
  );
} 