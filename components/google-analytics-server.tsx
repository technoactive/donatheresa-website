import { createClient } from '@/lib/supabase/server'

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
  
  // Return the exact format Google expects - raw script tags
  return (
    <>
      {/* Google tag (gtag.js) - Exact format from Google */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  )
}
