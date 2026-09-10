import { Metadata } from 'next'
import { NearbyAreaPage, type NearbyAreaContent } from '@/components/public/nearby-area-page'

export const metadata: Metadata = {
  title: 'Italian Restaurant Watford',
  description: 'Family-run Italian restaurant 20 minutes from Watford by car, or 10 minutes by direct train to Hatch End. Trattoria menu, £19.95 two-course lunch and early bird, free parking. 020 8421 5550.',
  keywords: ['italian restaurant watford', 'restaurants near watford', 'italian near watford', 'restaurants watford', 'places to eat near watford'],
  openGraph: {
    title: 'Italian Restaurant near Watford | Dona Theresa, Hatch End',
    description: 'Direct Overground from Watford Junction to Hatch End in about ten minutes, then a five-minute walk. Family-run Italian since 2011 with free parking.',
    url: 'https://donatheresa.co.uk/restaurants-watford',
    siteName: 'Dona Theresa Restaurant',
    images: [{ url: 'https://donatheresa.co.uk/og-watford.jpg', width: 1200, height: 630, alt: 'Dona Theresa Italian restaurant near Watford' }],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: { canonical: 'https://donatheresa.co.uk/restaurants-watford' }
}

const content: NearbyAreaContent = {
  area: 'Watford',
  heroTitle: 'near Watford',
  heroText:
    'Dona Theresa is the family-run Italian in Hatch End — twenty minutes from Watford by car, or four stops on the Overground from Watford Junction and a five-minute walk. Proper trattoria cooking since 2011, two courses for £19.95 at lunch and early evening, and free parking if you drive.',
  driveTime: '10 min',
  driveLabel: 'Direct train from Watford Junction',
  intro: [
    'Watford has no shortage of restaurants. What it has a shortage of is the kind of Italian where the menu has not changed much in a decade because nobody wanted it to: veal saltimbocca, calf\'s liver, an 11oz fillet Rossini, spaghetti heaped with seafood, Dover sole on the bone. That is what we do, in a dining room in Hatch End that is a lot easier to get to from Watford than people assume.',
    'The train is the trick. The Overground from Watford Junction stops at Watford High Street, Bushey, Carpenders Park and then Hatch End — about ten minutes — and we are five minutes\' walk from the station. Nobody has to drive, nobody has to stay off the wine.'
  ],
  drivingPoints: [
    'Via Oxhey and Carpenders Park: Oxhey Lane to the Hatch End roundabout, then left onto Uxbridge Road.',
    'Or the A4008 / A410 through Bushey Heath and Harrow Weald, then Uxbridge Road westbound.',
    'About 6 miles; 20 minutes outside rush hour.'
  ],
  transportPoints: [
    'London Overground from Watford Junction or Watford High Street to Hatch End: four stops, about ten minutes, then a five-minute walk along Uxbridge Road.',
    'Last trains back to Watford run late into the evening, so dinner and the train is a comfortable combination.',
    'A cab from Watford town centre is about 20 minutes.'
  ],
  faqs: [
    {
      q: 'How do I get to Dona Theresa from Watford without driving?',
      a: 'Take the London Overground from Watford Junction or Watford High Street towards Euston. Hatch End is the fourth stop, about ten minutes. Come out of the station, turn onto Uxbridge Road and we are a five-minute walk at number 451.'
    },
    {
      q: 'How long is the drive from Watford?',
      a: 'About 20 minutes outside rush hour — roughly six miles via Oxhey Lane or through Bushey Heath and Harrow Weald. There is free parking for guests at the restaurant.'
    },
    {
      q: 'What is the £19.95 menu?',
      a: 'Two courses from a shorter menu, at lunch (12–3) and as an early bird at dinner with orders in by 6.45pm. Fridays and Saturdays early-bird tables finish by 8pm. Not for parties over twelve.'
    },
    {
      q: 'Do I need to book?',
      a: 'For Friday and Saturday evenings and Sunday lunch, yes — online or on 020 8421 5550. Midweek you can generally walk in.'
    }
  ]
}

export default function RestaurantsWatfordPage() {
  return <NearbyAreaPage content={content} />
}
