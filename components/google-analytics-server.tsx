import { createClient } from '@/lib/supabase/server'
import Script from 'next/script'

async function getGoogleAnalyticsSettings() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('google_analytics_settings')
      .select('measurement_id, enabled')
      .eq('user_id', 'admin')
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching Google Analytics settings:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch Google Analytics settings:', error)
    return null
  }
}

export async function GoogleAnalyticsServer() {
  const settings = await getGoogleAnalyticsSettings()
  
  // Don't render anything if GA is not enabled or no measurement ID
  if (!settings?.enabled || !settings?.measurement_id) {
    return null
  }
  
  const measurementId = settings.measurement_id
  
  // Return the GA script directly in the server component
  // This ensures it's part of the initial HTML response
  return (
    <>
      <Script
        id="google-analytics-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Set default consent mode
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            // Configure GA
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              cookie_flags: 'max-age=7200;secure;samesite=none'
            });
            
            // Make measurement ID available globally
            window.GA_MEASUREMENT_ID = '${measurementId}';
            
            console.log('Google Analytics loaded with ID:', '${measurementId}');
          `,
        }}
      />
    </>
  )
}
