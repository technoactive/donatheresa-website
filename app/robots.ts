import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://donatheresa.com'
  
  return {
    rules: [
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
          
          // Search functionality (internal)
          '/search',
          '/search/',
          
          // Test pages (if any)
          '/test-',
          '/ga-test',
          '/verify-ga',
          '/cookie-demo',
          '/test-cookie',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 