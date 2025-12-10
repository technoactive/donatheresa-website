"use client"

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useNotifications } from './notification-provider'
import { Notification, NotificationSettings } from '@/lib/notifications'
import { 
  CalendarCheck, 
  Crown, 
  XCircle, 
  Pencil, 
  Flame, 
  MessageSquare, 
  AlertTriangle,
  Bell,
  ExternalLink,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Get the appropriate icon component for notification type
function getNotificationIcon(type: Notification['type']) {
  const iconClass = "h-5 w-5"
  switch (type) {
    case 'new_booking':
      return <CalendarCheck className={cn(iconClass, "text-emerald-600")} />
    case 'vip_booking':
      return <Crown className={cn(iconClass, "text-amber-500")} />
    case 'booking_cancelled':
      return <XCircle className={cn(iconClass, "text-red-500")} />
    case 'booking_updated':
      return <Pencil className={cn(iconClass, "text-blue-500")} />
    case 'peak_time_booking':
      return <Flame className={cn(iconClass, "text-orange-500")} />
    case 'customer_message':
      return <MessageSquare className={cn(iconClass, "text-purple-500")} />
    case 'system_alert':
      return <AlertTriangle className={cn(iconClass, "text-yellow-600")} />
    default:
      return <Bell className={cn(iconClass, "text-slate-500")} />
  }
}

// Get priority-based styling
function getPriorityStyle(priority: Notification['priority']) {
  switch (priority) {
    case 'critical':
      return {
        className: 'border-red-200 bg-red-50',
        duration: 10000, // 10 seconds for critical (not infinite to prevent blocking)
      }
    case 'high':
      return {
        className: 'border-amber-200 bg-amber-50',
        duration: 8000,
      }
    case 'medium':
      return {
        className: 'border-blue-200 bg-blue-50',
        duration: 6000,
      }
    case 'low':
    default:
      return {
        className: 'border-slate-200 bg-white',
        duration: 4000,
      }
  }
}

// Main toast container using Sonner
export function NotificationToastContainer() {
  const router = useRouter()
  const { notifications, markAsRead, dismissNotification, settings } = useNotifications()
  
  // Track which notifications we've already seen/shown
  const shownNotificationsRef = useRef<Set<string>>(new Set())
  
  // Track initial notification IDs on first load - we won't show toasts for these
  const initialNotificationIdsRef = useRef<Set<string> | null>(null)
  
  // Track if component has initialized
  const [isInitialized, setIsInitialized] = useState(false)

  // Handle navigation
  const handleNavigate = useCallback((url: string, notificationId: string) => {
    markAsRead(notificationId)
    toast.dismiss(notificationId)
    router.push(url)
  }, [router, markAsRead])

  // Handle acknowledge
  const handleAcknowledge = useCallback((notificationId: string) => {
    markAsRead(notificationId)
    toast.dismiss(notificationId)
  }, [markAsRead])

  // Initialize: capture which notifications already exist on page load
  useEffect(() => {
    if (notifications.length > 0 && initialNotificationIdsRef.current === null) {
      // First time we have notifications - record all their IDs
      // We won't show toasts for these (they existed before page load)
      initialNotificationIdsRef.current = new Set(notifications.map(n => n.id))
      
      // Also add them to shown set so they never trigger a toast
      notifications.forEach(n => {
        shownNotificationsRef.current.add(n.id)
      })
      
      // Mark as initialized after a short delay to allow initial notifications to settle
      setTimeout(() => {
        setIsInitialized(true)
      }, 1000)
    }
  }, [notifications])

  // Show toasts only for NEW notifications (ones that arrive after initialization)
  useEffect(() => {
    // Don't show any toasts until we're fully initialized
    if (!isInitialized || !settings) return

    // Filter to only truly new notifications
    const newNotifications = notifications.filter(notification => {
      // Skip if already shown
      if (shownNotificationsRef.current.has(notification.id)) return false
      
      // Skip if it was in the initial set (existed on page load)
      if (initialNotificationIdsRef.current?.has(notification.id)) return false
      
      // Skip if dismissed
      if (notification.dismissed) return false
      
      // Check user settings
      const shouldShowToast = settings[`${notification.type}_toast` as keyof typeof settings] as boolean
      const isGloballyEnabled = settings.show_toasts
      
      return isGloballyEnabled && shouldShowToast
    })

    // Show toast for each new notification
    newNotifications.forEach(notification => {
      // Mark as shown immediately to prevent duplicates
      shownNotificationsRef.current.add(notification.id)
      
      const priorityStyle = getPriorityStyle(notification.priority)
      const staticSettings = NotificationSettings[notification.type]
      const showAcknowledge = staticSettings.requiresAction && !notification.read
      const hasAction = notification.actionUrl || showAcknowledge

      toast.custom(
        () => (
          <div 
            className={cn(
              "w-full max-w-sm rounded-xl border p-4 shadow-lg",
              "bg-white",
              "transition-all duration-200 ease-out",
              notification.actionUrl && "cursor-pointer hover:shadow-xl",
              priorityStyle.className
            )}
            onClick={(e) => {
              if (notification.actionUrl) {
                e.stopPropagation()
                handleNavigate(notification.actionUrl, notification.id)
              }
            }}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-slate-900 truncate">
                    {notification.title}
                  </h4>
                  {notification.priority === 'critical' && (
                    <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                      Urgent
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2">
                  {notification.message}
                </p>
                
                {hasAction && (
                  <div className="flex items-center gap-2 mt-3">
                    {notification.actionUrl && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNavigate(notification.actionUrl!, notification.id)
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </button>
                    )}
                    
                    {showAcknowledge && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAcknowledge(notification.id)
                        }}
                      >
                        <Check className="w-3 h-3" />
                        OK
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
        {
          id: notification.id,
          duration: priorityStyle.duration,
          position: 'bottom-right',
          dismissible: true,
        }
      )
    })
  }, [notifications, settings, isInitialized, handleNavigate, handleAcknowledge])

  return null
}
