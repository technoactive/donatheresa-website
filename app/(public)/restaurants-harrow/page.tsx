import { Metadata } from 'next'
import { NearbyAreaPage, type NearbyAreaContent } from '@/components/public/nearby-area-page'

export const metadata: Metadata = {
  title: 'Italian Restaurant Harrow',
  description: 'Family-run Italian restaurant 10 minutes from Harrow, in Hatch End. Two stops on the Overground from Harrow & Wealdstone. Trattoria menu, £19.95 two-course lunch and early bird, free parking. 020 8421 5550.',
  keywords: ['italian restaurant harrow', 'restaurants harrow', 'restaurants in harrow', 'italian near harrow', 'restaurants near harrow', 'places to eat harrow'],
  openGraph: {
    title: 'Italian Restaurant near Harrow | Dona Theresa, Hatch End',
    description: 'Two stops from Harrow & Wealdstone on the Overground, or ten minutes by car. Family-run Italian since 2011 with free parking.',
    url: 'https://donatheresa.co.uk/restaurants-harrow',
    siteName: 'Dona Theresa Restaurant',
    images: [{ url: 'https://donatheresa.co.uk/og-harrow.jpg', width: 1200, height: 630, alt: 'Dona Theresa Italian restaurant near Harrow' }],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: { canonical: 'https://donatheresa.co.uk/restaurants-harrow' }
}

const content: NearbyAreaContent = {
  area: 'Harrow',
  heroTitle: 'near Harrow',
  heroText:
    'Dona Theresa is the family-run Italian in Hatch End, ten minutes from Harrow town centre and two stops up the Overground from Harrow & Wealdstone. Open since 2011, with an old-fashioned trattoria menu, two courses for £19.95 at lunch and early evening, and free parking.',
  driveTime: '10 min',
  driveLabel: 'From Harrow town centre',
  intro: [
    'Harrow has everything — St Ann\'s, the Heart of Harrow, Station Road, more restaurants than you could eat through in a year. It also has parking charges, one-way systems and a Friday night that can feel like hard work. Hatch End is ten minutes up the road and none of those things apply.',
    'We are the Italian on Uxbridge Road with the car park. Harrow Weald and Headstone people walk in; from the town centre it is Headstone Lane or the Uxbridge Road straight through, or two stops on the Overground from Harrow & Wealdstone and a five-minute walk from Hatch End station.'
  ],
  drivingPoints: [
    'From Harrow town centre: Headstone Road, then Headstone Lane north to Uxbridge Road; we are on the left.',
    'From Harrow Weald: Uxbridge Road westbound, about five minutes.',
    'From Harrow on the Hill or Rayners Lane: through North Harrow and up Pinner Road/Uxbridge Road, 10–15 minutes.'
  ],
  transportPoints: [
    'London Overground from Harrow & Wealdstone towards Watford: Headstone Lane, then Hatch End — two stops, about five minutes, then a five-minute walk.',
    'Metropolitan line to Pinner from Harrow on the Hill, then the H12 bus along Uxbridge Road or a 20-minute walk.',
    'The H12 runs from South Harrow through Rayners Lane and Pinner to Hatch End, and stops on Uxbridge Road near us.'
  ],
  faqs: [
    {
      q: 'How far is Dona Theresa from Harrow?',
      a: 'About ten minutes by car from Harrow town centre via Headstone Lane, or two stops on the Overground from Harrow & Wealdstone to Hatch End and a five-minute walk. We are at 451 Uxbridge Road, HA5 4JR.'
    },
    {
      q: 'Is there parking?',
      a: 'Yes — free parking for guests at the restaurant, which is not a sentence you often hear in Harrow.'
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

export default function RestaurantsHarrowPage() {
  return <NearbyAreaPage content={content} />
}
