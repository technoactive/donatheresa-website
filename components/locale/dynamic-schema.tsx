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
    "description": "Award-winning Italian restaurant in Hatch End, Pinner. Located at 451 Uxbridge Road, HA5 4JR. Authentic Italian fine dining with fresh pasta, wood-fired pizza, and extensive wine list. Open Tuesday-Sunday for lunch and dinner. Reservations: 020 8421 5550.",
    "url": "https://donatheresa.com",
    "logo": "https://donatheresa.com/placeholder-logo.png",
    "image": [
      "https://donatheresa.com/hero-main.png",
      "https://donatheresa.com/gallery-interior.png",
      "https://donatheresa.com/gallery-dining.png"
    ],
    "telephone": localeSettings.restaurant_phone || "+442084215550",
    "email": "info@donatheresa.com",
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
    "hasMenu": "https://donatheresa.com/menu",
    "sameAs": [
      "https://www.facebook.com/donatheresa",
      "https://www.instagram.com/donatheresa", 
      "https://twitter.com/dona_theresa"
    ],
    "knowsAbout": [
      "Italian Cuisine",
      "Fine Dining",
      "Wine Pairing",
      "Fresh Pasta",
      "Wood-Fired Pizza",
      "Authentic Italian Recipes"
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
        "urlTemplate": "https://donatheresa.com/reserve",
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