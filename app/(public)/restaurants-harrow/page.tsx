import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, Star, Award, Utensils, Wine, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RestaurantInfo } from '@/components/locale/restaurant-info'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Italian Restaurant Harrow | Best Restaurants Near You | Dona Theresa',
  description: 'Top-rated Italian restaurant near Harrow. Dona Theresa serves authentic Italian cuisine, lunch £19.95, premium steaks. Free parking. 451 Uxbridge Road, Pinner. Book: 020 8421 5550',
  keywords: [
    'italian restaurant harrow',
    'restaurants harrow',
    'best restaurants harrow',
    'restaurants near harrow',
    'italian food harrow',
    'restaurants harrow town',
    'best italian near harrow',
    'harrow dining',
    'italian harrow',
    'places to eat harrow'
  ],
  openGraph: {
    title: 'Italian Restaurant Harrow | Dona Theresa - Best Italian Food Near You',
    description: 'Award-winning Italian restaurant near Harrow. Authentic cuisine, romantic atmosphere, convenient location with free parking. Just 10 minutes from Harrow.',
    url: 'https://donatheresa.com/restaurants-harrow',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.com/og-harrow.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa - Best Italian Restaurant Near Harrow'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.com/restaurants-harrow'
  }
}

export default function RestaurantsHarrowPage() {
  const features = [
    {
      icon: Award,
      title: "Award-Winning",
      description: "Consistently rated among the best Italian restaurants near Harrow"
    },
    {
      icon: Utensils,
      title: "Authentic Cuisine",
      description: "Traditional Italian recipes with modern presentation"
    },
    {
      icon: Wine,
      title: "Extensive Wine List",
      description: "Carefully curated selection of Italian wines"
    },
    {
      icon: Users,
      title: "Family Friendly",
      description: "Perfect for any occasion - business, family, or romantic dinners"
    }
  ]

  return (
    <>
      <DynamicSchema />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Best </span>
              <span className="text-amber-600">Italian Restaurant Near Harrow</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Looking for an excellent Italian restaurant near Harrow? Dona Theresa is just 10 minutes away 
              with authentic cuisine, free parking, and award-winning service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg bg-amber-600 hover:bg-amber-700">
                <Link href="/reserve">Reserve Your Table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/menu">Explore Our Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Distance & Travel Time */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">4.9★</div>
              <p className="text-slate-600">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">10 min</div>
              <p className="text-slate-600">From Harrow Town</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">£19.95</div>
              <p className="text-slate-600">Lunch Special</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">FREE</div>
              <p className="text-slate-600">Customer Parking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose Dona Theresa for Italian Dining Near Harrow
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            Just a short journey from Harrow, we offer authentic Italian excellence 
            that beats any restaurant in the area
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <feature.icon className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Makes Our Menu Special
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-amber-50 rounded-2xl p-8 mb-4">
                <span className="text-4xl">🍝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Pasta Daily</h3>
              <p className="text-slate-600">
                Handmade pasta prepared fresh every morning by our Italian chefs
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-50 rounded-2xl p-8 mb-4">
                <span className="text-4xl">🥩</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Steaks</h3>
              <p className="text-slate-600">
                28-day aged beef cooked to perfection on our charcoal grill
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-50 rounded-2xl p-8 mb-4">
                <span className="text-4xl">🍷</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Italian Wine Selection</h3>
              <p className="text-slate-600">
                Over 50 wines from Italy's finest vineyards
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Travel to Us */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Harrow Residents Choose Dona Theresa
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Worth the Short Journey</h3>
              <div className="space-y-4">
                <p className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                  <span>
                    <strong>Just 10 minutes from Harrow town centre</strong><br />
                    Easy access via A4440 or A411
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-amber-600 mt-1" />
                  <span>
                    <strong>Superior to most Harrow restaurants</strong><br />
                    Award-winning Italian excellence you won't find locally
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-amber-600 mt-1" />
                  <span>
                    <strong>Consistently packed with satisfied diners</strong><br />
                    Harrow residents regularly make the short trip
                  </span>
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h3 className="text-2xl font-semibold mb-6">Easy Location</h3>
              <div className="space-y-4">
                <p className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>451 Uxbridge Road, Pinner HA5 4JR</strong><br />
                    Between Pinner & Hatch End
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Open Tue-Sun</strong><br />
                    Lunch: 12:00-15:00 | Dinner: 18:00-23:00
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Reservations:</strong><br />
                    <a href="tel:02084215550" className="text-amber-600 hover:text-amber-700 font-semibold">
                      020 8421 5550
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Harrow Visitors Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">
                "Worth the 10-minute drive from Harrow! The Italian here is authentic and the service is impeccable. Definitely my favourite restaurant near me."
              </p>
              <p className="font-semibold">Michael T.</p>
              <p className="text-sm text-slate-600">Harrow Resident</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">
                "Had dinner here with friends from Harrow last weekend. Everyone agreed it's the best Italian restaurant near Harrow. We're going back next month!"
              </p>
              <p className="font-semibold">Jennifer W.</p>
              <p className="text-sm text-slate-600">From Harrow</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">
                "Our regular spot for special occasions. Only 10 minutes from Harrow and miles better than anything in town. Highly recommend!"
              </p>
              <p className="font-semibold">Robert H.</p>
              <p className="text-sm text-slate-600">Harrow Business Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-amber-600">
                Lunch Special £19.95
              </h3>
              <p className="text-slate-700 mb-6">
                Perfect value for Harrow professionals. Choose from our specially 
                curated menu featuring classic Italian dishes.
              </p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li>• Available Tuesday - Sunday</li>
                <li>• 12:00 PM - 3:00 PM</li>
                <li>• Includes starter & main course</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/menu/lunchtime-earlybird">View Lunch Menu</Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-amber-600">
                Easy Parking
              </h3>
              <p className="text-slate-700 mb-6">
                Unlike restaurants in Harrow town centre, we offer FREE customer 
                parking on-site - a significant advantage for all our guests.
              </p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li>• Dedicated customer parking</li>
                <li>• No parking fees or meters</li>
                <li>• Easy access and drop-off</li>
              </ul>
              <Button asChild size="lg" className="w-full">
                <Link href="/reserve">Book Your Table</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the Best Italian Restaurant Near Harrow?
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Just 10 minutes from Harrow, Dona Theresa offers authentic Italian excellence 
            that beats any local option. Book your table today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-amber-600 hover:bg-amber-700">
              <Link href="/reserve">Book Online Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <a href="tel:02084215550">
                <Phone className="w-5 h-5 mr-2" />
                Call 020 8421 5550
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-12 border-t">
            <RestaurantInfo />
          </div>
        </div>
      </section>
    </>
  )
}

