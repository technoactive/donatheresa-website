import { Metadata } from 'next'
import { NearbyAreaPage, type NearbyAreaContent } from '@/components/public/nearby-area-page'

export const metadata: Metadata = {
  title: 'Italian Restaurant Northwood',
  description: 'Family-run Italian restaurant about 10 minutes from Northwood, in Hatch End. Old-school trattoria menu, £19.95 two-course lunch and early bird, free parking. 020 8421 5550.',
  keywords: ['italian restaurant northwood', 'restaurants northwood', 'restaurants near northwood', 'italian near northwood', 'places to eat northwood'],
  openGraph: {
    title: 'Italian Restaurant near Northwood | Dona Theresa, Hatch End',
    description: 'Ten minutes from Northwood along Pinner Road. Family-run Italian since 2011, free parking, two courses for £19.95.',
    url: 'https://donatheresa.co.uk/restaurants-northwood',
    siteName: 'Dona Theresa Restaurant',
    images: [{ url: 'https://donatheresa.co.uk/og-northwood.jpg', width: 1200, height: 630, alt: 'Dona Theresa Italian restaurant near Northwood' }],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: { canonical: 'https://donatheresa.co.uk/restaurants-northwood' }
}

const content: NearbyAreaContent = {
  area: 'Northwood',
  heroTitle: 'near Northwood',
  heroText:
    'Dona Theresa is the family-run Italian in Hatch End, about ten minutes from Northwood along Pinner Road. Open since 2011, with a proper trattoria menu, two courses for £19.95 at lunch and early evening, and free parking.',
  driveTime: '10 min',
  driveLabel: 'By car from Northwood',
  intro: [
    'Northwood has a handful of decent places to eat around Green Lane and the station, and Northwood Hills a few more. What it is short of is a sit-down Italian with a car park, which is where we come in. A good number of our Saturday regulars are Northwood people who found us because parking in Pinner village had beaten them one too many times.',
    'From Northwood it is Pinner Road through Pinner Green, over the roundabout onto Uxbridge Road, and we are on the right after the Hatch End shops. Ten minutes on a normal evening, a bit longer if the school run is on.'
  ],
  drivingPoints: [
    'Pinner Road (B466) from Northwood through Pinner Green, then right onto Uxbridge Road.',
    'From Northwood Hills, Joel Street to Pinner then up Uxbridge Road — about the same.',
    'Roughly 3 miles; 10 minutes most evenings.'
  ],
  transportPoints: [
    'Metropolitan line from Northwood to Pinner (two stops), then the H12 bus a few stops along Uxbridge Road, or a 20-minute walk.',
    'Hatch End Overground station is five minutes\' walk from us if you are coming from the Watford or Euston direction.',
    'A cab from Northwood is about ten minutes.'
  ],
  faqs: [
    {
      q: 'How far is Dona Theresa from Northwood?',
      a: 'About three miles — ten minutes by car along Pinner Road and Uxbridge Road. We are at 451 Uxbridge Road, Hatch End, HA5 4JR, with free parking for guests.'
    },
    {
      q: 'Is there parking?',
      a: 'Yes, free, at the restaurant. Nobody has to circle Pinner village looking for a space.'
    },
    {
      q: 'What is the £19.95 menu?',
      a: 'Two courses from a shorter menu, served at lunch (12–3) and as an early bird at dinner with orders in by 6.45pm. Fridays and Saturdays, early-bird tables finish by 8pm. Not for parties over twelve.'
    },
    {
      q: 'Do I need to book?',
      a: 'Friday and Saturday nights and Sunday lunch, yes — online or on 020 8421 5550. Midweek you can usually walk in.'
    }
  ]
}

export default function RestaurantsNorthwoodPage() {
  return <NearbyAreaPage content={content} />
}
