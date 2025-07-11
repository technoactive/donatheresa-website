"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from './notification-provider'
import { Notification, NotificationPriority } from '@/lib/notifications'
import { Bell, BellRing, Check, X, ExternalLink, Settings, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

// Notification priority colors following restaurant industry standards
const getPriorityColors = (priority: NotificationPriority) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-50 border-red-200 text-red-900'
    case 'high':
      return 'bg-amber-50 border-amber-200 text-amber-900'
    case 'medium':
      return 'bg-blue-50 border-blue-200 text-blue-900'
    case 'low':
      return 'bg-slate-50 border-slate-200 text-slate-700'
    default:
      return 'bg-slate-50 border-slate-200 text-slate-700'
  }
}

const getPriorityIcon = (notification: Notification) => {
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

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onDismiss }: NotificationItemProps) {
  const priorityColors = getPriorityColors(notification.priority)
  const icon = getPriorityIcon(notification)
  
  return (
    <Card className={cn(
      "mb-2 transition-all duration-200 hover:shadow-md cursor-pointer border",
      priorityColors,
      !notification.read && "ring-1 ring-amber-200"
    )}>
      <CardContent className="p-2 sm:p-3">
        {/* Header with icon, title, and unread indicator */}
        <div className="flex items-start gap-2 mb-1 sm:mb-2">
          <span className="text-base sm:text-lg flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm truncate flex items-center gap-1">
              {notification.title}
              {!notification.read && (
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full flex-shrink-0" />
              )}
            </h4>
            {/* Message content */}
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mt-0.5">
              {notification.message}
            </p>
          </div>
        </div>
        
        {/* Footer with timestamp and actions */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {notification.actionUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-6 sm:w-6 p-0 hover:bg-white/50 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = notification.actionUrl!
                }}
                title="View details"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
            
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-6 sm:w-6 p-0 hover:bg-white/50 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead(notification.id)
                }}
                title="Mark as read"
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 sm:h-6 sm:w-6 p-0 hover:bg-white/50 text-red-600 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                onDismiss(notification.id)
              }}
              title="Dismiss notification"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    isNotificationCenterOpen,
    setNotificationCenterOpen
  } = useNotifications()

  const hasNotifications = notifications.length > 0
  const hasUnread = unreadCount > 0

  return (
    <DropdownMenu 
      open={isNotificationCenterOpen} 
      onOpenChange={setNotificationCenterOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 hover:bg-slate-100 transition-colors"
        >
          {hasUnread ? (
            <BellRing className="h-5 w-5 text-amber-600" />
          ) : (
            <Bell className="h-5 w-5 text-slate-600" />
          )}
          
          {hasUnread && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-amber-500 hover:bg-amber-600"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-full sm:w-[380px] md:w-[420px] lg:w-[480px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] p-0 bg-white border-slate-200 shadow-xl flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <Bell className="h-4 w-4" />
              Notifications
              {hasUnread && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 ml-1 sm:ml-2 text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </h3>
            
            {(hasUnread || hasNotifications) && (
              <div className="flex items-center gap-1">
                {hasUnread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-9 w-9 sm:h-8 sm:w-8 p-0 hover:bg-white/50"
                    title="Mark all as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                
                {hasNotifications && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-9 w-9 sm:h-8 sm:w-8 p-0 text-red-600 hover:bg-red-50"
                    title="Clear all notifications"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications List - Scrollable */}
        {hasNotifications ? (
          <div className="flex-1 overflow-y-auto min-h-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismissNotification}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col items-center justify-center">
            <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-medium text-slate-900 mb-1 text-sm sm:text-base">No notifications</h4>
            <p className="text-xs sm:text-sm text-slate-500">
              You're all caught up! New booking notifications will appear here.
            </p>
          </div>
        )}
        
        {/* Footer - Fixed */}
        {hasNotifications && (
          <>
            <DropdownMenuSeparator className="flex-shrink-0" />
            <div className="p-2 flex-shrink-0">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-slate-50 py-2.5"
                onClick={() => window.location.href = '/dashboard/settings/notifications'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 