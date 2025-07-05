'use client'

import React from 'react'
import { FormattedCurrency } from './formatted-date'

interface FormattedPriceProps {
  price: string
  className?: string
  fallback?: string
}

export function FormattedPrice({ price, className, fallback }: FormattedPriceProps) {
  // Extract numeric value from price string
  // Examples: "£5.95" -> 5.95, "£3.60 each" -> 3.60
  const parsePrice = (priceStr: string): number => {
    // Remove currency symbols and extract the first number found
    const match = priceStr.match(/(\d+\.?\d*)/)
    return match ? parseFloat(match[1]) : 0
  }

  // Check if price contains "each" - handle special case
  const isPerItem = price.toLowerCase().includes('each')
  const numericPrice = parsePrice(price)

  if (numericPrice === 0) {
    return <span className={className}>{fallback || price}</span>
  }

  return (
    <span className={className}>
      <FormattedCurrency amount={numericPrice} fallback={price} />
      {isPerItem && ' each'}
    </span>
  )
} 