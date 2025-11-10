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
    "alternateName": ["Donna Teresa", "Dona Teresa", "Donna Theresa", "Dona Theresa Italian Restaurant"],
    "description": "Best Italian restaurant Pinner & Hatch End. Award-winning authentic Italian cuisine, lunch specials £19.95, steaks. Top restaurants in Pinner on Uxbridge Road. Book now!",
    "url": "https://www.donatheresa.com",
    "logo": "https://www.donatheresa.com/placeholder-logo.png",
    "image": [
      "https://www.donatheresa.com/hero-main.png",
      "https://www.donatheresa.com/gallery-interior.png",
      "https://www.donatheresa.com/gallery-dining.png"
    ],
    "telephone": localeSettings.restaurant_phone || "+442084215550",
    "email": "info@donatheresa.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": localeSettings.restaurant_address || "451 Uxbridge Road",
      "addressLocality": "Pinner, Hatch End",
      "postalCode": localeSettings.restaurant_postal_code || "HA5 4JR",
      "addressCountry": localeSettings.country_code || "GB",
      "addressRegion": "London"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5941",
      "longitude": "-0.3840"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Pinner",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "London",
          "addressCountry": "GB"
        }
      },
      {
        "@type": "City", 
        "name": "Hatch End",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "London",
          "addressCountry": "GB"
        }
      },
      {
        "@type": "City",
        "name": "Harrow",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "London",
          "addressCountry": "GB"
        }
      },
      {
        "@type": "City",
        "name": "Northwood",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "London",
          "addressCountry": "GB"
        }
      },
      {
        "@type": "City",
        "name": "Ruislip",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "London",
          "addressCountry": "GB"
        }
      }
    ],
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
    "hasMenu": "https://www.donatheresa.com/menu",
    "sameAs": [
      "https://www.facebook.com/donatheresa",
      "https://www.instagram.com/donatheresa", 
      "https://twitter.com/dona_theresa"
    ],
    "knowsAbout": [
      "Italian Cuisine",
      "Fine Dining",
      "Wine Pairing",
      "Authentic Italian Recipes",
      "Italian Steaks",
      "Lunch Specials"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Menu Options",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Lunch Menu",
          "price": "19.95",
          "priceCurrency": localeSettings.currency_code || "GBP",
          "description": "2 course lunch menu available Tuesday-Sunday"
        },
        {
          "@type": "Offer",
          "name": "Early Bird Menu",
          "price": "19.95",
          "priceCurrency": localeSettings.currency_code || "GBP",
          "description": "2 course early dinner menu"
        },
        {
          "@type": "Offer",
          "name": "À La Carte",
          "priceRange": "£££",
          "description": "Full à la carte menu with premium dishes"
        }
      ]
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.donatheresa.com/reserve",
        "inLanguage": "en-GB",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Table Reservation"
      }
    }
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