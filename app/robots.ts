import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://donatheresa.com'
  
  return {
    rules: [
      // Good bots - allow most content
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/', '/login', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/', '/login', '/_next/'],
      },
      // Block bad bots entirely
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'BLEXBot',
        disallow: '/',
      },
      {
        userAgent: 'DataForSeoBot',
        disallow: '/',
      },
      // Default rules for all other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Admin and dashboard areas
          '/dashboard/',
          '/dashboard',
          '/admin/',
          '/admin',
          '/login',
          '/login/',
          
          // API routes
          '/api/',
          '/api',
          
          // Auth routes
          '/auth/',
          '/auth',
          
          // Next.js internal routes
          '/_next/',
          '/_next',
          
          // Sensitive paths
          '/private/',
          '/internal/',
          '/*.json$',
          '/*.xml$',
          
          // Search functionality (internal)
          '/search',
          '/search/',
          
          // Test pages (if any)
          '/test-',
          '/ga-test',
          '/verify-ga',
          '/cookie-demo',
          '/test-cookie',
          
          // Potential CMS paths (honeypot)
          '/wp-admin/',
          '/administrator/',
          '/phpmyadmin/',
        ],
        // Crawl delay to prevent aggressive crawling
        // crawlDelay: 10, // Not supported by MetadataRoute.Robots
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 