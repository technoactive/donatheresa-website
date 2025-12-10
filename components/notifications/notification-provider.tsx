"use client"

import { createContext, useContext, useEffect, useState, Suspense } from 'react'
import { Notification, notificationManager, NotificationSettings as NotificationSettingsType } from '@/lib/notifications'
import { NotificationCenter } from './notification-center'
import { NotificationToastContainer } from './notification-toast'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAll: () => void
  settings: NotificationSettingsType | null
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
  clearAll: () => {},
  settings: null,
})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null)

  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length

  // Initialize notification manager - simple, no polling, no realtime
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initializeManager = async () => {
      try {
        await notificationManager.ensureInitialized()
        
        // Subscribe to notification changes from the manager
        unsubscribe = notificationManager.subscribe(() => {
          setNotifications([...notificationManager.getNotifications()])
        })

        // Load initial notifications
        setNotifications([...notificationManager.getNotifications()])
        setSettings(notificationManager.getSettings())
      } catch (error) {
        console.error('Failed to initialize NotificationManager:', error)
      }
    }

    initializeManager()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Handlers - call the notification manager directly
  const markAsRead = async (id: string) => {
    await notificationManager.markAsRead(id)
    // Force update local state
    setNotifications([...notificationManager.getNotifications()])
  }

  const markAllAsRead = async () => {
    await notificationManager.markAllAsRead()
    setNotifications([...notificationManager.getNotifications()])
  }

  const dismissNotification = async (id: string) => {
    await notificationManager.dismissNotification(id)
    // Force update local state immediately
    setNotifications([...notificationManager.getNotifications()])
  }

  const clearAll = async () => {
    await notificationManager.clearAll()
    setNotifications([])
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
      }}
    >
      {children}
      <Suspense fallback={null}>
        <NotificationCenter />
        <NotificationToastContainer />
      </Suspense>
    </NotificationContext.Provider>
  )
}
