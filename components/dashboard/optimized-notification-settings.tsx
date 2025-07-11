'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Settings, 
  Zap, 
  TestTube, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  Headphones,
  Save
} from 'lucide-react'
import { getNotificationSettings, updateNotificationSettings } from '@/app/dashboard/settings/notifications/actions'
import { testNotificationSound } from '@/lib/notification-sounds'

// Simplified schema for better performance
const notificationSchema = z.object({
  notifications_enabled: z.boolean(),
  sound_enabled: z.boolean(),
  show_toasts: z.boolean(),
  master_volume: z.number().min(0).max(1),
  new_booking_enabled: z.boolean(),
  new_booking_sound: z.boolean(),
  vip_booking_enabled: z.boolean(),
  vip_booking_sound: z.boolean(),
  booking_cancelled_enabled: z.boolean(),
  booking_cancelled_sound: z.boolean(),
  system_alert_enabled: z.boolean(),
  system_alert_sound: z.boolean(),
  quiet_hours_enabled: z.boolean(),
  quiet_hours_start: z.string(),
  quiet_hours_end: z.string(),
})

type NotificationForm = z.infer<typeof notificationSchema>

// Smart presets for quick setup
const PRESETS = {
  restaurant: {
    name: 'Restaurant Standard',
    description: 'Balanced settings for restaurant operations',
    icon: Bell,
    settings: {
      notifications_enabled: true,
      sound_enabled: true,
      show_toasts: true,
      master_volume: 0.4,
      new_booking_enabled: true,
      new_booking_sound: true,
      vip_booking_enabled: true,
      vip_booking_sound: true,
      booking_cancelled_enabled: true,
      booking_cancelled_sound: true,
      system_alert_enabled: true,
      system_alert_sound: true,
      quiet_hours_enabled: true,
      quiet_hours_start: '23:00',
      quiet_hours_end: '08:00',
    }
  },
  quiet: {
    name: 'Quiet Mode',
    description: 'Visual notifications only, no sounds',
    icon: VolumeX,
    settings: {
      notifications_enabled: true,
      sound_enabled: false,
      show_toasts: true,
      master_volume: 0,
      new_booking_enabled: true,
      new_booking_sound: false,
      vip_booking_enabled: true,
      vip_booking_sound: false,
      booking_cancelled_enabled: true,
      booking_cancelled_sound: false,
      system_alert_enabled: true,
      system_alert_sound: false,
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
    }
  },
  alerts: {
    name: 'High Alert',
    description: 'Maximum notifications for busy periods',
    icon: AlertTriangle,
    settings: {
      notifications_enabled: true,
      sound_enabled: true,
      show_toasts: true,
      master_volume: 0.7,
      new_booking_enabled: true,
      new_booking_sound: true,
      vip_booking_enabled: true,
      vip_booking_sound: true,
      booking_cancelled_enabled: true,
      booking_cancelled_sound: true,
      system_alert_enabled: true,
      system_alert_sound: true,
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
    }
  }
}

