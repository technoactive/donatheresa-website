import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]
    
    // Fetch all bookings in the period
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        booking_time,
        party_size,
        status,
        source,
        created_at,
        customer:customers (
          id,
          name,
          email,
          customer_segment,
          total_bookings
        )
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
    
    if (bookingsError) {
      console.error('Failed to fetch bookings:', bookingsError)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
    
    // Calculate statistics
    const totalBookings = bookings?.length || 0
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'completed').length || 0
    const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
    
    // Total guests
    const totalGuests = bookings?.reduce((sum, b) => sum + (b.party_size || 0), 0) || 0
    
    // Average party size
    const avgPartySize = totalBookings > 0 ? totalGuests / totalBookings : 0
    
    // Bookings by party size
    const bookingsBySize: Record<number, number> = {}
    bookings?.forEach(b => {
      const size = b.party_size || 0
      bookingsBySize[size] = (bookingsBySize[size] || 0) + 1
    })
    
    // Bookings by day of week
    const bookingsByDay: Record<string, number> = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    }
    bookings?.forEach(b => {
      if (b.booking_date) {
        const day = new Date(b.booking_date).toLocaleDateString('en-US', { weekday: 'long' })
        bookingsByDay[day] = (bookingsByDay[day] || 0) + 1
      }
    })
    
    // Bookings by source
    const bookingsBySource = {
      website: bookings?.filter(b => b.source === 'website').length || 0,
      dashboard: bookings?.filter(b => b.source === 'dashboard').length || 0
    }
    
    // Top customers (most bookings in period)
    const customerBookings: Record<string, { name: string; email: string; bookings: number; segment: string }> = {}
    bookings?.forEach(b => {
      const customer = b.customer as any
      if (customer?.email) {
        if (!customerBookings[customer.email]) {
          customerBookings[customer.email] = {
            name: customer.name || 'Unknown',
            email: customer.email,
            bookings: 0,
            segment: customer.customer_segment || 'new'
          }
        }
        customerBookings[customer.email].bookings++
      }
    })
    
    const topCustomers = Object.values(customerBookings)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10)
    
    // Website conversion rate (rough estimate based on confirmed bookings)
    const websiteBookings = bookingsBySource.website
    const conversionRate = websiteBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0
    
    return NextResponse.json({
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      pendingBookings,
      totalGuests,
      avgPartySize,
      bookingsBySize,
      bookingsByDay,
      bookingsBySource,
      topCustomers,
      conversionRate,
      periodDays: days
    })
  } catch (error) {
    console.error('Error in booking-stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
