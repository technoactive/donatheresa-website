'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  BarChart3, 
  Save, 
  RefreshCw, 
  Info,
  Globe,
  TrendingUp,
  Users,
  Activity,
  Server,
  Key,
  ShieldCheck
} from 'lucide-react'
import { SettingsLayout } from '@/components/dashboard/settings-layout'
import { getGoogleAnalyticsSettings, updateGoogleAnalyticsSettings } from './actions'

interface GoogleAnalyticsSettings {
  measurement_id: string
  api_secret: string
  enabled: boolean
}

export default function GoogleAnalyticsSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<GoogleAnalyticsSettings>({
    measurement_id: '',
    api_secret: '',
    enabled: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const data = await getGoogleAnalyticsSettings()
      setSettings({
        measurement_id: data.measurement_id || '',
        api_secret: data.api_secret || '',
        enabled: data.enabled || false
      })
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load Google Analytics settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Validate measurement ID format if enabled
      if (settings.enabled && settings.measurement_id) {
        const gaPattern = /^G-[A-Z0-9]+$/
        if (!gaPattern.test(settings.measurement_id.trim())) {
          toast.error('Invalid Measurement ID format. It should start with "G-" followed by alphanumeric characters.')
          return
        }
      }

      const result = await updateGoogleAnalyticsSettings(settings)
      
      if (result.success) {
        toast.success('Google Analytics settings saved successfully!')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save Google Analytics settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SettingsLayout
      title="Google Analytics"
      description="Configure Google Analytics 4 tracking for your website"
      primaryAction={{
        label: "Save Settings",
        onClick: handleSave,
        loading: isSaving,
        loadingLabel: "Saving...",
        disabled: isSaving || isLoading
      }}
      secondaryAction={{
        label: "Refresh",
        onClick: loadSettings,
        loading: isLoading,
        loadingLabel: "Loading...",
        disabled: isLoading || isSaving,
        variant: "outline"
      }}
    >
      <div className="w-full max-w-full space-y-6">
        {/* Main Settings Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              Google Analytics Configuration
            </CardTitle>
            <CardDescription className="text-slate-600">
              Connect your website to Google Analytics 4 for comprehensive visitor tracking and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-900">Enable Google Analytics</Label>
                <p className="text-sm text-slate-600">
                  Activate tracking on all public pages
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {/* Measurement ID Input */}
            <div className="space-y-2">
              <Label htmlFor="measurement_id" className="text-slate-900">
                Measurement ID
              </Label>
              <Input
                id="measurement_id"
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.measurement_id}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, measurement_id: e.target.value.trim() }))
                }
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 font-mono"
              />
              <p className="text-sm text-slate-600">
                Your Google Analytics 4 measurement ID (starts with "G-")
              </p>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-slate-700">
                To find your Measurement ID:
                <ol className="mt-2 ml-4 list-decimal text-sm space-y-1">
                  <li>Go to Google Analytics</li>
                  <li>Select your property</li>
                  <li>Navigate to Admin → Data Streams</li>
                  <li>Click on your web stream</li>
                  <li>Copy the Measurement ID (starts with G-)</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Server-Side Tracking Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Server className="h-5 w-5 text-green-600" />
              </div>
              Server-Side Conversion Tracking
            </CardTitle>
            <CardDescription className="text-slate-600">
              Track booking conversions directly from the server for 100% accuracy (even with ad blockers)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Secret Input */}
            <div className="space-y-2">
              <Label htmlFor="api_secret" className="text-slate-900 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Measurement Protocol API Secret
              </Label>
              <Input
                id="api_secret"
                type="password"
                placeholder="Enter your API secret..."
                value={settings.api_secret}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, api_secret: e.target.value.trim() }))
                }
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 font-mono"
              />
              <p className="text-sm text-slate-600">
                Required for server-side tracking. Keep this secret - never share it publicly.
              </p>
            </div>

            {/* Status Indicator */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${settings.api_secret ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <ShieldCheck className={`h-5 w-5 ${settings.api_secret ? 'text-green-600' : 'text-amber-600'}`} />
              <div>
                <p className={`font-medium ${settings.api_secret ? 'text-green-700' : 'text-amber-700'}`}>
                  {settings.api_secret ? 'Server-side tracking enabled' : 'Server-side tracking disabled'}
                </p>
                <p className="text-sm text-slate-600">
                  {settings.api_secret 
                    ? 'All booking conversions will be tracked server-side for maximum accuracy.'
                    : 'Add your API secret to enable server-side conversion tracking.'}
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="border-green-200 bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-slate-700">
                To create an API Secret:
                <ol className="mt-2 ml-4 list-decimal text-sm space-y-1">
                  <li>Go to Google Analytics Admin</li>
                  <li>Select your property → Data Streams</li>
                  <li>Click on your web stream</li>
                  <li>Scroll to "Measurement Protocol API secrets"</li>
                  <li>Click "Create" and give it a name (e.g., "Dona Theresa Server")</li>
                  <li>Copy the secret value and paste it above</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">What We Track</CardTitle>
            <CardDescription className="text-slate-600">
              Industry-standard metrics to help you understand your visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Page Views</h4>
                  <p className="text-sm text-slate-600">
                    Track which pages visitors view and how long they stay
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">User Demographics</h4>
                  <p className="text-sm text-slate-600">
                    Understand your audience location and device preferences
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Reservation Events</h4>
                  <p className="text-sm text-slate-600">
                    Monitor booking funnel and conversion rates
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Traffic Sources</h4>
                  <p className="text-sm text-slate-600">
                    See where your visitors come from (search, social, direct)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-slate-50 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 text-base">Privacy & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Google Analytics uses cookies to track visitor behavior. We comply with GDPR and privacy regulations:
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm text-slate-600 space-y-1">
              <li>IP addresses are anonymized</li>
              <li>No personal data is collected without consent</li>
              <li>Users can opt-out via browser settings</li>
              <li>Data is processed according to Google's privacy policy</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 