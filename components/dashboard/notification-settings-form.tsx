'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Bell, Volume2, VolumeX, Clock, Settings, AlertTriangle, RotateCcw } from 'lucide-react'
import { getNotificationSettings, updateNotificationSettings, resetNotificationSettings, type NotificationSettings } from '@/app/dashboard/settings/notifications/actions'

const notificationSettingsSchema = z.object({
  // General settings
  notifications_enabled: z.boolean(),
  sound_enabled: z.boolean(),
  show_toasts: z.boolean(),
  master_volume: z.number().min(0).max(1),
  auto_mark_read_delay: z.number().min(1).max(300),
  max_notifications: z.number().min(10).max(1000),

  // Notification type settings
  new_booking_enabled: z.boolean(),
  new_booking_sound: z.boolean(),
  new_booking_toast: z.boolean(),
  new_booking_priority: z.enum(['low', 'medium', 'high', 'critical']),

  vip_booking_enabled: z.boolean(),
  vip_booking_sound: z.boolean(),
  vip_booking_toast: z.boolean(),
  vip_booking_priority: z.enum(['low', 'medium', 'high', 'critical']),

  booking_cancelled_enabled: z.boolean(),
  booking_cancelled_sound: z.boolean(),
  booking_cancelled_toast: z.boolean(),
  booking_cancelled_priority: z.enum(['low', 'medium', 'high', 'critical']),

  booking_updated_enabled: z.boolean(),
  booking_updated_sound: z.boolean(),
  booking_updated_toast: z.boolean(),
  booking_updated_priority: z.enum(['low', 'medium', 'high', 'critical']),

  peak_time_booking_enabled: z.boolean(),
  peak_time_booking_sound: z.boolean(),
  peak_time_booking_toast: z.boolean(),
  peak_time_booking_priority: z.enum(['low', 'medium', 'high', 'critical']),

  customer_message_enabled: z.boolean(),
  customer_message_sound: z.boolean(),
  customer_message_toast: z.boolean(),
  customer_message_priority: z.enum(['low', 'medium', 'high', 'critical']),

  system_alert_enabled: z.boolean(),
  system_alert_sound: z.boolean(),
  system_alert_toast: z.boolean(),
  system_alert_priority: z.enum(['low', 'medium', 'high', 'critical']),

  // Time-based settings
  quiet_hours_enabled: z.boolean(),
  quiet_hours_start: z.string(),
  quiet_hours_end: z.string(),
  quiet_hours_mute_sound: z.boolean(),
  quiet_hours_reduce_toasts: z.boolean(),

  business_hours_only: z.boolean(),
  business_hours_start: z.string(),
  business_hours_end: z.string(),

  // Advanced settings
  group_similar_notifications: z.boolean(),
  persist_critical_notifications: z.boolean(),
  notification_history_days: z.number().min(1).max(30),
})

type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>

const notificationTypes = [
  {
    key: 'new_booking',
    label: 'New Bookings',
    description: 'When customers make new reservations through the website',
    icon: Bell,
    defaultPriority: 'high' as const,
  },
  {
    key: 'vip_booking',
    label: 'VIP Bookings',
    description: 'When VIP customers (10+ bookings) make reservations',
    icon: AlertTriangle,
    defaultPriority: 'critical' as const,
  },
  {
    key: 'booking_cancelled',
    label: 'Booking Cancellations',
    description: 'When customers cancel their reservations',
    icon: Bell,
    defaultPriority: 'high' as const,
  },
  {
    key: 'booking_updated',
    label: 'Booking Updates',
    description: 'When booking details are modified',
    icon: Bell,
    defaultPriority: 'medium' as const,
  },
  {
    key: 'peak_time_booking',
    label: 'Peak Time Bookings',
    description: 'Reservations during busy hours (6-9 PM)',
    icon: Clock,
    defaultPriority: 'medium' as const,
  },
  {
    key: 'customer_message',
    label: 'Customer Messages',
    description: 'Messages and special requests from customers',
    icon: Bell,
    defaultPriority: 'low' as const,
  },
  {
    key: 'system_alert',
    label: 'System Alerts',
    description: 'Important system notifications and errors',
    icon: Settings,
    defaultPriority: 'high' as const,
  },
]

const priorityColors = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

