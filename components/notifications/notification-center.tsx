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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from './notification-provider'
import { Notification, NotificationPriority } from '@/lib/notifications'
import { Bell, BellRing, Check, X, ExternalLink, Settings, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-mobile'

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
      "mb-3 transition-all duration-200 hover:shadow-md cursor-pointer border",
      priorityColors,
      !notification.read && "ring-2 ring-amber-400"
    )}>
      <CardContent className="p-4">
        {/* Header with icon, title, and unread indicator */}
        <div className="flex items-start gap-3 mb-2">
          <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <span className="truncate">{notification.title}</span>
              {!notification.read && (
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
              )}
            </h4>
            {/* Message content */}
            <p className="text-sm text-slate-600 mt-1">
              {notification.message}
            </p>
          </div>
        </div>
        
        {/* Footer with timestamp and actions */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
          
          {/* Action buttons - larger for mobile */}
          <div className="flex items-center gap-2">
            {notification.actionUrl && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 hover:bg-slate-50"
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = notification.actionUrl!
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
            
            {!notification.read && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead(notification.id)
                }}
                title="Mark as read"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              onClick={(e) => {
                e.stopPropagation()
                onDismiss(notification.id)
              }}
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Notification content component used by both mobile and desktop views
interface NotificationContentProps {
  isMobile?: boolean
}

function NotificationContent({ isMobile = false }: NotificationContentProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    setNotificationCenterOpen
  } = useNotifications()

  const hasNotifications = notifications.length > 0
  const hasUnread = unreadCount > 0

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleClearAll = async () => {
    await clearAll()
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Notifications
            {hasUnread && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h3>
          
          <div className="flex items-center gap-2">
            {(hasUnread || hasNotifications) && (
              <>
                {hasUnread && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="h-9"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                
                {hasNotifications && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-9 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNotificationCenterOpen(false)}
                className="h-9 w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      {hasNotifications ? (
        <ScrollArea className="flex-1 h-[calc(100vh-12rem)] md:h-[500px]">
          <div className="p-4">
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
        <div className="p-8 text-center flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-medium text-slate-900 mb-1 text-base">No notifications</h4>
          <p className="text-sm text-slate-500">
            You're all caught up! New booking notifications will appear here.
          </p>
        </div>
      )}
      
      {/* Footer */}
      {hasNotifications && (
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setNotificationCenterOpen(false)
              window.location.href = '/dashboard/settings/notifications'
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      )}
    </>
  )
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isNotificationCenterOpen,
    setNotificationCenterOpen
  } = useNotifications()

  const hasUnread = unreadCount > 0
  const isMobile = useMediaQuery("(max-width: 1024px)") // Use sheet on tablets too

  const triggerButton = (
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
  )

  // Use Sheet for mobile/tablet
  if (isMobile) {
    return (
      <Sheet open={isNotificationCenterOpen} onOpenChange={setNotificationCenterOpen}>
        <SheetTrigger asChild>
          {triggerButton}
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[400px] p-0 flex flex-col"
        >
          <NotificationContent isMobile={true} />
        </SheetContent>
      </Sheet>
    )
  }

  // Use Dropdown for desktop
  return (
    <DropdownMenu 
      open={isNotificationCenterOpen} 
      onOpenChange={setNotificationCenterOpen}
    >
      <DropdownMenuTrigger asChild>
        {triggerButton}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[480px] max-h-[600px] p-0 bg-white border-slate-200 shadow-xl flex flex-col"
      >
        <NotificationContent />
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 