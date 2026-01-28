'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit'

export async function login(formData: FormData) {
  // Get IP address for rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  // Rate limiting: 5 attempts per 15 minutes per IP (brute force protection)
  const rateLimit = checkRateLimit(ipAddress, RateLimitPresets.auth)
  if (!rateLimit.success) {
    console.warn(`Login rate limit exceeded: ${ipAddress}`)
    redirect('/login?error=Too many login attempts. Please try again in 15 minutes.')
  }

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Basic input validation
  if (!data.email || !data.password) {
    redirect('/login?error=Please enter email and password')
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    // Generic error message to prevent user enumeration
    redirect('/login?error=Invalid credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}



export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error.message)
    redirect('/login?error=Could not sign out')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
} 