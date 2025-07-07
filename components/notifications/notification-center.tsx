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
      !notification.read && "ring-2 ring-amber-200"
    )}>
      <CardContent className="p-3">
        {/* Header with icon, title, and unread indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg flex-shrink-0">{icon}</span>
          <h4 className="font-semibold text-sm flex-1 truncate">
            {notification.title}
          </h4>
          {!notification.read && (
            <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
          )}
        </div>
        
        {/* Message content */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        
        {/* Footer with timestamp and actions - guaranteed space */}
        <div className="flex items-center justify-between min-h-[24px]">
          <span className="text-xs text-slate-500 flex-shrink-0 max-w-[60%] truncate">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
          
          {/* Action buttons with guaranteed minimum width */}
          <div className="flex items-center gap-1 flex-shrink-0 min-w-[80px] justify-end">
            {notification.actionUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-white/50 flex-shrink-0"
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
                className="h-6 w-6 p-0 hover:bg-white/50 flex-shrink-0"
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
              className="h-6 w-6 p-0 hover:bg-white/50 text-red-600 flex-shrink-0"
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
        className="w-[480px] max-h-[80vh] p-0 bg-white border-slate-200 shadow-xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {hasUnread && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 ml-2">
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
                    className="h-8 w-8 p-0 hover:bg-white/50"
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
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    title="Clear all notifications"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications List */}
        {hasNotifications ? (
          <ScrollArea className="max-h-96">
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
        ) : (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-medium text-slate-900 mb-1">No notifications</h4>
            <p className="text-sm text-slate-500">
              You're all caught up! New booking notifications will appear here.
            </p>
          </div>
        )}
        
        {/* Footer */}
        {hasNotifications && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">
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