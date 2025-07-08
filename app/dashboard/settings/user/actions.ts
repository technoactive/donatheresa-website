'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Authentication error:', userError)
    return { 
      error: 'Not authenticated',
      success: false 
    }
  }

  const displayName = formData.get('display_name') as string

  if (!displayName || displayName.trim().length === 0) {
    return { 
      error: 'Display name is required',
      success: false 
    }
  }

  if (displayName.trim().length > 100) {
    return { 
      error: 'Display name must be less than 100 characters',
      success: false 
    }
  }

  try {
    console.log('Attempting to update profile for user:', user.id, 'with display name:', displayName.trim())
    
    // First, try to check if the user_profiles table exists and is accessible
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    console.log('Existing profile check:', { existingProfile, checkError })
    
    // Update or insert user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        display_name: displayName.trim(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    console.log('Upsert result:', { data, error })

    if (error) {
      console.error('Database error updating profile:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return { 
        error: `Database error: ${error.message}`,
        success: false 
      }
    }

    revalidatePath('/dashboard/settings/user')
    return { 
      success: true,
      message: 'Profile updated successfully!'
    }
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return { 
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false 
    }
  }
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  
  const currentPassword = formData.get('current_password') as string
  const newPassword = formData.get('new_password') as string
  const confirmPassword = formData.get('confirm_password') as string

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { 
      error: 'All password fields are required',
      success: false 
    }
  }

  if (newPassword !== confirmPassword) {
    return { 
      error: 'New passwords do not match',
      success: false 
    }
  }

  if (newPassword.length < 8) {
    return { 
      error: 'New password must be at least 8 characters long',
      success: false 
    }
  }

  if (newPassword === currentPassword) {
    return { 
      error: 'New password must be different from current password',
      success: false 
    }
  }

  try {
    // Get current user to verify current password
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { 
        error: 'Not authenticated',
        success: false 
      }
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError) {
      return { 
        error: 'Current password is incorrect',
        success: false 
      }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('Error updating password:', updateError)
      return { 
        error: 'Failed to update password. Please try again.',
        success: false 
      }
    }

    return { 
      success: true,
      message: 'Password updated successfully!'
    }
  } catch (error) {
    console.error('Error changing password:', error)
    return { 
      error: 'Failed to update password. Please try again.',
      success: false 
    }
  }
} 