export function NotificationSettingsForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const form = useForm<NotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      notifications_enabled: true,
      sound_enabled: true,
      show_toasts: true,
      master_volume: 0.3,
      auto_mark_read_delay: 10,
      max_notifications: 50,
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
      quiet_hours_mute_sound: true,
      quiet_hours_reduce_toasts: true,
      business_hours_only: false,
      business_hours_start: '09:00',
      business_hours_end: '23:00',
      group_similar_notifications: true,
      persist_critical_notifications: true,
      notification_history_days: 7,
      ...notificationTypes.reduce((acc, type) => ({
        ...acc,
        [`${type.key}_enabled`]: true,
        [`${type.key}_sound`]: type.key !== 'booking_updated' && type.key !== 'customer_message',
        [`${type.key}_toast`]: type.key !== 'customer_message',
        [`${type.key}_priority`]: type.defaultPriority,
      }), {}),
    },
  })

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getNotificationSettings()
        if (settings) {
          // Convert time format from HH:MM:SS to HH:MM for input fields
          const formData = {
            ...settings,
            quiet_hours_start: settings.quiet_hours_start.slice(0, 5),
            quiet_hours_end: settings.quiet_hours_end.slice(0, 5),
            business_hours_start: settings.business_hours_start.slice(0, 5),
            business_hours_end: settings.business_hours_end.slice(0, 5),
          }
          form.reset(formData)
        }
      } catch (error) {
        toast.error('Failed to load notification settings')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [form])

  const onSubmit = async (data: NotificationSettingsForm) => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      
      // Convert form data to FormData object
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.set(key, value.toString())
        } else if (typeof value === 'number') {
          formData.set(key, value.toString())
        } else {
          // For time inputs, ensure format is HH:MM:SS
          if (key.includes('_start') || key.includes('_end')) {
            formData.set(key, `${value}:00`)
          } else {
            formData.set(key, value)
          }
        }
      })

      const result = await updateNotificationSettings(formData)
      
      if (result.success) {
        toast.success('Notification settings saved successfully')
      } else {
        toast.error(result.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save notification settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const result = await resetNotificationSettings()
      
      if (result.success) {
        toast.success('Settings reset to defaults')
        // Reload the settings
        const settings = await getNotificationSettings()
        if (settings) {
          const formData = {
            ...settings,
            quiet_hours_start: settings.quiet_hours_start.slice(0, 5),
            quiet_hours_end: settings.quiet_hours_end.slice(0, 5),
            business_hours_start: settings.business_hours_start.slice(0, 5),
            business_hours_end: settings.business_hours_end.slice(0, 5),
          }
          form.reset(formData)
        }
      } else {
        toast.error(result.error || 'Failed to reset settings')
      }
    } catch (error) {
      toast.error('Failed to reset settings')
    } finally {
      setIsResetting(false)
    }
  }

  const masterVolume = form.watch('master_volume')
  const soundEnabled = form.watch('sound_enabled')
  const notificationsEnabled = form.watch('notifications_enabled')

  if (isLoading) {
    return <div>Loading settings...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Master Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Master Controls
            </CardTitle>
            <CardDescription>
              Global settings that affect all notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="notifications_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Notifications</FormLabel>
                      <FormDescription>
                        Turn all notifications on or off
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sound_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Sounds</FormLabel>
                      <FormDescription>
                        Play audio alerts for notifications
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="show_toasts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Toast Messages</FormLabel>
                      <FormDescription>
                        Display popup notifications
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="master_volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {soundEnabled && masterVolume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      Master Volume ({Math.round(masterVolume * 100)}%)
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.05}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={!soundEnabled || !notificationsEnabled}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Control the volume of all notification sounds
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auto_mark_read_delay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto-mark Read Delay (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={300}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                    <FormDescription>
                      How long before notifications are marked as read
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_notifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Notifications</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={10}
                        max={1000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of notifications to keep
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Configure individual notification types and their behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {notificationTypes.map((type) => (
                <div key={type.key} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <type.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{type.label}</h4>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-8">
                    <FormField
                      control={form.control}
                      name={`${type.key}_enabled` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">Enabled</FormLabel>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                              disabled={!notificationsEnabled}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`${type.key}_sound` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">Sound</FormLabel>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                              disabled={!notificationsEnabled || !soundEnabled || !form.watch(`${type.key}_enabled` as any)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`${type.key}_toast` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">Toast</FormLabel>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                              disabled={!notificationsEnabled || !form.watch(`${type.key}_enabled` as any)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`${type.key}_priority` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!notificationsEnabled || !form.watch(`${type.key}_enabled` as any)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">
                                <Badge className={priorityColors.low}>Low</Badge>
                              </SelectItem>
                              <SelectItem value="medium">
                                <Badge className={priorityColors.medium}>Medium</Badge>
                              </SelectItem>
                              <SelectItem value="high">
                                <Badge className={priorityColors.high}>High</Badge>
                              </SelectItem>
                              <SelectItem value="critical">
                                <Badge className={priorityColors.critical}>Critical</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {type !== notificationTypes[notificationTypes.length - 1] && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time-based Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time-based Settings
            </CardTitle>
            <CardDescription>
              Configure when notifications are active
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quiet Hours */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="quiet_hours_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Quiet Hours</FormLabel>
                        <FormDescription>
                          Reduce notifications during specified hours
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          disabled={!notificationsEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('quiet_hours_enabled') && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quiet_hours_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
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
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="quiet_hours_mute_sound"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mute Sounds</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quiet_hours_reduce_toasts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Reduce Toasts</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Business Hours */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="business_hours_only"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Business Hours Only</FormLabel>
                        <FormDescription>
                          Only show notifications during business hours
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          disabled={!notificationsEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('business_hours_only') && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="business_hours_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="business_hours_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
            <CardDescription>
              Fine-tune notification behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="group_similar_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Group Similar Notifications</FormLabel>
                      <FormDescription>
                        Combine similar notifications to reduce clutter
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="persist_critical_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Persist Critical Notifications</FormLabel>
                      <FormDescription>
                        Keep critical notifications until manually dismissed
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notification_history_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification History (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={!notificationsEnabled}
                      />
                    </FormControl>
                    <FormDescription>
                      How long to keep notification history
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isResetting || isSaving || !notificationsEnabled}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {isResetting ? 'Resetting...' : 'Reset to Defaults'}
          </Button>

          <Button 
            type="submit" 
            disabled={isSaving || !notificationsEnabled}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 