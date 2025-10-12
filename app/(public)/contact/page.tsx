import { Metadata } from "next"
import ContactPageClient from "@/components/public/contact-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Contact Us | Dona Theresa Italian Restaurant Hatch End Pinner",
  description: "Contact Dona Theresa Italian Restaurant at 451 Uxbridge Road, Hatch End, Pinner HA5 4JR. Call 020 8421 5550 for reservations. Open Tuesday-Sunday.",
  keywords: [
    "contact Dona Theresa",
    "Italian restaurant contact Hatch End",
    "restaurant phone number Pinner",
    "book table Italian restaurant Northwest London",
    "Dona Theresa address",
    "Italian restaurant HA5 4JR contact",
    "restaurant Uxbridge Road contact",
    "Italian restaurant near Pinner station",
    "contact Italian restaurant Harrow",
    "restaurant reservation Hatch End"
  ],
  openGraph: {
    title: "Contact Dona Theresa | Italian Restaurant Hatch End Pinner",
    description: "Get in touch with Dona Theresa. Located at 451 Uxbridge Road, Pinner HA5 4JR. Call 020 8421 5550. Open Tue-Sun for lunch and dinner.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.com/contact",
    siteName: "Dona Theresa Restaurant",
    images: [
      {
        url: "https://donatheresa.com/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Dona Theresa Italian Restaurant"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Dona Theresa Italian Restaurant",
    description: "451 Uxbridge Road, Pinner HA5 4JR. Call 020 8421 5550. Open Tuesday-Sunday.",
    images: ["https://donatheresa.com/og-contact.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.com/contact"
  }
}

export default function ContactPage() {
  return <ContactPageClient />
}