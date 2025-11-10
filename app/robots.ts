import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.donatheresa.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/menu', '/contact', '/reserve', '/cookie-policy'],
        disallow: ['/dashboard/', '/api/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/about', '/menu', '/contact', '/reserve', '/cookie-policy'],
        disallow: ['/dashboard/', '/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 