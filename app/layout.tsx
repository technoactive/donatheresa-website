import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from "@/components/google-analytics"
import { GoogleAnalyticsServer } from "@/components/google-analytics-server"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { DynamicSchema } from "@/components/locale/dynamic-schema"
import { FAQSchema } from "@/components/locale/faq-schema"
import { BreadcrumbSchema } from "@/components/locale/breadcrumb-schema"
import { CookieConsent } from "@/components/cookie-consent"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
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
    default: "Italian Restaurant Pinner | Dona Theresa | Book Table Online | Hatch End",
    template: "%s | Dona Theresa Italian Restaurant Pinner"
  },
  description: "Authentic Italian restaurant in Hatch End, Pinner HA5 4JR. ⭐ 4.9 rating. Book online for lunch specials £19.95. 📍 451 Uxbridge Road. 📞 020 8421 5550. Open Tue-Sun.",
  keywords: [
    "Italian restaurant Hatch End",
    "Italian restaurant Pinner",
    "fine dining Northwest London",
    "best Italian restaurant Pinner",
    "authentic Italian food Hatch End",
    "restaurant Uxbridge Road Pinner",
    "Italian restaurant HA5 4JR",
    "pasta restaurant Pinner",
    "pizza restaurant Hatch End",
    "romantic restaurant Northwest London",
    "Italian fine dining Harrow",
    "restaurant near Pinner station",
    "Italian restaurant 451 Uxbridge Road",
    "Dona Theresa Pinner",
    "Italian cuisine Northwest London"
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
    title: 'Dona Theresa | Italian Restaurant Hatch End Pinner | 451 Uxbridge Road',
    description: 'Authentic Italian restaurant in Hatch End, Pinner. Located at 451 Uxbridge Road, HA5 4JR. Award-winning fine dining, fresh pasta, extensive wine list. Reservations: 020 8421 5550.',
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
    title: 'Dona Theresa Italian Restaurant | Hatch End Pinner | Northwest London',
    description: 'Italian fine dining in Hatch End, Pinner. 451 Uxbridge Road, HA5 4JR. Authentic cuisine, romantic atmosphere. Open Tue-Sun. Book: 020 8421 5550.',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
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
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Prevent layout shift with aspect-ratio */}
        <style dangerouslySetInnerHTML={{ __html: `
          img { max-width: 100%; height: auto; }
          [data-loading] { min-height: 100px; }
          .lucide { display: inline-block; vertical-align: middle; }
        `}} />
        
        {/* Favicon and touch icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Dynamic Schema.org structured data */}
        <DynamicSchema />
        <FAQSchema />
        <BreadcrumbSchema />
        
        {/* Google Analytics Server Component - Loads GA script immediately */}
        <GoogleAnalyticsServer />
        
        {/* Last updated: October 12, 2025 */}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          inter.variable, 
          playfairDisplay.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          {children}
          <Toaster richColors />
          <SpeedInsights />
          <Analytics />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
