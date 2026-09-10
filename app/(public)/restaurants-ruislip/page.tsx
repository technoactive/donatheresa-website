import { Metadata } from 'next'
import { NearbyAreaPage, type NearbyAreaContent } from '@/components/public/nearby-area-page'

export const metadata: Metadata = {
  title: 'Italian Restaurant Ruislip',
  description: 'Family-run Italian restaurant about 15 minutes from Ruislip, in Hatch End. Old-school trattoria menu, £19.95 two-course lunch and early bird, free parking. 020 8421 5550.',
  keywords: ['italian restaurant ruislip', 'restaurants ruislip', 'restaurants near ruislip', 'italian near ruislip', 'places to eat ruislip'],
  openGraph: {
    title: 'Italian Restaurant near Ruislip | Dona Theresa, Hatch End',
    description: 'Fifteen minutes from Ruislip through Eastcote and Pinner. Family-run Italian since 2011 with free parking and two courses for £19.95.',
    url: 'https://donatheresa.co.uk/restaurants-ruislip',
    siteName: 'Dona Theresa Restaurant',
    images: [{ url: 'https://donatheresa.co.uk/og-ruislip.jpg', width: 1200, height: 630, alt: 'Dona Theresa Italian restaurant near Ruislip' }],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: { canonical: 'https://donatheresa.co.uk/restaurants-ruislip' }
}

const content: NearbyAreaContent = {
  area: 'Ruislip',
  heroTitle: 'near Ruislip',
  heroText:
    'Dona Theresa is the family-run Italian in Hatch End, about fifteen minutes from Ruislip through Eastcote and Pinner. Open since 2011, with a trattoria menu that has not chased fashion, two courses for £19.95 at lunch and early evening, and free parking.',
  driveTime: '15 min',
  driveLabel: 'By car from Ruislip',
  intro: [
    'Ruislip High Street and Ruislip Manor have their own Italians and we are not going to pretend otherwise. The reason people make the fifteen-minute trip to us tends to be one of three things: the menu, which is the old-fashioned kind — veal, calf\'s liver, an 11oz fillet Rossini, seafood spaghetti, Dover sole; the £19.95 two-course menu on a weekday; or a birthday, because we make a proper fuss.',
    'From Ruislip it is Eastcote Road through Eastcote, Bridle Road and Cuckoo Hill into Pinner, then up Uxbridge Road for a mile. Fifteen minutes on an ordinary evening, and there is free parking when you get here — which is not something Pinner village can offer.'
  ],
  drivingPoints: [
    'Eastcote Road through Eastcote village, then Bridle Road and Cuckoo Hill into Pinner, and right onto Uxbridge Road.',
    'From Ruislip Manor or Eastcote station: Field End Road north, then Cuckoo Hill and Uxbridge Road.',
    'Roughly 4 miles; 15 minutes most evenings.'
  ],
  transportPoints: [
    'Metropolitan line from Ruislip or Ruislip Manor to Harrow on the Hill, change for Pinner, then the H12 bus or a 20-minute walk — a cab is honestly easier.',
    'The H13 bus runs from Ruislip Lido through Northwood Hills to Pinner; change there for the H12 along Uxbridge Road.',
    'A cab from Ruislip is about 15 minutes.'
  ],
  faqs: [
    {
      q: 'How far is Dona Theresa from Ruislip?',
      a: 'About four miles — fifteen minutes by car through Eastcote and Pinner, then a mile up Uxbridge Road. We are at 451 Uxbridge Road, Hatch End, HA5 4JR, with free parking for guests.'
    },
    {
      q: 'Is there parking?',
      a: 'Yes, free, at the restaurant.'
    },
    {
      q: 'What is the £19.95 menu?',
      a: 'Two courses from a shorter menu, at lunch (12–3) and as an early bird at dinner with orders in by 6.45pm. Fridays and Saturdays early-bird tables finish by 8pm. Not for parties over twelve.'
    },
    {
      q: 'Do I need to book?',
      a: 'Friday and Saturday evenings and Sunday lunch, yes — online or on 020 8421 5550. Midweek you can usually walk in.'
    }
  ]
}

export default function RestaurantsRuislipPage() {
  return <NearbyAreaPage content={content} />
}
