import "server-only"
import { createClient } from "@/lib/supabase/server"
import { DatabaseCustomer, LocaleSettings } from "@/lib/types"

// Types for the database
export interface Booking {
  id: string
  customer_id: string
  booking_date: string
  booking_time: string
  party_size: number
  status: 'pending' | 'confirmed' | 'cancelled'
  source: 'website' | 'dashboard'
  special_requests?: string
  created_at: string
  updated_at: string
}

export interface BookingWithCustomer extends Booking {
  customer: DatabaseCustomer
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'responded' | 'archived'
  created_at: string
  updated_at: string
}

export interface BookingSettings {
  booking_enabled: boolean
  max_advance_days: number
  max_party_size: number
  total_seats: number
  available_times: string[]
  closed_dates: string[]
  closed_days_of_week: number[]
  suspension_message: string
  maintenance_mode: boolean
  service_periods?: ServicePeriod[]
}

export interface ServicePeriod {
  id?: string
  name: string
  start_time: string
  end_time: string
  last_order_time: string
  kitchen_closing_time: string
  interval_minutes: number
  enabled: boolean
  period_type: 'lunch' | 'dinner' | 'break' | 'other'
  sort_order: number
}

// Customer functions
export async function upsertCustomer(customer: {
  name: string
  email: string
  phone?: string
}): Promise<DatabaseCustomer> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('upsert_customer', {
    p_name: customer.name,
    p_email: customer.email,
    p_phone: customer.phone || null,
    p_notes: null
  })

  if (error) throw error

  // Get the full customer record
  const { data: customerData, error: fetchError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', data)
    .single()

  if (fetchError) throw fetchError
  return customerData
}

export async function getCustomers(): Promise<DatabaseCustomer[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCustomerByEmail(email: string): Promise<DatabaseCustomer | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
  return data
}

export async function updateCustomer(id: string, updates: Partial<DatabaseCustomer>): Promise<DatabaseCustomer> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCustomer(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Booking functions
export async function createBooking(booking: {
  customer_id: string
  booking_date: string
  booking_time: string
  party_size: number
  special_requests?: string
  source?: 'website' | 'dashboard'
}): Promise<Booking> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: booking.customer_id,
      booking_date: booking.booking_date,
      booking_time: booking.booking_time,
      party_size: booking.party_size,
      special_requests: booking.special_requests || null,
      source: booking.source || 'website',
      status: 'confirmed'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getBookings(): Promise<BookingWithCustomer[]> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        customer_id,
        booking_date,
        booking_time,
        party_size,
        status,
        source,
        special_requests,
        created_at,
        updated_at,
        customers (
          id,
          name,
          email,
          phone,
          created_at,
          updated_at
        )
      `)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
    
    // Transform the data to match our interface
    return (data || []).map(booking => {
      const customer = Array.isArray(booking.customers) ? booking.customers[0] : booking.customers
      
      return {
        id: booking.id,
        customer_id: booking.customer_id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        party_size: booking.party_size,
        status: booking.status,
        source: booking.source,
        special_requests: booking.special_requests,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          created_at: customer.created_at,
          updated_at: customer.updated_at
        }
      }
    })
  } catch (error) {
    console.error('Database error in getBookings:', error)
    // Return empty array instead of throwing to prevent re-render loops
    return []
  }
}

export async function getBookingById(id: string): Promise<BookingWithCustomer | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      customer_id,
      booking_date,
      booking_time,
      party_size,
      status,
      source,
      special_requests,
      created_at,
      updated_at,
      customers (
        id,
        name,
        email,
        phone,
        created_at,
        updated_at
      )
    `)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  if (!data) return null

  const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers

  return {
    id: data.id,
    customer_id: data.customer_id,
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    party_size: data.party_size,
    status: data.status,
    source: data.source,
    special_requests: data.special_requests,
    created_at: data.created_at,
    updated_at: data.updated_at,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    }
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBooking(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Contact message functions
export async function createContactMessage(message: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}): Promise<ContactMessage> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: message.name,
      email: message.email,
      phone: message.phone || null,
      subject: message.subject,
      message: message.message,
      status: 'new'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Service Periods functions
