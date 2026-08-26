/**
 * Single source of truth for crawler policy.
 *
 * `app/robots.ts` publishes this policy and `middleware.ts` enforces it. They
 * used to keep separate lists, which drifted: robots.txt invited AhrefsBot
 * while the middleware answered it with a 403, so Ahrefs site audits could
 * never actually read the site.
 */

/**
 * Crawlers that get their own explicit `Allow` rule in robots.txt. Search
 * engines already fall under the wildcard rule, but AI assistants and SEO
 * tools tend to look for a named rule before crawling.
 */
export const EXPLICITLY_ALLOWED_CRAWLERS = [
  // SEO tooling the restaurant pays for
  'AhrefsBot',
  'AhrefsSiteAudit',
  // AI assistants, so they can cite the restaurant in answers
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
]

/** Search engines. Covered by the wildcard robots.txt rule; listed so the middleware never blocks them. */
export const SEARCH_ENGINE_CRAWLERS = [
  'Googlebot',
  'bingbot',
  'YandexBot',
  'DuckDuckBot',
  'Slurp',
  'Baiduspider',
]

/** Link preview fetchers. Blocking these breaks share cards on social and messaging apps. */
export const SOCIAL_UNFURLERS = [
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Pinterest',
  'Discordbot',
]

/**
 * Crawlers disallowed in robots.txt and rejected by the middleware. These
 * consume bandwidth and resell the data without sending any customers.
 */
export const DISALLOWED_CRAWLERS = [
  'MJ12bot',
  'DotBot',
  'BLEXBot',
  'DataForSeoBot',
  'SemrushBot',
  'serpstatbot',
  'rogerbot',
  'SeznamBot',
]

/**
 * Vulnerability scanners and generic scripting clients. Enforced by the
 * middleware only; there is no point publishing these in robots.txt because
 * nothing in this list reads it.
 */
export const BLOCKED_SCANNERS = [
  // Vulnerability scanners
  'sqlmap', 'nikto', 'nessus', 'openvas', 'nmap', 'masscan',
  'zgrab', 'censys', 'shodan', 'nuclei', 'wpscan', 'dirbuster',
  'gobuster', 'ffuf', 'burp', 'zap', 'acunetix', 'netsparker',
  'qualys', 'rapid7', 'tenable', 'w3af', 'skipfish', 'arachni',
  // Generic scripting clients
  'scrapy', 'wget', 'curl/', 'httpx', 'httpclient',
  'python-requests', 'python-urllib', 'go-http-client', 'java/',
  'phantomjs', 'headlesschrome',
]

/** Paths kept out of search results. */
export const PRIVATE_PATHS = [
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

const ALLOWED = [
  ...EXPLICITLY_ALLOWED_CRAWLERS,
  ...SEARCH_ENGINE_CRAWLERS,
  ...SOCIAL_UNFURLERS,
].map((bot) => bot.toLowerCase())

const DISALLOWED = DISALLOWED_CRAWLERS.map((bot) => bot.toLowerCase())
const SCANNERS = BLOCKED_SCANNERS.map((agent) => agent.toLowerCase())

/**
 * Whether a user agent should be served normally even if it matches a block
 * list. Checked first so that, for example, Applebot is not caught by a
 * substring rule.
 */
export function isAllowedCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return ALLOWED.some((bot) => ua.includes(bot))
}

/** Whether a user agent should be rejected outright. */
export function isBlockedAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return DISALLOWED.some((bot) => ua.includes(bot)) || SCANNERS.some((agent) => ua.includes(agent))
}
