'use server'

import { getLocaleSettings as getDbLocaleSettings, updateLocaleSettings as updateDbLocaleSettings } from '@/lib/database'
import { type LocaleSettings } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getLocaleSettings(): Promise<LocaleSettings> {
  try {
    const settings = await getDbLocaleSettings()
    return settings
  } catch (error) {
    console.error('Error in getLocaleSettings action:', error)
    throw error
  }
}

export async function updateLocaleSettings(settings: Partial<LocaleSettings>): Promise<{ success: boolean; message?: string }> {
  try {
    await updateDbLocaleSettings(settings)
    revalidatePath('/dashboard/settings/locale')
    revalidatePath('/dashboard/settings')
    
    return {
      success: true,
      message: 'Locale settings updated successfully'
    }
  } catch (error) {
    console.error('Error in updateLocaleSettings action:', error)
    return {
      success: false,
      message: 'Failed to update locale settings'
    }
  }
} 