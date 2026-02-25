import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Phone, Utensils, Calendar, TrendingUp, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Lunch in Pinner | Dona Theresa £19.95 Special',
  description: 'Best lunch in Pinner at £19.95. Authentic Italian cuisine, served Tuesday-Sunday. 451 Uxbridge Road. Book now: 020 8421 5550',
  keywords: [
    'lunch in pinner',
    'lunch pinner',
    'pinner lunch',
    'lunch places in pinner',
    'pinner lunch places',
    'restaurants pinner lunch',
    'lunch restaurant',
    'lunch near me',
    'business lunch pinner',
    'italian lunch pinner',
    'best lunch pinner'
  ],
  openGraph: {
    title: 'Lunch in Pinner - £19.95 Special | Dona Theresa Italian Restaurant',
    description: 'Best lunch deal in Pinner! Enjoy authentic Italian cuisine with our £19.95 lunch special. Perfect for business lunches or casual dining.',
    url: 'https://donatheresa.co.uk/lunch-pinner',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.co.uk/og-lunch.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa Lunch Special - Best Lunch in Pinner'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.co.uk/lunch-pinner'
  }
}

export default function LunchPinnerPage() {
  const lunchMenuHighlights = [
    { category: "Starters", items: ["Bruschetta", "Soup of the Day", "Caesar Salad", "Antipasti"] },
    { category: "Pasta", items: ["Spaghetti Carbonara", "Penne Arrabbiata", "Lasagne", "Risotto"] },
    { category: "Mains", items: ["Grilled Salmon", "Chicken Milanese", "Pizza Margherita", "Veal Scaloppine"] },
    { category: "Desserts", items: ["Tiramisu", "Panna Cotta", "Gelato Selection", "Espresso"] }
  ]

  return (
    <>
      <DynamicSchema />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-amber-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>PINNER'S BEST VALUE LUNCH</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-900">Lunch in </span>
              <span className="text-amber-600">Pinner</span>
              <span className="text-slate-900"> from </span>
              <span className="text-green-600">£19.95</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Discover why Dona Theresa is the top choice for lunch in Pinner. 
              Quick service, authentic Italian cuisine, and incredible value.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg bg-green-600 hover:bg-green-700">
                <Link href="/reserve">Book Lunch Table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/menu/lunchtime-earlybird">View Lunch Menu</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-slate-600 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Tue-Sun 12:00-15:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                <span>2 Courses Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <span>Groups Welcome</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us for Lunch */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Business Professionals Choose Us for Lunch in Pinner
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Business-Friendly</h3>
              <p className="text-slate-600">
                Quiet atmosphere perfect for business lunches. Wi-Fi available for 
                working lunches. Professional service.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Service</h3>
              <p className="text-slate-600">
                45-minute lunch service guaranteed. Pre-order available for faster 
                service. Perfect for lunch breaks.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Incredible Value</h3>
              <p className="text-slate-600">
                £19.95 for 2 courses. Best value lunch in Pinner. No compromise 
                on quality or portion sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lunch Menu Preview */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Famous Lunch Menu
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            Choose any starter and main course for just £19.95. Fresh ingredients, 
            authentic recipes, generous portions.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {lunchMenuHighlights.map((section) => (
              <div key={section.category} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-amber-600 mb-4">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="text-lg">
              <Link href="/menu/lunchtime-earlybird">View Full Lunch Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location & Convenience */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Convenient Lunch Location in Pinner
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Perfect for Lunch From:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold">Pinner Town Centre</p>
                    <p className="text-slate-600">Just 5 minutes by car or 10 minute walk</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold">Local Offices</p>
                    <p className="text-slate-600">Serving businesses along Uxbridge Road</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold">Pinner Station</p>
                    <p className="text-slate-600">10 minute walk via High Street</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Lunch Service Details</h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-green-600" />
                  <span><strong>Tuesday - Sunday:</strong> 12:00 PM - 3:00 PM</span>
                </p>
                <p className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <span><strong>Reservations:</strong> Recommended for groups</span>
                </p>
                <p className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <span><strong>Capacity:</strong> Up to 40 for lunch parties</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-green-600" />
                  <span><strong>Book now:</strong> 020 8421 5550</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Pinner Lunch Diners Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-slate-700 mb-4 italic">
                "Best lunch deal in Pinner! The £19.95 special is incredible value. 
                Perfect for our office lunch meetings."
              </p>
              <p className="font-semibold">James K.</p>
              <p className="text-sm text-slate-600">Local Business Owner</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-slate-700 mb-4 italic">
                "Quick service without compromising quality. My go-to spot for 
                lunch in Pinner. The pasta is always perfect!"
              </p>
              <p className="font-semibold">Rachel M.</p>
              <p className="text-sm text-slate-600">Regular Lunch Customer</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-slate-700 mb-4 italic">
                "Great atmosphere for business lunches. Quiet enough to talk, 
                excellent food, and the service is always prompt."
              </p>
              <p className="font-semibold">David P.</p>
              <p className="text-sm text-slate-600">Pinner Professional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Lunch Offers */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pinner's Best Value Lunch Special
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="text-5xl font-bold mb-4">£19.95</div>
            <p className="text-2xl mb-6">Any Starter + Any Main Course</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tuesday - Friday</h4>
                <p className="text-sm opacity-90">Perfect for business lunches</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Saturday - Sunday</h4>
                <p className="text-sm opacity-90">Ideal for weekend treats</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Groups Welcome</h4>
                <p className="text-sm opacity-90">Up to 40 guests</p>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg">
              <Link href="/reserve">Book Your Lunch Table</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Lunch in Pinner - Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">
                What's included in the £19.95 lunch special?
              </h3>
              <p className="text-slate-700">
                Choose any starter and any main course from our lunch menu. Beverages 
                are charged separately. Coffee or tea can be added for £3.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">
                How long does lunch service take?
              </h3>
              <p className="text-slate-700">
                We guarantee 45-minute service for lunch. Perfect for business lunches 
                or when you're short on time. Pre-ordering available for faster service.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">
                Do you cater for dietary requirements?
              </h3>
              <p className="text-slate-700">
                Yes! We have vegetarian, vegan, and gluten-free options available. 
                Please inform us of any allergies when booking.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">
                Is parking available for lunch?
              </h3>
              <p className="text-slate-700">
                Yes, we have FREE customer parking on-site. Perfect for quick lunch 
                visits without worrying about parking meters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Book Your Lunch Table in Pinner Today
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Experience the best value lunch in Pinner at Dona Theresa. 
            Authentic Italian cuisine, quick service, unbeatable prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="text-lg bg-green-600 hover:bg-green-700 px-8">
              <Link href="/reserve">Reserve Lunch Table</Link>
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
