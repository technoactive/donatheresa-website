import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, Phone, Car, Train, Utensils, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Hatch End Restaurants',
  description: 'Dona Theresa is the family-run Italian restaurant on Uxbridge Road, Hatch End. Two-course lunch and early bird £19.95, free parking, open Tue–Sun. 020 8421 5550.',
  keywords: [
    'hatch end restaurants',
    'restaurants in hatch end',
    'restaurants hatch end',
    'hatch end italian restaurants',
    'italian restaurant hatch end',
    'restaurant in hatch end',
    'places to eat hatch end'
  ],
  openGraph: {
    title: 'Hatch End Restaurants | Dona Theresa Italian Restaurant',
    description: 'The family-run Italian on Uxbridge Road, Hatch End, since 2011. Free parking, £19.95 two-course lunch, open Tuesday to Sunday.',
    url: 'https://donatheresa.co.uk/restaurants-hatch-end',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.co.uk/og-hatch-end.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa Italian restaurant, Uxbridge Road, Hatch End'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/restaurants-hatch-end'
  }
}

const faqs = [
  {
    q: 'Where exactly is Dona Theresa in Hatch End?',
    a: 'We are at 451 Uxbridge Road, Pinner HA5 4JR — on the main road through Hatch End, about five minutes on foot from Hatch End Overground station and a short walk from the Broadway shops.'
  },
  {
    q: 'Is there parking?',
    a: 'Yes, free parking for guests on site. That is rare on this stretch of Uxbridge Road, and it is the reason a lot of people from Pinner and Harrow choose us for a night out rather than somewhere in the village.'
  },
  {
    q: 'What is the £19.95 menu?',
    a: 'Two courses — a starter and a main — from a shorter version of our menu. It runs at lunch (12 till 3) and as an early-bird at dinner, with orders in by 6.45pm. On Fridays and Saturdays early-bird tables need to be finished by 8pm. Not available for parties of more than twelve.'
  },
  {
    q: 'Do I need to book?',
    a: 'Midweek lunch, usually not. Friday and Saturday evenings and Sunday lunch, yes — book online or call 020 8421 5550. Walk-ins are welcome whenever there is a free table.'
  },
  {
    q: 'What are your opening hours?',
    a: 'Tuesday to Sunday, lunch 12:00–15:00 and dinner 18:00–23:00. We are closed on Mondays. The kitchen takes last food orders around half an hour before closing.'
  }
]

export default function RestaurantsHatchEndPage() {
  return (
    <>
      <DynamicSchema />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Restaurants in </span>
              <span className="text-amber-600">Hatch End</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Dona Theresa is the Italian restaurant on Uxbridge Road, a few minutes from Hatch End station.
              Family-run since 2011, with a proper trattoria menu, a two-course lunch for £19.95 and free parking
              at the door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/reserve">Book a table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/menu">See the menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three things */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why people in Hatch End eat here
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">The menu hasn&apos;t chased fashion</h3>
              <p className="text-slate-600">
                Saltimbocca, calf&apos;s liver with sage, spaghetti alla pescatora, an 11oz fillet Rossini,
                Dover sole on the bone. The kind of Italian cooking that is getting hard to find in London.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">You can park</h3>
              <p className="text-slate-600">
                Free parking for guests on site. Anyone who has tried to park on the Broadway on a Saturday
                night will know why that matters.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">It&apos;s the same people</h3>
              <p className="text-slate-600">
                Same family running it since 2011, and a dining room where the staff know a good share of
                the tables by name. Birthdays get a fuss made of them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lunch / early bird */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Two courses for £19.95
            </h2>
            <p className="text-xl mb-3 max-w-2xl mx-auto">
              Lunch from 12 till 3, and early bird at dinner with orders in by 6.45pm, Tuesday to Sunday.
            </p>
            <p className="text-base mb-8 max-w-2xl mx-auto text-amber-50">
              Friday and Saturday early-bird tables finish by 8pm. Not for parties over twelve. 10% service.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/menu/lunchtime-earlybird">See what&apos;s on it</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Guide copy */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Eating out in Hatch End — an honest local&apos;s guide
            </h2>

            <div className="prose prose-lg max-w-none">
              <h3>What Hatch End has</h3>
              <p>
                Hatch End is small. Most of what there is to eat sits along Uxbridge Road between the station and
                the Broadway: a couple of Indian restaurants, a Turkish grill, a Japanese place, the pubs, and the
                Italians. Pinner village, a mile down the road, has more choice and far worse parking. Harrow has
                everything and you will not want to drive there on a Friday.
              </p>

              <h3>Where we fit</h3>
              <p>
                Of the Italians, we are the one with the old-fashioned menu and the car park. Not a pizza place
                — we don&apos;t make pizza at all — but a trattoria in the older sense: starters like prawn cocktail, minestrone and grilled sardines; pasta made to order in
                the pan; veal, liver, duck and steaks; fish that changes with what the supplier has. Portions are
                generous. Nobody has ever left hungry and complained about it.
              </p>
              <p>
                The name is Portuguese, and so is the way we look after people. You will not be turned over in
                ninety minutes unless you are on the Friday early bird, in which case we will tell you up front.
              </p>

              <h3>When to come</h3>
              <ul>
                <li><strong>Weekday lunch:</strong> quiet, the £19.95 menu, and you can usually walk in.</li>
                <li><strong>Early evening:</strong> the same £19.95 menu until 6.45pm — popular with families and with people coming off the Overground.</li>
                <li><strong>Friday and Saturday night:</strong> full à la carte, and you will need to book.</li>
                <li><strong>Sunday lunch:</strong> big family tables from half twelve. Come after two if you want a slower one.</li>
              </ul>

              <h3>Groups and occasions</h3>
              <p>
                We take tables of up to twelve on the set menu and larger groups on à la carte with a bit of
                notice. If there is a cake, tell us and we will keep it in the fridge and bring it out with candles.
                We would rather know about allergies when you book than when the plate arrives, but either way the
                kitchen will give you a straight answer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Getting to us
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Train className="w-6 h-6 text-amber-600" />
                Train and bus
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li>• Hatch End station is about five minutes&apos; walk. It is on the London Overground line between Euston and Watford Junction — roughly half an hour from Euston, ten minutes from Watford Junction.</li>
                <li>• Harrow &amp; Wealdstone is two stops down the same line.</li>
                <li>• Pinner (Metropolitan line) is about a 20-minute walk, or a few minutes on the H12 bus, which runs along Uxbridge Road.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="w-6 h-6 text-amber-600" />
                Driving
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li>• Free parking for guests at the restaurant.</li>
                <li>• We are on the A4180 Uxbridge Road — put HA5 4JR in the satnav.</li>
                <li>• About 10 minutes from Pinner village, Harrow Weald and Northwood; 15–20 from Watford, Ruislip and Stanmore.</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12 text-slate-600">
            <p className="font-semibold">Dona Theresa Italian Restaurant</p>
            <p>451 Uxbridge Road, Pinner HA5 4JR</p>
            <p>Tel: <a href="tel:02084215550" className="hover:text-amber-600">020 8421 5550</a></p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions we get asked
          </h2>

          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={f.q} className={i < faqs.length - 1 ? 'border-b pb-6' : 'pb-6'}>
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
            Book a table in Hatch End
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Online for any day, or ring us if it is for tonight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
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
