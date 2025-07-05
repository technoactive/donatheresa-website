import { format, parseISO } from 'date-fns'
import { enGB, es, fr, de, it, pt } from 'date-fns/locale'
import { getLocaleSettings } from './database'

// Locale map for date-fns
const localeMap = {
  'en-GB': enGB,
  'en-US': enGB,
  'es': es,
  'fr': fr,
  'de': de,
  'it': it,
  'pt': pt,
}

// Timezone conversion utilities
export function convertToRestaurantTimezone(date: Date, timezone: string): Date {
  // Convert date to restaurant timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  const parts = formatter.formatToParts(date)
  const restaurantTime = new Date(
    `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}T${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}:${parts.find(p => p.type === 'second')?.value}`
  )
  
  return restaurantTime
}

export function getRestaurantNow(timezone: string): Date {
  return convertToRestaurantTimezone(new Date(), timezone)
}

export function getRestaurantDateString(timezone: string): string {
  const restaurantDate = getRestaurantNow(timezone)
  return format(restaurantDate, 'yyyy-MM-dd')
}

export function formatDateWithLocale(date: Date, dateFormat: string, languageCode: string): string {
  const locale = localeMap[languageCode as keyof typeof localeMap] || enGB
  
  // Convert common format patterns
  const formatMap: { [key: string]: string } = {
    'dd/MM/yyyy': 'dd/MM/yyyy',
    'MM/dd/yyyy': 'MM/dd/yyyy',
    'yyyy-MM-dd': 'yyyy-MM-dd',
    'dd-MM-yyyy': 'dd-MM-yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'YYYY-MM-DD': 'yyyy-MM-dd',
  }
  
  const dateFnsFormat = formatMap[dateFormat] || 'dd/MM/yyyy'
  
  return format(date, dateFnsFormat, { locale })
}

export function formatTimeWithLocale(date: Date, timeFormat: string): string {
  const formatMap: { [key: string]: string } = {
    'HH:mm': 'HH:mm',
    'HH:mm:ss': 'HH:mm:ss',
    'hh:mm a': 'hh:mm a',
    'hh:mm:ss a': 'hh:mm:ss a',
    'h:mm a': 'h:mm a',
    'H:mm': 'H:mm',
  }
  
  const dateFnsFormat = formatMap[timeFormat] || 'HH:mm'
  
  return format(date, dateFnsFormat)
}

export function formatCurrency(amount: number, currencyCode: string, currencySymbol: string, decimalPlaces: number): string {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
  
  // Use custom symbol if provided
  const formatted = formatter.format(amount)
  if (currencySymbol && currencySymbol !== '£') {
    return formatted.replace('£', currencySymbol)
  }
  
  return formatted
}

export function formatNumber(number: number, decimalSeparator: string, thousandsSeparator: string): string {
  const parts = number.toString().split('.')
  
  // Add thousands separator
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
  
  // Use custom decimal separator
  if (parts[1] && decimalSeparator !== '.') {
    return parts.join(decimalSeparator)
  }
  
  return parts.join('.')
}

// Booking validation utilities
export function isDateInRestaurantPast(date: string, timezone: string): boolean {
  const bookingDate = parseISO(date)
  const restaurantToday = getRestaurantNow(timezone)
  
  // Set both dates to start of day for comparison
  const bookingDateStart = new Date(bookingDate)
  bookingDateStart.setHours(0, 0, 0, 0)
  
  const restaurantTodayStart = new Date(restaurantToday)
  restaurantTodayStart.setHours(0, 0, 0, 0)
  
  return bookingDateStart < restaurantTodayStart
}

export function isDateWithinAdvanceLimit(date: string, timezone: string, maxAdvanceDays: number): boolean {
  const bookingDate = parseISO(date)
  const restaurantToday = getRestaurantNow(timezone)
  
  const maxDate = new Date(restaurantToday)
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays)
  maxDate.setHours(23, 59, 59, 999)
  
  return bookingDate <= maxDate
}

// Common timezone utilities
export const commonTimezones = [
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+0/+1' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+1/+2' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', offset: '+1/+2' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', offset: '+1/+2' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+1/+2' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', offset: '+1/+2' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT/IST)', offset: '+0/+1' },
  { value: 'Europe/Lisbon', label: 'Lisbon (WET/WEST)', offset: '+0/+1' },
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: '-5/-4' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: '-6/-5' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: '-7/-6' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-8/-7' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', offset: '-5/-4' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', offset: '-8/-7' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+10/+11' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', offset: '+10/+11' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+9' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+8' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: '+8' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+8' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: '+12/+13' },
]

export const commonCountries = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
  { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€' },
  { code: 'FR', name: 'France', currency: 'EUR', symbol: '€' },
  { code: 'IT', name: 'Italy', currency: 'EUR', symbol: '€' },
  { code: 'ES', name: 'Spain', currency: 'EUR', symbol: '€' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', symbol: '€' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', symbol: '€' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', symbol: '€' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', symbol: '€' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
  { code: 'NO', name: 'Norway', currency: 'NOK', symbol: 'kr' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', symbol: 'kr' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', symbol: 'HK$' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
]

export const commonLanguages = [
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
] 