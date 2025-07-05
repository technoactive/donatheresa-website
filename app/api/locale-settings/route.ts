import { NextResponse } from 'next/server'
import { getLocaleSettings } from '@/lib/database'

export async function GET() {
  try {
    const settings = await getLocaleSettings()
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching locale settings:', error)
    
    // Return default settings as fallback
    return NextResponse.json({
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
    })
  }
} 