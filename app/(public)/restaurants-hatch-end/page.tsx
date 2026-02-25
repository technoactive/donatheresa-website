import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, Star, ChefHat, Users, Car, Train } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Restaurants in Hatch End | Best Italian Restaurant | Dona Theresa',
  description: '⭐ #1 rated restaurant in Hatch End! Authentic Italian • Lunch £19.95 • FREE parking • Open Tue-Sun. Book now ☎️ 020 8421 5550',
  keywords: [
    'hatch end restaurants',
    'restaurants in hatch end',
    'restaurants hatch end',
    'best restaurants in hatch end',
    'hatch end italian restaurants',
    'italian restaurant hatch end',
    'restaurant in hatch end',
    'hatch end restaurant',
    'places to eat hatch end',
    'hatch end high street restaurants'
  ],
  openGraph: {
    title: 'Hatch End Restaurants | Dona Theresa Italian Restaurant',
    description: 'Discover the best Italian restaurant in Hatch End. Authentic cuisine, romantic atmosphere, convenient location on Uxbridge Road.',
    url: 'https://donatheresa.co.uk/restaurants-hatch-end',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.co.uk/og-hatch-end.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa - Best Restaurant in Hatch End'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/restaurants-hatch-end'
  }
}

export default function RestaurantsHatchEndPage() {
  const restaurantComparison = [
    {
      name: "Dona Theresa",
      cuisine: "Authentic Italian",
      priceRange: "££",
      rating: 4.8,
      highlights: ["Award-winning", "Lunch £19.95", "Free parking", "Late opening"],
      recommended: true
    },
    {
      name: "Other local restaurant",
      cuisine: "Mixed",
      priceRange: "££",
      rating: 4.2,
      highlights: ["Good service", "Limited parking"],
      recommended: false
    }
  ]

  return (
    <>
      <DynamicSchema />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Restaurants in </span>
              <span className="text-amber-600">Hatch End</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Discover why Dona Theresa is consistently voted the best Italian restaurant 
              among all Hatch End restaurants. Located on Uxbridge Road with free parking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/reserve">Book Your Table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/menu">View Our Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why We're Hatch End's Favourite Restaurant
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-slate-600">
                451 Uxbridge Road, just 5 minutes from Hatch End station with free customer parking
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Italian</h3>
              <p className="text-slate-600">
                Traditional recipes passed down through generations, made with fresh daily ingredients
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Award-Winning</h3>
              <p className="text-slate-600">
                Voted "Best Italian Restaurant" by Hatch End locals on TripAdvisor
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Comparison */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Compare Hatch End Restaurants
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            See why locals consistently choose Dona Theresa for special occasions, 
            business lunches, and family dinners
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {restaurantComparison.map((restaurant) => (
              <div 
                key={restaurant.name}
                className={`bg-white rounded-lg shadow-lg p-8 ${
                  restaurant.recommended ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                {restaurant.recommended && (
                  <div className="bg-amber-500 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{restaurant.name}</h3>
                <p className="text-slate-600 mb-4">{restaurant.cuisine} • {restaurant.priceRange}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-slate-600">/ 5.0</span>
                </div>
                <ul className="space-y-2">
                  {restaurant.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-slate-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
                {restaurant.recommended && (
                  <Button asChild className="w-full mt-6" size="lg">
                    <Link href="/reserve">Reserve Now</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lunch Special - Best Value in Hatch End
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Enjoy our famous lunch menu for just £19.95 per person. 
              Available Tuesday to Sunday, 12:00 - 15:00
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/menu/lunchtime-earlybird">View Lunch Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Your Guide to Dining at Hatch End's Best Italian Restaurant
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <h3>Finding the Perfect Restaurant in Hatch End</h3>
              <p>
                When searching for restaurants in Hatch End, you'll find various options along 
                Uxbridge Road and the high street. However, for those seeking authentic Italian 
                cuisine with a warm, welcoming atmosphere, Dona Theresa stands out as the clear choice.
              </p>
              
              <h3>What Makes Us Different</h3>
              <p>
                Unlike other Hatch End restaurants, we combine traditional Italian recipes with 
                modern presentation. Our chefs use only the freshest ingredients, delivered daily 
                from trusted suppliers. From handmade pasta to wood-fired pizzas, every dish is 
                crafted with passion.
              </p>
              
              <h3>Perfect for Every Occasion</h3>
              <ul>
                <li><strong>Business Lunches:</strong> Quick service, professional atmosphere</li>
                <li><strong>Romantic Dinners:</strong> Intimate candlelit tables available</li>
                <li><strong>Family Gatherings:</strong> Children's menu and high chairs provided</li>
                <li><strong>Special Celebrations:</strong> Private dining area for up to 40 guests</li>
              </ul>
              
              <h3>Easy to Find, Easy to Park</h3>
              <p>
                Located at 451 Uxbridge Road, we're one of the most accessible restaurants in 
                Hatch End. Just a 5-minute walk from Hatch End station, with free customer 
                parking available on-site - a rarity among Hatch End restaurants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How to Find Us in Hatch End
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Train className="w-6 h-6 text-amber-600" />
                By Public Transport
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li>• 5 minutes walk from Hatch End station (Metropolitan line)</li>
                <li>• 10 minutes from Pinner station</li>
                <li>• Bus routes H12 and H13 stop nearby</li>
                <li>• Direct trains from Baker Street (25 minutes)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="w-6 h-6 text-amber-600" />
                By Car
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li>• FREE customer parking on-site</li>
                <li>• Located on A4180 Uxbridge Road</li>
                <li>• 2 minutes from Pinner town centre</li>
                <li>• Easy access from A40 and M25</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12 text-slate-600">
            <p className="font-semibold">Dona Theresa Italian Restaurant</p>
            <p>451 Uxbridge Road, Pinner HA5 4JR</p>
            <p>Tel: 020 8421 5550</p>
          </div>
        </div>
      </section>

      {/* FAQ Section for Rich Snippets */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions About Hatch End Restaurants
          </h2>
          
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-3">What is the best restaurant in Hatch End?</h3>
              <p className="text-slate-700">
                Dona Theresa is consistently rated the best restaurant in Hatch End, with a 4.8-star rating 
                on TripAdvisor and Google. We specialise in authentic Italian cuisine with fresh pasta made 
                daily, premium steaks, and an extensive wine list. Located at 451 Uxbridge Road with free parking.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-3">Is there free parking at restaurants in Hatch End?</h3>
              <p className="text-slate-700">
                Yes! Dona Theresa offers FREE customer parking on-site, which is rare among Hatch End restaurants. 
                We're located on Uxbridge Road with easy access from the A40 and M25, making us one of the most 
                convenient dining options in the area.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-3">What are the best lunch deals in Hatch End?</h3>
              <p className="text-slate-700">
                Our Lunchtime & Early Bird menu offers exceptional value at just £19.95 for 2 courses. 
                Available Tuesday to Sunday, 12:00-15:00, this is widely considered the best lunch deal 
                among all Hatch End restaurants. The menu includes Italian classics like fresh pasta, 
                risotto, and grilled dishes.
              </p>
            </div>
            
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-3">Do I need to book a table at Hatch End restaurants?</h3>
              <p className="text-slate-700">
                We recommend booking in advance, especially for Friday and Saturday evenings. You can 
                book online at donatheresa.co.uk/reserve or call us on 020 8421 5550. Walk-ins are welcome 
                but subject to availability.
              </p>
            </div>
            
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-3">What time do Hatch End restaurants close?</h3>
              <p className="text-slate-700">
                Dona Theresa is open Tuesday to Sunday. Lunch service: 12:00-15:00, Dinner service: 18:00-23:00. 
                We're closed on Mondays. Last orders for food are typically 30 minutes before closing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Experience Hatch End's Finest Italian Dining
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Join thousands of satisfied diners who've made Dona Theresa their 
            favourite among all Hatch End restaurants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/reserve">Book Your Table Now</Link>
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
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the best restaurant in Hatch End?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dona Theresa is consistently rated the best restaurant in Hatch End, with a 4.8-star rating on TripAdvisor and Google. We specialise in authentic Italian cuisine with fresh pasta made daily, premium steaks, and an extensive wine list."
                }
              },
              {
                "@type": "Question",
                "name": "Is there free parking at restaurants in Hatch End?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Dona Theresa offers FREE customer parking on-site, which is rare among Hatch End restaurants. We're located on Uxbridge Road with easy access from the A40 and M25."
                }
              },
              {
                "@type": "Question",
                "name": "What are the best lunch deals in Hatch End?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our Lunchtime & Early Bird menu offers exceptional value at just £19.95 for 2 courses. Available Tuesday to Sunday, 12:00-15:00."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to book a table at Hatch End restaurants?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We recommend booking in advance, especially for Friday and Saturday evenings. You can book online at donatheresa.co.uk/reserve or call us on 020 8421 5550."
                }
              }
            ]
          })
        }}
      />
    </>
  )
}
