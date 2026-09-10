import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, MapPin, Phone, Utensils, Car, Train, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'
import { lunchtimeEarlybirdMenuData } from '@/lib/lunchtime-earlybird-menu-data'

export const metadata: Metadata = {
  title: 'Lunch in Pinner | £19.95',
  description: 'Two-course Italian lunch for £19.95, Tuesday to Sunday 12–3, a mile from Pinner in Hatch End. Free parking. Dona Theresa, 451 Uxbridge Road. 020 8421 5550.',
  keywords: [
    'lunch in pinner',
    'lunch pinner',
    'pinner lunch',
    'lunch places in pinner',
    'business lunch pinner',
    'italian lunch pinner',
    'set lunch pinner'
  ],
  openGraph: {
    title: 'Lunch in Pinner – two courses for £19.95 | Dona Theresa',
    description: 'A proper sit-down Italian lunch for £19.95, Tuesday to Sunday, with free parking. Dona Theresa, Uxbridge Road, Hatch End.',
    url: 'https://donatheresa.co.uk/lunch-pinner',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.co.uk/og-lunch.jpg',
        width: 1200,
        height: 630,
        alt: 'Two-course lunch at Dona Theresa, Hatch End'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/lunch-pinner'
  }
}

const faqs = [
  {
    q: 'What do I get for £19.95?',
    a: 'Any starter and any main from the lunch menu — the same menu we run as an early bird at dinner. Puddings, coffee and drinks are extra, and there is a 10% service charge.'
  },
  {
    q: 'How long does lunch take?',
    a: 'As long as you want it to. If you are on a lunch break tell us when you sit down and we will get the food out quickly; most tables in a hurry are done in about 45 minutes to an hour. If you are not in a hurry, nobody will move you on.'
  },
  {
    q: 'Can a big group come for the set lunch?',
    a: 'Up to twelve people. Larger groups are very welcome but on the à la carte menu — call us and we will sort it out.'
  },
  {
    q: 'Vegetarian, gluten-free, allergies?',
    a: 'Vegetarian dishes are marked (V) — there are usually five or six on the lunch menu. Tell us about allergies when you book or when you sit down; the kitchen will tell you plainly what you can and cannot have. Most grilled fish and meat dishes can be done without breadcrumbs or sauce.'
  },
  {
    q: 'Is there parking?',
    a: 'Yes, free, at the restaurant. That is the practical reason a lot of people from Pinner come to us for lunch rather than eating in the village.'
  }
]

export default function LunchPinnerPage() {
  const starters = lunchtimeEarlybirdMenuData.find((s) => s.category === 'Starters')?.items ?? []
  const mains = lunchtimeEarlybirdMenuData.find((s) => s.category !== 'Starters')?.items ?? []

  return (
    <>
      <DynamicSchema />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-amber-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Lunch in </span>
              <span className="text-amber-600">Pinner</span>
              <span className="text-slate-900"> — two courses, </span>
              <span className="text-green-600">£19.95</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              A proper sit-down Italian lunch, not a sandwich. Starter and main from a menu of about
              thirty dishes, Tuesday to Sunday from 12 till 3, a mile up the road from Pinner in Hatch End.
              Free parking outside.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg bg-green-600 hover:bg-green-700">
                <Link href="/reserve">Book a lunch table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/menu/lunchtime-earlybird">Full lunch menu</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-slate-600 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Tue–Sun, 12:00–15:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                <span>Starter + main</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                <span>Free parking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu, from the real data */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What&apos;s on the lunch menu
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            This is the actual menu, not a taster. Pick one from each column.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-amber-600 mb-6">Starters</h3>
              <ul className="space-y-3">
                {starters.map((item) => (
                  <li key={item.name}>
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    {item.description && <span className="text-slate-600"> — {item.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-amber-600 mb-6">Mains</h3>
              <ul className="space-y-3">
                {mains.map((item) => (
                  <li key={item.name}>
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    {item.description && <span className="text-slate-600"> — {item.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto">
            Puddings, coffee and drinks are extra. 10% service charge. The same menu runs as an early bird at
            dinner with orders in by 6.45pm; on Fridays and Saturdays early-bird tables finish by 8pm. Not
            available for parties over twelve.
          </p>
        </div>
      </section>

      {/* Who it suits */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Who comes for lunch
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">People on a lunch break</h3>
              <p className="text-slate-600">
                Tell us you are short of time and we will have the food out fast. Most tables in a hurry are
                finished inside the hour. The room is quiet enough midweek to actually talk business.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Retired friends who meet on Tuesdays</h3>
              <p className="text-slate-600">
                We have several of these tables and they are the best part of the week. Nobody is hurried,
                the coffee keeps coming, and the calf&apos;s liver is usually involved.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Sunday families</h3>
              <p className="text-slate-600">
                Sunday lunch is the busiest service of the week, big tables and children included. Half
                portions of pasta for the little ones are never a problem. Book, because it fills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Getting here from Pinner
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Car className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">By car</p>
                  <p className="text-slate-600">About ten minutes from Pinner High Street along Uxbridge Road. Free parking for guests at the restaurant. Satnav HA5 4JR.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Train className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Bus and train</p>
                  <p className="text-slate-600">The H12 runs along Uxbridge Road from Pinner. Hatch End Overground station is five minutes&apos; walk from us; Pinner Metropolitan line station is about twenty.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">On foot</p>
                  <p className="text-slate-600">Twenty minutes or so from the village, straight up Uxbridge Road. Downhill on the way back.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Lunch service</h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span><strong>Tuesday to Sunday:</strong> 12:00–15:00</span>
                </p>
                <p className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span><strong>Set menu groups:</strong> up to twelve people</span>
                </p>
                <p className="flex items-center gap-3">
                  <Utensils className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span><strong>Booking:</strong> walk in midweek; book Sundays</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span><strong>Phone:</strong> <a href="tel:02084215550" className="hover:text-amber-600">020 8421 5550</a></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Lunch questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{f.q}</h3>
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
            Book a lunch table
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Online for any day, or ring if it is for today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="text-lg bg-green-600 hover:bg-green-700 px-8">
              <Link href="/reserve">Book online</Link>
            </Button>
            <div className="flex items-center gap-4 text-slate-600">
              <span>or call</span>
              <a href="tel:02084215550" className="text-2xl font-bold text-amber-600 hover:text-amber-700">
                020 8421 5550
              </a>
            </div>
          </div>
          <div className="mt-12 pt-12 border-t text-slate-600">
            <p className="font-semibold">Dona Theresa Italian Restaurant</p>
            <p>451 Uxbridge Road, Pinner HA5 4JR</p>
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