export async function getServicePeriods(): Promise<ServicePeriod[]> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_service_periods')
    
    if (error) {
      console.error('Error fetching service periods:', error)
      return []
    }
    
    return (data || []).map((period: any) => ({
      id: period.id,
      name: period.name,
      start_time: period.start_time,
      end_time: period.end_time,
      last_order_time: period.last_order_time,
      kitchen_closing_time: period.kitchen_closing_time,
      interval_minutes: period.interval_minutes,
      enabled: period.enabled,
      period_type: period.period_type,
      sort_order: period.sort_order
    }))
  } catch (error) {
    console.error('Database error in getServicePeriods:', error)
    return []
  }
}

export async function upsertServicePeriod(period: Omit<ServicePeriod, 'id'> & { id?: string }): Promise<string | null> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('upsert_service_period', {
      p_id: period.id || null,
      p_name: period.name,
      p_start_time: period.start_time,
      p_end_time: period.end_time,
      p_last_order_time: period.last_order_time,
      p_kitchen_closing_time: period.kitchen_closing_time,
      p_interval_minutes: period.interval_minutes,
      p_enabled: period.enabled,
      p_period_type: period.period_type,
      p_sort_order: period.sort_order
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error upserting service period:', error)
    throw error
  }
}

export async function deleteServicePeriod(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('delete_service_period', { p_id: id })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error deleting service period:', error)
    throw error
  }
}

export async function generateTimeSlotsFromPeriods(): Promise<string[]> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('generate_time_slots_from_periods')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error generating time slots:', error)
    return []
  }
}

// Booking settings functions
export async function getBookingSettings(): Promise<BookingSettings> {
  const supabase = await createClient()
  
  // Provide defaults if no settings exist
  const defaultSettings: BookingSettings = {
    booking_enabled: true,
    max_advance_days: 30,
    max_party_size: 8,
    total_seats: 0,
    available_times: [
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
    ],
    closed_dates: [],
    closed_days_of_week: [],
    suspension_message: "",
    maintenance_mode: false,
    service_periods: []
  }

  try {
    // Get booking config
    const { data: configData, error: configError } = await supabase
      .from('booking_config')
      .select('*')
      .eq('id', 1)
      .single()

    // Get service periods
    const servicePeriods = await getServicePeriods()

    if (configError) {
      console.error('Error fetching booking settings:', configError)
      return { ...defaultSettings, service_periods: servicePeriods }
    }
    
    if (!configData) {
      return { ...defaultSettings, service_periods: servicePeriods }
    }

    return {
      booking_enabled: configData.booking_enabled ?? defaultSettings.booking_enabled,
      max_advance_days: configData.max_advance_days ?? defaultSettings.max_advance_days,
      max_party_size: configData.max_party_size ?? defaultSettings.max_party_size,
      total_seats: configData.total_seats ?? defaultSettings.total_seats,
      available_times: configData.available_times ?? defaultSettings.available_times,
      closed_dates: configData.closed_dates ?? defaultSettings.closed_dates,
      closed_days_of_week: configData.closed_days_of_week ?? defaultSettings.closed_days_of_week,
      suspension_message: configData.suspension_message ?? defaultSettings.suspension_message,
      maintenance_mode: configData.maintenance_mode ?? defaultSettings.maintenance_mode,
      service_periods: servicePeriods
    }
  } catch (error) {
    console.error('Database error in getBookingSettings:', error)
    // Return defaults with service periods if available
    const servicePeriods = await getServicePeriods()
    return { ...defaultSettings, service_periods: servicePeriods }
  }
}

export async function updateBookingSettings(settings: Partial<BookingSettings>): Promise<void> {
  const supabase = await createClient()
  
  try {
    // Prepare the update object with proper array handling
    const updateData: any = {}
    
    // Handle regular fields
    if (settings.booking_enabled !== undefined) updateData.booking_enabled = settings.booking_enabled
    if (settings.max_advance_days !== undefined) updateData.max_advance_days = settings.max_advance_days
    if (settings.max_party_size !== undefined) updateData.max_party_size = settings.max_party_size
    if (settings.total_seats !== undefined) updateData.total_seats = settings.total_seats
    if (settings.suspension_message !== undefined) updateData.suspension_message = settings.suspension_message
    if (settings.maintenance_mode !== undefined) updateData.maintenance_mode = settings.maintenance_mode
    
    // Handle array fields - ensure they're passed as native arrays, not JSON strings
    if (settings.available_times !== undefined) updateData.available_times = settings.available_times
    if (settings.closed_dates !== undefined) updateData.closed_dates = settings.closed_dates
    if (settings.closed_days_of_week !== undefined) updateData.closed_days_of_week = settings.closed_days_of_week
    
    const { error } = await supabase
      .from('booking_config')
      .update(updateData)
      .eq('id', 1)

    if (error) {
      console.error('Error updating booking settings:', error)
      throw error
    }
    
    console.log('Booking settings updated successfully:', updateData)
  } catch (error) {
    console.error('Database error in updateBookingSettings:', error)
    throw error
  }
}

