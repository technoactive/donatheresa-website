// Restaurant Notification System - Industry Standards Implementation
// Following patterns from OpenTable, Resy, and other professional booking platforms

import { createClient } from '@/lib/supabase/client'

export type NotificationType = 
  | 'new_booking'           // High priority - new reservation made
  | 'booking_cancelled'     // High priority - cancellation alert  
  | 'booking_updated'       // Medium priority - modification
  | 'vip_booking'          // Critical priority - VIP customer
  | 'peak_time_booking'    // Medium priority - busy period alert
  | 'customer_message'     // Low priority - contact form submission
  | 'system_alert'         // High priority - system issues

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  data?: {
    bookingId?: string
    customerId?: string
    customerName?: string
    bookingTime?: string
    partySize?: number
    source?: 'website' | 'dashboard'
    [key: string]: any
  }
  timestamp: Date
  read: boolean
  dismissed: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationSettings {
  notifications_enabled: boolean
  sound_enabled: boolean
  show_toasts: boolean
  master_volume: number
  auto_mark_read_delay: number
  max_notifications: number
  
  // Notification type settings
  new_booking_enabled: boolean
  new_booking_sound: boolean
  new_booking_toast: boolean
  new_booking_priority: NotificationPriority
  
  vip_booking_enabled: boolean
  vip_booking_sound: boolean
  vip_booking_toast: boolean
  vip_booking_priority: NotificationPriority
  
  booking_cancelled_enabled: boolean
  booking_cancelled_sound: boolean
  booking_cancelled_toast: boolean
  booking_cancelled_priority: NotificationPriority
  
  booking_updated_enabled: boolean
  booking_updated_sound: boolean
  booking_updated_toast: boolean
  booking_updated_priority: NotificationPriority
  
  peak_time_booking_enabled: boolean
  peak_time_booking_sound: boolean
  peak_time_booking_toast: boolean
  peak_time_booking_priority: NotificationPriority
  
  customer_message_enabled: boolean
  customer_message_sound: boolean
  customer_message_toast: boolean
  customer_message_priority: NotificationPriority
  
  system_alert_enabled: boolean
  system_alert_sound: boolean
  system_alert_toast: boolean
  system_alert_priority: NotificationPriority
  
  // Time-based settings
  quiet_hours_enabled: boolean
  quiet_hours_start: string
  quiet_hours_end: string
  quiet_hours_mute_sound: boolean
  quiet_hours_reduce_toasts: boolean
  
  business_hours_only: boolean
  business_hours_start: string
  business_hours_end: string
  
  // Advanced settings
  group_similar_notifications: boolean
  persist_critical_notifications: boolean
  notification_history_days: number
}

// Notification priority settings following restaurant industry standards
export const NotificationSettings: Record<NotificationType, {
  priority: NotificationPriority
  defaultTitle: string
  soundFile?: string
  autoMarkRead: boolean
  persistDuration: number // seconds, 0 = persist until manually dismissed
  showInToast: boolean
  requiresAction: boolean
}> = {
  new_booking: {
    priority: 'high',
    defaultTitle: 'New Reservation',
    soundFile: '/sounds/new-booking.mp3',
    autoMarkRead: false,
    persistDuration: 0, // Persist until acknowledged
    showInToast: true,
    requiresAction: true
  },
  vip_booking: {
    priority: 'critical',
    defaultTitle: 'VIP Reservation',
    soundFile: '/sounds/vip-booking.mp3',
    autoMarkRead: false,
    persistDuration: 0, // Persist until acknowledged
    showInToast: true,
    requiresAction: true
  },
  booking_cancelled: {
    priority: 'high',
    defaultTitle: 'Booking Cancelled',
    soundFile: '/sounds/booking-cancelled.mp3',
    autoMarkRead: false,
    persistDuration: 30,
    showInToast: true,
    requiresAction: false
  },
  booking_updated: {
    priority: 'medium',
    defaultTitle: 'Booking Modified',
    autoMarkRead: true,
    persistDuration: 15,
    showInToast: true,
    requiresAction: false
  },
  peak_time_booking: {
    priority: 'medium',
    defaultTitle: 'Peak Time Booking',
    soundFile: '/sounds/peak-time.mp3',
    autoMarkRead: true,
    persistDuration: 20,
    showInToast: true,
    requiresAction: false
  },
  customer_message: {
    priority: 'low',
    defaultTitle: 'Customer Message',
    autoMarkRead: true,
    persistDuration: 10,
    showInToast: false,
    requiresAction: false
  },
  system_alert: {
    priority: 'high',
    defaultTitle: 'System Alert',
    soundFile: '/sounds/system-alert.mp3',
    autoMarkRead: false,
    persistDuration: 0,
    showInToast: true,
    requiresAction: true
  }
}

