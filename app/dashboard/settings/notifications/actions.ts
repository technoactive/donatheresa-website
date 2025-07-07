'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type NotificationSettings = {
  id: string
  user_id: string
  notifications_enabled: boolean
  sound_enabled: boolean
  show_toasts: boolean
  master_volume: number
  auto_mark_read_delay: number
  max_notifications: number
  new_booking_enabled: boolean
  new_booking_sound: boolean
  new_booking_toast: boolean
  new_booking_priority: 'low' | 'medium' | 'high' | 'critical'
  vip_booking_enabled: boolean
  vip_booking_sound: boolean
  vip_booking_toast: boolean
  vip_booking_priority: 'low' | 'medium' | 'high' | 'critical'
  booking_cancelled_enabled: boolean
  booking_cancelled_sound: boolean
  booking_cancelled_toast: boolean
  booking_cancelled_priority: 'low' | 'medium' | 'high' | 'critical'
  booking_updated_enabled: boolean
  booking_updated_sound: boolean
  booking_updated_toast: boolean
  booking_updated_priority: 'low' | 'medium' | 'high' | 'critical'
  peak_time_booking_enabled: boolean
  peak_time_booking_sound: boolean
  peak_time_booking_toast: boolean
  peak_time_booking_priority: 'low' | 'medium' | 'high' | 'critical'
  customer_message_enabled: boolean
  customer_message_sound: boolean
  customer_message_toast: boolean
  customer_message_priority: 'low' | 'medium' | 'high' | 'critical'
  system_alert_enabled: boolean
  system_alert_sound: boolean
  system_alert_toast: boolean
  system_alert_priority: 'low' | 'medium' | 'high' | 'critical'
  quiet_hours_enabled: boolean
  quiet_hours_start: string
  quiet_hours_end: string
  quiet_hours_mute_sound: boolean
  quiet_hours_reduce_toasts: boolean
  business_hours_only: boolean
  business_hours_start: string
  business_hours_end: string
  group_similar_notifications: boolean
  persist_critical_notifications: boolean
  notification_history_days: number
  created_at: string
  updated_at: string
}

export type UpdateNotificationSettingsData = Omit<NotificationSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', 'admin')
      .single()

    if (error) {
      console.error('Error fetching notification settings:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getNotificationSettings:', error)
    return null
  }
}

export async function updateNotificationSettings(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Extract and validate form data
    const settings: UpdateNotificationSettingsData = {
      notifications_enabled: formData.get('notifications_enabled') === 'true',
      sound_enabled: formData.get('sound_enabled') === 'true',
      show_toasts: formData.get('show_toasts') === 'true',
      master_volume: parseFloat(formData.get('master_volume') as string) || 0.3,
      auto_mark_read_delay: parseInt(formData.get('auto_mark_read_delay') as string) || 10,
      max_notifications: parseInt(formData.get('max_notifications') as string) || 50,
      
      new_booking_enabled: formData.get('new_booking_enabled') === 'true',
      new_booking_sound: formData.get('new_booking_sound') === 'true',
      new_booking_toast: formData.get('new_booking_toast') === 'true',
      new_booking_priority: (formData.get('new_booking_priority') as any) || 'high',
      
      vip_booking_enabled: formData.get('vip_booking_enabled') === 'true',
      vip_booking_sound: formData.get('vip_booking_sound') === 'true',
      vip_booking_toast: formData.get('vip_booking_toast') === 'true',
      vip_booking_priority: (formData.get('vip_booking_priority') as any) || 'critical',
      
      booking_cancelled_enabled: formData.get('booking_cancelled_enabled') === 'true',
      booking_cancelled_sound: formData.get('booking_cancelled_sound') === 'true',
      booking_cancelled_toast: formData.get('booking_cancelled_toast') === 'true',
      booking_cancelled_priority: (formData.get('booking_cancelled_priority') as any) || 'high',
      
      booking_updated_enabled: formData.get('booking_updated_enabled') === 'true',
      booking_updated_sound: formData.get('booking_updated_sound') === 'true',
      booking_updated_toast: formData.get('booking_updated_toast') === 'true',
      booking_updated_priority: (formData.get('booking_updated_priority') as any) || 'medium',
      
      peak_time_booking_enabled: formData.get('peak_time_booking_enabled') === 'true',
      peak_time_booking_sound: formData.get('peak_time_booking_sound') === 'true',
      peak_time_booking_toast: formData.get('peak_time_booking_toast') === 'true',
      peak_time_booking_priority: (formData.get('peak_time_booking_priority') as any) || 'medium',
      
      customer_message_enabled: formData.get('customer_message_enabled') === 'true',
      customer_message_sound: formData.get('customer_message_sound') === 'true',
      customer_message_toast: formData.get('customer_message_toast') === 'true',
      customer_message_priority: (formData.get('customer_message_priority') as any) || 'low',
      
      system_alert_enabled: formData.get('system_alert_enabled') === 'true',
      system_alert_sound: formData.get('system_alert_sound') === 'true',
      system_alert_toast: formData.get('system_alert_toast') === 'true',
      system_alert_priority: (formData.get('system_alert_priority') as any) || 'high',
      
      quiet_hours_enabled: formData.get('quiet_hours_enabled') === 'true',
      quiet_hours_start: (formData.get('quiet_hours_start') as string) || '22:00:00',
      quiet_hours_end: (formData.get('quiet_hours_end') as string) || '08:00:00',
      quiet_hours_mute_sound: formData.get('quiet_hours_mute_sound') === 'true',
      quiet_hours_reduce_toasts: formData.get('quiet_hours_reduce_toasts') === 'true',
      
      business_hours_only: formData.get('business_hours_only') === 'true',
      business_hours_start: (formData.get('business_hours_start') as string) || '09:00:00',
      business_hours_end: (formData.get('business_hours_end') as string) || '23:00:00',
      
      group_similar_notifications: formData.get('group_similar_notifications') === 'true',
      persist_critical_notifications: formData.get('persist_critical_notifications') === 'true',
      notification_history_days: parseInt(formData.get('notification_history_days') as string) || 7,
    }

    const { error } = await supabase
      .from('notification_settings')
      .update(settings)
      .eq('user_id', 'admin')

    if (error) {
      console.error('Error updating notification settings:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings/notifications')
    return { success: true }

  } catch (error) {
    console.error('Error in updateNotificationSettings:', error)
    return { success: false, error: 'Failed to save settings' }
  }
}

export async function resetNotificationSettings(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Reset to default values
    const defaultSettings: UpdateNotificationSettingsData = {
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

    const { error } = await supabase
      .from('notification_settings')
      .update(defaultSettings)
      .eq('user_id', 'admin')

    if (error) {
      console.error('Error resetting notification settings:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings/notifications')
    return { success: true }

  } catch (error) {
    console.error('Error in resetNotificationSettings:', error)
    return { success: false, error: 'Failed to reset settings' }
  }
} 