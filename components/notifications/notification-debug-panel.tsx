"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from './notification-provider'
import { notificationManager } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/client'

export function NotificationDebugPanel() {
  const { notifications, settings, unreadCount } = useNotifications()
  const [realtimeStatus, setRealtimeStatus] = useState<string>('unknown')
  const [lastTest, setLastTest] = useState<string>('')

  // Test real-time connection
  const testRealtime = () => {
    const supabase = createClient()
    const channel = supabase
      .channel('debug_test')
      .subscribe((status) => {
        setRealtimeStatus(status)
        if (status === 'SUBSCRIBED') {
          setLastTest('✅ Real-time working')
          setTimeout(() => channel.unsubscribe(), 2000)
        } else if (status === 'CHANNEL_ERROR') {
          setLastTest('❌ Real-time failed')
        }
      })
  }

  // Test notification creation
  const testNotification = () => {
    const testNotif = {
      type: 'new_booking' as const,
      title: '🧪 Test Notification',
      message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
      priority: 'high' as const,
      dismissed: false
    }
    
    const wasAdded = notificationManager.addNotification(testNotif)
    setLastTest(wasAdded ? '✅ Test notification created' : '❌ Notification blocked')
  }

  // Test sound
  const testSound = async () => {
    setLastTest('🔊 Testing sound...')
    try {
      const audio = new Audio('/sounds/new-booking.mp3')
      audio.volume = 0.3
      await audio.play()
      setLastTest('✅ Sound played')
    } catch (error) {
      setLastTest('❌ Sound failed: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  // Check notification permissions
  const checkPermissions = async () => {
    if ('Notification' in window) {
      const permission = Notification.permission
      setLastTest(`Browser notifications: ${permission}`)
      
      if (permission === 'default') {
        const result = await Notification.requestPermission()
        setLastTest(`Permission requested: ${result}`)
      }
    } else {
      setLastTest('❌ Browser notifications not supported')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Notification Debug Panel
          <Badge variant={settings?.notifications_enabled ? 'default' : 'secondary'}>
            {settings?.notifications_enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-sm font-medium">Notifications</div>
            <div className="text-lg">{notifications.length} total</div>
            <div className="text-sm text-slate-600">{unreadCount} unread</div>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-sm font-medium">Settings</div>
            <div className="text-sm">
              Sound: {settings?.sound_enabled ? '✅' : '❌'}<br/>
              Toasts: {settings?.show_toasts ? '✅' : '❌'}<br/>
              New Bookings: {settings?.new_booking_enabled ? '✅' : '❌'}
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="p-3 border rounded">
          <div className="text-sm font-medium mb-2">Real-time Status</div>
          <Badge variant={realtimeStatus === 'SUBSCRIBED' ? 'default' : 'secondary'}>
            {realtimeStatus}
          </Badge>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={testRealtime} variant="outline" size="sm">
            Test Real-time
          </Button>
          <Button onClick={testNotification} variant="outline" size="sm">
            Test Notification
          </Button>
          <Button onClick={testSound} variant="outline" size="sm">
            Test Sound
          </Button>
          <Button onClick={checkPermissions} variant="outline" size="sm">
            Check Permissions
          </Button>
        </div>

        {/* Last Test Result */}
        {lastTest && (
          <div className="p-3 bg-blue-50 rounded text-sm">
            <strong>Last Test:</strong> {lastTest}
          </div>
        )}

        {/* Recent Notifications */}
        <div>
          <div className="text-sm font-medium mb-2">Recent Notifications</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className="text-xs p-2 bg-slate-50 rounded">
                <div className="font-medium">{notif.title}</div>
                <div className="text-slate-600">{notif.message}</div>
                <div className="text-slate-500">{notif.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-sm text-slate-500 italic">No notifications yet</div>
            )}
          </div>
        </div>

        {/* Console Logs Helper */}
        <div className="text-xs text-slate-500 p-2 bg-yellow-50 rounded">
          💡 Check browser console (F12) for detailed notification logs
        </div>
      </CardContent>
    </Card>
  )
} 