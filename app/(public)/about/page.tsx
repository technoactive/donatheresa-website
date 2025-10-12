import { Metadata } from "next"
import AboutPageClient from "@/components/public/about-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "About Us | Dona Theresa Italian Restaurant Hatch End Pinner",
  description: "Family-owned Italian restaurant in Hatch End, Pinner since 2011. Located at 451 Uxbridge Road, HA5 4JR. Award-winning authentic Italian cuisine in Northwest London.",
  keywords: "Dona Theresa about, Italian restaurant Hatch End history, family restaurant Pinner, authentic Italian Northwest London, best Italian restaurant Harrow, Uxbridge Road Pinner restaurant, HA5 4JR restaurant",
  openGraph: {
    title: "About Dona Theresa | Italian Restaurant Hatch End Pinner | Since 2011",
    description: "Family-owned Italian restaurant at 451 Uxbridge Road, Hatch End, Pinner HA5 4JR. Authentic cuisine, award-winning service in Northwest London.",
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