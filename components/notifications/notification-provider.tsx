"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { notificationManager, type Notification, type NotificationSettings } from '@/lib/notifications'

interface NotificationContextType {
  notifications: Notification[]
  settings: NotificationSettings | null
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAll: () => void
  refreshSettings: () => Promise<void>
  isNotificationCenterOpen: boolean
  setNotificationCenterOpen: (open: boolean) => void
}

interface NotificationProviderProps {
  children: React.ReactNode
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false)

  // Calculate unread count directly from notifications
  const unreadCount = notifications.filter(n => !n.read).length

  // Load settings and subscribe to changes
  useEffect(() => {
    console.log('🎛️ Setting up notification settings subscription...');
    
    const unsubscribeSettings = notificationManager.onSettingsChange((newSettings) => {
      console.log('📊 Notification settings updated:', {
        enabled: newSettings.notifications_enabled,
        sound: newSettings.sound_enabled,
        toasts: newSettings.show_toasts
      });
      setSettings(newSettings)
    })

    return unsubscribeSettings
  }, [])

  // Subscribe to notifications
  useEffect(() => {
    console.log('🔔 Setting up notification subscription...');
    
    let unsubscribe: (() => void) | null = null;
    let mounted = true;
    
    const setupSubscription = async () => {
      try {
        // Ensure NotificationManager is fully initialized
        await notificationManager.ensureInitialized()
        console.log('✅ NotificationManager initialized');
        
        // Only proceed if component is still mounted
        if (!mounted) return;
        
        // Subscribe to notifications
        unsubscribe = notificationManager.subscribe((newNotifications) => {
          console.log('📥 Notifications updated in Provider:', newNotifications.length, 'total');
          console.log('📬 Unread notifications in Provider:', newNotifications.filter(n => !n.read).length);
          console.log('🔍 First few notifications:', newNotifications.slice(0, 3).map(n => ({
            id: n.id,
            title: n.title,
            read: n.read
          })));
          
          // Only update state if component is still mounted
          if (mounted) {
            setNotifications(newNotifications)
          }
        })

        // Get initial notifications after initialization
        const initialNotifications = notificationManager.getNotifications();
        console.log('🔄 Loading initial notifications:', initialNotifications.length);
        console.log('📬 Initial unread:', initialNotifications.filter(n => !n.read).length);
        
        if (mounted) {
          setNotifications(initialNotifications)
        }
      } catch (error) {
        console.error('❌ Error initializing NotificationManager:', error);
      }
    }

    setupSubscription();

    return () => {
      console.log('🧹 Cleaning up notification subscription');
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [])

  // Log state changes
  useEffect(() => {
    console.log('📈 Notification provider state:', {
      totalNotifications: notifications.length,
      unreadCount,
      settingsLoaded: settings !== null,
      centerOpen: isNotificationCenterOpen
    });
  }, [notifications, unreadCount, settings, isNotificationCenterOpen]);

  const markAsRead = useCallback((id: string) => {
    console.log('✅ Provider marking as read:', id);
    notificationManager.markAsRead(id)
  }, [])

  const markAllAsRead = useCallback(() => {
    console.log('✅ Provider marking all as read');
    notificationManager.markAllAsRead()
  }, [])

  const dismissNotification = useCallback((id: string) => {
    console.log('❌ Provider dismissing notification:', id);
    notificationManager.dismissNotification(id)
  }, [])

  const clearAll = useCallback(() => {
    console.log('🗑️ Provider clearing all notifications');
    notificationManager.clearAll()
  }, [])

  const refreshSettings = useCallback(async () => {
    console.log('🔄 Provider refreshing settings...');
    await notificationManager.refreshSettings()
  }, [])

  const value: NotificationContextType = {
    notifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    refreshSettings,
    isNotificationCenterOpen,
    setNotificationCenterOpen,
  }

  console.log('🎛️ Notification provider rendering with:', {
    notifications: notifications.length,
    unread: unreadCount,
    hasSettings: !!settings
  });

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 