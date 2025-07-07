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
    const unsubscribeSettings = notificationManager.onSettingsChange((newSettings) => {
      setSettings(newSettings)
    })

    return unsubscribeSettings
  }, [])

  // Subscribe to notifications
  useEffect(() => {
    const unsubscribeNotifications = notificationManager.subscribe((newNotifications) => {
      setNotifications(newNotifications)
    })

    // Initial load
    setNotifications(notificationManager.getNotifications())

    return unsubscribeNotifications
  }, [])

  const markAsRead = useCallback((id: string) => {
    notificationManager.markAsRead(id)
  }, [])

  const markAllAsRead = useCallback(() => {
    notificationManager.markAllAsRead()
  }, [])

  const dismissNotification = useCallback((id: string) => {
    notificationManager.dismissNotification(id)
  }, [])

  const clearAll = useCallback(() => {
    notificationManager.clearAll()
  }, [])

  const refreshSettings = useCallback(async () => {
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