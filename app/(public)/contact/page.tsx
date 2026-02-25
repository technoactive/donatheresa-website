import { Metadata } from "next"
import ContactPageClient from "@/components/public/contact-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Contact | Dona Theresa Italian Restaurant Pinner",
  description: "Contact Dona Theresa - best Italian restaurant near me in Pinner & Hatch End. 📍451 Uxbridge Road HA5 4JR 📞020 8421 5550. Top restaurants Pinner.",
  keywords: [
    "restaurants near me contact",
    "italian restaurant near me",
    "best restaurants pinner contact",
    "best restaurants hatch end contact",
    "dona theresa contact",
    "donna teresa contact",
    "restaurants pinner address",
    "restaurants hatch end phone",
    "italian pinner contact", 
    "italian hatch end contact",
    "uxbridge road restaurants",
    "451 uxbridge road",
    "places to eat pinner",
    "places to eat hatch end"
  ],
  openGraph: {
    title: "Contact Dona Theresa | Italian Restaurant Hatch End Pinner",
    description: "Get in touch with Dona Theresa. Located at 451 Uxbridge Road, Pinner HA5 4JR. Call 020 8421 5550. Open Tue-Sun for lunch and dinner.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.co.uk/contact",
    siteName: "Dona Theresa Restaurant",
    images: [
      {
        url: "https://donatheresa.co.uk/og-contact.jpg",
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
    images: ["https://donatheresa.co.uk/og-contact.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/contact"
  }
}

export default function ContactPage() {
  return <ContactPageClient />
}