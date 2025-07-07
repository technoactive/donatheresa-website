/**
 * Email Settings Form Component
 * Comprehensive form for configuring email settings
 */

'use client';

import { useState, useTransition, useEffect } from 'react';
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
  CheckCircle,
  Hash
  } from 'lucide-react';
  import type { EmailSettings } from '@/lib/email/types';

// Create conditional validation schema
const createEmailSettingsSchema = (hasExistingSettings: boolean) => {
  const baseSchema = {
    // Provider Configuration
    email_provider: z.enum(['resend', 'sendgrid', 'ses', 'postmark']),
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
    
    // Advanced Reminder Settings
    reminder_large_party_enabled: z.boolean(),
    reminder_large_party_hours: z.number().min(1).max(168),
    reminder_large_party_size: z.number().min(2).max(20),
    reminder_same_day_enabled: z.boolean(),
    reminder_same_day_hours: z.number().min(1).max(12),
    reminder_weekend_enabled: z.boolean(),
    reminder_weekend_hours: z.number().min(1).max(168),
    reminder_weekday_enabled: z.boolean(),
    reminder_weekday_hours: z.number().min(1).max(168),
    reminder_special_events_enabled: z.boolean(),
    reminder_special_events_hours: z.number().min(1).max(168),
    reminder_vip_enabled: z.boolean(),
    reminder_vip_hours: z.number().min(1).max(168),
    reminder_second_enabled: z.boolean(),
    reminder_second_hours: z.number().min(1).max(24),
    reminder_cutoff_hours: z.number().min(0).max(48),
    
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
    
    // Booking Reference Settings
    booking_ref_prefix: z.string().min(1, 'Prefix is required').max(10, 'Prefix too long'),
    booking_ref_length: z.number().min(3, 'Minimum 3 digits').max(10, 'Maximum 10 digits'),
    
    // Advanced Settings
    max_daily_emails: z.number().min(1).max(10000),
    rate_limit_per_hour: z.number().min(1).max(1000),
    retry_failed_emails: z.boolean(),
    max_retry_attempts: z.number().min(0).max(10),
    track_opens: z.boolean(),
    track_clicks: z.boolean(),
  };

  // Add conditional API key validation
  if (hasExistingSettings) {
    // For existing settings, API key is optional (empty means keep existing)
    return z.object({
      ...baseSchema,
      api_key: z.string(), // Allow empty string for existing settings
    });
  } else {
    // For new settings, API key is required
    return z.object({
      ...baseSchema,
      api_key: z.string().min(1, 'API key is required for initial setup'),
    });
  }
};

type EmailSettingsFormData = {
  email_provider: 'resend' | 'sendgrid' | 'ses' | 'postmark';
  api_key: string;
  sender_email: string;
  sender_name: string;
  reply_to_email?: string;
  booking_confirmation_enabled: boolean;
  booking_reminder_enabled: boolean;
  booking_reminder_hours: number;
  booking_cancellation_enabled: boolean;
  booking_modification_enabled: boolean;
  welcome_email_enabled: boolean;
  
  // Advanced Reminder Settings
  reminder_large_party_enabled: boolean;
  reminder_large_party_hours: number;
  reminder_large_party_size: number;
  reminder_same_day_enabled: boolean;
  reminder_same_day_hours: number;
  reminder_weekend_enabled: boolean;
  reminder_weekend_hours: number;
  reminder_weekday_enabled: boolean;
  reminder_weekday_hours: number;
  reminder_special_events_enabled: boolean;
  reminder_special_events_hours: number;
  reminder_vip_enabled: boolean;
  reminder_vip_hours: number;
  reminder_second_enabled: boolean;
  reminder_second_hours: number;
  reminder_cutoff_hours: number;
  
  staff_booking_alerts: boolean;
  staff_cancellation_alerts: boolean;
  staff_contact_alerts: boolean;
  staff_daily_summary: boolean;
  staff_vip_alerts: boolean;
  contact_auto_reply_enabled: boolean;
  contact_staff_notification: boolean;
  restaurant_email: string;
  manager_email?: string;
  backup_email?: string;
  custom_logo_url?: string;
  brand_color: string;
  max_daily_emails: number;
  rate_limit_per_hour: number;
  retry_failed_emails: boolean;
  max_retry_attempts: number;
  track_opens: boolean;
  track_clicks: boolean;
  booking_ref_prefix: string;
  booking_ref_length: number;
};

interface EmailSettingsFormProps {
  initialSettings: EmailSettings | null;
}

