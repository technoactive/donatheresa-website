'use client'

import React from 'react'
import { format } from 'date-fns'
import { enGB, es, fr, de, it, pt } from 'date-fns/locale'
import { type LocaleSettings } from '@/lib/types'

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

interface FormattedDateProps {
  date: Date | string
  className?: string
  includeTime?: boolean
  fallback?: string
}

export function FormattedDate({ date, className, includeTime = false, fallback }: FormattedDateProps) {
  const [localeSettings, setLocaleSettings] = React.useState<LocaleSettings | null>(null)

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/locale-settings')
        if (response.ok) {
          const settings = await response.json()
          setLocaleSettings(settings)
        }
      } catch (error) {
        console.error('Error loading locale settings:', error)
      }
    }

    loadSettings()
  }, [])

  if (!localeSettings) {
    return <span className={className}>{fallback || '...'}</span>
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const locale = localeMap[localeSettings.language_code as keyof typeof localeMap] || enGB

  // Convert date format patterns
  const formatMap: { [key: string]: string } = {
    'dd/MM/yyyy': 'dd/MM/yyyy',
    'MM/dd/yyyy': 'MM/dd/yyyy',
    'yyyy-MM-dd': 'yyyy-MM-dd',
    'dd-MM-yyyy': 'dd-MM-yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'YYYY-MM-DD': 'yyyy-MM-dd',
  }

  const dateFnsFormat = formatMap[localeSettings.date_format] || 'dd/MM/yyyy'
  
  // Time format patterns
  const timeFormatMap: { [key: string]: string } = {
    'HH:mm': 'HH:mm',
    'HH:mm:ss': 'HH:mm:ss',
    'hh:mm a': 'hh:mm a',
    'hh:mm:ss a': 'hh:mm:ss a',
    'h:mm a': 'h:mm a',
    'H:mm': 'H:mm',
  }

  const timeFnsFormat = timeFormatMap[localeSettings.time_format] || 'HH:mm'

  const formatPattern = includeTime ? `${dateFnsFormat} ${timeFnsFormat}` : dateFnsFormat

  try {
    const formatted = format(dateObj, formatPattern, { locale })
    return <span className={className}>{formatted}</span>
  } catch (error) {
    console.error('Error formatting date:', error)
    return <span className={className}>{fallback || dateObj.toLocaleDateString()}</span>
  }
}

interface FormattedCurrencyProps {
  amount: number | string
  className?: string
  fallback?: string
}

export function FormattedCurrency({ amount, className, fallback }: FormattedCurrencyProps) {
  const [localeSettings, setLocaleSettings] = React.useState<LocaleSettings | null>(null)

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/locale-settings')
        if (response.ok) {
          const settings = await response.json()
          setLocaleSettings(settings)
        }
      } catch (error) {
        console.error('Error loading locale settings:', error)
      }
    }

    loadSettings()
  }, [])

  if (!localeSettings) {
    return <span className={className}>{fallback || '...'}</span>
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  try {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: localeSettings.currency_code,
      minimumFractionDigits: localeSettings.currency_decimal_places,
      maximumFractionDigits: localeSettings.currency_decimal_places,
    })

    // Format and replace with custom symbol if different
    let formatted = formatter.format(numericAmount)
    if (localeSettings.currency_symbol && localeSettings.currency_symbol !== '£') {
      formatted = formatted.replace('£', localeSettings.currency_symbol)
    }

    return <span className={className}>{formatted}</span>
  } catch (error) {
    console.error('Error formatting currency:', error)
    return <span className={className}>{fallback || `${localeSettings.currency_symbol}${numericAmount.toFixed(localeSettings.currency_decimal_places)}`}</span>
  }
} 