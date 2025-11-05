export default function VerifyGAPage() {
  return (
    <>
      {/* Direct GA script in page for verification */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-YR0LDTQLGD"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-YR0LDTQLGD');
          `,
        }}
      />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">GA Verification Page</h1>
        <p className="mb-4">This page has Google Analytics directly embedded.</p>
        <p className="mb-4">Your Measurement ID: <code className="bg-gray-100 px-2 py-1 rounded">G-YR0LDTQLGD</code></p>
        
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h2 className="font-semibold mb-2">Verification Steps:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Right-click → View Page Source</li>
            <li>Search for G-YR0LDTQLGD</li>
            <li>You should see the GA scripts</li>
            <li>Go to Google Analytics and retry verification</li>
          </ol>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'test_click', {
                  event_category: 'verification',
                  event_label: 'test'
                });
                alert('Test event sent to GA!');
              } else {
                alert('GA not loaded yet!');
              }
            }}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          >
            Test GA Event
          </button>
        </div>
      </div>
    </>
  );
}
