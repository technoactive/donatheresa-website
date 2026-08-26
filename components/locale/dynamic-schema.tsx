export function DynamicSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Dona Theresa",
    "alternateName": ["Donna Teresa", "Dona Teresa", "Donna Theresa", "Dona Theresa Italian Restaurant"],
    "description": "Award-winning Italian restaurant in Hatch End and Pinner. Authentic Italian cuisine, lunch specials from £19.95, steaks. 451 Uxbridge Road, HA5 4JR.",
    "url": "https://donatheresa.co.uk",
    "logo": "https://donatheresa.co.uk/placeholder-logo.png",
    "image": [
      "https://donatheresa.co.uk/og-home.jpg",
      "https://donatheresa.co.uk/restaurant-image.jpg",
      "https://donatheresa.co.uk/gallery-interior.jpg",
      "https://donatheresa.co.uk/gallery-dining.jpg"
    ],
    "telephone": "+442084215550",
    "email": "info@donatheresa.co.uk",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "451 Uxbridge Road",
      "addressLocality": "Hatch End",
      "addressRegion": "Greater London",
      "postalCode": "HA5 4JR",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5941",
      "longitude": "-0.3840"
    },
    "areaServed": ["Pinner", "Hatch End", "Harrow", "Watford", "Northwood", "Ruislip"],
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
    "currenciesAccepted": "GBP",
    "hasMenu": "https://donatheresa.co.uk/menu",
    "sameAs": [
      "https://www.facebook.com/donatheresa",
      "https://www.instagram.com/donatheresa",
      "https://twitter.com/dona_theresa"
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://donatheresa.co.uk/reserve",
        "inLanguage": "en-GB",
        "actionPlatform": [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
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