// Convenience function for creating a booking with customer upsert
export async function createBookingWithCustomer(bookingData: {
  customer: {
    name: string
    email: string
    phone?: string
  }
  booking: {
    booking_date: string
    booking_time: string
    party_size: number
    special_requests?: string
    source?: 'website' | 'dashboard'
  }
}): Promise<{ customer: DatabaseCustomer; booking: Booking }> {
  // First upsert the customer
  const customer = await upsertCustomer(bookingData.customer)
  
  // Then create the booking
  const booking = await createBooking({
    customer_id: customer.id,
    ...bookingData.booking
  })

  return { customer, booking }
}

// Utility function to get booking statistics
export async function getBookingStats() {
  const supabase = await createClient()
  const { count: totalBookings, error: totalError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  if (totalError) throw totalError

  const { count: pendingBookings, error: pendingError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (pendingError) throw pendingError

  // Use restaurant timezone for "today" instead of server timezone
  const restaurantDate = await getRestaurantDate()
  const { count: todayBookings, error: todayError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('booking_date', restaurantDate)

  if (todayError) throw todayError

  const { count: totalCustomers, error: customersError } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (customersError) throw customersError

  return {
    totalBookings: totalBookings || 0,
    pendingBookings: pendingBookings || 0,
    todayBookings: todayBookings || 0,
    totalCustomers: totalCustomers || 0
  }
}

// Enhanced dashboard statistics
export async function getDashboardStats() {
  const supabase = await createClient()
  
  try {
    const restaurantDate = await getRestaurantDate()
    
    // Get today's date for comparisons
    const today = new Date(restaurantDate)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    // Get booking settings for seating capacity
    const bookingSettings = await getBookingSettings()
    
    // Today's bookings
    const { data: todayBookings, error: todayError } = await supabase
      .from('bookings')
      .select('party_size, status')
      .eq('booking_date', restaurantDate)
      .neq('status', 'cancelled')
    
    if (todayError) throw todayError
    
    // Yesterday's bookings count
    const { count: yesterdayCount, error: yesterdayError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('booking_date', yesterday.toISOString().split('T')[0])
      .neq('status', 'cancelled')
    
    if (yesterdayError) throw yesterdayError
    
    // Total customers
    const { count: totalCustomers, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
    
    if (customersError) throw customersError
    
    // New customers this week
    const { count: newCustomersThisWeek, error: newCustomersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastWeek.toISOString())
    
    if (newCustomersError) throw newCustomersError
    
    // Confirmed bookings today
    const confirmedToday = todayBookings?.filter(b => b.status === 'confirmed') || []
    const pendingToday = todayBookings?.filter(b => b.status === 'pending') || []
    
    // Calculate total guests today
    const totalGuestsToday = todayBookings?.reduce((sum, booking) => sum + booking.party_size, 0) || 0
    
    // Calculate occupancy percentage
    const occupancyPercentage = bookingSettings.total_seats > 0 
      ? Math.min(Math.round((totalGuestsToday / bookingSettings.total_seats) * 100), 100)
      : 0
    
    return {
      todayBookings: todayBookings?.length || 0,
      yesterdayBookings: yesterdayCount || 0,
      totalCustomers: totalCustomers || 0,
      newCustomersThisWeek: newCustomersThisWeek || 0,
      confirmedToday: confirmedToday.length,
      pendingToday: pendingToday.length,
      totalGuestsToday,
      totalSeats: bookingSettings.total_seats,
      occupancyPercentage,
      // Calculate percentage changes
      bookingChange: yesterdayCount ? Math.round(((todayBookings?.length || 0) - yesterdayCount) / yesterdayCount * 100) : 0,
      customerGrowth: totalCustomers ? Math.round((newCustomersThisWeek || 0) / (totalCustomers || 1) * 100) : 0
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return {
      todayBookings: 0,
      yesterdayBookings: 0,
      totalCustomers: 0,
      newCustomersThisWeek: 0,
      confirmedToday: 0,
      pendingToday: 0,
      totalGuestsToday: 0,
      totalSeats: 0,
      occupancyPercentage: 0,
      bookingChange: 0,
      customerGrowth: 0
    }
  }
}

// Get recent bookings for dashboard
export async function getRecentBookings(limit: number = 5): Promise<BookingWithCustomer[]> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        customer_id,
        booking_date,
        booking_time,
        party_size,
        status,
        source,
        special_requests,
        created_at,
        updated_at,
        customers (
          id,
          name,
          email,
          phone,
          created_at,
          updated_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    
    // Transform the data to match our interface
    return (data || []).map(booking => {
      const customer = Array.isArray(booking.customers) ? booking.customers[0] : booking.customers
      
      return {
        id: booking.id,
        customer_id: booking.customer_id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        party_size: booking.party_size,
        source: booking.source,
        status: booking.status,
        special_requests: booking.special_requests,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          created_at: customer.created_at,
          updated_at: customer.updated_at
        }
      }
    })
  } catch (error) {
    console.error('Error getting recent bookings:', error)
    return []
  }
}

// Get booking trends for charts (future enhancement)
export async function getBookingTrends(days: number = 7) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('booking_date, status, party_size')
      .gte('booking_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('booking_date', { ascending: true })
    
    if (error) throw error
    
    // Group by date and calculate metrics
    const trends = data?.reduce((acc, booking) => {
      const date = booking.booking_date
      if (!acc[date]) {
        acc[date] = { date, bookings: 0, guests: 0, confirmed: 0, pending: 0, cancelled: 0 }
      }
      
      acc[date].bookings += 1
      acc[date].guests += booking.party_size
      acc[date][booking.status] += 1
      
      return acc
    }, {} as Record<string, any>)
    
    return Object.values(trends || {})
  } catch (error) {
    console.error('Error getting booking trends:', error)
    return []
  }
}

// Locale Settings functions
export async function getLocaleSettings(): Promise<LocaleSettings> {
  const supabase = await createClient()
  
  const defaultSettings: LocaleSettings = {
    id: 1,
    restaurant_timezone: 'Europe/London',
    country_code: 'GB',
    language_code: 'en-GB',
    currency_code: 'GBP',
    currency_symbol: '£',
    currency_decimal_places: 2,
    date_format: 'dd/MM/yyyy',
    time_format: 'HH:mm',
    first_day_of_week: 1,
    decimal_separator: '.',
    thousands_separator: ',',
    restaurant_name: 'Dona Theresa',
    restaurant_phone: '+44 20 8421 5550',
    restaurant_address: '451 Uxbridge Road, Pinner',
    restaurant_city: 'London',
    restaurant_postal_code: 'HA5 1AA',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  try {
    const { data, error } = await supabase
      .from('locale_settings')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error) {
      console.error('Error fetching locale settings:', error)
      return defaultSettings
    }
    
    return data || defaultSettings
  } catch (error) {
    console.error('Database error in getLocaleSettings:', error)
    return defaultSettings
  }
}

export async function updateLocaleSettings(settings: Partial<LocaleSettings>): Promise<void> {
  const supabase = await createClient()
  
  try {
    const updateData = { ...settings }
    delete updateData.id
    delete updateData.created_at
    updateData.updated_at = new Date().toISOString()
    
    const { error } = await supabase
      .from('locale_settings')
      .update(updateData)
      .eq('id', 1)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating locale settings:', error)
    throw error
  }
}

export async function getRestaurantTime(): Promise<Date> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_restaurant_time')
    
    if (error) throw error
    return new Date(data)
  } catch (error) {
    console.error('Error getting restaurant time:', error)
    return new Date() // Fallback to system time
  }
}

export async function getRestaurantDate(): Promise<string> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.rpc('get_restaurant_date')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting restaurant date:', error)
    return new Date().toISOString().split('T')[0] // Fallback to system date
  }
} 