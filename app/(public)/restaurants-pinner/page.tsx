import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, Star, Award, Utensils, Calendar, Wine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicSchema } from '@/components/locale/dynamic-schema'

export const metadata: Metadata = {
  title: 'Restaurants in Pinner | Best Italian Restaurant Near Me | Dona Theresa',
  description: '⭐ Top-rated Pinner restaurant! Authentic Italian • Lunch £19.95 • FREE parking • 4.8★ reviews. Book now ☎️ 020 8421 5550',
  keywords: [
    'pinner restaurants',
    'restaurants in pinner',
    'restaurants pinner',
    'best restaurants pinner',
    'best restaurants in pinner',
    'italian restaurant pinner',
    'italian restaurants pinner',
    'restaurant in pinner',
    'restaurant pinner',
    'pinner italian restaurants',
    'places to eat in pinner',
    'pinner high street restaurants'
  ],
  openGraph: {
    title: 'Pinner Restaurants | Dona Theresa Italian Restaurant',
    description: 'Discover the best Italian restaurant in Pinner. Award-winning cuisine, convenient location, free parking. Your perfect dining destination.',
    url: 'https://donatheresa.com/restaurants-pinner',
    siteName: 'Dona Theresa Restaurant',
    images: [
      {
        url: 'https://donatheresa.com/og-pinner.jpg',
        width: 1200,
        height: 630,
        alt: 'Dona Theresa - Best Restaurant in Pinner'
      }
    ],
    locale: 'en_GB',
    type: 'website'
  },
  alternates: {
    canonical: 'https://donatheresa.com/restaurants-pinner'
  }
}

