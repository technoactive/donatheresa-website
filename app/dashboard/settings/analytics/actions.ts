'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface GoogleAnalyticsSettings {
  measurement_id: string | null
  api_secret: string | null
  enabled: boolean
}

export async function getGoogleAnalyticsSettings(): Promise<GoogleAnalyticsSettings> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('google_analytics_settings')
      .select('measurement_id, api_secret, enabled')
      .eq('user_id', 'admin')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Google Analytics settings:', error)
      throw error
    }

    return {
      measurement_id: data?.measurement_id || null,
      api_secret: data?.api_secret || null,
      enabled: data?.enabled || false
    }
  } catch (error) {
    console.error('Failed to fetch Google Analytics settings:', error)
    return {
      measurement_id: null,
      api_secret: null,
      enabled: false
    }
  }
}

export async function updateGoogleAnalyticsSettings(
  settings: GoogleAnalyticsSettings
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient()

    // Validate measurement ID if provided and enabled
    if (settings.enabled && settings.measurement_id) {
      const trimmedId = settings.measurement_id.trim()
      if (!trimmedId.match(/^G-[A-Z0-9]+$/)) {
        return {
          success: false,
          message: 'Invalid Measurement ID format'
        }
      }
    }

    const { error } = await supabase
      .from('google_analytics_settings')
      .upsert({
        user_id: 'admin',
        measurement_id: settings.measurement_id?.trim() || null,
        api_secret: settings.api_secret?.trim() || null,
        enabled: settings.enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error updating Google Analytics settings:', error)
      return {
        success: false,
        message: 'Failed to update settings'
      }
    }

    // Revalidate pages that might be affected
    revalidatePath('/dashboard/settings/analytics')
    revalidatePath('/') // Homepage
    revalidatePath('/about')
    revalidatePath('/menu')
    revalidatePath('/contact')

    return {
      success: true
    }
  } catch (error) {
    console.error('Failed to update Google Analytics settings:', error)
    return {
      success: false,
      message: 'An unexpected error occurred'
    }
  }
} 