'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { type LocaleSettings } from '@/lib/types'

interface LocaleContextType {
  localeSettings: LocaleSettings | null
  isLoading: boolean
  refresh: () => Promise<void>
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

interface LocaleProviderProps {
  children: React.ReactNode
  initialSettings?: LocaleSettings
}

export function LocaleProvider({ children, initialSettings }: LocaleProviderProps) {
  const [localeSettings, setLocaleSettings] = useState<LocaleSettings | null>(initialSettings || null)
  const [isLoading, setIsLoading] = useState(!initialSettings)

  const loadLocaleSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/locale-settings')
      if (response.ok) {
        const settings = await response.json()
        setLocaleSettings(settings)
      } else {
        console.error('Failed to fetch locale settings')
        // Fallback to default settings
        setLocaleSettings({
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
          created_at: '',
          updated_at: ''
        })
      }
    } catch (error) {
      console.error('Error loading locale settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = async () => {
    await loadLocaleSettings()
  }

  useEffect(() => {
    if (!initialSettings) {
      loadLocaleSettings()
    }
  }, [initialSettings])

  return (
    <LocaleContext.Provider value={{ localeSettings, isLoading, refresh }}>
      {children}
    </LocaleContext.Provider>
  )
} 