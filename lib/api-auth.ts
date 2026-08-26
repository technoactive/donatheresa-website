import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Guards for API routes.
 *
 * Several routes previously ran with no check at all, which meant anyone could
 * read customer names and email addresses, drain the email queue or trigger
 * outbound email. Route handlers should start with one of these.
 */

/**
 * Requires a signed-in dashboard user.
 *
 * Returns a 401 response to return directly, or `null` when the caller is
 * authenticated:
 *
 *     const denied = await requireDashboardUser()
 *     if (denied) return denied
 */
export async function requireDashboardUser(): Promise<NextResponse | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in to the dashboard' },
      { status: 401 }
    )
  }

  return null
}

/**
 * Requires a valid `Authorization: Bearer <CRON_SECRET>` header.
 *
 * Fails closed: if CRON_SECRET is not configured in production the route is
 * refused rather than left open. Outside production a missing secret is
 * allowed so the jobs stay runnable locally.
 */
export function requireCronSecret(request: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET
  const isProduction = process.env.NODE_ENV === 'production'

  if (!cronSecret) {
    if (isProduction) {
      console.error('CRON_SECRET is not set; refusing to run scheduled job')
      return NextResponse.json(
        { error: 'Cron authentication is not configured' },
        { status: 503 }
      )
    }
    return null
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

/**
 * Allows either a signed-in dashboard user or a valid cron secret. Used by the
 * email queue routes, which are triggered both by the scheduler and by hand
 * from the dashboard.
 */
export async function requireDashboardUserOrCron(request: NextRequest): Promise<NextResponse | null> {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`) {
    return null
  }
  return requireDashboardUser()
}
