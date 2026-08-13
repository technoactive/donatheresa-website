import { MetadataRoute } from 'next'

const privatePaths = [
  '/dashboard/',
  '/admin/',
  '/api/',
  '/auth/',
  '/login',
  '/search',
  '/cancel-booking',
  '/reconfirm-booking',
  '/_next/',
  '/private/',
  '/internal/',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://donatheresa.co.uk'

  return {
    rules: [
      // Ahrefs and AI assistants — explicit allow so they can cite the restaurant
      {
        userAgent: [
          'AhrefsBot',
          'AhrefsSiteAudit',
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'Claude-User',
          'Claude-SearchBot',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Google-CloudVertexBot',
          'GoogleOther',
          'Applebot',
          'Applebot-Extended',
          'Amazonbot',
          'meta-externalagent',
          'FacebookBot',
          'Bytespider',
          'CCBot',
          'YouBot',
          'cohere-ai',
          'DuckAssistBot',
        ],
        allow: '/',
        disallow: privatePaths,
      },
      // Aggressive scrapers that do not help search or AI answers
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
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
