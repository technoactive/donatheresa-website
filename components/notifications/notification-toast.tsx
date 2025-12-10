"use client"

import React, { useEffect, useRef } from 'react'
import { toast, Toaster } from 'sonner'
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
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
        duration: Infinity, // Persist until dismissed
      }
    case 'high':
      return {
        className: 'border-amber-200 bg-amber-50',
        duration: 15000, // 15 seconds
      }
    case 'medium':
      return {
        className: 'border-blue-200 bg-blue-50',
        duration: 8000, // 8 seconds
      }
    case 'low':
    default:
      return {
        className: 'border-slate-200 bg-white',
        duration: 5000, // 5 seconds
      }
  }
}

// Custom toast component for rich notifications
interface NotificationToastContentProps {
  notification: Notification
  onMarkAsRead: () => void
  onDismiss: () => void
  onAction?: () => void
}

function NotificationToastContent({ 
  notification, 
  onMarkAsRead, 
  onDismiss, 
  onAction 
}: NotificationToastContentProps) {
  const staticSettings = NotificationSettings[notification.type]
  const showAcknowledge = staticSettings.requiresAction && !notification.read

  return (
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
        
        <p className="text-sm text-slate-600 line-clamp-2">
          {notification.message}
        </p>
        
        {/* Action buttons */}
        {(notification.actionUrl || showAcknowledge) && (
          <div className="flex items-center gap-2 mt-3">
            {notification.actionUrl && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-white hover:bg-slate-50"
                onClick={() => {
                  window.location.href = notification.actionUrl!
                  onMarkAsRead()
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {notification.actionLabel || 'View Details'}
              </Button>
            )}
            
            {showAcknowledge && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                onClick={() => {
                  onMarkAsRead()
                  toast.dismiss(notification.id)
                }}
              >
                <Check className="w-3 h-3 mr-1" />
                Acknowledge
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Main toast container using Sonner
export function NotificationToastContainer() {
  const { notifications, markAsRead, dismissNotification, settings } = useNotifications()
  const shownNotificationsRef = useRef<Set<string>>(new Set())

  // Monitor for new notifications and show them as Sonner toasts
  useEffect(() => {
    if (!settings) return

    const newNotifications = notifications.filter(notification => {
      // Check if this notification should be shown as a toast
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
      
      toast.custom(
        (t) => (
          <div 
            className={cn(
              "w-full max-w-md rounded-lg border p-4 shadow-lg",
              "transition-all duration-300 ease-out",
              priorityStyle.className
            )}
          >
            <NotificationToastContent
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
              onDismiss={() => {
                dismissNotification(notification.id)
                toast.dismiss(t)
              }}
            />
          </div>
        ),
        {
          id: notification.id,
          duration: priorityStyle.duration,
          position: 'bottom-right',
          dismissible: true,
          onDismiss: () => {
            // Clean up when toast is dismissed
            shownNotificationsRef.current.delete(notification.id)
          },
          onAutoClose: () => {
            shownNotificationsRef.current.delete(notification.id)
          },
        }
      )
    })
  }, [notifications, settings, markAsRead, dismissNotification])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shownNotificationsRef.current.clear()
    }
  }, [])

  return null // Sonner renders its own container
}

// Sonner Toaster configuration for the app
export function NotificationToaster() {
  return (
    <Toaster
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      gap={12}
      visibleToasts={4}
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        },
        className: 'notification-toast',
        descriptionClassName: 'text-slate-600',
      }}
      // Smooth animations
      offset="24px"
    />
  )
}
