'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  Mail, 
  Settings, 
  Shield,
  ExternalLink,
  Save,
  Loader2
} from 'lucide-react';

export default function EmailSettingsPage() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  // Form fields
  const [apiKey, setApiKey] = useState('');
  const [senderEmail, setSenderEmail] = useState('reservations@donateresa.com');
  const [senderName, setSenderName] = useState('Dona Theresa Restaurant');
  const [bookingConfirmations, setBookingConfirmations] = useState(true);
  const [staffAlerts, setStaffAlerts] = useState(true);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // Simulate loading settings
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSettings = {
        api_key_encrypted: false,
        sender_email: 'reservations@donateresa.com',
        sender_name: 'Dona Theresa Restaurant',
        booking_confirmation_enabled: true,
        staff_booking_alerts: true,
        emails_sent_today: 0,
        max_daily_emails: 1000
      };
      
      setSettings(mockSettings);
      setSenderEmail(mockSettings.sender_email);
      setSenderName(mockSettings.sender_name);
      setBookingConfirmations(mockSettings.booking_confirmation_enabled);
      setStaffAlerts(mockSettings.staff_booking_alerts);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Resend API key.',
        variant: 'destructive',
      });
      return;
    }

    if (!senderEmail.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid sender email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings Saved',
        description: 'Email settings have been updated successfully.',
      });
      
      setIsConfiguring(false);
      setApiKey('');
      
      // Update mock settings
      setSettings({
        ...settings,
        api_key_encrypted: true,
        sender_email: senderEmail,
        sender_name: senderName,
        booking_confirmation_enabled: bookingConfirmations,
        staff_booking_alerts: staffAlerts
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const isConfigured = settings?.api_key_encrypted && settings?.sender_email;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid gap-6">
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
          <p className="text-muted-foreground">
            Configure email notifications and delivery settings for your restaurant
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email System
        </Badge>
      </div>

      {/* Service Status */}
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
                <span className="text-sm text-muted-foreground">Resend</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isConfigured ? "Email system is active and ready" : "Configure your email provider to start sending emails"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings?.emails_sent_today || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {settings?.max_daily_emails || 1000} emails sent today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Resend</div>
            <p className="text-xs text-muted-foreground">
              Email service provider
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Configure your email service provider and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfiguring ? (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {isConfigured 
                    ? "Your email system is configured and ready to send emails."
                    : "Email system is ready to be configured. You'll need a Resend API key to send emails."
                  }
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quick Setup Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Sign up for a free Resend account at resend.com</li>
                    <li>Get your API key from the Resend dashboard</li>
                    <li>Configure your sending domain (optional)</li>
                    <li>Add your API key to the email settings</li>
                    <li>Test email delivery</li>
                  </ol>
                </div>

                <div className="flex space-x-2">
                  <Button asChild>
                    <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Resend Account
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setIsConfiguring(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Resend API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="re_..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from resend.com dashboard
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email *</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="reservations@donateresa.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    placeholder="Dona Theresa Restaurant"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Email Types</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Booking Confirmations</Label>
                      <p className="text-sm text-muted-foreground">Send confirmation emails when bookings are made</p>
                    </div>
                    <Switch 
                      checked={bookingConfirmations}
                      onCheckedChange={setBookingConfirmations}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Staff Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert staff about new bookings</p>
                    </div>
                    <Switch 
                      checked={staffAlerts}
                      onCheckedChange={setStaffAlerts}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfiguring(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Types Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Types
          </CardTitle>
          <CardDescription>
            Automatic emails configured for your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Booking Confirmations</p>
                  <p className="text-sm text-muted-foreground">Sent when customers make reservations</p>
                </div>
                <Badge variant={bookingConfirmations ? "default" : "secondary"}>
                  {bookingConfirmations ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Booking Reminders</p>
                  <p className="text-sm text-muted-foreground">Sent 24 hours before reservations</p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Staff Alerts</p>
                  <p className="text-sm text-muted-foreground">New booking notifications to staff</p>
                </div>
                <Badge variant={staffAlerts ? "default" : "secondary"}>
                  {staffAlerts ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Contact Form Auto-Reply</p>
                  <p className="text-sm text-muted-foreground">Thank you messages to customers</p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Complete setup to start sending professional emails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                {isConfigured 
                  ? "Your email system is configured! Make a test booking to verify emails are working properly."
                  : "Once configured, your restaurant will automatically send professional emails for bookings, confirmations, and staff notifications."
                }
              </AlertDescription>
            </Alert>

            <div className="grid gap-2 md:grid-cols-2">
              <Button variant="outline" disabled={!isConfigured}>
                <Mail className="h-4 w-4 mr-2" />
                Send Test Email
              </Button>
              <Button variant="outline" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings (Coming Soon)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 