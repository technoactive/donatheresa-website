import { Metadata } from "next"
import AboutPageClient from "@/components/public/about-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "About Dona Theresa | Authentic Italian Restaurant in Hatch End",
  description: "Discover the story of Dona Theresa, Hatch End's beloved family-run Italian restaurant. Bringing authentic Italian cuisine with Portuguese hospitality since 2011.",
  keywords: "Dona Theresa, Italian restaurant Hatch End, family restaurant London, authentic Italian food, Portuguese hospitality, Uxbridge Road restaurant",
  openGraph: {
    title: "About Dona Theresa | Authentic Italian Restaurant in Hatch End",
    description: "Experience authentic Italian cuisine with the warmth of Portuguese hospitality at Dona Theresa, serving Hatch End since 2011.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.com/about",
    siteName: "Dona Theresa",
    images: [
      {
        url: "https://donatheresa.com/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Dona Theresa Italian Restaurant"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dona Theresa | Authentic Italian Restaurant",
    description: "Experience authentic Italian cuisine with Portuguese hospitality in Hatch End since 2011.",
    images: ["https://donatheresa.com/og-about.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.com/about"
  }
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Dona Theresa",
    "description": "Authentic Italian restaurant in Hatch End offering traditional cuisine with Portuguese hospitality",
    "servesCuisine": "Italian",
    "establishmentYear": "2011",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "451 Uxbridge Road",
      "addressLocality": "Hatch End",
      "addressRegion": "London",
      "postalCode": "HA5 4JR",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.6097,
      "longitude": -0.3683
    },
    "url": "https://donatheresa.com",
    "telephone": "+44-20-8428-1234",
    "priceRange": "££",
    "image": "https://donatheresa.com/restaurant-image.jpg",
    "paymentAccepted": "Cash, Credit Card, Debit Card",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "12:00",
        "closes": "22:30"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageClient />
    </>
  )
} 