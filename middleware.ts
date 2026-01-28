import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================
// SECURITY CONFIGURATION - Industry Standards
// ============================================

// Blocked paths - common vulnerability scanning targets
const BLOCKED_PATHS = [
  // WordPress
  '/wp-admin', '/wp-login', '/wp-includes', '/wp-content', '/xmlrpc.php', '/wp-json',
  // Joomla
  '/administrator', '/components', '/modules',
  // Drupal
  '/misc/ajax.js', '/sites/default',
  // PHP/Server
  '/admin.php', '/config.php', '/phpinfo.php', '/phpmyadmin', '/pma',
  '/eval-stdin.php', '/shell.php', '/c99.php', '/r57.php',
  // Sensitive files
  '/.env', '/.git', '/.svn', '/.htaccess', '/.htpasswd',
  '/web.config', '/config.json', '/package.json',
  '/composer.json', '/composer.lock',
  // Database
  '/mysql', '/phpmyadmin', '/adminer', '/sql',
  // Common exploits
  '/cgi-bin', '/scripts', '/admin', '/backup',
  '/view-source:', '/etc/passwd',
  // API probing
  '/api/v1', '/api/v2', '/graphql', '/swagger',
]

// Blocked file extensions (potential exploits)
const BLOCKED_EXTENSIONS = [
  '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl',
  '.sh', '.bash', '.exe', '.dll', '.bat', '.cmd',
  '.sql', '.bak', '.backup', '.old', '.orig',
  '.log', '.ini', '.conf', '.cfg',
]

// Suspicious user agents (vulnerability scanners & bad bots)
const BLOCKED_USER_AGENTS = [
  // Vulnerability scanners
  'sqlmap', 'nikto', 'nessus', 'openvas', 'nmap', 'masscan',
  'zgrab', 'censys', 'shodan', 'nuclei', 'wpscan', 'dirbuster',
  'gobuster', 'ffuf', 'burp', 'zap', 'acunetix', 'netsparker',
  'qualys', 'rapid7', 'tenable', 'w3af', 'skipfish', 'arachni',
  // Bad bots
  'semrushbot', 'ahrefsbot', 'dotbot', 'rogerbot', 'seznambot',
  'mj12bot', 'blexbot', 'dataforseo', 'serpstatbot',
  // Scrapers
  'scrapy', 'wget', 'curl/', 'httpx', 'httpclient',
  'python-requests', 'python-urllib', 'go-http-client', 'java/',
  // Headless browsers (potential bots)
  'phantomjs', 'headlesschrome',
]

// Allowed good bots (don't block these)
const ALLOWED_BOTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot',
  'slurp', 'baiduspider', 'facebookexternalhit', 'twitterbot',
  'linkedinbot', 'whatsapp', 'telegrambot', 'applebot',
  'pinterest', 'discordbot',
]

// Content Security Policy
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.sentry.io https://js.stripe.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https: http:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.sentry.io https://api.stripe.com https://vercel.live wss://ws-us3.pusher.com",
  "frame-src 'self' https://js.stripe.com https://vercel.live",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ')

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'

  // ============================================
  // SECURITY CHECKS
  // ============================================

  // 1. Block suspicious paths (vulnerability scanning)
  if (BLOCKED_PATHS.some(path => pathname.startsWith(path.toLowerCase()))) {
    console.warn(`🚫 Blocked path access attempt: ${pathname} from ${ip}`)
    return new NextResponse(null, { status: 404 })
  }

  // 2. Block suspicious file extensions
  if (BLOCKED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    console.warn(`🚫 Blocked extension access: ${pathname} from ${ip}`)
    return new NextResponse(null, { status: 404 })
  }

  // 3. Check if it's an allowed good bot first
  const isGoodBot = ALLOWED_BOTS.some(bot => userAgent.includes(bot))

  // 4. Block known vulnerability scanners (unless it's a good bot spoofing)
  if (!isGoodBot && BLOCKED_USER_AGENTS.some(agent => userAgent.includes(agent))) {
    console.warn(`🚫 Blocked scanner/bad bot: ${userAgent.substring(0, 50)} from ${ip}`)
    return new NextResponse(null, { status: 403 })
  }

  // 5. Block empty user agents (often bots)
  if (!userAgent || userAgent.length < 10) {
    // Allow some internal/health check requests
    if (!pathname.includes('health') && !pathname.includes('_next')) {
      console.warn(`🚫 Blocked empty/short user agent from ${ip}`)
      return new NextResponse(null, { status: 403 })
    }
  }

  // 6. Block requests with suspicious query strings
  const queryString = request.nextUrl.search.toLowerCase()
  const suspiciousPatterns = [
    'union+select', 'union%20select', '<script', '%3cscript',
    'javascript:', 'vbscript:', 'onload=', 'onerror=',
    '../', '..%2f', '/etc/passwd', 'cmd=', 'exec=',
    'base64_decode', 'eval(', 'system(', 'passthru(',
  ]
  if (suspiciousPatterns.some(pattern => queryString.includes(pattern))) {
    console.warn(`🚫 Blocked suspicious query string from ${ip}: ${queryString.substring(0, 100)}`)
    return new NextResponse(null, { status: 400 })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in and trying to access dashboard, redirect to login
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // ============================================
  // SECURITY HEADERS - Industry Best Practices
  // ============================================

  // Prevent MIME type sniffing
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Prevent clickjacking
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  
  // XSS Protection (legacy browsers)
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Control referrer information
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Restrict browser features
  supabaseResponse.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )
  
  // HTTP Strict Transport Security (HSTS) - Force HTTPS for 1 year
  supabaseResponse.headers.set('Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains; preload'
  )
  
  // Content Security Policy
  supabaseResponse.headers.set('Content-Security-Policy', CSP_DIRECTIVES)
  
  // Prevent IE from executing downloads in site's context
  supabaseResponse.headers.set('X-Download-Options', 'noopen')
  
  // Disable DNS prefetching
  supabaseResponse.headers.set('X-DNS-Prefetch-Control', 'off')
  
  // Cross-Origin policies
  supabaseResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  supabaseResponse.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  
  // Remove server identification
  supabaseResponse.headers.delete('X-Powered-By')
  supabaseResponse.headers.delete('Server')

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 