import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, Phone, Star, Car, Train } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Pinner Restaurants',
  description: 'Looking for restaurants in Pinner? Dona Theresa is the family-run Italian a mile up Uxbridge Road in Hatch End, with free parking and a £19.95 two-course lunch. 020 8421 5550.',
  keywords: [
    'pinner restaurants',
    'restaurants in pinner',
    'restaurants pinner',
    'italian restaurant pinner',
    'italian restaurants pinner',
    'restaurant in pinner',
    'places to eat in pinner'
  ],
  openGraph: {
    title: 'Pinner Restaurants | Dona Theresa Italian Restaurant',
    description: 'The family-run Italian between Pinner and Hatch End. Proper trattoria menu, free parking, two courses for £19.95 at lunch and early evening.',
    url: 'https://donatheresa.co.uk/restaurants-pinner',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.co.uk/og-pinner.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa Italian restaurant near Pinner'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/restaurants-pinner'
  }
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

const faqs = [
  {
    q: 'Is Dona Theresa actually in Pinner?',
    a: 'Our postal address is Pinner, HA5 4JR, but we are on Uxbridge Road in Hatch End, about a mile north-east of Pinner village. Ten minutes by car from the High Street, twenty on foot, or a few stops on the H12 bus.'
  },
  {
    q: 'Which Pinner restaurants have parking?',
    a: 'Very few in the village itself — the car parks fill by seven. We have free parking for guests at the restaurant, which is the main reason a lot of Pinner regulars come up the road to us on a Friday or Saturday.'
  },
  {
    q: 'What is the £19.95 menu?',
    a: 'Two courses, starter and main, from a shorter version of our menu. Served at lunch, 12 till 3, and as an early bird at dinner with orders in by 6.45pm. On Fridays and Saturdays early-bird tables finish by 8pm. Not available for parties over twelve.'
  },
  {
    q: 'Can I book online?',
    a: 'Yes, at donatheresa.co.uk/reserve, or call 020 8421 5550. Book ahead for Friday and Saturday evenings and Sunday lunch. Midweek you can usually walk in.'
  }
]

