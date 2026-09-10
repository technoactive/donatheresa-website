import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies and similar storage donatheresa.co.uk actually uses, what for, and how to switch them off.",
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
          <p className="text-sm text-gray-500 mb-6">Last updated: 10 September 2026</p>

          <p>
            This is a restaurant website. It exists so you can look at the menu and book a table, and we have
            tried to keep the tracking to match. Below is a plain list of what the site stores on your device,
            why, and how to turn it off. If anything here is unclear, ring us on 020 8421 5550 and ask for
            whoever looks after the website.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">The short version</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No advertising cookies. We do not run ads and we do not sell or share your data with advertisers.</li>
              <li>Google Analytics only runs if you accept it in the banner. If you decline, it is switched off.</li>
              <li>Your booking is stored on our own booking system, not in a cookie.</li>
              <li>Staff who log in to manage bookings get a login cookie. Nobody else does.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What we store, item by item</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Your cookie choice</h3>
              <p className="text-sm mb-2">
                When you click Accept or Decline on the banner we save that answer in your browser&apos;s local
                storage under the name <code>dona-theresa-cookie-preferences</code>, so we do not ask you again
                every visit. It contains only your yes/no answers and the date. It is strictly necessary in the
                sense that without it the banner would come back on every page.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Google Analytics 4 — only with your consent</h3>
              <p className="text-sm mb-2">
                If you accept analytics, Google Analytics sets its usual cookies (<code>_ga</code> and{' '}
                <code>_ga_*</code>) so we can see roughly how many people visit, which pages they read and
                whether the booking form is working. If you decline, we tell Google&apos;s script that consent
                is denied and it does not set them. We do not use Google Signals, advertising features or
                remarketing.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Ahrefs and Vercel analytics — no cookies</h3>
              <p className="text-sm mb-2">
                We also use two lightweight page-view counters, one from Ahrefs and one from Vercel (who host
                the site). Neither sets a cookie or stores anything on your device; they count visits in
                aggregate and do not identify you.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Booking a table</h3>
              <p className="text-sm mb-2">
                When you book, the details you type (name, phone, email, party size, time) go to our booking
                database so the restaurant can see the reservation and send you a confirmation. Nothing about
                your booking is kept in a cookie. If a deposit is required for your booking, payment is taken
                by Stripe on their secure page; Stripe sets its own cookies during that payment for fraud
                prevention, and only then.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Staff login</h3>
              <p className="text-sm mb-2">
                The restaurant team signs in to a private area to manage bookings. That login uses secure
                session cookies set by Supabase, our database provider. They are only ever set for someone who
                has actually logged in as staff; ordinary visitors never receive them.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What we don&apos;t do</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No Facebook, Instagram or other social media tracking pixels. The social icons in the footer are plain links.</li>
              <li>No advertising or retargeting cookies of any kind.</li>
              <li>No selling or sharing of visitor data with third parties.</li>
              <li>No location tracking beyond the country-level information Google Analytics derives from your IP address, if you have accepted analytics.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changing your mind</h2>
            <p>
              To withdraw analytics consent, clear this site&apos;s data in your browser (that removes the saved
              preference and any Google cookies) and the banner will reappear on your next visit so you can
              decline. You can also block or delete cookies for any site in your browser settings:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/help/4027947" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">Microsoft Edge</a></li>
            </ul>
            <p className="mt-4">
              Blocking everything will not stop you reading the menu or booking a table. It will only mean the
              banner asks you again each visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to this page</h2>
            <p>
              If we add or remove a tool that stores anything on your device we will update this page and the
              date at the top. We do not expect that to happen often.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
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
