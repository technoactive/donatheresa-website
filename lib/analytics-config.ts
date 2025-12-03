// Analytics Configuration - Industry Standard Settings
// Customize these values based on your business metrics

export const ANALYTICS_CONFIG = {
  // Business Values
  values: {
    // Average spend per person for booking value calculation
    avgSpendPerPerson: 45,  // £45 average per guest
    
    // Lead values for different contact types
    leadValues: {
      general: 15,           // General inquiry value
      menu: 10,             // Menu inquiry (lower intent)
      feedback: 5,          // Feedback (relationship building)
      'private-events': 250, // Private events (high value)
      catering: 200,        // Catering services (high value)
      other: 20             // Other inquiries
    },
    
    // Currency
    currency: 'GBP'
  },
  
  // Booking Categories
  bookingCategories: {
    partySize: {
      small: { max: 2, label: 'Couple' },
      medium: { max: 5, label: 'Small Group' },
      large: { max: 8, label: 'Large Party' },
      vip: { max: 999, label: 'VIP Group' }
    },
    
    timeSlots: {
      lunch: { start: '12:00', end: '15:00', label: 'Lunch' },
      earlyDinner: { start: '17:00', end: '18:30', label: 'Early Dinner' },
      primeDinner: { start: '19:00', end: '20:30', label: 'Prime Dinner' },
      lateDinner: { start: '21:00', end: '23:00', label: 'Late Dinner' }
    },
    
    leadTime: {
      immediate: { hours: 4, label: 'Same Day' },
      shortNotice: { hours: 24, label: 'Next Day' },
      planned: { hours: 72, label: 'Planned' },
      advance: { hours: 168, label: 'Week+ Advance' }
    }
  },
  
  // Custom Dimensions (set these up in GA4)
  customDimensions: {
    bookingDate: 'dimension1',
    bookingTime: 'dimension2',
    partySize: 'dimension3',
    leadType: 'dimension4',
    bookingSource: 'dimension5',
    specialRequests: 'dimension6',
    dayOfWeek: 'dimension7',
    timeSlotCategory: 'dimension8',
    leadTimeCategory: 'dimension9',
    customerType: 'dimension10'
  },
  
  // Goals and Thresholds
  goals: {
    targetConversionRate: 5.0,      // 5% of visitors should book
    targetFormCompletionRate: 60.0, // 60% who start should complete
    targetContactResponseRate: 80.0, // 80% of contacts should be quality leads
  }
}

// Helper function to calculate dynamic booking value
export function calculateBookingValue(partySize: number, date: string, time: string): number {
  const baseValue = partySize * ANALYTICS_CONFIG.values.avgSpendPerPerson
  
  // Add multipliers for special occasions
  const dayOfWeek = new Date(date).getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const isPrimeTime = time >= '19:00' && time <= '20:30'
  
  let multiplier = 1.0
  if (isWeekend) multiplier *= 1.2          // 20% more on weekends
  if (isPrimeTime) multiplier *= 1.15       // 15% more during prime time
  if (partySize >= 6) multiplier *= 1.1     // 10% more for large parties
  
  return Math.round(baseValue * multiplier)
}

// Helper function to categorize booking
export function categorizeBooking(partySize: number, date: string, time: string) {
  const { bookingCategories } = ANALYTICS_CONFIG
  
  // Party size category
  let partySizeCategory = 'Small'
  for (const [key, config] of Object.entries(bookingCategories.partySize)) {
    if (partySize <= config.max) {
      partySizeCategory = config.label
      break
    }
  }
  
  // Time slot category
  let timeSlotCategory = 'Other'
  for (const [key, config] of Object.entries(bookingCategories.timeSlots)) {
    if (time >= config.start && time <= config.end) {
      timeSlotCategory = config.label
      break
    }
  }
  
  // Lead time category
  const bookingDateTime = new Date(`${date}T${time}`)
  const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60)
  let leadTimeCategory = 'Unknown'
  
  if (hoursUntilBooking < bookingCategories.leadTime.immediate.hours) {
    leadTimeCategory = bookingCategories.leadTime.immediate.label
  } else if (hoursUntilBooking < bookingCategories.leadTime.shortNotice.hours) {
    leadTimeCategory = bookingCategories.leadTime.shortNotice.label
  } else if (hoursUntilBooking < bookingCategories.leadTime.planned.hours) {
    leadTimeCategory = bookingCategories.leadTime.planned.label
  } else {
    leadTimeCategory = bookingCategories.leadTime.advance.label
  }
  
  return {
    partySizeCategory,
    timeSlotCategory,
    leadTimeCategory,
    isVip: partySize >= 6,
    isPeakTime: timeSlotCategory === 'Prime Dinner',
    isLastMinute: leadTimeCategory === 'Same Day'
  }
}

// Helper to get lead value
export function getLeadValue(contactType: string): number {
  return ANALYTICS_CONFIG.values.leadValues[contactType as keyof typeof ANALYTICS_CONFIG.values.leadValues] || 
         ANALYTICS_CONFIG.values.leadValues.other
}