export default function RestaurantsPinnerPage() {
  return (
    <>
      <DynamicSchema />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Restaurants in </span>
              <span className="text-amber-600">Pinner</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              If you live in Pinner and want a proper Italian dinner without the parking headache, come a mile up
              Uxbridge Road to Hatch End. Dona Theresa has been here since 2011 — family-run, old-school menu,
              free parking at the door.
            </p>
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
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">2011</div>
              <p className="text-slate-600">Open since</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">1 mile</div>
              <p className="text-slate-600">From Pinner High Street</p>
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

      {/* Guide */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Eating out in Pinner, from someone who lives here
            </h2>

            <div className="prose prose-lg max-w-none">
              <p>
                Pinner has more restaurants than a village its size deserves, and most of them are good. The
                High Street and Bridge Street have Indian, Turkish, Japanese, a couple of Italians, the pubs
                and the cafés round the Memorial Park. What Pinner does not have is anywhere to park after
                about seven o&apos;clock on a Friday.
              </p>

              <h3>Where we come in</h3>
              <p>
                We are a mile up the road in Hatch End, at 451 Uxbridge Road, with our own free parking. The
                menu is the kind of Italian you may remember from before everything became small plates: prawn
                cocktail and minestrone, grilled sardines, Pera al Forno with fried camembert; then saltimbocca
                di vitello, calf&apos;s liver with sage, spaghetti alla pescatora, an 11oz Filleto Rossini, duck in
                honey and pepper sauce, grilled Dover sole. Pasta is cooked to order. Portions are not small.
              </p>
              <p>
                No pizza — we have never made it and we are not going to start. Plenty of vegetarian dishes,
                marked (V) on the menu: parmigiana di melanzane, ravioli di funghi porcini, penne giardiniera,
                crespoline alla fiorentina.
              </p>

              <h3>The wine</h3>
              <p>
                Around thirty bottles, mostly Italian: a Barolo and a Brunello for occasions, Primitivo and
                Montepulciano for Tuesdays, a Sancerre and a Gavi for fish, a house Prosecco and a couple of
                Champagnes. Nothing on the list is there because a rep talked us into it.
              </p>

              <h3>When it suits</h3>
              <ul>
                <li><strong>Lunch during the week:</strong> the £19.95 menu, quiet room, walk in.</li>
                <li><strong>Early dinner:</strong> same £19.95 menu with orders in by 6.45pm — good with children.</li>
                <li><strong>Friday and Saturday night:</strong> full menu, book ahead.</li>
                <li><strong>Sunday lunch:</strong> big family tables. Come after two if you want a slow one.</li>
                <li><strong>Groups:</strong> up to twelve on the set menu, more on à la carte with a bit of notice.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What people from Pinner say
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Taken from our Google reviews. There are a lot more on{' '}
            <a
              href="https://www.tripadvisor.co.uk/Restaurant_Review-g7380842-d3226259-Reviews-Dona_Theresa-Pinner_Greater_London_England.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline"
            >
              TripAdvisor
            </a>
            , the good and the not-so-good.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-8 shadow-lg">
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

      {/* Set menu + a la carte */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-amber-600">
                Two courses, £19.95
              </h3>
              <p className="text-slate-700 mb-6">
                Starter and main from a shorter menu: minestrone, calamari, prosciutto e melone or whitebait to
                start; then sea bass, salmon in prosecco sauce, veal Milanese, calf&apos;s liver, lasagne or penne
                arrabiata. Coffee and puddings are extra.
              </p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li>• Tuesday to Sunday</li>
                <li>• Lunch 12:00–15:00, early bird with orders by 18:45</li>
                <li>• Friday &amp; Saturday early-bird tables finish by 20:00</li>
                <li>• Not for parties over twelve · 10% service</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/menu/lunchtime-earlybird">See the set menu</Link>
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-amber-600">
                À la carte
              </h3>
              <p className="text-slate-700 mb-6">
                The full menu, every evening. Starters from £5.95, pasta from £10.90, mains from about £17,
                fillet steaks around £29 and the Dover sole at £33. Specials depend on what the fish supplier
                turns up with.
              </p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li>• Pasta cooked to order</li>
                <li>• Veal, liver, duck, lamb and 11oz fillet steaks</li>
                <li>• Vegetarian dishes marked (V)</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/menu/a-la-carte">See the full menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Getting here */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Getting here from Pinner
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Address and hours</h3>
              <div className="space-y-4">
                <p className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">
                    451 Uxbridge Road, Pinner HA5 4JR<br />
                    On the Hatch End stretch of Uxbridge Road, near the station
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">
                    Tuesday to Sunday<br />
                    Lunch 12:00–15:00 · Dinner 18:00–23:00<br />
                    Closed Mondays
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <a href="tel:02084215550" className="font-semibold text-slate-700 hover:text-amber-600">
                    020 8421 5550
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">How to get here</h3>
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="font-semibold mb-2 flex items-center gap-2"><Car className="w-5 h-5 text-amber-600" /> Driving</p>
                  <ul className="space-y-1 ml-4">
                    <li>• About 10 minutes from Pinner High Street along Uxbridge Road</li>
                    <li>• Free parking for guests on site</li>
                    <li>• Satnav: HA5 4JR</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2 flex items-center gap-2"><Train className="w-5 h-5 text-amber-600" /> Public transport</p>
                  <ul className="space-y-1 ml-4">
                    <li>• H12 bus along Uxbridge Road from Pinner — a few stops</li>
                    <li>• Hatch End station (Overground, Euston–Watford line) is five minutes&apos; walk from us</li>
                    <li>• Pinner Metropolitan line station is about a 20-minute walk</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions people from Pinner ask us
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
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
          <h2 className="text-4xl font-bold mb-6">
            Book a table
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Online for any day, or ring us if it is for tonight and we will see what we can do.
          </p>
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
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })
        }}
      />
    </>
  )
}
