"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from './notification-provider'
import { notificationManager } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/client'

export function NotificationDebugger() {
  const { notifications, settings } = useNotifications()
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [realtimeStatus, setRealtimeStatus] = useState<string>('unknown')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('unknown')

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]) // Keep last 20 logs
  }

  // Test real-time connection
  const testRealtimeConnection = () => {
    addLog('🔄 Testing real-time connection...')
    
    const supabase = createClient()
    const channel = supabase
      .channel('debug_test')
      .subscribe((status) => {
        addLog(`📡 Real-time status: ${status}`)
        setRealtimeStatus(status)
        
        if (status === 'SUBSCRIBED') {
          addLog('✅ Real-time connection working')
          setTimeout(() => {
            channel.unsubscribe()
            addLog('🔌 Test channel unsubscribed')
          }, 2000)
        }
      })
  }

  // Test booking subscription
  const testBookingSubscription = () => {
    addLog('📋 Testing booking subscription...')
    
    const supabase = createClient()
    const channel = supabase
      .channel('debug_booking_test')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        (payload: any) => {
          const id = payload.new?.id || payload.old?.id || 'unknown'
          addLog(`🆕 Booking event received: ${payload.eventType} - ${id}`)
        }
      )
      .subscribe((status) => {
        addLog(`📋 Booking subscription status: ${status}`)
        setSubscriptionStatus(status)
        
        if (status === 'SUBSCRIBED') {
          addLog('✅ Booking subscription working')
        }
      })

    // Clean up after 10 seconds
    setTimeout(() => {
      channel.unsubscribe()
      addLog('📋 Booking test subscription unsubscribed')
    }, 10000)
  }

  // Test notification creation
  const testNotificationCreation = () => {
    addLog('🔔 Testing notification creation...')
    
    const testNotification = {
      type: 'new_booking' as const,
      title: 'Test Notification',
      message: 'This is a test notification to verify the notification system is working.',
      priority: 'high' as const,
      actionUrl: '/dashboard/bookings',
      actionLabel: 'View Bookings',
      dismissed: false
    }

    const wasAdded = notificationManager.addNotification(testNotification)
    addLog(`🔔 Test notification added: ${wasAdded}`)
    
    if (!wasAdded) {
      addLog('❌ Notification was not added - check settings or filters')
    }
  }

  // Check notification settings
  const checkSettings = () => {
    addLog('⚙️ Checking notification settings...')
    
    if (!settings) {
      addLog('❌ No notification settings loaded')
      return
    }

    addLog(`📊 Settings: enabled=${settings.notifications_enabled}, toasts=${settings.show_toasts}`)
    addLog(`📊 New booking: enabled=${settings.new_booking_enabled}, toast=${settings.new_booking_toast}`)
    addLog(`📊 VIP booking: enabled=${settings.vip_booking_enabled}, toast=${settings.vip_booking_toast}`)
  }

  useEffect(() => {
    addLog('🎛️ Notification debugger initialized')
    addLog(`📊 Current notifications: ${notifications.length}`)
    addLog(`⚙️ Settings loaded: ${settings ? 'Yes' : 'No'}`)
  }, [])

  useEffect(() => {
    addLog(`📥 Notifications updated: ${notifications.length} total`)
  }, [notifications.length])

  useEffect(() => {
    if (settings) {
      addLog(`⚙️ Settings updated: notifications=${settings.notifications_enabled}`)
    }
  }, [settings])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Notification System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Notifications:</span>
              <Badge variant="outline" className="ml-2">{notifications.length}</Badge>
            </div>
            <div>
              <span className="font-medium">Unread:</span>
              <Badge variant="outline" className="ml-2">
                {notifications.filter(n => !n.read).length}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Settings Loaded:</span>
              <Badge variant={settings ? "default" : "destructive"} className="ml-2">
                {settings ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Notifications Enabled:</span>
              <Badge variant={settings?.notifications_enabled ? "default" : "destructive"} className="ml-2">
                {settings?.notifications_enabled ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Real-time Status:</span>
              <Badge variant={realtimeStatus === 'SUBSCRIBED' ? "default" : "secondary"} className="ml-2">
                {realtimeStatus}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Booking Subscription:</span>
              <Badge variant={subscriptionStatus === 'SUBSCRIBED' ? "default" : "secondary"} className="ml-2">
                {subscriptionStatus}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={testRealtimeConnection} size="sm" variant="outline">
              Test Real-time
            </Button>
            <Button onClick={testBookingSubscription} size="sm" variant="outline">
              Test Booking Sub
            </Button>
            <Button onClick={testNotificationCreation} size="sm" variant="outline">
              Test Notification
            </Button>
            <Button onClick={checkSettings} size="sm" variant="outline">
              Check Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 Debug Logs
            <Button 
              onClick={() => setDebugLogs([])} 
              size="sm" 
              variant="ghost"
              className="text-xs"
            >
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 rounded-md p-3 max-h-64 overflow-y-auto">
            {debugLogs.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No debug logs yet...</p>
            ) : (
              <div className="space-y-1">
                {debugLogs.map((log, index) => (
                  <div key={index} className="text-xs font-mono text-slate-700">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>📋 Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No notifications found</p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{notification.type}</Badge>
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-slate-600">{notification.message}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={notification.read ? "secondary" : "default"}>
                      {notification.read ? "Read" : "Unread"}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 