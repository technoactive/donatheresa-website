import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://dona-theresa.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/menu', '/contact', '/reserve'],
        disallow: ['/dashboard/', '/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/about', '/menu', '/contact', '/reserve'],
        disallow: ['/dashboard/', '/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 