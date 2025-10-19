import { Metadata } from "next"
import MenuPageClient from "@/components/public/menu-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Italian Restaurant Menu Pinner | Lunch £19.95 | Dona Theresa Hatch End",
  description: "📋 View Dona Theresa's Italian menu with prices. Lunch special £19.95 (Tue-Sun). À la carte dinner menu. Fresh ingredients daily. Book: 020 8421 5550.",
  keywords: [
    "Italian restaurant menu Hatch End",
    "Dona Theresa menu Pinner",
    "Italian food menu Northwest London",
    "lunch menu Pinner",
    "Italian restaurant prices Hatch End",
    "pasta menu Pinner",
    "pizza menu Hatch End",
    "Italian wine list Northwest London",
    "early bird menu Pinner",
    "Italian restaurant HA5 4JR menu"
  ],
  openGraph: {
    title: "Italian Menu with Prices | Dona Theresa Restaurant Pinner",
    description: "View our full Italian menu. Lunch menu £19.95. À la carte options. 451 Uxbridge Road, Hatch End. Book online or call 020 8421 5550.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.com/menu",
    siteName: "Dona Theresa Restaurant",
    images: [
      {
        url: "https://donatheresa.com/og-menu.jpg",
        width: 1200,
        height: 630,
        alt: "Dona Theresa Italian Restaurant Menu"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Italian Menu | Dona Theresa Pinner | Lunch £19.95",
    description: "Authentic Italian menu with lunch specials £19.95. Fresh daily ingredients. Book online for best availability.",
    images: ["https://donatheresa.com/og-menu.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.com/menu"
  }
}

export default function MenuPage() {
  return <MenuPageClient />
} 