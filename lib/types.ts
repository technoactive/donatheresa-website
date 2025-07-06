export type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  notes?: string
  bookingCount?: number
  created_at?: string
  updated_at?: string
}

export type DatabaseCustomer = {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  updated_at: string
}

export type Booking = {
  id: string
  customerName: string
  customerEmail: string
  partySize: number
  bookingTime: Date
  status: "pending" | "confirmed" | "cancelled"
  source: "website" | "dashboard"
  notes?: string
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

export interface BookingSettings {
  booking_enabled: boolean
  max_advance_days: number
  max_party_size: number
  total_seats: number
  available_times: string[]
  closed_dates: string[]
  closed_days_of_week: number[]
  suspension_message: string
  service_periods?: ServicePeriod[]
  maintenance_mode?: boolean
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
}

export interface ActionState {
  message: string
  success: boolean
  errors?: Record<string, string[]>
}

export interface LocaleSettings {
  id: number
  
  // Location & Timezone
  restaurant_timezone: string
  country_code: string
  language_code: string
  
  // Currency & Formatting
  currency_code: string
  currency_symbol: string
  currency_decimal_places: number
  
  // Date & Time Formatting
  date_format: string
  time_format: string
  first_day_of_week: number
  
  // Number Formatting
  decimal_separator: string
  thousands_separator: string
  
  // Restaurant Details
  restaurant_name: string
  restaurant_phone: string
  restaurant_address: string
  restaurant_city: string
  restaurant_postal_code: string
  
  // System Settings
  created_at: string
  updated_at: string
}
