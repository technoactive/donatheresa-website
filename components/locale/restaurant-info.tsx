'use client'

import React from 'react'
import { type LocaleSettings } from '@/lib/types'

interface RestaurantInfoProps {
  type: 'name' | 'phone' | 'address' | 'city' | 'postalCode' | 'full-address'
  className?: string
  fallback?: string
}

export function RestaurantInfo({ type, className, fallback }: RestaurantInfoProps) {
  const [localeSettings, setLocaleSettings] = React.useState<LocaleSettings | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/locale-settings')
        if (response.ok) {
          const settings = await response.json()
          setLocaleSettings(settings)
        } else {
          console.warn('Failed to load locale settings from API')
        }
      } catch (error) {
        console.error('Error loading locale settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const getValue = () => {
    if (!localeSettings) return fallback || ''
    
    switch (type) {
      case 'name':
        return localeSettings.restaurant_name
      case 'phone':
        return localeSettings.restaurant_phone
      case 'address':
        return localeSettings.restaurant_address
      case 'city':
        return localeSettings.restaurant_city
      case 'postalCode':
        return localeSettings.restaurant_postal_code
      case 'full-address':
        return `${localeSettings.restaurant_address}, ${localeSettings.restaurant_city} ${localeSettings.restaurant_postal_code}`
      default:
        return fallback || ''
    }
  }

  // Show loading skeleton only briefly to avoid flash
  if (loading && !fallback) {
    return <span className={className}>...</span>
  }

  return <span className={className}>{getValue()}</span>
}

interface RestaurantPhoneLinkProps {
  className?: string
  children?: React.ReactNode
}

export function RestaurantPhoneLink({ className, children }: RestaurantPhoneLinkProps) {
  const [phone, setPhone] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadPhone = async () => {
      try {
        const response = await fetch('/api/locale-settings')
        if (response.ok) {
          const settings = await response.json()
          setPhone(settings.restaurant_phone)
        } else {
          console.warn('Failed to load phone from API')
        }
      } catch (error) {
        console.error('Error loading phone:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhone()
  }, [])

  if (loading) {
    return <span className={className}>{children || '...'}</span>
  }

  if (!phone) {
    return <span className={className}>{children || 'Phone not available'}</span>
  }

  // Convert phone to tel: format (remove spaces and special chars)
  const telHref = `tel:${phone.replace(/\s/g, '')}`

  return (
    <a href={telHref} className={className}>
      {children || phone}
    </a>
  )
} 