export function EmailSettingsForm({ initialSettings }: EmailSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [dynamicFooter, setDynamicFooter] = useState<string>('Loading...');
  const { toast } = useToast();

  // Load dynamic footer from locale settings
  useEffect(() => {
    async function loadDynamicFooter() {
      try {
        const response = await fetch('/api/locale-settings');
        if (response.ok) {
          const data = await response.json();
          const { restaurant_name, restaurant_phone, restaurant_address, restaurant_city, restaurant_postal_code } = data;
          
          // Build address
          const addressParts = [restaurant_address, restaurant_city, restaurant_postal_code].filter(Boolean);
          const fullAddress = addressParts.join(', ');
          
          // Build footer
          const footerParts = [restaurant_name, fullAddress, restaurant_phone].filter(Boolean);
          setDynamicFooter(footerParts.join(' | '));
        } else {
          setDynamicFooter('Dona Theresa | 451 Uxbridge Road, Pinner HA5 4JR');
        }
      } catch (error) {
        console.error('Failed to load locale settings:', error);
        setDynamicFooter('Dona Theresa | 451 Uxbridge Road, Pinner HA5 4JR');
      }
    }
    
    loadDynamicFooter();
  }, []);

  const form = useForm<EmailSettingsFormData>({
    resolver: zodResolver(createEmailSettingsSchema(!!initialSettings)),
    defaultValues: {
      // Provider Configuration
      email_provider: initialSettings?.email_provider || 'resend',
      api_key: '', // Don't prefill for security
      sender_email: initialSettings?.sender_email || '',
      sender_name: initialSettings?.sender_name || 'Dona Theresa Restaurant',
      reply_to_email: initialSettings?.reply_to_email || '',
      
      // Customer Email Settings
      booking_confirmation_enabled: initialSettings?.booking_confirmation_enabled ?? true,
      booking_reminder_enabled: initialSettings?.booking_reminder_enabled ?? true,
      booking_reminder_hours: initialSettings?.booking_reminder_hours || 24,
      booking_cancellation_enabled: initialSettings?.booking_cancellation_enabled ?? true,
      booking_modification_enabled: initialSettings?.booking_modification_enabled ?? true,
      welcome_email_enabled: initialSettings?.welcome_email_enabled ?? true,
      
      // Advanced Reminder Settings
      reminder_large_party_enabled: initialSettings?.reminder_large_party_enabled ?? true,
      reminder_large_party_hours: initialSettings?.reminder_large_party_hours || 48,
      reminder_large_party_size: initialSettings?.reminder_large_party_size || 6,
      reminder_same_day_enabled: initialSettings?.reminder_same_day_enabled ?? false,
      reminder_same_day_hours: initialSettings?.reminder_same_day_hours || 4,
      reminder_weekend_enabled: initialSettings?.reminder_weekend_enabled ?? true,
      reminder_weekend_hours: initialSettings?.reminder_weekend_hours || 24,
      reminder_weekday_enabled: initialSettings?.reminder_weekday_enabled ?? true,
      reminder_weekday_hours: initialSettings?.reminder_weekday_hours || 24,
      reminder_special_events_enabled: initialSettings?.reminder_special_events_enabled ?? true,
      reminder_special_events_hours: initialSettings?.reminder_special_events_hours || 72,
      reminder_vip_enabled: initialSettings?.reminder_vip_enabled ?? true,
      reminder_vip_hours: initialSettings?.reminder_vip_hours || 48,
      reminder_second_enabled: initialSettings?.reminder_second_enabled ?? false,
      reminder_second_hours: initialSettings?.reminder_second_hours || 2,
      reminder_cutoff_hours: initialSettings?.reminder_cutoff_hours || 2,
      
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
      restaurant_email: initialSettings?.restaurant_email || '',
      manager_email: initialSettings?.manager_email || '',
      backup_email: initialSettings?.backup_email || '',
      
      // Template Settings
      custom_logo_url: initialSettings?.custom_logo_url || '',
      brand_color: initialSettings?.brand_color || '#D97706',
      
      // Booking Reference Settings
      booking_ref_prefix: initialSettings?.booking_ref_prefix || '',
      booking_ref_length: initialSettings?.booking_ref_length || 5,
      
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
                placeholder={initialSettings ? "Leave empty to keep current API key" : "Enter your email provider API key"}
                {...form.register('api_key')}
              />
              {form.formState.errors.api_key && (
                <p className="text-sm text-red-500">{form.formState.errors.api_key.message}</p>
              )}
              {initialSettings && (
                <p className="text-xs text-muted-foreground">
                  💡 Your API key is securely stored. Only enter a new one if you want to change it.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sender_email">Sender Email</Label>
              <Input
                id="sender_email"
                type="email"
                placeholder="reservations@donatheresa.com"
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
              placeholder="info@donatheresa.com"
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
          
          {/* Advanced Reminder Settings */}
          {form.watch('booking_reminder_enabled') && (
            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Advanced Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure intelligent reminder timing based on booking type and customer segment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Large Party Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Large Party Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send earlier reminders for large bookings (requires more planning)</p>
                    </div>
                    <Switch 
                      checked={form.watch('reminder_large_party_enabled')}
                      onCheckedChange={(checked) => form.setValue('reminder_large_party_enabled', checked)}
                    />
                  </div>
                  {form.watch('reminder_large_party_enabled') && (
                    <div className="grid gap-4 md:grid-cols-2 pl-4 border-l-2 border-blue-200">
                      <div className="space-y-2">
                        <Label htmlFor="reminder_large_party_hours">Hours before booking</Label>
                        <Input
                          id="reminder_large_party_hours"
                          type="number"
                          min="1"
                          max="168"
                          {...form.register('reminder_large_party_hours', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder_large_party_size">Party size threshold</Label>
                        <Input
                          id="reminder_large_party_size"
                          type="number"
                          min="2"
                          max="20"
                          {...form.register('reminder_large_party_size', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-muted-foreground">Parties of this size or larger get extended timing</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* VIP Customer Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">VIP Customer Reminders</Label>
                      <p className="text-sm text-muted-foreground">Special reminder timing for VIP customers</p>
                    </div>
                    <Switch 
                      checked={form.watch('reminder_vip_enabled')}
                      onCheckedChange={(checked) => form.setValue('reminder_vip_enabled', checked)}
                    />
                  </div>
                  {form.watch('reminder_vip_enabled') && (
                    <div className="pl-4 border-l-2 border-purple-200">
                      <div className="space-y-2">
                        <Label htmlFor="reminder_vip_hours">Hours before booking</Label>
                        <Input
                          id="reminder_vip_hours"
                          type="number"
                          min="1"
                          max="168"
                          {...form.register('reminder_vip_hours', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-muted-foreground">Industry standard: 48 hours for VIP customers</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekend vs Weekday Reminders */}
                <div className="space-y-4">
                  <div className="text-base font-medium text-gray-700">Weekend vs Weekday Timing</div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-medium">Weekend Reminders</Label>
                          <p className="text-sm text-muted-foreground">Friday-Sunday bookings</p>
                        </div>
                        <Switch 
                          checked={form.watch('reminder_weekend_enabled')}
                          onCheckedChange={(checked) => form.setValue('reminder_weekend_enabled', checked)}
                        />
                      </div>
                      {form.watch('reminder_weekend_enabled') && (
                        <div className="pl-4 border-l-2 border-green-200">
                          <div className="space-y-2">
                            <Label htmlFor="reminder_weekend_hours">Hours before</Label>
                            <Input
                              id="reminder_weekend_hours"
                              type="number"
                              min="1"
                              max="168"
                              {...form.register('reminder_weekend_hours', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-medium">Weekday Reminders</Label>
                          <p className="text-sm text-muted-foreground">Monday-Thursday bookings</p>
                        </div>
                        <Switch 
                          checked={form.watch('reminder_weekday_enabled')}
                          onCheckedChange={(checked) => form.setValue('reminder_weekday_enabled', checked)}
                        />
                      </div>
                      {form.watch('reminder_weekday_enabled') && (
                        <div className="pl-4 border-l-2 border-blue-200">
                          <div className="space-y-2">
                            <Label htmlFor="reminder_weekday_hours">Hours before</Label>
                            <Input
                              id="reminder_weekday_hours"
                              type="number"
                              min="1"
                              max="168"
                              {...form.register('reminder_weekday_hours', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Same-Day Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Same-Day Reminders</Label>
                      <p className="text-sm text-muted-foreground">Final reminder on the day of booking</p>
                    </div>
                    <Switch 
                      checked={form.watch('reminder_same_day_enabled')}
                      onCheckedChange={(checked) => form.setValue('reminder_same_day_enabled', checked)}
                    />
                  </div>
                  {form.watch('reminder_same_day_enabled') && (
                    <div className="pl-4 border-l-2 border-amber-200">
                      <div className="space-y-2">
                        <Label htmlFor="reminder_same_day_hours">Hours before booking</Label>
                        <Input
                          id="reminder_same_day_hours"
                          type="number"
                          min="1"
                          max="12"
                          {...form.register('reminder_same_day_hours', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-muted-foreground">Industry standard: 2-4 hours before arrival</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Events Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Special Events</Label>
                      <p className="text-sm text-muted-foreground">Holidays, Valentine's Day, special occasions</p>
                    </div>
                    <Switch 
                      checked={form.watch('reminder_special_events_enabled')}
                      onCheckedChange={(checked) => form.setValue('reminder_special_events_enabled', checked)}
                    />
                  </div>
                  {form.watch('reminder_special_events_enabled') && (
                    <div className="pl-4 border-l-2 border-red-200">
                      <div className="space-y-2">
                        <Label htmlFor="reminder_special_events_hours">Hours before booking</Label>
                        <Input
                          id="reminder_special_events_hours"
                          type="number"
                          min="1"
                          max="168"
                          {...form.register('reminder_special_events_hours', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-muted-foreground">Industry standard: 72 hours for special events</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Second Reminder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Second Reminder</Label>
                      <p className="text-sm text-muted-foreground">Additional reminder closer to booking time</p>
                    </div>
                    <Switch 
                      checked={form.watch('reminder_second_enabled')}
                      onCheckedChange={(checked) => form.setValue('reminder_second_enabled', checked)}
                    />
                  </div>
                  {form.watch('reminder_second_enabled') && (
                    <div className="pl-4 border-l-2 border-indigo-200">
                      <div className="space-y-2">
                        <Label htmlFor="reminder_second_hours">Hours before booking</Label>
                        <Input
                          id="reminder_second_hours"
                          type="number"
                          min="1"
                          max="24"
                          {...form.register('reminder_second_hours', { valueAsNumber: true })}
                        />
                        <p className="text-xs text-muted-foreground">Sent in addition to the main reminder</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reminder Cutoff */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder_cutoff_hours" className="text-base font-medium">Reminder Cutoff</Label>
                    <p className="text-sm text-muted-foreground">Don't send reminders if booking is within this many hours</p>
                    <Input
                      id="reminder_cutoff_hours"
                      type="number"
                      min="0"
                      max="48"
                      {...form.register('reminder_cutoff_hours', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">Prevents spam for very last-minute bookings</p>
                  </div>
                </div>

                {/* Industry Standards Notice */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Industry Standards:</strong> 24hrs (standard), 48hrs (large parties/VIP), 72hrs (special events), 2-4hrs (same-day)
                  </AlertDescription>
                </Alert>

              </CardContent>
            </Card>
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
                placeholder="info@donatheresa.com"
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
                  placeholder="manager@donatheresa.com"
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
                  placeholder="backup@donatheresa.com"
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
            <Label>Email Footer</Label>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div className="text-sm font-medium text-slate-700 mb-2">Auto-generated from Restaurant Settings:</div>
              <div className="text-sm text-slate-900 font-mono">
                {dynamicFooter}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Footer is automatically generated from your restaurant information in Settings → Locale. 
                To change this, update your restaurant details in the locale settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Reference Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Booking Reference Settings
          </CardTitle>
          <CardDescription>
            Configure how booking references appear in emails and customer communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking_ref_prefix">Reference Prefix</Label>
              <Input
                id="booking_ref_prefix"
                type="text"
                placeholder="DT"
                maxLength={10}
                {...form.register('booking_ref_prefix')}
              />
              {form.formState.errors.booking_ref_prefix && (
                <p className="text-sm text-red-500">{form.formState.errors.booking_ref_prefix.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Short prefix for your business (2-4 characters recommended)
              </p>
            </div>
   
            <div className="space-y-2">
              <Label htmlFor="booking_ref_length">Number Length</Label>
              <Input
                id="booking_ref_length"
                type="number"
                min="3"
                max="10"
                {...form.register('booking_ref_length', { valueAsNumber: true })}
              />
              {form.formState.errors.booking_ref_length && (
                <p className="text-sm text-red-500">{form.formState.errors.booking_ref_length.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Number of digits (with leading zeros)
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="text-sm font-medium text-slate-700 mb-2">Preview Example:</div>
            <div className="text-lg font-mono font-bold text-slate-900">
              {form.watch('booking_ref_prefix') || 'DT'}-{String(1).padStart(form.watch('booking_ref_length') || 5, '0')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Next booking reference format
            </div>
          </div>

          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <strong>Note:</strong> Changing these settings will only affect new bookings. Existing bookings will keep their current references.
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