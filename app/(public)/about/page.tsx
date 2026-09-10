import { Metadata } from "next"
import AboutPageClient from "@/components/public/about-page-client"
import { DynamicSchema } from "@/components/locale/dynamic-schema"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "About Us",
  description: "Family-owned Italian restaurant in Pinner & Hatch End since 2011. Award-winning cuisine, lunch specials, steaks. 451 Uxbridge Road.",
  keywords: "best restaurants in pinner, best restaurants in hatch end, italian restaurant pinner, italian restaurant hatch end, restaurants near me, dona theresa, donna teresa, best italian pinner, best italian hatch end, restaurants pinner, restaurants hatch end",
  openGraph: {
    title: "About Dona Theresa | Italian Restaurant Hatch End Pinner | Since 2011",
    description: "Family-owned Italian restaurant at 451 Uxbridge Road, Hatch End, Pinner HA5 4JR. Authentic cuisine, award-winning service in Northwest London.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.co.uk/about",
    siteName: "Dona Theresa",
    images: [
      {
        url: "https://donatheresa.co.uk/og-about.jpg",
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
    images: ["https://donatheresa.co.uk/og-about.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/about"
  }
}

export default function AboutPage() {
  return (
    <>
      <DynamicSchema />
      <AboutPageClient />
    </>
  )
}