// Notification helper functions
export class NotificationManager {
  private static instance: NotificationManager
  private notifications: Notification[] = []
  private settings: NotificationSettings | null = null
  private listeners: Array<(notifications: Notification[]) => void> = []
  private settingsListeners: Array<(settings: NotificationSettings) => void> = []

  private constructor() {
    this.loadSettings()
    this.setupSettingsRefresh()
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  private async loadSettings(): Promise<void> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', 'admin')
        .single()

      if (error) {
        console.error('Error loading notification settings:', error)
        // Use default settings if database fetch fails
        this.settings = this.getDefaultSettings()
      } else {
        this.settings = data
      }

      // Notify settings listeners
      this.settingsListeners.forEach(listener => {
        if (this.settings) {
          listener(this.settings)
        }
      })
    } catch (error) {
      console.error('Error in loadSettings:', error)
      this.settings = this.getDefaultSettings()
    }
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      notifications_enabled: true,
      sound_enabled: true,
      show_toasts: true,
      master_volume: 0.3,
      auto_mark_read_delay: 10,
      max_notifications: 50,
      
      new_booking_enabled: true,
      new_booking_sound: true,
      new_booking_toast: true,
      new_booking_priority: 'high',
      
      vip_booking_enabled: true,
      vip_booking_sound: true,
      vip_booking_toast: true,
      vip_booking_priority: 'critical',
      
      booking_cancelled_enabled: true,
      booking_cancelled_sound: true,
      booking_cancelled_toast: true,
      booking_cancelled_priority: 'high',
      
      booking_updated_enabled: true,
      booking_updated_sound: false,
      booking_updated_toast: true,
      booking_updated_priority: 'medium',
      
      peak_time_booking_enabled: true,
      peak_time_booking_sound: true,
      peak_time_booking_toast: true,
      peak_time_booking_priority: 'medium',
      
      customer_message_enabled: true,
      customer_message_sound: false,
      customer_message_toast: false,
      customer_message_priority: 'low',
      
      system_alert_enabled: true,
      system_alert_sound: true,
      system_alert_toast: true,
      system_alert_priority: 'high',
      
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00:00',
      quiet_hours_end: '08:00:00',
      quiet_hours_mute_sound: true,
      quiet_hours_reduce_toasts: true,
      
      business_hours_only: false,
      business_hours_start: '09:00:00',
      business_hours_end: '23:00:00',
      