const NOTIFICATION_TYPES = [
  { key: 'new_booking', label: 'New Bookings', icon: Bell, color: 'bg-green-100 text-green-700' },
  { key: 'vip_booking', label: 'VIP Bookings', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
  { key: 'booking_cancelled', label: 'Cancellations', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
  { key: 'system_alert', label: 'System Alerts', icon: Settings, color: 'bg-blue-100 text-blue-700' },
]

export function OptimizedNotificationSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [testingSound, setTestingSound] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('quick')

  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: PRESETS.restaurant.settings,
  })

  const [notifications_enabled, sound_enabled, master_volume] = form.watch([
    'notifications_enabled', 
    'sound_enabled', 
    'master_volume'
  ])

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getNotificationSettings()
        if (settings) {
          const formData = {
            ...settings,
            quiet_hours_start: settings.quiet_hours_start.slice(0, 5),
            quiet_hours_end: settings.quiet_hours_end.slice(0, 5),
          }
          form.reset(formData)
        }
      } catch (error) {
        toast.error('Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [form])

  // Apply preset
  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey]
    form.reset(preset.settings)
    toast.success(`Applied ${preset.name} preset`)
  }

  // Test sound
  const handleTestSound = async (type: string) => {
    if (!sound_enabled) {
      toast.error('Enable sounds first to test audio')
      return
    }
    
    setTestingSound(type)
    try {
      await testNotificationSound(type as any, master_volume)
      toast.success('Sound test completed')
    } catch (error) {
      toast.error('Sound test failed')
    } finally {
      setTestingSound(null)
    }
  }

  // Save settings
  const onSubmit = async (data: NotificationForm) => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.set(key, value.toString())
        } else if (typeof value === 'number') {
          formData.set(key, value.toString())
        } else {
          if (key.includes('_start') || key.includes('_end')) {
            formData.set(key, `${value}:00`)
          } else {
            formData.set(key, value)
          }
        }
      })

      const result = await updateNotificationSettings(formData)
      
      if (result.success) {
        toast.success('Settings saved successfully')
      } else {
        toast.error(result.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Status Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${notifications_enabled ? 'bg-green-100' : 'bg-slate-100'}`}>
                  <Bell className={`h-6 w-6 ${notifications_enabled ? 'text-green-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Notifications {notifications_enabled ? 'Active' : 'Disabled'}
                  </h3>
                  <p className="text-muted-foreground">
                    {notifications_enabled 
                      ? `${sound_enabled ? 'Sound enabled' : 'Silent mode'} • Volume: ${Math.round(master_volume * 100)}%`
                      : 'All notifications are turned off'
                    }
                  </p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notifications_enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Master Switch</span>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {!notifications_enabled && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Notifications are disabled. Enable the master switch above to receive booking alerts.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Setup
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test & Demo
            </TabsTrigger>
          </TabsList>

          {/* Quick Setup Tab */}
          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Presets
                </CardTitle>
                <CardDescription>
                  Choose a preset that matches your restaurant's needs. You can customize further in the Custom tab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <Card 
                      key={key} 
                      className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/50"
                      onClick={() => applyPreset(key as keyof typeof PRESETS)}
                    >
                      <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <preset.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{preset.name}</h3>
                            <p className="text-sm text-muted-foreground">{preset.description}</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Apply Preset
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Essential Settings</CardTitle>
                <CardDescription>
                  The most important notification settings for daily operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sound Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {sound_enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      <div>
                        <h4 className="font-medium">Sound Notifications</h4>
                        <p className="text-sm text-muted-foreground">Audio alerts for important events</p>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="sound_enabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                              disabled={!notifications_enabled}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {sound_enabled && (
                    <FormField
                      control={form.control}
                      name="master_volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume: {Math.round(field.value * 100)}%</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={1}
                              step={0.05}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              disabled={!notifications_enabled || !sound_enabled}
                              className="w-full"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Separator />

                {/* Visual Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">Visual Notifications</h4>
                      <p className="text-sm text-muted-foreground">Toast popups and badges</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="show_toasts"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            disabled={!notifications_enabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Configure individual notification types and their behavior.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {NOTIFICATION_TYPES.map((type) => (
                    <div key={type.key} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${type.color}`}>
                          <type.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
                        <FormField
                          control={form.control}
                          name={`${type.key}_enabled` as keyof NotificationForm}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <FormLabel className="text-sm">Enable Notifications</FormLabel>
                              <FormControl>
                                <Switch 
                                  checked={field.value as boolean} 
                                  onCheckedChange={field.onChange}
                                  disabled={!notifications_enabled}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`${type.key}_sound` as keyof NotificationForm}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                              <FormLabel className="text-sm">Play Sound</FormLabel>
                              <FormControl>
                                <Switch 
                                  checked={field.value as boolean} 
                                  onCheckedChange={field.onChange}
                                  disabled={!notifications_enabled || !sound_enabled || !(form.watch(`${type.key}_enabled` as keyof NotificationForm) as boolean)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Reduce notifications during specified hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="quiet_hours_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Enable Quiet Hours</FormLabel>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          disabled={!notifications_enabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('quiet_hours_enabled') && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quiet_hours_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <input 
                              type="time" 
                              {...field} 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quiet_hours_end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <input 
                              type="time" 
                              {...field} 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test Notifications
                </CardTitle>
                <CardDescription>
                  Test your notification settings to ensure they work as expected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {NOTIFICATION_TYPES.map((type) => (
                    <Card key={type.key} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${type.color}`}>
                            <type.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestSound(type.key)}
                          disabled={!notifications_enabled || !sound_enabled || testingSound === type.key}
                          className="flex items-center gap-2"
                        >
                          {testingSound === type.key ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              Testing...
                            </>
                          ) : (
                            <>
                              <Headphones className="h-3 w-3" />
                              Test Sound
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Test your setup:</strong> Create a booking through your website to see real-time notifications in action.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button 
            type="submit" 
            disabled={isSaving || !notifications_enabled}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 