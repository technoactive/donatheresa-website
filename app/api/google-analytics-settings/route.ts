import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('google_analytics_settings')
      .select('measurement_id, enabled')
      .eq('user_id', 'admin')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Google Analytics settings:', error)
      return NextResponse.json(
        { measurement_id: null, enabled: false },
        { status: 200 }
      )
    }

    // Return settings or defaults
    return NextResponse.json({
      measurement_id: data?.measurement_id || null,
      enabled: data?.enabled || false
    })
  } catch (error) {
    console.error('Failed to fetch Google Analytics settings:', error)
    return NextResponse.json(
      { measurement_id: null, enabled: false },
      { status: 200 }
    )
  }
} 