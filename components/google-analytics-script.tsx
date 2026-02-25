import { unstable_noStore } from 'next/cache'
import { getGoogleAnalyticsSettings } from '@/app/dashboard/settings/analytics/actions'

/**
 * Loads the Google Analytics (gtag) script using the measurement ID
 * saved in the dashboard. Renders nothing if GA is disabled or no ID.
 */
export async function GoogleAnalyticsScript() {
  unstable_noStore()
  const settings = await getGoogleAnalyticsSettings()

  const measurementId =
    settings.enabled && settings.measurement_id?.trim()
      ? settings.measurement_id.trim()
      : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null

  if (!measurementId) return null

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId.replace(/'/g, "\\'")}', {
    currency: 'GBP',
    country: 'GB'
  });
  gtag('set', { currency: 'GBP', country: 'GB' });
          `,
        }}
      />
    </>
  )
}
