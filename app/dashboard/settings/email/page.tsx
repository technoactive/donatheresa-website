/**
 * Email Settings Page - Basic working version
 * Features: Email configuration, test functionality, analytics
 */

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Settings, 
  BarChart3, 
  FileText, 
  TestTube, 
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

// Simple email settings component
function EmailSettingsOverview() {
  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Not Configured</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Configure your email provider to start sending emails
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              of 1000 emails sent today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
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
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Email system is ready to be configured. You'll need a Resend API key to send emails.
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
              <Button variant="outline" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Configure Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Types
          </CardTitle>
          <CardDescription>
            Automatic emails that will be sent by the system
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
                <Badge variant="outline">Ready</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Booking Reminders</p>
                  <p className="text-sm text-muted-foreground">Sent 24 hours before reservations</p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Cancellation Emails</p>
                  <p className="text-sm text-muted-foreground">Sent when bookings are cancelled</p>
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
                <Badge variant="outline">Ready</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Contact Form Auto-Reply</p>
                  <p className="text-sm text-muted-foreground">Thank you messages to customers</p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Contact Notifications</p>
                  <p className="text-sm text-muted-foreground">Staff alerts for new inquiries</p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Professional email templates are ready to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              6 professional email templates have been configured for your restaurant:
            </p>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Booking Confirmation Template</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Booking Reminder Template</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Booking Cancellation Template</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Staff New Booking Alert</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contact Form Auto-Reply</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contact Staff Notification</span>
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                All templates are designed with your restaurant branding and can be customized once the email service is configured.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Email Testing
          </CardTitle>
          <CardDescription>
            Test your email system once configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Email testing will be available once you configure your email provider settings.
            </AlertDescription>
          </Alert>

          <div className="grid gap-2 md:grid-cols-2">
            <Button variant="outline" disabled>
              <Mail className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
            <Button variant="outline" disabled>
              <TestTube className="h-4 w-4 mr-2" />
              Test Booking Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main page component
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
      <Suspense fallback={<div>Loading email settings...</div>}>
        <EmailSettingsOverview />
      </Suspense>
    </div>
  );
} 