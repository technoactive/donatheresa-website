import { unstable_noStore } from 'next/cache'
import { getGoogleAnalyticsSettings } from '@/app/dashboard/settings/analytics/actions'

/**
 * Loads the Google Analytics (gtag.js) script - exact format from Google for tag detection.
 * Sets consent default to granted so the tag fires and Google can verify.
 */
export async function GoogleAnalyticsScript() {
  unstable_noStore()
  const settings = await getGoogleAnalyticsSettings()

  const measurementId =
    settings.enabled && settings.measurement_id?.trim()
      ? settings.measurement_id.trim()
      : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null

  if (!measurementId) return null

  // Match Google snippet exactly; set consent before config so tag fires for verification
  const scriptContent = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', { 'analytics_storage': 'granted', 'ad_storage': 'denied' });
gtag('config', '${measurementId.replace(/'/g, "\\'")}');`

  return (
    <>
      {/* Google tag (gtag.js) */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
    </>
  )
}
