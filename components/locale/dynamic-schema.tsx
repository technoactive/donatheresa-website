'use client'

import { useEffect, useState } from 'react'
import { LocaleSettings } from '@/lib/types'

export function DynamicSchema() {
  const [localeSettings, setLocaleSettings] = useState<LocaleSettings | null>(null)

  useEffect(() => {
    const fetchLocaleSettings = async () => {
      try {
        const response = await fetch('/api/locale-settings')
        if (response.ok) {
          const data = await response.json()
          setLocaleSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch locale settings:', error)
      }
    }

    fetchLocaleSettings()
  }, [])

  if (!localeSettings) {
    return null // Don't render anything until we have the data
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": localeSettings.restaurant_name || "Dona Theresa",
    "alternateName": `${localeSettings.restaurant_name || "Dona Theresa"} Restaurant`,
    "description": "Fine Italian restaurant serving authentic modern Italian cuisine since 2011. Award-winning dining experience with exceptional service.",
    "url": "https://dona-theresa.com",
    "logo": "https://dona-theresa.com/placeholder-logo.png",
    "image": [
      "https://dona-theresa.com/hero-main.png",
      "https://dona-theresa.com/gallery-interior.png",
      "https://dona-theresa.com/gallery-dining.png"
    ],
    "telephone": localeSettings.restaurant_phone || "+442084215550",
    "email": "info@dona-theresa.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": localeSettings.restaurant_address || "451 Uxbridge Road",
      "addressLocality": localeSettings.restaurant_city || "Pinner",
      "postalCode": localeSettings.restaurant_postal_code || "HA5 4JR",
      "addressCountry": localeSettings.country_code || "GB",
      "addressRegion": "London"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5941",
      "longitude": "-0.3840"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "12:00",
        "closes": "15:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "18:00",
        "closes": "23:00"
      }
    ],
    "servesCuisine": ["Italian", "Mediterranean", "European"],
    "priceRange": "£££",
    "acceptsReservations": true,
    "foundingDate": "2011",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "247"
    },
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": localeSettings.currency_code || "GBP",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Intimate Dining",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Wine Selection",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Events",
        "value": true
      }
    ],
    "hasMenu": "https://dona-theresa.com/menu",
    "sameAs": [
      "https://www.facebook.com/donatheresa",
      "https://www.instagram.com/donatheresa", 
      "https://twitter.com/dona_theresa"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }}
    />
  )
} 