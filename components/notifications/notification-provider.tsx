"use client"

import { createContext, useContext, useEffect, useState, useRef, Suspense } from 'react'
import { Notification, notificationManager, NotificationSettings as NotificationSettingsType } from '@/lib/notifications'
import { NotificationCenter } from './notification-center'
import { NotificationToastContainer, NotificationToaster } from './notification-toast'
import { createClient } from '@/lib/supabase/client'
import { playNotificationSound } from '@/lib/notification-sounds'
import { RealtimeChannel } from '@supabase/supabase-js'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAll: () => void
  settings: NotificationSettingsType | null
  isNotificationCenterOpen: boolean
  setNotificationCenterOpen: (open: boolean) => void
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
  clearAll: () => {},
  settings: null,
  isNotificationCenterOpen: false,
  setNotificationCenterOpen: () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null)
  const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false)
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const localNotificationIdsRef = useRef<Set<string>>(new Set())
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckedRef = useRef<Date>(new Date())

  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length

  // Initialize notification manager
  useEffect(() => {
    const initializeManager = async () => {
      try {
        await notificationManager.ensureInitialized()
        
        // Subscribe to notification changes
        const unsubscribe = notificationManager.subscribe(() => {
          setNotifications([...notificationManager.getNotifications()])
        })

        // Load initial notifications
        setNotifications([...notificationManager.getNotifications()])
        setSettings(notificationManager.getSettings())

        return unsubscribe
      } catch (error) {
        console.error('Failed to initialize NotificationManager:', error)
      }
    }

    const unsubscribePromise = initializeManager()

    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe()
      })
    }
  }, [])

  // Polling mechanism to check for new notifications periodically
  useEffect(() => {
    const pollForNotifications = async () => {
      try {
        const { data: newNotifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', 'admin')
          .eq('read', false)
          .gt('created_at', lastCheckedRef.current.toISOString())
          .order('created_at', { ascending: false })

        if (error) return

        if (newNotifications && newNotifications.length > 0) {
          // Process each new notification
          for (const dbNotification of newNotifications) {
            // Skip if we already have this notification
            if (notificationManager.getNotifications().some(n => n.id === dbNotification.id)) {
              continue
            }

            const notification: Notification = {
              id: dbNotification.id,
              type: dbNotification.type,
              title: dbNotification.title,
              message: dbNotification.message,
              priority: dbNotification.priority,
              timestamp: new Date(dbNotification.timestamp),
              read: dbNotification.read,
              dismissed: dbNotification.dismissed,
              actionUrl: dbNotification.action_url,
              actionLabel: dbNotification.action_label,
              data: {
                bookingId: dbNotification.booking_id,
                contactId: dbNotification.contact_id
              }
            }

            // Add to notification manager
            notificationManager.addNotificationFromDatabase(notification)

            // Play sound if enabled
            if (notificationManager.shouldPlaySound(notification.type)) {
              const volume = notificationManager.getMasterVolume()
              await playNotificationSound(notification.type, volume)
            }
          }

          // Update last checked time
          lastCheckedRef.current = new Date()
        }
      } catch (error) {
        // Silent fail for polling
      }
    }

    // Start polling every 3 seconds (less aggressive)
    pollingIntervalRef.current = setInterval(pollForNotifications, 3000)
    
    // Initial poll
    pollForNotifications()

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [supabase])

  // Real-time subscription setup (backup to polling)
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      try {
        channelRef.current = supabase
          .channel('notification_changes')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'notifications',
              filter: 'user_id=eq.admin'
            },
            async (payload) => {
              const dbNotification = payload.new as any
              
              // Skip if this is a locally created notification
              if (localNotificationIdsRef.current.has(dbNotification.id)) {
                localNotificationIdsRef.current.delete(dbNotification.id)
                return
              }

              const notification: Notification = {
                id: dbNotification.id,
                type: dbNotification.type,
                title: dbNotification.title,
                message: dbNotification.message,
                priority: dbNotification.priority,
                timestamp: new Date(dbNotification.timestamp),
                read: dbNotification.read,
                dismissed: dbNotification.dismissed,
                actionUrl: dbNotification.action_url,
                actionLabel: dbNotification.action_label,
                data: {
                  bookingId: dbNotification.booking_id,
                  contactId: dbNotification.contact_id
                }
              }

              notificationManager.addNotificationFromDatabase(notification)

              // Play sound if enabled
              if (notificationManager.shouldPlaySound(notification.type)) {
                const volume = notificationManager.getMasterVolume()
                await playNotificationSound(notification.type, volume)
              }
            }
          )
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'notifications',
              filter: 'user_id=eq.admin'
            },
            (payload) => {
              const updated = payload.new as any
              notificationManager.updateNotificationFromDatabase(updated.id, {
                read: updated.read,
                dismissed: updated.dismissed
              })
            }
          )
          .subscribe()

      } catch (error) {
        // Silent fail - polling will handle it
      }
    }

    setupRealtimeSubscription()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [supabase])

  // Track locally created notifications
  useEffect(() => {
    const originalAddNotification = notificationManager.addNotification.bind(notificationManager);
    
    notificationManager.addNotification = function(notification) {
      const result = originalAddNotification(notification);
      if (result) {
        // Track this notification ID as locally created
        const notifications = notificationManager.getNotifications();
        const latestNotification = notifications[0];
        if (latestNotification) {
          localNotificationIdsRef.current.add(latestNotification.id);
        }
      }
      return result;
    };

    return () => {
      notificationManager.addNotification = originalAddNotification;
    };
  }, []);

  // Handlers
  const markAsRead = (id: string) => {
    notificationManager.markAsRead(id)
  }

  const markAllAsRead = () => {
    notificationManager.markAllAsRead()
  }

  const dismissNotification = (id: string) => {
    notificationManager.dismissNotification(id)
  }

  const clearAll = () => {
    notificationManager.clearAll()
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll,
        settings,
        isNotificationCenterOpen,
        setNotificationCenterOpen,
      }}
    >
      {children}
      <Suspense fallback={null}>
        <NotificationCenter />
        <NotificationToastContainer />
        <NotificationToaster />
      </Suspense>
    </NotificationContext.Provider>
  )
} 