import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Blocked paths - common vulnerability scanning targets
const BLOCKED_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/wp-includes',
  '/wp-content',
  '/administrator',
  '/admin.php',
  '/xmlrpc.php',
  '/misc/ajax.js',
  '/.env',
  '/.git',
  '/config.php',
  '/phpinfo.php',
  '/phpmyadmin',
  '/view-source:',
  '/eval-stdin.php',
  '/.well-known/security.txt',
]

// Suspicious user agents (vulnerability scanners)
const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nessus',
  'openvas',
  'nmap',
  'masscan',
  'zgrab',
  'censys',
  'shodan',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase()
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''

  // Block suspicious paths (vulnerability scanning)
  if (BLOCKED_PATHS.some(path => pathname.startsWith(path.toLowerCase()))) {
    return new NextResponse(null, { status: 404 })
  }

  // Block known vulnerability scanners
  if (BLOCKED_USER_AGENTS.some(agent => userAgent.includes(agent))) {
    return new NextResponse(null, { status: 403 })
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

  // Add security headers
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

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