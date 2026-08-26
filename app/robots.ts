import { MetadataRoute } from 'next'
import {
  DISALLOWED_CRAWLERS,
  EXPLICITLY_ALLOWED_CRAWLERS,
  PRIVATE_PATHS,
} from '@/lib/crawlers'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://donatheresa.co.uk'

  return {
    rules: [
      // Ahrefs and AI assistants — explicit allow so they can cite the restaurant
      {
        userAgent: EXPLICITLY_ALLOWED_CRAWLERS,
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // Aggressive scrapers that do not help search or AI answers
      ...DISALLOWED_CRAWLERS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
