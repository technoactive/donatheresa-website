"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Volume2, VolumeX, Bell, Settings } from 'lucide-react'
import { 
  notificationManager, 
  type NotificationType 
} from '@/lib/notifications'
import { testNotificationSound, soundDescriptions } from '@/lib/notification-sounds'
import { useNotifications } from './notification-provider'

const demoNotifications = [
  {
    type: 'new_booking' as const,
    label: 'New Booking',
    description: 'Regular customer booking',
    example: () => ({
      type: 'new_booking' as const,
      title: 'New Booking',
      message: 'John Doe - 4 guests on Today at 7:30 PM',
      priority: 'high' as const,
      customerName: 'John Doe',
      bookingId: 'demo-1',
      actionUrl: '/dashboard/bookings?highlight=demo-1'
    }),
  },
  {
    type: 'vip_booking' as const,
    label: 'VIP Booking', 
    description: 'VIP customer booking',
    example: () => ({
      type: 'vip_booking' as const,
      title: '🌟 VIP Booking',
      message: 'Sarah Johnson - 2 guests on Today at 8:00 PM',
      priority: 'critical' as const,
      customerName: 'Sarah Johnson',
      bookingId: 'demo-2',
      actionUrl: '/dashboard/bookings?highlight=demo-2'
    }),
  },
  {
    type: 'peak_time_booking' as const,
    label: 'Peak Time Booking',
    description: 'Booking during busy hours',
    example: () => ({
      type: 'peak_time_booking' as const,
      title: '🔥 Peak Time Booking',
      message: 'Mike Wilson - 6 guests on Today at 7:00 PM',
      priority: 'medium' as const,
      customerName: 'Mike Wilson',
      bookingId: 'demo-3',
      actionUrl: '/dashboard/bookings?highlight=demo-3'
    }),
  },
  {
    type: 'booking_cancelled' as const,
    label: 'Booking Cancelled',
    description: 'Customer cancellation',
    example: () => ({
      type: 'booking_cancelled' as const,
      title: 'Booking Cancelled',
      message: 'Emma Davis\'s reservation for Today at 6:30 PM has been cancelled',
      priority: 'high' as const,
      customerName: 'Emma Davis',
      bookingId: 'demo-4',
      actionUrl: '/dashboard/bookings'
    }),
  },
  {
    type: 'booking_updated' as const,
    label: 'Booking Updated',
    description: 'Reservation changes',
    example: () => ({
      type: 'booking_updated' as const,
      title: 'Booking Updated',
      message: 'Tom Brown changed party size from 2 to 4 guests',
      priority: 'medium' as const,
      customerName: 'Tom Brown',
      bookingId: 'demo-5',
    }),
  },
  {
    type: 'customer_message' as const,
    label: 'Customer Message',
    description: 'Special requests or notes',
    example: () => ({
      type: 'customer_message' as const,
      title: 'Customer Message',
      message: 'Special dietary requirements: Gluten-free options needed',
      priority: 'low' as const,
      customerName: 'Lisa Chen',
    }),
  },
  {
    type: 'system_alert' as const,
    label: 'System Alert',
    description: 'Important system notifications',
    example: () => ({
      type: 'system_alert' as const,
      title: 'System Update',
      message: 'Booking system will restart in 5 minutes',
      priority: 'high' as const
    }),
  },
]

