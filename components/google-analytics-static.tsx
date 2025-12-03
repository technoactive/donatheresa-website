// Static GA component that doesn't require database access
// This ensures GA tag is always present for Google verification
export function GoogleAnalyticsStatic() {
  // Use the measurement ID from your database
  const measurementId = 'G-YR0LDTQLGD'
  
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

  gtag('config', '${measurementId}', {
    currency: 'GBP',
    country: 'GB'
  });
  
  // Initialize enhanced ecommerce for conversion tracking
  gtag('set', {
    'currency': 'GBP',
    'country': 'GB'
  });
          `,
        }}
      />
    </>
  )
}
