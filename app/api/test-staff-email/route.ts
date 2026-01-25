import { NextResponse } from 'next/server'
import { RobustEmailUtils } from '@/lib/email/robust-email-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log("Testing staff email notification...")
    
    const testBooking = {
      id: 'test-id',
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: '19:00',
      party_size: 6,
      booking_reference: 'TEST-001',
      special_requests: 'Test booking'
    }
    
    const testCustomer = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '07500000000'
    }
    
    console.log("Calling sendStaffBookingStatusNotification...")
    const result = await RobustEmailUtils.sendStaffBookingStatusNotification(
      testBooking, 
      testCustomer, 
      'confirmed'
    )
    
    console.log("Email result:", result)
    
    return NextResponse.json({ 
      success: result.success,
      result: result
    })
  } catch (error) {
    console.error("Test failed:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
