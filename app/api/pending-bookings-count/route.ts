import { NextResponse } from 'next/server'
import { getPendingBookingsCount } from '@/lib/database'

export async function GET() {
  try {
    const count = await getPendingBookingsCount()
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching pending bookings count:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
} 