export function NotificationDemo() {
  const [isTestingSound, setIsTestingSound] = useState(false)
  const [currentTestType, setCurrentTestType] = useState<NotificationType | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { settings, refreshSettings } = useNotifications()

  // Ensure component is mounted before showing dynamic content
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSendTestNotification = async (demo: typeof demoNotifications[0]) => {
    const notification = demo.example()
    const wasAdded = notificationManager.addNotification(notification)
    
    // Sound will be played automatically by the notification system if enabled in settings
  }

  const handleTestSound = async (type: NotificationType) => {
    setIsTestingSound(true)
    setCurrentTestType(type)
    
    try {
      const volume = notificationManager.getMasterVolume()
      await testNotificationSound(type, volume)
    } catch (error) {
      console.error('Error testing sound:', error)
    } finally {
      setIsTestingSound(false)
      setCurrentTestType(null)
    }
  }

  const handleRefreshSettings = async () => {
    await refreshSettings()
  }

  const getNotificationStatus = (type: NotificationType) => {
    if (!isMounted || !settings) {
      return { enabled: true, sound: true, toast: true, priority: 'medium' }
    }
    
    return {
      enabled: settings[`${type}_enabled` as keyof typeof settings] as boolean,
      sound: settings[`${type}_sound` as keyof typeof settings] as boolean,
      toast: settings[`${type}_toast` as keyof typeof settings] as boolean,
      priority: settings[`${type}_priority` as keyof typeof settings] as string,
    }
  }

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification System Demo
        </CardTitle>
        <CardDescription>
          Test different notification types and their sounds. Configure settings in the Notification Settings page.
        </CardDescription>
        
        <div className="flex items-center gap-4 pt-4">
          <Button onClick={handleRefreshSettings} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Refresh Settings
          </Button>
          
          {isMounted && settings && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Master Settings:</span>
              {settings.notifications_enabled ? (
                <Badge variant="default">Enabled</Badge>
              ) : (
                <Badge variant="secondary">Disabled</Badge>
              )}
              {settings.sound_enabled ? (
                <div className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3" />
                  <span>{Math.round(settings.master_volume * 100)}%</span>
                </div>
              ) : (
                <VolumeX className="h-3 w-3" />
              )}
            </div>
          )}
          
          {!isMounted && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Loading settings...</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {demoNotifications.map((demo) => {
            const status = getNotificationStatus(demo.type)
            const isTesting = isTestingSound && currentTestType === demo.type
            
            return (
              <div key={demo.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{demo.label}</h3>
                    <div className="flex items-center gap-2">
                      {isMounted ? (
                        <>
                          {status.enabled ? (
                            <Badge variant="default" className="text-xs">Enabled</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Disabled</Badge>
                          )}
                          <Badge className={`text-xs ${priorityColors[status.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                            {status.priority}
                          </Badge>
                          {status.sound && (
                            <Volume2 className="h-3 w-3 text-muted-foreground" />
                          )}
                          {status.toast && (
                            <Bell className="h-3 w-3 text-muted-foreground" />
                          )}
                        </>
                      ) : (
                        <>
                          <Badge variant="default" className="text-xs">Enabled</Badge>
                          <Badge className="text-xs bg-blue-100 text-blue-700">medium</Badge>
                          <Volume2 className="h-3 w-3 text-muted-foreground" />
                          <Bell className="h-3 w-3 text-muted-foreground" />
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{demo.description}</p>
                  {soundDescriptions[demo.type] && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Sound: {soundDescriptions[demo.type]}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestSound(demo.type)}
                    disabled={isTestingSound || (isMounted && (!status.enabled || !status.sound))}
                  >
                    {isTesting ? 'Playing...' : 'Test Sound'}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleSendTestNotification(demo)}
                    disabled={isMounted && !status.enabled}
                  >
                    Send Test
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Settings Status</h3>
          {isMounted && settings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Notifications:</span>
                  <Badge variant={settings.notifications_enabled ? "default" : "secondary"}>
                    {settings.notifications_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sound:</span>
                  <Badge variant={settings.sound_enabled ? "default" : "secondary"}>
                    {settings.sound_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Toasts:</span>
                  <Badge variant={settings.show_toasts ? "default" : "secondary"}>
                    {settings.show_toasts ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Master Volume:</span>
                  <span>{Math.round(settings.master_volume * 100)}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Quiet Hours:</span>
                  <Badge variant={settings.quiet_hours_enabled ? "default" : "secondary"}>
                    {settings.quiet_hours_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Business Hours Only:</span>
                  <Badge variant={settings.business_hours_only ? "default" : "secondary"}>
                    {settings.business_hours_only ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Max Notifications:</span>
                  <span>{settings.max_notifications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-read Delay:</span>
                  <span>{settings.auto_mark_read_delay}s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Notifications:</span>
                  <Badge variant="default">Loading...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sound:</span>
                  <Badge variant="default">Loading...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Toasts:</span>
                  <Badge variant="default">Loading...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Master Volume:</span>
                  <span>30%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Quiet Hours:</span>
                  <Badge variant="secondary">Loading...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Business Hours Only:</span>
                  <Badge variant="secondary">Loading...</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Max Notifications:</span>
                  <span>50</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-read Delay:</span>
                  <span>10s</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Click "Send Test" to create a test notification (only works if that type is enabled)</li>
            <li>Click "Test Sound" to preview the notification sound</li>
            <li>Go to Settings → Notifications to customize your preferences</li>
            <li>Real notifications will respect your settings for sound, toasts, quiet hours, etc.</li>
            <li>VIP notifications have special sounds and higher priority</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 