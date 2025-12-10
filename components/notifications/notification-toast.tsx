"use client"

import React, { useEffect, useRef, useCallback } from 'react'
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
        duration: Infinity,
      }
    case 'high':
      return {
        className: 'border-amber-200 bg-amber-50',
        duration: 15000,
      }
    case 'medium':
      return {
        className: 'border-blue-200 bg-blue-50',
        duration: 8000,
      }
    case 'low':
    default:
      return {
        className: 'border-slate-200 bg-white',
        duration: 5000,
      }
  }
}

// Main toast container using Sonner
export function NotificationToastContainer() {
  const router = useRouter()
  const { notifications, markAsRead, dismissNotification, settings } = useNotifications()
  const shownNotificationsRef = useRef<Set<string>>(new Set())

  // Handle navigation - using useCallback to ensure stable reference
  const handleNavigate = useCallback((url: string, notificationId: string) => {
    markAsRead(notificationId)
    toast.dismiss(notificationId)
    // Use router.push for client-side navigation
    router.push(url)
  }, [router, markAsRead])

  // Handle acknowledge
  const handleAcknowledge = useCallback((notificationId: string) => {
    markAsRead(notificationId)
    toast.dismiss(notificationId)
  }, [markAsRead])

  // Monitor for new notifications and show them as Sonner toasts
  useEffect(() => {
    if (!settings) return

    const newNotifications = notifications.filter(notification => {
      const shouldShowToast = settings[`${notification.type}_toast` as keyof typeof settings] as boolean
      const isGloballyEnabled = settings.show_toasts
      
      const shouldShow = (
        isGloballyEnabled &&
        shouldShowToast && 
        !notification.dismissed &&
        !shownNotificationsRef.current.has(notification.id)
      )
      
      return shouldShow
    })

    // Show each new notification as a Sonner toast
    newNotifications.forEach(notification => {
      shownNotificationsRef.current.add(notification.id)
      
      const priorityStyle = getPriorityStyle(notification.priority)
      const staticSettings = NotificationSettings[notification.type]
      const showAcknowledge = staticSettings.requiresAction && !notification.read
      const hasAction = notification.actionUrl || showAcknowledge

      toast.custom(
        () => (
          <div 
            className={cn(
              "w-full max-w-md rounded-xl border p-4 shadow-lg cursor-pointer",
              "transition-all duration-200 ease-out",
              "hover:shadow-xl hover:scale-[1.01]",
              priorityStyle.className
            )}
            onClick={(e) => {
              // Make entire toast clickable if there's an action URL
              if (notification.actionUrl) {
                e.stopPropagation()
                handleNavigate(notification.actionUrl, notification.id)
              }
            }}
          >
            <div className="flex items-start gap-3 w-full">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              {/* Content */}
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
                  {notification.priority === 'high' && (
                    <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                      Important
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 mb-1">
                  {notification.message}
                </p>
                
                {/* Action buttons */}
                {hasAction && (
                  <div className="flex items-center gap-2 mt-3">
                    {notification.actionUrl && (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
                          "bg-slate-900 text-white hover:bg-slate-800",
                          "transition-colors duration-150",
                          "focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNavigate(notification.actionUrl!, notification.id)
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {notification.actionLabel || 'View Booking'}
                      </button>
                    )}
                    
                    {showAcknowledge && (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
                          "bg-emerald-600 text-white hover:bg-emerald-700",
                          "transition-colors duration-150",
                          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAcknowledge(notification.id)
                        }}
                      >
                        <Check className="w-3 h-3" />
                        Acknowledge
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
          onDismiss: () => {
            shownNotificationsRef.current.delete(notification.id)
          },
          onAutoClose: () => {
            shownNotificationsRef.current.delete(notification.id)
          },
        }
      )
    })
  }, [notifications, settings, markAsRead, dismissNotification, handleNavigate, handleAcknowledge])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shownNotificationsRef.current.clear()
    }
  }, [])

  return null
}
