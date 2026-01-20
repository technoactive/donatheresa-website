import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Common bot patterns to detect
const BOT_PATTERNS = [
  { pattern: /\/wp-admin/i, name: 'WordPress Admin' },
  { pattern: /\/wp-content/i, name: 'WordPress Content' },
  { pattern: /\/wp-includes/i, name: 'WordPress Includes' },
  { pattern: /\.php$/i, name: 'PHP Files' },
  { pattern: /\/admin/i, name: 'Admin Panel' },
  { pattern: /\/\.env/i, name: 'Environment Files' },
  { pattern: /\/\.git/i, name: 'Git Directory' },
  { pattern: /\.(asp|aspx|jsp|cgi)$/i, name: 'Non-JS Files' },
  { pattern: /\/phpmyadmin/i, name: 'phpMyAdmin' },
  { pattern: /\/xmlrpc/i, name: 'XML-RPC' },
  { pattern: /\/config\//i, name: 'Config Files' },
  { pattern: /\/backup/i, name: 'Backup Files' },
  { pattern: /\/api\/.*test/i, name: 'API Test Endpoints' },
]

function detectBot(path: string, userAgent: string | null): { isBot: boolean; pattern: string | null } {
  // Check path patterns
  for (const { pattern, name } of BOT_PATTERNS) {
    if (pattern.test(path)) {
      return { isBot: true, pattern: name }
    }
  }
  
  // Check user agent for common bots
  if (userAgent) {
    const botAgents = [
      /bot/i, /spider/i, /crawler/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /scanner/i,
      /nmap/i, /nikto/i, /sqlmap/i
    ]
    for (const agent of botAgents) {
      if (agent.test(userAgent)) {
        return { isBot: true, pattern: 'Bot User Agent' }
      }
    }
  }
  
  return { isBot: false, pattern: null }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { errorType = '404', url, path, referrer } = body
    
    if (!url || !path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get request headers
    const userAgent = request.headers.get('user-agent')
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || null
    
    // Detect if this is likely a bot
    const { isBot, pattern: botPattern } = detectBot(path, userAgent)
    
    // Log to database
    const supabase = await createClient()
    const { error } = await supabase
      .from('page_errors')
      .insert({
        error_type: errorType,
        url,
        path,
        referrer: referrer || null,
        user_agent: userAgent,
        ip_address: ipAddress,
        is_bot: isBot,
        bot_pattern: botPattern
      })
    
    if (error) {
      console.error('Failed to log page error:', error)
      return NextResponse.json({ error: 'Failed to log error' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, isBot })
  } catch (error) {
    console.error('Error in log-error API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to retrieve error statistics (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const excludeBots = searchParams.get('excludeBots') !== 'false'
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Get error counts grouped by path
    let query = supabase
      .from('page_errors')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
    
    if (excludeBots) {
      query = query.eq('is_bot', false)
    }
    
    const { data: errors, error } = await query
    
    if (error) {
      console.error('Failed to fetch page errors:', error)
      return NextResponse.json({ error: 'Failed to fetch errors' }, { status: 500 })
    }
    
    // Aggregate statistics
    const pathCounts: Record<string, { count: number; lastSeen: string; referrers: string[] }> = {}
    let totalErrors = 0
    let botErrors = 0
    let realErrors = 0
    
    errors?.forEach(err => {
      if (err.is_bot) {
        botErrors++
      } else {
        realErrors++
        if (!pathCounts[err.path]) {
          pathCounts[err.path] = { count: 0, lastSeen: err.created_at, referrers: [] }
        }
        pathCounts[err.path].count++
        if (err.referrer && !pathCounts[err.path].referrers.includes(err.referrer)) {
          pathCounts[err.path].referrers.push(err.referrer)
        }
      }
      totalErrors++
    })
    
    // Sort paths by count
    const topPaths = Object.entries(pathCounts)
      .map(([path, data]) => ({ path, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
    
    return NextResponse.json({
      summary: {
        totalErrors,
        botErrors,
        realErrors,
        uniquePaths: Object.keys(pathCounts).length,
        periodDays: days
      },
      topPaths,
      recentErrors: errors?.filter(e => !e.is_bot).slice(0, 10) || []
    })
  } catch (error) {
    console.error('Error fetching page errors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