      group_similar_notifications: true,
      persist_critical_notifications: true,
      notification_history_days: 7,
    }
  }

  private setupSettingsRefresh(): void {
    // Listen for settings changes in real-time
    const supabase = createClient()
    supabase
      .channel('notification_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notification_settings',
          filter: 'user_id=eq.admin'
        },
        () => {
          this.loadSettings()
        }
      )
      .subscribe()
  }

  public async refreshSettings(): Promise<void> {
    await this.loadSettings()
  }

  public getSettings(): NotificationSettings | null {
    return this.settings
  }

  public onSettingsChange(listener: (settings: NotificationSettings) => void): () => void {
    this.settingsListeners.push(listener)
    
    // Call immediately with current settings if available
    if (this.settings) {
      listener(this.settings)
    }
    
    return () => {
      const index = this.settingsListeners.indexOf(listener)
      if (index > -1) {
        this.settingsListeners.splice(index, 1)
      }
    }
  }

  private isNotificationAllowed(type: NotificationType): boolean {
    if (!this.settings || !this.settings.notifications_enabled) {
      return false
    }

    // Check if this notification type is enabled
    const typeEnabled = this.settings[`${type}_enabled` as keyof NotificationSettings] as boolean
    if (!typeEnabled) {
      return false
    }

    // Check business hours
    if (this.settings.business_hours_only) {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 8)
      const businessStart = this.settings.business_hours_start
      const businessEnd = this.settings.business_hours_end
      
      if (currentTime < businessStart || currentTime > businessEnd) {
        return false
      }
    }

    return true
  }

  private isQuietHours(): boolean {
    if (!this.settings || !this.settings.quiet_hours_enabled) {
      return false
    }

    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 8)
    const quietStart = this.settings.quiet_hours_start
    const quietEnd = this.settings.quiet_hours_end

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (quietStart > quietEnd) {
      return currentTime >= quietStart || currentTime <= quietEnd
    } else {
      return currentTime >= quietStart && currentTime <= quietEnd
    }
  }

  public shouldPlaySound(type: NotificationType): boolean {
    if (!this.settings || !this.settings.sound_enabled) {
      return false
    }

    // Check if sounds are disabled during quiet hours
    if (this.isQuietHours() && this.settings.quiet_hours_mute_sound) {
      return false
    }

    // Check if this notification type should play sound
    return this.settings[`${type}_sound` as keyof NotificationSettings] as boolean
  }

  public shouldShowToast(type: NotificationType): boolean {
    if (!this.settings || !this.settings.show_toasts) {
      return false
    }

    // Check if toasts are reduced during quiet hours
    if (this.isQuietHours() && this.settings.quiet_hours_reduce_toasts) {
      // Only show critical notifications during quiet hours
      const priority = this.settings[`${type}_priority` as keyof NotificationSettings] as NotificationPriority
      return priority === 'critical'
    }

    // Check if this notification type should show toast
    return this.settings[`${type}_toast` as keyof NotificationSettings] as boolean
  }

  public getMasterVolume(): number {
    return this.settings?.master_volume ?? 0.3
  }

  public getNotificationPriority(type: NotificationType): NotificationPriority {
    return (this.settings?.[`${type}_priority` as keyof NotificationSettings] as NotificationPriority) ?? 'medium'
  }

  public addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): boolean {
    // Check if notifications are allowed for this type
    if (!this.isNotificationAllowed(notification.type)) {
      return false
    }

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
      priority: this.getNotificationPriority(notification.type)
    }

    this.notifications.unshift(newNotification)

    // Limit notifications based on settings
    const maxNotifications = this.settings?.max_notifications ?? 50
    if (this.notifications.length > maxNotifications) {
      this.notifications = this.notifications.slice(0, maxNotifications)
    }

    this.notifyListeners()

    // Auto-mark as read after delay (unless it's critical and persistence is enabled)
    const shouldPersist = this.settings?.persist_critical_notifications && 
                         newNotification.priority === 'critical'
    
    if (!shouldPersist) {
      const delay = (this.settings?.auto_mark_read_delay ?? 10) * 1000
      setTimeout(() => {
        this.markAsRead(newNotification.id)
      }, delay)
    }

    return true
  }

  public getNotifications(): Notification[] {
    return [...this.notifications]
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  public markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  public dismissNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()
  }

  public clearAll(): void {
    this.notifications = []
    this.notifyListeners()
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener)
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }
}

// Utility functions for creating specific notification types
export function createBookingNotification(
  customerName: string,
  bookingTime: string,
  partySize: number,
  bookingId: string,
  isVip: boolean = false,
  isPeakTime: boolean = false
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  let type: NotificationType = 'new_booking'
  let title = 'New Booking'
  
  if (isVip) {
    type = 'vip_booking'
    title = '🌟 VIP Booking'
  } else if (isPeakTime) {
    type = 'peak_time_booking'
    title = '🔥 Peak Time Booking'
  }

  return {
    type,
    title,
    message: `${customerName} - ${partySize} guests on ${bookingTime}`,
    priority: 'high',
    customerName,
    bookingId,
    actionUrl: `/dashboard/bookings?highlight=${bookingId}`
  }
}

export function createCancellationNotification(
  customerName: string,
  bookingTime: string,
  bookingId: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `${customerName}'s reservation for ${bookingTime} has been cancelled`,
    priority: 'high',
    customerName,
    bookingId,
    actionUrl: `/dashboard/bookings`
  }
}

export function createSystemAlertNotification(
  title: string,
  message: string,
  priority: NotificationPriority = 'high'
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'system_alert',
    title,
    message,
    priority
  }
}

export const notificationManager = NotificationManager.getInstance() 