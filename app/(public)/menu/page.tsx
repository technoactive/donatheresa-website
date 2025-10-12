import { Metadata } from "next"
import MenuPageClient from "@/components/public/menu-page-client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Menu | Dona Theresa Italian Restaurant Hatch End Pinner",
  description: "View our authentic Italian menu at Dona Theresa, Hatch End. Fresh pasta, wood-fired pizza, seafood specials. Lunch menu £19.95. Located at 451 Uxbridge Road, Pinner HA5 4JR.",
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
    title: "Italian Menu | Dona Theresa Restaurant Hatch End Pinner",
    description: "Authentic Italian cuisine menu. Fresh pasta, pizzas, seafood. Lunch specials from £19.95. 451 Uxbridge Road, Pinner HA5 4JR.",
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
    title: "Menu | Dona Theresa Italian Restaurant",
    description: "View our authentic Italian menu. Fresh ingredients, traditional recipes. Lunch specials available.",
    images: ["https://donatheresa.com/og-menu.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.com/menu"
  }
}

export default function MenuPage() {
  return <MenuPageClient />
} 