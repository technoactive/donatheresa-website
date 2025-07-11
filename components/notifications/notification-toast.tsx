"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from './notification-provider'
import { Notification, NotificationSettings } from '@/lib/notifications'
import { X, ExternalLink, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ToastNotificationProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
  onRemove: (id: string) => void
}

function ToastNotification({ notification, onMarkAsRead, onDismiss, onRemove }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const settings = NotificationSettings[notification.type]

  // Auto-remove after persist duration
  useEffect(() => {
    if (settings.persistDuration > 0) {
      const timer = setTimeout(() => {
        handleRemove()
      }, settings.persistDuration * 1000)

      return () => clearTimeout(timer)
    }
  }, [settings.persistDuration])

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300) // Animation duration
  }

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id)
    if (settings.autoMarkRead) {
      handleRemove()
    }
  }

  const handleDismiss = () => {
    onDismiss(notification.id)
    handleRemove()
  }

  const getPriorityStyles = () => {
    switch (notification.priority) {
      case 'critical':
        return 'bg-red-50 border-red-500 shadow-red-100'
      case 'high':
        return 'bg-amber-50 border-amber-500 shadow-amber-100'
      case 'medium':
        return 'bg-blue-50 border-blue-500 shadow-blue-100'
      case 'low':
        return 'bg-slate-50 border-slate-300 shadow-slate-100'
      default:
        return 'bg-white border-slate-300 shadow-slate-100'
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'new_booking':
        return '🍽️'
      case 'vip_booking':
        return '👑'
      case 'booking_cancelled':
        return '❌'
      case 'booking_updated':
        return '✏️'
      case 'peak_time_booking':
        return '🔥'
      case 'customer_message':
        return '💬'
      case 'system_alert':
        return '⚠️'
      default:
        return '📢'
    }
  }

  if (!isVisible) return null

  return (
    <Card className={cn(
      "w-96 mb-3 border-l-4 shadow-lg transition-all duration-300 transform",
      getPriorityStyles(),
      isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
      notification.priority === 'critical' && "animate-pulse"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getIcon()}</span>
              <h4 className="font-semibold text-sm text-slate-900">
                {notification.title}
              </h4>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  notification.priority === 'critical' && "bg-red-100 text-red-700 border-red-300",
                  notification.priority === 'high' && "bg-amber-100 text-amber-700 border-amber-300",
                  notification.priority === 'medium' && "bg-blue-100 text-blue-700 border-blue-300",
                  notification.priority === 'low' && "bg-slate-100 text-slate-700 border-slate-300"
                )}
              >
                {notification.priority}
              </Badge>
            </div>
            
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </span>
              
              <div className="flex items-center gap-2">
                {notification.actionUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      window.location.href = notification.actionUrl!
                      handleMarkAsRead()
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {notification.actionLabel || 'View'}
                  </Button>
                )}
                
                {!notification.read && settings.requiresAction && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    onClick={handleMarkAsRead}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Acknowledge
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-slate-100"
                  onClick={handleDismiss}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationToastContainer() {
  const { notifications, markAsRead, dismissNotification } = useNotifications()
  const [activeToasts, setActiveToasts] = useState<Notification[]>([])

  // Monitor for new notifications that should show as toasts
  useEffect(() => {
    console.log('🍞 Toast container checking notifications:', notifications.length);
    
    const newToastNotifications = notifications.filter(notification => {
      const settings = NotificationSettings[notification.type]
      const shouldShow = (
        settings.showInToast && 
        !notification.dismissed &&
        !activeToasts.some(toast => toast.id === notification.id)
      );
      
      console.log(`📝 Notification ${notification.id}:`, {
        type: notification.type,
        shouldShowInToast: settings.showInToast,
        dismissed: notification.dismissed,
        alreadyActive: activeToasts.some(toast => toast.id === notification.id),
        willShow: shouldShow
      });
      
      return shouldShow;
    })

    if (newToastNotifications.length > 0) {
      console.log(`🆕 Adding ${newToastNotifications.length} new toast notifications`);
      setActiveToasts(prev => [...newToastNotifications, ...prev])
    } else {
      console.log('📭 No new toast notifications to show');
    }
  }, [notifications, activeToasts])

  // Log active toasts
  useEffect(() => {
    console.log(`🍞 Active toasts: ${activeToasts.length}`);
    activeToasts.forEach((toast, index) => {
      console.log(`   ${index + 1}. ${toast.type}: ${toast.title}`);
    });
  }, [activeToasts]);

  const handleRemoveToast = (notificationId: string) => {
    console.log('🗑️ Removing toast:', notificationId);
    setActiveToasts(prev => prev.filter(toast => toast.id !== notificationId))
  }

  const handleMarkAsRead = (notificationId: string) => {
    console.log('✅ Marking toast as read:', notificationId);
    markAsRead(notificationId)
  }

  const handleDismiss = (notificationId: string) => {
    console.log('❌ Dismissing toast:', notificationId);
    dismissNotification(notificationId)
  }

  console.log('🍞 Rendering toast container with', activeToasts.length, 'active toasts');

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col-reverse max-w-md">
      {activeToasts.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
          onDismiss={handleDismiss}
          onRemove={handleRemoveToast}
        />
      ))}
    </div>
  )
} 