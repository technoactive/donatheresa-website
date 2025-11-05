export function GADirectScript({ measurementId }: { measurementId: string }) {
  return (
    <>
      {/* Google Analytics Direct Script - For Verification Only */}
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
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'ad_storage': 'denied'
            });
            gtag('config', '${measurementId}', {
              send_page_view: false
            });
            console.log('GA Direct Script loaded for verification: ${measurementId}');
          `,
        }}
      />
    </>
  )
}
