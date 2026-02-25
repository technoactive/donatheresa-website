import { Metadata } from "next"
import MenuPageClient from "@/components/public/menu-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Menu | Dona Theresa Italian Restaurant | £19.95 Lunch",
  description: "🍝 View our Italian menu! Lunch 2 courses £19.95 • Fresh pasta • Premium steaks • 50+ wines. Book ☎️ 020 8421 5550",
  keywords: [
    "restaurants pinner menu",
    "restaurants hatch end menu",
    "italian restaurant menu",
    "lunch",
    "lunch pinner",
    "lunch hatch end", 
    "steak",
    "italian restaurant near me menu",
    "best restaurants pinner menu",
    "best restaurants hatch end menu",
    "dona theresa menu",
    "donna teresa menu",
    "italian pinner menu",
    "italian hatch end menu"
  ],
  openGraph: {
    title: "Italian Menu with Prices | Dona Theresa Restaurant Pinner",
    description: "View our full Italian menu. Lunch menu £19.95. À la carte options. 451 Uxbridge Road, Hatch End. Book online or call 020 8421 5550.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.co.uk/menu",
    siteName: "Dona Theresa Restaurant",
    images: [
      {
        url: "https://donatheresa.co.uk/og-menu.jpg",
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
    images: ["https://donatheresa.co.uk/og-menu.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/menu"
  }
}

export default function MenuPage() {
  return <MenuPageClient />
} 