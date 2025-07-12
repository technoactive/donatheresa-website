import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from "@/components/google-analytics"
// import { DynamicSchema } from "@/components/locale/dynamic-schema"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' },
  ],
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://donatheresa.com'),
  title: {
    default: "Dona Theresa | Fine Italian Restaurant in Pinner | Authentic Cuisine Since 2011",
    template: "%s | Dona Theresa Restaurant"
  },
  description: "Experience authentic Italian fine dining at Dona Theresa in Pinner. Award-winning restaurant serving modern Italian cuisine since 2011. Book your table today for an unforgettable culinary journey.",
  keywords: [
    "Italian restaurant Pinner",
    "fine dining London", 
    "authentic Italian cuisine",
    "restaurant Uxbridge Road",
    "Italian food Pinner",
    "fine dining Pinner",
    "restaurant reservations",
    "modern Italian restaurant",
    "award winning restaurant",
    "intimate dining Pinner"
  ],
  authors: [{ name: "Dona Theresa Restaurant" }],
  creator: "Dona Theresa Restaurant",
  publisher: "Dona Theresa Restaurant",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://donatheresa.com',
    siteName: 'Dona Theresa Restaurant',
    title: 'Dona Theresa | Fine Italian Restaurant in Pinner | Authentic Cuisine Since 2011',
    description: 'Experience authentic Italian fine dining at Dona Theresa in Pinner. Award-winning restaurant serving modern Italian cuisine since 2011. Book your table today.',
    images: [
      {
        url: '/hero-main.png',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa Restaurant - Fine Italian Dining in Pinner',
        type: 'image/png',
      },
      {
        url: '/gallery-interior.png',
        width: 800,
        height: 600,
        alt: 'Elegant interior of Dona Theresa Restaurant',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dona_theresa',
    creator: '@dona_theresa',
    title: 'Dona Theresa | Fine Italian Restaurant in Pinner',
    description: 'Experience authentic Italian fine dining at Dona Theresa in Pinner. Award-winning restaurant since 2011. Book your table today.',
    images: ['/hero-main.png'],
  },
  alternates: {
    canonical: 'https://donatheresa.com',
  },
  category: 'restaurant',
  classification: 'Fine Dining Restaurant',
  generator: 'Next.js',
  applicationName: 'Dona Theresa Restaurant',
  referrer: 'origin-when-cross-origin',
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Dona Theresa',
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=yes',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon and touch icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Dynamic Schema.org structured data */}
        {/* <DynamicSchema /> */}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          inter.variable, 
          playfairDisplay.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <GoogleAnalytics />
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