export default function RestaurantsPinnerPage() {
  const features = [
    {
      icon: Award,
      title: "Award-Winning",
      description: "Voted best Italian among all Pinner restaurants by locals"
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
      icon: Calendar,
      title: "Open 6 Days",
      description: "Tuesday to Sunday, lunch and dinner service"
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
              <span className="text-amber-600">Pinner Restaurants</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
              Experience why Dona Theresa is the most beloved Italian restaurant among all 
              restaurants in Pinner. Located in nearby Hatch End with free parking.
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

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">4.8★</div>
              <p className="text-slate-600">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">13+</div>
              <p className="text-slate-600">Years in Pinner</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">£19.95</div>
              <p className="text-slate-600">Lunch Special</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">6</div>
              <p className="text-slate-600">Days Open</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why We Stand Out Among Pinner Restaurants
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            While Pinner offers various dining options, Dona Theresa brings authentic 
            Italian excellence to Northwest London
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

      {/* Reviews Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Pinner Locals Say About Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">
                "From the moment we stepped into Dona Theresa, we knew we had chosen the perfect place 
                to celebrate our anniversary. This isn't just a restaurant; it's a slice of Italy right here in Pinner."
              </p>
              <p className="font-semibold">theguruyt</p>
              <p className="text-sm text-slate-600">Local Guide · Google Review</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">
                "The best place ever for Italian food. We love this place so much that we like to 
                celebrate our special occasions with them. All pastas are good and dessert too!"
              </p>
              <p className="font-semibold">Sonali Kosrabe</p>
              <p className="text-sm text-slate-600">Local Guide · Google Review</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4">
                "Authentic romantic cosy place, fantastic food fresh and cooked as you like, 
                service was really good and welcoming. Highly recommend this place."
              </p>
              <p className="font-semibold">Dilyana Milenkova</p>
              <p className="text-sm text-slate-600">Local Guide · Google Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Area Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Your Complete Guide to Dining in Pinner
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <h3>Finding the Best Restaurants in Pinner</h3>
              <p>
                Pinner offers a diverse selection of restaurants, from traditional British pubs 
                to international cuisine. Located on Uxbridge Road, just off the high street, 
                Dona Theresa has become the destination of choice for those seeking authentic 
                Italian dining in a warm, sophisticated atmosphere.
              </p>
              
              <h3>What Sets Dona Theresa Apart</h3>
              <p>
                While many Pinner restaurants offer Italian dishes, we specialise exclusively in 
                authentic Italian cuisine. Our head chef, trained in Rome, brings traditional 
                techniques and family recipes that have been perfected over generations. From 
                our signature homemade pasta to our wood-fired pizzas, every dish tells a story 
                of Italian culinary heritage.
              </p>
              
              <h3>Perfect Location in Pinner</h3>
              <p>
                Situated at 451 Uxbridge Road, we're conveniently located between Pinner and 
                Hatch End, making us easily accessible from anywhere in Northwest London. Unlike 
                many restaurants in Pinner town centre, we offer free on-site parking - a 
                significant advantage for our guests.
              </p>
              
              <h3>Ideal for Every Dining Occasion</h3>
              <ul>
                <li><strong>Business Lunches:</strong> Our £19.95 lunch special is popular with local professionals</li>
                <li><strong>Date Nights:</strong> Intimate atmosphere with candlelit tables</li>
                <li><strong>Family Celebrations:</strong> Spacious dining area accommodating large groups</li>
                <li><strong>Special Events:</strong> Private dining room available for up to 40 guests</li>
              </ul>
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
                Best value lunch among all Pinner restaurants. Choose from our specially 
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
                À La Carte Dining
              </h3>
              <p className="text-slate-700 mb-6">
                Experience authentic Italian cuisine at one of Pinner's finest restaurants. 
                Our à la carte menu features traditional recipes with fresh, quality ingredients.
              </p>
              <ul className="space-y-2 text-slate-700 mb-6">
                <li>• Authentic Italian dishes</li>
                <li>• Fresh pasta made daily</li>
                <li>• Extensive wine selection</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/menu/a-la-carte">View Full Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Visit Us in Pinner
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Location & Parking</h3>
              <div className="space-y-4">
                <p className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                  <span className="text-slate-700">
                    451 Uxbridge Road, Pinner HA5 4JR<br />
                    Between Pinner and Hatch End stations
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber-600 mt-1" />
                  <span className="text-slate-700">
                    Tuesday - Sunday<br />
                    Lunch: 12:00 - 15:00<br />
                    Dinner: 18:00 - 23:00<br />
                    Closed Mondays
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-amber-600 mt-1" />
                  <span className="text-slate-700">
                    <a href="tel:02084215550" className="font-semibold hover:text-amber-600">
                      020 8421 5550
                    </a>
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">Getting Here</h3>
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="font-semibold mb-2">By Underground:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Pinner Station - 10 minute walk</li>
                    <li>• Hatch End Station - 5 minute walk</li>
                    <li>• Metropolitan Line direct from Central London</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">By Car:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• FREE customer parking on-site</li>
                    <li>• Easy access from A40 & M25</li>
                    <li>• Satnav: HA5 4JR</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section for Rich Snippets */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions About Pinner Restaurants
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What is the best Italian restaurant in Pinner?</h3>
              <p className="text-slate-700">
                Dona Theresa is rated the best Italian restaurant in Pinner, with over 13 years serving 
                authentic Italian cuisine. We have a 4.8-star rating and are known for fresh pasta made daily, 
                premium steaks, and our popular £19.95 lunch special. Located at 451 Uxbridge Road with free parking.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Where can I find restaurants in Pinner with parking?</h3>
              <p className="text-slate-700">
                Dona Theresa offers FREE customer parking on-site, making it one of the most convenient 
                restaurants in Pinner. We're located on Uxbridge Road between Pinner and Hatch End, 
                with easy access from the A40 and M25. Most Pinner high street restaurants have limited parking.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What are the best places to eat in Pinner?</h3>
              <p className="text-slate-700">
                For authentic Italian dining, Dona Theresa is the top choice among places to eat in Pinner. 
                We offer an exceptional lunch menu for £19.95, an extensive à la carte selection, and a 
                romantic atmosphere perfect for date nights and celebrations. Other options in Pinner include 
                various cafes and international restaurants on the high street.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Is Dona Theresa open for lunch in Pinner?</h3>
              <p className="text-slate-700">
                Yes! We serve lunch Tuesday to Sunday from 12:00-15:00. Our Lunchtime & Early Bird menu 
                at £19.95 for 2 courses is the best lunch deal among Pinner restaurants. The menu features 
                classic Italian starters and mains including fresh pasta, risotto, and grilled dishes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Can I book a table online at Pinner restaurants?</h3>
              <p className="text-slate-700">
                Yes! Dona Theresa offers easy online booking at donatheresa.com/reserve. You can also call 
                us on 020 8421 5550. We recommend booking in advance for weekend dinners. Walk-ins are 
                welcome but subject to availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience Pinner's Finest Italian Restaurant?
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Join the thousands who've made Dona Theresa their favourite among all 
            restaurants in Pinner. Book your table today.
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
                "name": "What is the best Italian restaurant in Pinner?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dona Theresa is rated the best Italian restaurant in Pinner, with over 13 years serving authentic Italian cuisine. We have a 4.8-star rating and are known for fresh pasta made daily, premium steaks, and our popular £19.95 lunch special."
                }
              },
              {
                "@type": "Question",
                "name": "Where can I find restaurants in Pinner with parking?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dona Theresa offers FREE customer parking on-site, making it one of the most convenient restaurants in Pinner. We're located on Uxbridge Road between Pinner and Hatch End."
                }
              },
              {
                "@type": "Question",
                "name": "What are the best places to eat in Pinner?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For authentic Italian dining, Dona Theresa is the top choice among places to eat in Pinner. We offer an exceptional lunch menu for £19.95, an extensive à la carte selection, and a romantic atmosphere."
                }
              },
              {
                "@type": "Question",
                "name": "Is Dona Theresa open for lunch in Pinner?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We serve lunch Tuesday to Sunday from 12:00-15:00. Our Lunchtime & Early Bird menu at £19.95 for 2 courses is the best lunch deal among Pinner restaurants."
                }
              }
            ]
          })
        }}
      />
    </>
  )
}
