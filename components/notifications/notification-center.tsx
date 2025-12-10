"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from './notification-provider'
import { Notification } from '@/lib/notifications'
import { Bell, BellRing, Check, X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// Simple notification item - minimal to avoid issues
function NotificationItem({ 
  notification, 
  onDismiss,
  onClose 
}: { 
  notification: Notification
  onDismiss: (id: string) => void
  onClose: () => void
}) {
  const router = useRouter()
  
  const getIcon = () => {
    switch (notification.type) {
      case 'new_booking': return '🍽️'
      case 'vip_booking': return '👑'
      case 'booking_cancelled': return '❌'
      default: return '📢'
    }
  }

  const handleClick = () => {
    if (notification.actionUrl) {
      onClose()
      router.push(notification.actionUrl)
    }
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDismiss(notification.id)
  }

  // Format time simply
  const timeAgo = (() => {
    try {
      const diff = Date.now() - new Date(notification.timestamp).getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 60) return `${mins}m ago`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `${hours}h ago`
      return `${Math.floor(hours / 24)}d ago`
    } catch {
      return ''
    }
  })()

  return (
    <div 
      className={cn(
        "p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer",
        "flex items-start gap-3",
        !notification.read && "bg-amber-50/50"
      )}
      onClick={handleClick}
    >
      <span className="text-lg flex-shrink-0">{getIcon()}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-slate-900 truncate">
          {notification.title}
        </p>
        <p className="text-xs text-slate-600 truncate">
          {notification.message}
        </p>
        <p className="text-xs text-slate-400 mt-1">{timeAgo}</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    dismissNotification,
    clearAll,
  } = useNotifications()

  const hasUnread = unreadCount > 0
  const hasNotifications = notifications.length > 0

  const handleClearAll = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await clearAll()
  }

  const handleDismiss = async (id: string) => {
    await dismissNotification(id)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 hover:bg-slate-100"
        >
          {hasUnread ? (
            <BellRing className="h-5 w-5 text-amber-600" />
          ) : (
            <Bell className="h-5 w-5 text-slate-600" />
          )}
          
          {hasUnread && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-amber-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        className="w-80 p-0 bg-white shadow-lg"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <span className="font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {hasUnread && (
              <Badge className="bg-amber-100 text-amber-700 text-xs">
                {unreadCount}
              </Badge>
            )}
          </span>
          
          {hasNotifications && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        
        {/* Notifications List */}
        {hasNotifications ? (
          <ScrollArea className="max-h-80">
            {notifications.slice(0, 10).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
                onClose={handleClose}
              />
            ))}
          </ScrollArea>
        ) : (
          <div className="p-6 text-center">
            <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No notifications</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
