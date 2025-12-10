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
    this.setupNotificationUpdates()
    // Load notifications from database asynchronously
    this.loadNotificationsFromDatabase()
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  // Add a method to ensure initialization is complete
  public async ensureInitialized(): Promise<void> {
    // Wait for settings to load if not already loaded
    if (!this.settings) {
      await this.loadSettings()
    }
    
    // Always load notifications from database to ensure we have the latest data
    await this.loadNotificationsFromDatabase()
  }

  private async loadSettings(): Promise<void> {
    try {
      console.log('📱 Loading notification settings...');
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', 'admin')
        .single()

      if (error) {
        console.error('❌ Error loading notification settings:', error)
        console.log('📝 Creating default notification settings...');
        
        // Try to create default settings if they don't exist
        const defaultSettings = this.getDefaultSettings();
        const { data: newSettings, error: insertError } = await supabase
          .from('notification_settings')
          .insert([{ user_id: 'admin', ...defaultSettings }])
          .select()
          .single();
        
        if (insertError) {
          console.error('❌ Failed to create default settings:', insertError);
          this.settings = defaultSettings;
        } else {
          console.log('✅ Created default notification settings');
          this.settings = newSettings;
        }
      } else {
        console.log('✅ Notification settings loaded successfully');
        this.settings = data
      }

      // Notify settings listeners
      this.settingsListeners.forEach(listener => {
        if (this.settings) {
          listener(this.settings)
        }
      })
      
      console.log('📊 Current notification settings:', {
        enabled: this.settings?.notifications_enabled,
        sound: this.settings?.sound_enabled,
        toasts: this.settings?.show_toasts,
        newBooking: this.settings?.new_booking_enabled
      });
      
    } catch (error) {
      console.error('💥 Error in loadSettings:', error)
      console.log('🔄 Falling back to default settings');
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
    console.log('🔍 Checking if notification allowed for type:', type);
    console.log('🔍 Settings loaded:', !!this.settings);
    
    if (!this.settings || !this.settings.notifications_enabled) {
      console.log('❌ Notifications disabled globally or no settings');
      return false
    }

    // Check if this notification type is enabled
    const typeEnabled = this.settings[`${type}_enabled` as keyof NotificationSettings] as boolean
    console.log(`🔍 ${type}_enabled setting:`, typeEnabled);
    
    if (!typeEnabled) {
      console.log('❌ Notification type disabled in settings');
      return false
    }

    // Check business hours
    if (this.settings.business_hours_only) {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 8)
      const businessStart = this.settings.business_hours_start
      const businessEnd = this.settings.business_hours_end
      
      console.log('🔍 Business hours check:', { currentTime, businessStart, businessEnd });
      
      if (currentTime < businessStart || currentTime > businessEnd) {
        console.log('❌ Outside business hours');
        return false
      }
    }

    console.log('✅ Notification allowed');
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
    console.log('📝 Adding notification:', notification.type, notification.title);
    
    // Check if notifications are allowed for this type
    if (!this.isNotificationAllowed(notification.type)) {
      console.log('❌ Notification blocked by settings for type:', notification.type);
      return false
    }

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
      priority: this.getNotificationPriority(notification.type)
    }

    console.log('✅ Creating notification:', {
      id: newNotification.id,
      type: newNotification.type,
      title: newNotification.title,
      priority: newNotification.priority
    });

    this.notifications.unshift(newNotification)

    // Limit notifications based on settings
    const maxNotifications = this.settings?.max_notifications ?? 50
    if (this.notifications.length > maxNotifications) {
      this.notifications = this.notifications.slice(0, maxNotifications)
    }

    console.log('📊 Total notifications now:', this.notifications.length);
    
    // Notify listeners immediately for instant UI update
    this.notifyListeners()

    // Save to database for persistence
    this.saveNotificationToDatabase(newNotification)

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

  // Add notification that already exists in database (from real-time events or polling)
  public addNotificationFromDatabase(notification: Notification): boolean {
    console.log('📥 Adding notification from database:', notification.type, notification.title);
    
    // Check if we already have this notification
    if (this.notifications.some(n => n.id === notification.id)) {
      console.log('⏭️ Notification already exists, skipping');
      return false;
    }
    
    // Check if notifications are allowed for this type
    if (!this.isNotificationAllowed(notification.type)) {
      console.log('❌ Notification blocked by settings for type:', notification.type);
      return false
    }

    console.log('✅ Adding database notification:', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      priority: notification.priority
    });

    this.notifications.unshift(notification)

    // Limit notifications based on settings
    const maxNotifications = this.settings?.max_notifications ?? 50
    if (this.notifications.length > maxNotifications) {
      this.notifications = this.notifications.slice(0, maxNotifications)
    }

    console.log('📊 Total notifications now:', this.notifications.length);
    
    // Notify listeners immediately for instant UI update
    this.notifyListeners()

    // Auto-mark as read after delay (unless it's critical and persistence is enabled)
    const shouldPersist = this.settings?.persist_critical_notifications && 
                         notification.priority === 'critical'
    
    if (!shouldPersist && !notification.read) {
      const delay = (this.settings?.auto_mark_read_delay ?? 10) * 1000
      setTimeout(() => {
        this.markAsRead(notification.id)
      }, delay)
    }

    return true
  }

  // Update notification from database real-time events
  public updateNotificationFromDatabase(id: string, updates: { read?: boolean; dismissed?: boolean }): void {
    console.log('📝 Updating notification from database:', id, updates);
    
    const notification = this.notifications.find(n => n.id === id)
    if (!notification) {
      console.log('⚠️ Notification not found:', id);
      return
    }

    if (updates.read !== undefined) {
      notification.read = updates.read
    }
    
    if (updates.dismissed !== undefined) {
      notification.dismissed = updates.dismissed
    }

    this.notifyListeners()
  }

  private async saveNotificationToDatabase(notification: Notification): Promise<void> {
    try {
      console.log('💾 Saving notification to database:', notification.id);
      const supabase = createClient()
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          id: notification.id,
          user_id: 'admin',
          type: notification.type,
          priority: notification.priority,
          title: notification.title,
          message: notification.message,
          timestamp: notification.timestamp.toISOString(),
          read: notification.read,
          dismissed: notification.dismissed,
          action_url: notification.actionUrl,
          action_label: notification.actionLabel,
          booking_id: notification.data?.bookingId,
          contact_id: notification.data?.contactId
        })

      if (error) {
        console.error('❌ Failed to save notification to database:', error)
      } else {
        console.log('✅ Notification saved to database successfully');
      }
    } catch (error) {
      console.error('💥 Error saving notification to database:', error)
    }
  }

  private async loadNotificationsFromDatabase(): Promise<void> {
    try {
      console.log('🔄 Loading notifications from database...');
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', 'admin')
        .eq('dismissed', false) // Only load non-dismissed notifications
        .order('created_at', { ascending: false })
        .limit(this.settings?.max_notifications ?? 50)

      if (error) {
        console.error('❌ Error loading notifications from database:', error)
        return
      }

      if (data) {
        // Convert database notifications to our format
        this.notifications = data.map(dbNotification => ({
          id: dbNotification.id,
          type: dbNotification.type as NotificationType,
          priority: dbNotification.priority as NotificationPriority,
          title: dbNotification.title,
          message: dbNotification.message,
          timestamp: new Date(dbNotification.timestamp || dbNotification.created_at),
          read: dbNotification.read,
          dismissed: dbNotification.dismissed,
          actionUrl: dbNotification.action_url,
          actionLabel: dbNotification.action_label,
          data: {
            bookingId: dbNotification.booking_id,
            contactId: dbNotification.contact_id
          }
        }))

        console.log('✅ Loaded', this.notifications.length, 'notifications from database');
        console.log('📬 Unread notifications:', this.notifications.filter(n => !n.read).length);
        
        // Notify listeners
        this.notifyListeners()
      }
    } catch (error) {
      console.error('💥 Error loading notifications from database:', error)
    }
  }

  private setupNotificationUpdates(): void {
    // Listen for new notifications in real-time
    const supabase = createClient()
    console.log('🔄 Setting up real-time notification updates...');
    
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.admin'
        },
        async (payload) => {
          console.log('🔔 New notification inserted in database:', payload.new.id);
          
          // Always reload notifications from database to ensure consistency
          // This ensures we catch all notifications, even if they were created elsewhere
          setTimeout(() => {
            console.log('🔄 Reloading notifications after INSERT event');
            this.loadNotificationsFromDatabase();
          }, 100); // Small delay to ensure database write is complete
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.admin'
        },
        (payload) => {
          console.log('🔔 Notification updated:', payload.new.id);
          
          // Update the notification in our local array
          const index = this.notifications.findIndex(n => n.id === payload.new.id);
          if (index !== -1) {
            this.notifications[index] = {
              ...this.notifications[index],
              read: payload.new.read,
              dismissed: payload.new.dismissed,
              timestamp: new Date(payload.new.timestamp || payload.new.created_at),
              actionUrl: payload.new.action_url,
              actionLabel: payload.new.action_label
            };
            
            // Remove if dismissed
            if (payload.new.dismissed) {
              this.notifications.splice(index, 1);
            }
            
            console.log('✅ Updated notification from real-time event');
            this.notifyListeners();
          } else {
            // If we don't have this notification locally, reload from database
            console.log('🔄 Notification not found locally, reloading from database');
            this.loadNotificationsFromDatabase();
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Notification subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time notifications are active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time notification subscription failed');
        }
      });
  }

  public async refreshNotifications(): Promise<void> {
    console.log('🔄 Manually refreshing notifications from database...');
    await this.loadNotificationsFromDatabase();
  }

  public getNotifications(): Notification[] {
    return [...this.notifications]
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  public async markAsRead(id: string): Promise<void> {
    console.log('✅ Marking notification as read:', id);
    
    // Update in memory first for immediate UI response
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }

    // Update in database
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) {
        console.error('❌ Failed to mark notification as read in database:', error)
      } else {
        console.log('✅ Notification marked as read in database');
      }
    } catch (error) {
      console.error('💥 Error updating notification in database:', error)
    }
  }

  public async markAllAsRead(): Promise<void> {
    console.log('✅ Marking all notifications as read');
    
    // Update in memory first for immediate UI response
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()

    // Update in database
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', 'admin')
        .eq('read', false) // Only update unread notifications

      if (error) {
        console.error('❌ Failed to mark all as read in database:', error)
      } else {
        console.log('✅ All notifications marked as read in database');
      }
    } catch (error) {
      console.error('💥 Error updating notifications in database:', error)
    }
  }

  public async dismissNotification(id: string): Promise<void> {
    // Update in memory first for immediate UI response
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()

    // DELETE from database (not just mark as dismissed)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Failed to delete notification from database:', error)
        // Fallback: try to mark as dismissed instead
        await supabase
          .from('notifications')
          .update({ dismissed: true })
          .eq('id', id)
      }
    } catch (error) {
      console.error('Error deleting notification from database:', error)
    }
  }

  public async clearAll(): Promise<void> {
    // Update in memory first for immediate UI response
    this.notifications = []
    this.notifyListeners()

    // DELETE all from database
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', 'admin')

      if (error) {
        console.error('Failed to delete all notifications from database:', error)
        // Fallback: mark as dismissed
        await supabase
          .from('notifications')
          .update({ dismissed: true })
          .eq('user_id', 'admin')
      }
    } catch (error) {
      console.error('Error clearing notifications from database:', error)
    }
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
    console.log('🔔 Notifying listeners:', this.listeners.length, 'listeners');
    console.log('📊 Current notifications:', this.notifications.length);
    console.log('📬 Unread count:', this.notifications.filter(n => !n.read).length);
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
    dismissed: false,
    data: {
      customerName,
      bookingId,
      bookingTime,
      partySize
    },
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
    dismissed: false,
    data: {
      customerName,
      bookingId,
      bookingTime
    },
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
    priority,
    dismissed: false
  }
}

export const notificationManager = NotificationManager.getInstance() 