export type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  notes?: string
  bookingCount?: number
  created_at?: string
  updated_at?: string
  // Enhanced booking analytics
  total_bookings?: number
  recent_bookings?: number
  last_booking_date?: string
  average_party_size?: number
  no_show_count?: number
  cancelled_bookings?: number
  customer_segment?: 'new' | 'regular' | 'vip' | 'inactive'
}

export type DatabaseCustomer = {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  updated_at: string
  // Enhanced booking analytics
  total_bookings?: number
  recent_bookings?: number
  last_booking_date?: string
  average_party_size?: number
  no_show_count?: number
  cancelled_bookings?: number
  customer_segment?: 'new' | 'regular' | 'vip' | 'inactive'
}

// All possible deposit statuses
export type DepositStatus = 'none' | 'pending' | 'authorized' | 'captured' | 'cancelled' | 'refunded' | 'partially_refunded' | 'expired' | 'failed'

export type Booking = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  partySize: number
  bookingTime: Date
  status: "pending" | "confirmed" | "cancelled" | "completed"
  source: "website" | "dashboard"
  notes?: string
  bookingReference?: string
  // Deposit fields
  deposit_required?: boolean
  deposit_amount?: number | null // Amount in pence
  deposit_status?: DepositStatus
  deposit_refund_amount?: number | null // Amount already refunded in pence
  deposit_captured_at?: string | null
  deposit_refunded_at?: string | null
  stripe_payment_intent_id?: string | null
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
  // Reconfirmation settings
  reconfirmation_enabled?: boolean
  reconfirmation_min_party_size?: number
  reconfirmation_days_before?: number
  reconfirmation_deadline_hours?: number
  reconfirmation_no_response_action?: 'auto_cancel' | 'flag_only' | 'second_reminder'
  // Deposit settings
  deposit_enabled?: boolean
  deposit_min_party_size?: number
  deposit_amount_per_person?: number // Amount in pence
  deposit_cancellation_hours?: number
  deposit_late_cancel_charge_percent?: number
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
