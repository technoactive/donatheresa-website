import Link from 'next/link'
import { MapPin, Clock, Phone, Star, Car, Train } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export interface NearbyAreaContent {
  area: string
  heroTitle: string
  heroText: string
  driveTime: string
  driveLabel: string
  intro: string[]
  drivingPoints: string[]
  transportPoints: string[]
  faqs: { q: string; a: string }[]
}

const reviews = [
  {
    text: 'From the moment we stepped into Dona Theresa, we knew we had chosen the perfect place to celebrate our anniversary. This isn\'t just a restaurant; it\'s a slice of Italy right here in Pinner.',
    name: 'theguruyt',
    source: 'Local Guide · Google Review'
  },
  {
    text: 'The best place ever for Italian food. We love this place so much that we like to celebrate our special occasions with them. All pastas are good and dessert too!',
    name: 'Sonali Kosrabe',
    source: 'Local Guide · Google Review'
  },
  {
    text: 'Authentic romantic cosy place, fantastic food fresh and cooked as you like, service was really good and welcoming. Highly recommend this place.',
    name: 'Dilyana Milenkova',
    source: 'Local Guide · Google Review'
  }
]

export function NearbyAreaPage({ content }: { content: NearbyAreaContent }) {
  const c = content
  return (
    <>
      <DynamicSchema />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Italian restaurant </span>
              <span className="text-amber-600">{c.heroTitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">{c.heroText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg bg-amber-600 hover:bg-amber-700">
                <Link href="/reserve">Book a table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/menu">See the menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">{c.driveTime}</div>
              <p className="text-slate-600">{c.driveLabel}</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">2011</div>
              <p className="text-slate-600">Open since</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">£19.95</div>
              <p className="text-slate-600">Two courses, lunch &amp; early bird</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">Free</div>
              <p className="text-slate-600">Parking for guests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Copy */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Is it worth the drive from {c.area}?</h2>
            <div className="prose prose-lg max-w-none">
              {c.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <h3>What we cook</h3>
              <p>
                An Italian menu of the older kind. Starters like minestrone, prawn cocktail, grilled sardines and
                Pera al Forno — baked pear in red wine with fried camembert. Then saltimbocca di vitello, calf&apos;s
                liver with sage, spaghetti alla pescatora, an 11oz Filleto Rossini, duck in honey and pepper
                sauce, and grilled Dover sole on the bone. Pasta is cooked to order and portions are not small.
                No pizza — we have never made it. Vegetarian dishes are marked (V) and there are plenty.
              </p>
              <h3>The £19.95 menu</h3>
              <p>
                Starter and main from a shorter menu, at lunch (12 till 3) and as an early bird at dinner with
                orders in by 6.45pm. On Fridays and Saturdays early-bird tables finish by 8pm. It is not available
                for parties over twelve, and there is a 10% service charge. It is the reason a lot of people make
                the trip from {c.area} on a weekday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting here */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Getting here from {c.area}</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="w-6 h-6 text-amber-600" /> Driving
              </h3>
              <ul className="space-y-3 text-slate-700">
                {c.drivingPoints.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
                <li>• Free parking for guests at the restaurant. Satnav: HA5 4JR.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Train className="w-6 h-6 text-amber-600" /> Train and bus
              </h3>
              <ul className="space-y-3 text-slate-700">
                {c.transportPoints.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100 max-w-3xl mx-auto mt-12">
            <div className="grid sm:grid-cols-3 gap-6">
              <p className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <span className="text-slate-700">
                  <strong>451 Uxbridge Road</strong><br />Hatch End, Pinner HA5 4JR
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <span className="text-slate-700">
                  <strong>Tue–Sun</strong><br />12:00–15:00 · 18:00–23:00<br />Closed Mondays
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <span className="text-slate-700">
                  <strong>Bookings</strong><br />
                  <a href="tel:02084215550" className="text-amber-600 hover:text-amber-700 font-semibold">020 8421 5550</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What people say</h2>
          <p className="text-center text-slate-600 mb-12">
            From our Google reviews. More on{' '}
            <a
              href="https://www.tripadvisor.co.uk/Restaurant_Review-g7380842-d3226259-Reviews-Dona_Theresa-Pinner_Greater_London_England.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline"
            >
              TripAdvisor
            </a>
            .
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-slate-600">{r.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Questions from {c.area}</h2>
          <div className="space-y-6">
            {c.faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{f.q}</h3>
                <p className="text-slate-700">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Book a table</h2>
          <p className="text-xl text-slate-700 mb-8">Online for any day, or ring us if it is for tonight.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-amber-600 hover:bg-amber-700">
              <Link href="/reserve">Book online</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <a href="tel:02084215550">
                <Phone className="w-5 h-5 mr-2" />
                Call 020 8421 5550
              </a>
            </Button>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: c.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          })
        }}
      />
    </>
  )
}
