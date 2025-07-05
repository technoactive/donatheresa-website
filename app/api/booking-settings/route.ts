import { NextResponse } from 'next/server'
import { getBookingSettings } from '@/lib/database'

export async function GET() {
  try {
    const settings = await getBookingSettings()
    console.log('[API] Booking settings fetched from Supabase:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching booking settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking settings' },
      { status: 500 }
    )
  }
} 