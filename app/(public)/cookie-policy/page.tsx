import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Dona Theresa Italian Restaurant",
  description: "Learn about how Dona Theresa uses cookies to improve your browsing experience and provide personalized service.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/cookie-policy'
  }
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <p>Dona Theresa uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., remembering your booking details during a session)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website through Google Analytics</li>
              <li><strong>Preference Cookies:</strong> Remember your choices and preferences for future visits</li>
              <li><strong>Marketing Cookies:</strong> May be used to show you relevant advertisements about our restaurant</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Strictly Necessary Cookies</h3>
              <p className="text-sm mb-2">These cookies are essential for the website to function and cannot be switched off.</p>
              <ul className="text-sm list-disc pl-5">
                <li>Session cookies for maintaining your booking process</li>
                <li>Cookie consent preference storage</li>
                <li>Security cookies for protecting against fraud</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Performance & Analytics Cookies</h3>
              <p className="text-sm mb-2">These cookies help us understand how our website is being used.</p>
              <ul className="text-sm list-disc pl-5">
                <li>Google Analytics (_ga, _gid, _gat) - Tracks website usage and visitor behavior</li>
                <li>Performance monitoring cookies - Help us identify and fix website issues</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
              <p className="text-sm mb-2">These cookies enable enhanced functionality and personalization.</p>
              <ul className="text-sm list-disc pl-5">
                <li>Language preference cookies</li>
                <li>Location-based service cookies</li>
                <li>User preference cookies</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Targeting/Marketing Cookies</h3>
              <p className="text-sm mb-2">These cookies may be set through our site by advertising partners.</p>
              <ul className="text-sm list-disc pl-5">
                <li>Social media cookies (Facebook, Instagram)</li>
                <li>Advertising effectiveness tracking</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p>
              We use services from third parties that may also set cookies on your device:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Social Media Platforms:</strong> If you interact with social media buttons on our site</li>
              <li><strong>Booking System:</strong> To manage table reservations and availability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set your browser to refuse all or some browser cookies</li>
              <li>Use your browser settings to delete cookies that have already been set</li>
              <li>Visit websites in "incognito" or "private browsing" mode</li>
            </ul>
            <p className="mt-4">
              Please note that blocking some types of cookies may impact your experience on our website and limit the services we can offer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browser Cookie Settings</h2>
            <p>
              You can manage cookies through your browser settings. Here's how:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/help/4027947" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Microsoft Edge</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="font-semibold text-gray-900">Dona Theresa Italian Restaurant</p>
              <p>451 Uxbridge Road, Hatch End</p>
              <p>Pinner HA5 4JR</p>
              <p className="mt-2">
                <strong>Phone:</strong> <a href="tel:+442084215550" className="text-amber-600 hover:text-amber-700">020 8421 5550</a>
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@donatheresa.co.uk" className="text-amber-600 hover:text-amber-700">info@donatheresa.co.uk</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
