'use client'

import React from 'react'
import { type LocaleSettings } from '@/lib/types'
import { useLocale } from '@/lib/locale-provider'

interface RestaurantInfoProps {
  type: 'name' | 'phone' | 'address' | 'city' | 'postalCode' | 'full-address'
  className?: string
  fallback?: string
}

export function RestaurantInfo({ type, className, fallback }: RestaurantInfoProps) {
  const { localeSettings, isLoading } = useLocale()

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
  if (isLoading && !fallback) {
    return <span className={className}>...</span>
  }

  return <span className={className}>{getValue()}</span>
}

interface RestaurantPhoneLinkProps {
  className?: string
  children?: React.ReactNode
}

export function RestaurantPhoneLink({ className, children }: RestaurantPhoneLinkProps) {
  const { localeSettings, isLoading } = useLocale()

  if (isLoading) {
    return <span className={className}>{children || '...'}</span>
  }

  const phone = localeSettings?.restaurant_phone
  
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