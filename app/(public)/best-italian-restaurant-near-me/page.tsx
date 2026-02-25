import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, Star, Award, Utensils, Check, X, Heart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Best Italian Restaurant Near Me | Dona Theresa Pinner',
  description: 'Award-winning Italian restaurant in Pinner & Hatch End. Authentic cuisine, lunch £19.95, romantic atmosphere. Top rated. Book: 020 8421 5550',
  keywords: [
    'best italian restaurant near me',
    'italian restaurant near me',
    'italian restaurants near me',
    'italian near me',
    'best italian near me',
    'italian food near me',
    'italian places near me',
    'pasta near me',
    'best restaurants near me',
    'restaurants near me',
    'italian restaurant',
    'authentic italian near me'
  ],
  openGraph: {
    title: 'Best Italian Restaurant Near Me | Dona Theresa Pinner & Hatch End',
    description: 'Award-winning Italian restaurant in Northwest London. Authentic cuisine, romantic atmosphere, convenient location with free parking.',
    url: 'https://donatheresa.co.uk/best-italian-restaurant-near-me',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.co.uk/og-best-italian.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa - Best Italian Restaurant Near You'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/best-italian-restaurant-near-me'
  }
}

export default function BestItalianRestaurantNearMePage() {
  const comparisonData = [
    { feature: "Authentic Italian Chef", donaTheresa: true, others: false },
    { feature: "Free Parking", donaTheresa: true, others: false },
    { feature: "Lunch Special £19.95", donaTheresa: true, others: false },
    { feature: "Open 6 Days", donaTheresa: true, others: "Varies" },
    { feature: "Award-Winning", donaTheresa: true, others: false },
    { feature: "Late Evening Service", donaTheresa: true, others: "Limited" },
    { feature: "Private Dining Available", donaTheresa: true, others: false },
    { feature: "Extensive Wine List", donaTheresa: true, others: "Limited" }
  ]

  const areas = [
    "Pinner", "Hatch End", "Northwood", "Harrow", 
    "Ruislip", "Eastcote", "Watford", "Stanmore"
  ]

  return (
    <>
      <DynamicSchema />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Award className="w-4 h-4" />
              <span>AWARD-WINNING ITALIAN RESTAURANT</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">The </span>
              <span className="text-amber-600">Best Italian Restaurant</span>
              <span className="text-slate-900"> Near You</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Discover authentic Italian cuisine at Dona Theresa. Located in Pinner & Hatch End, 
              we're your nearest destination for exceptional Italian dining.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg bg-amber-600 hover:bg-amber-700">
                <Link href="/reserve">Book Your Table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <a href="#find-us">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Us Near You
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-current" />
              <span className="text-lg font-semibold">4.8/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-600" />
              <span className="text-lg font-semibold">50,000+ Served</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <span className="text-lg font-semibold">13+ Years Loved</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              <span className="text-lg font-semibold">TripAdvisor Winner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why We're The Best Italian Restaurant Near You
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            Compare Dona Theresa with other Italian restaurants in Northwest London
          </p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white">
              <div className="p-6">
                <h3 className="text-lg font-semibold">Features</h3>
              </div>
              <div className="p-6 text-center bg-amber-600">
                <h3 className="text-lg font-semibold">Dona Theresa</h3>
                <p className="text-sm opacity-90">Your Best Choice</p>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold">Other Restaurants</h3>
              </div>
            </div>
            
            {comparisonData.map((item, idx) => (
              <div key={idx} className={`grid grid-cols-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <div className="p-6 font-medium text-slate-700">
                  {item.feature}
                </div>
                <div className="p-6 text-center">
                  {item.donaTheresa === true ? (
                    <Check className="w-6 h-6 text-green-600 mx-auto" />
                  ) : item.donaTheresa}
                </div>
                <div className="p-6 text-center">
                  {item.others === false ? (
                    <X className="w-6 h-6 text-red-500 mx-auto" />
                  ) : item.others === true ? (
                    <Check className="w-6 h-6 text-green-600 mx-auto" />
                  ) : (
                    <span className="text-slate-500">{item.others}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Best */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Makes Us The Best Italian Near You
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl text-white">👨‍🍳</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Authentic Italian Chef</h3>
              <p className="text-slate-700">
                Our head chef trained in Rome brings authentic recipes passed down through 
                generations. Every dish is a journey to Italy.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl text-white">🍝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Fresh Daily Ingredients</h3>
              <p className="text-slate-700">
                From handmade pasta to imported Italian cheeses, we use only the freshest, 
                highest quality ingredients delivered daily.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl text-white">💝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Perfect Atmosphere</h3>
              <p className="text-slate-700">
                Romantic candlelit dinners, family celebrations, or business lunches - 
                our warm, inviting atmosphere suits every occasion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section id="find-us" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Serving Italian Food Near You
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12">
            Conveniently located for diners across Northwest London
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6">We Serve Customers From:</h3>
              <div className="grid grid-cols-2 gap-4">
                {areas.map((area) => (
                  <div key={area} className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span className="text-lg">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Easy to Find, Easy to Love</h3>
              <div className="space-y-4">
                <p className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>451 Uxbridge Road, Pinner HA5 4JR</strong><br />
                    Between Pinner & Hatch End stations
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Open Tuesday - Sunday</strong><br />
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

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Locals Call Us The Best Italian Near Them
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-4 italic">
                "Searched for 'best Italian restaurant near me' and found this gem! 
                Now it's our regular spot. The authentic flavors remind me of Italy."
              </p>
              <p className="font-semibold">Michael R.</p>
              <p className="text-sm text-slate-600">From Harrow</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-4 italic">
                "Living in Northwood, this is definitely the best Italian restaurant 
                near me. Worth the short drive for their incredible pasta!"
              </p>
              <p className="font-semibold">Sophie T.</p>
              <p className="text-sm text-slate-600">From Northwood</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-amber-600 mb-2">4.8/5 Average Rating</p>
            <p className="text-slate-600">From over 500+ verified reviews</p>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience The Best Italian Near You
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Special lunch offer available Tuesday to Sunday
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Lunch Special £19.95</h3>
            <p className="text-lg mb-6 opacity-90">
              Enjoy authentic Italian cuisine with our incredible value lunch menu. 
              Choose from a selection of starters and mains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/menu/lunchtime-earlybird">View Lunch Menu</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100 text-lg">
                <Link href="/reserve">Book Lunch Table</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Try The Best Italian Restaurant Near You?
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Join thousands who've discovered authentic Italian excellence at Dona Theresa. 
            Your table is waiting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/reserve">Reserve Your Table Now</Link>
            </Button>
            <div className="flex items-center gap-4 text-slate-600">
              <span>or call</span>
              <a 
                href="tel:02084215550" 
                className="text-2xl font-bold text-amber-600 hover:text-amber-700"
              >
                020 8421 5550
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-12 border-t text-slate-600">
            <p className="font-semibold">Dona Theresa Italian Restaurant</p>
            <p>451 Uxbridge Road, Pinner HA5 4JR</p>
            <p>Tel: 020 8421 5550</p>
          </div>
        </div>
      </section>
    </>
  )
}
