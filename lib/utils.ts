import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Customer Segment Utilities - Restaurant Industry Standards
export const getCustomerSegmentInfo = (segment: string | undefined) => {
  switch (segment) {
    case 'vip':
      return {
        label: 'VIP',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        description: '10+ bookings, highly valued customer'
      }
    case 'regular':
      return {
        label: 'Regular',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: '3+ bookings, loyal customer'
      }
    case 'inactive':
      return {
        label: 'Inactive',
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        description: 'No recent bookings (180+ days)'
      }
    case 'new':
    default:
      return {
        label: 'New',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'New or low-frequency customer'
      }
  }
}

export const formatCustomerStats = (customer: any) => {
  const totalBookings = customer.total_bookings || 0
  const recentBookings = customer.recent_bookings || 0
  const avgPartySize = customer.average_party_size || 0
  const lastBooking = customer.last_booking_date
  
  return {
    totalBookings,
    recentBookings,
    avgPartySize: Number(avgPartySize).toFixed(1),
    lastBooking: lastBooking ? new Date(lastBooking).toLocaleDateString() : 'Never',
    hasRecentActivity: recentBookings > 0,
    isFrequentCustomer: totalBookings >= 3,
    isVip: totalBookings >= 10
  }
}

// Customer engagement analytics
export const getCustomerEngagementLevel = (customer: any) => {
  const stats = formatCustomerStats(customer)
  
  if (stats.isVip && stats.hasRecentActivity) {
    return { level: 'high', color: 'text-purple-600', icon: '👑' }
  } else if (stats.isFrequentCustomer && stats.hasRecentActivity) {
    return { level: 'medium', color: 'text-blue-600', icon: '⭐' }
  } else if (stats.hasRecentActivity) {
    return { level: 'active', color: 'text-green-600', icon: '✅' }
  } else {
    return { level: 'low', color: 'text-gray-500', icon: '💤' }
  }
}
