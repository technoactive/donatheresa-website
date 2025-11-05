import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GA Test Page',
  robots: 'noindex,nofollow'
}

export default function GATestPage() {
  return (
    <>
      {/* Direct Google Analytics Script for Testing */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Ask user for their measurement ID
            const measurementId = prompt('Please enter your Google Analytics Measurement ID (G-XXXXXXXXXX):');
            if (measurementId) {
              // Inject GA script
              const script = document.createElement('script');
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
              document.head.appendChild(script);
              
              // Initialize gtag
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', measurementId);
              
              // Show result
              document.getElementById('result').innerHTML = 
                '<p>Google Analytics loaded with ID: ' + measurementId + '</p>' +
                '<p>Now go back to Google Analytics setup and click "Retry"</p>' +
                '<p>You can also check the browser console for the gtag script.</p>';
            }
          `
        }}
      />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Google Analytics Test Page</h1>
        <div id="result" className="space-y-4">
          <p>This page will help you verify Google Analytics installation.</p>
          <p>You'll be prompted to enter your Measurement ID.</p>
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 rounded-lg">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Enter your GA Measurement ID when prompted</li>
            <li>Open browser console (F12) to verify script loaded</li>
            <li>Go back to Google Analytics setup</li>
            <li>Click "Retry" verification</li>
          </ol>
        </div>
      </div>
    </>
  )
}
