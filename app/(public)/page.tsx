import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HorizontalGallery } from "@/components/public/horizontal-gallery"
import { Star, ArrowRight, Play, Sparkles, Zap, Crown, Utensils, Quote } from "lucide-react"
import { FormattedCurrency } from "@/components/locale/formatted-date"
import type { Metadata } from "next"

const featuredDishes = [
  {
    name: "Filleto Rossini",
    category: "SIGNATURE",
    description: "Pan fried steak with chicken pâté and brandy sauce",
    price: "32.40",
    image: "/dish-filleto-rossini.png",
  },
  {
    name: "Spaghetti Pescatora", 
    category: "FRESH",
    description: "Authentic Italian seafood spaghetti",
    price: "24.95",
    image: "/dish-spaghetti-pescatora.png",
  },
  {
    name: "Pera al Forno",
    category: "ARTISAN",
    description: "Baked pear with red wine sauce and camembert",
    price: "9.90",
    image: "/pasta-carbonara.jpg",
  },
]

const modernStats = [
  { number: "2011", label: "EST" },
  { number: "95%", label: "SATISFACTION" },
  { number: "12+", label: "AWARDS" },
  { number: "25K", label: "GUESTS" }
]

const customerReviews = [
  {
    name: "Sarah Mitchell",
    rating: 5,
    review: "Absolutely exceptional dining experience! The Filleto Rossini was perfectly executed, and the service was impeccable. This is fine dining at its finest.",
    date: "2 weeks ago",
    verified: true
  },
  {
    name: "James Thompson",
    rating: 5,
    review: "Dona Theresa exceeded all expectations. The atmosphere is intimate and sophisticated, and every dish was a work of art. Highly recommend for special occasions.",
    date: "1 month ago",
    verified: true
  },
  {
    name: "Maria Rodriguez",
    rating: 5,
    review: "The best Italian restaurant in London! Chef Marco's attention to detail is remarkable. The wine pairing was perfect, and the staff made us feel like royalty.",
    date: "3 weeks ago",
    verified: true
  },
  {
    name: "David Chen",
    rating: 5,
    review: "An unforgettable culinary journey. The modern take on Italian classics is brilliant. The ambiance is perfect for romantic dinners. Will definitely return!",
    date: "1 week ago",
    verified: true
  }
]

export const metadata: Metadata = {
  title: "Dona Theresa | Fine Italian Restaurant in Pinner | Authentic Cuisine Since 2011",
  description: "Experience authentic Italian fine dining at Dona Theresa in Pinner. Award-winning restaurant serving modern Italian cuisine since 2011. Book your table today for an unforgettable culinary journey.",
  alternates: {
    canonical: 'https://dona-theresa.com',
  },
}

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative flex items-center overflow-hidden" 
        style={{ 
          minHeight: 'max(100vh, 700px)', 
          marginTop: '80px',
          paddingTop: 'max(2rem, 5vh)',
          paddingBottom: 'max(2rem, 5vh)'
        }}
        aria-label="Hero section"
      >
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
          
          {/* Auto-Playing Video Background */}
          <div className="absolute inset-0 z-5">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              style={{ 
                transform: 'scale(1.05)', 
                filter: 'brightness(1.0) contrast(1.2) saturate(1.0)'
              }}
              aria-label="Restaurant ambiance video background"
            >
              <source src="/video/4253147-uhd_4096_2160_25fps.mp4" type="video/mp4" />
              <track kind="captions" src="/video/captions.vtt" srcLang="en" label="English captions" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <header className="space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-400" />
                  <span className="text-xs sm:text-sm tracking-[0.3em] text-white font-light">
                    CULINARY EXCELLENCE
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight">
                  <span className="block text-white">DONA</span>
                  <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    THERESA
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-100 font-light leading-relaxed max-w-lg">
                  Where modern gastronomy meets timeless sophistication. 
                  An elevated dining experience in the heart of the city.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  asChild
                  className="group relative px-6 sm:px-8 py-5 sm:py-6 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 shadow-2xl"
                >
                  <Link href="/reserve" className="flex items-center justify-center gap-2">
                    <span>Reserve Table</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  asChild
                  className="group px-6 sm:px-8 py-5 sm:py-6 border-white/80 hover:border-white bg-black/20 text-white hover:bg-white hover:text-slate-900 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 shadow-2xl"
                >
                  <Link href="/menu" className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>View Menu</span>
                  </Link>
                </Button>
              </div>
            </header>

            {/* Stats Display */}
            <aside className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 lg:mt-0" aria-label="Restaurant statistics">
              {modernStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="relative p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/40 hover:from-black/30 hover:to-black/50 transition-all duration-300 shadow-2xl group">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white group-hover:text-amber-300 transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-xs tracking-[0.2em] text-slate-300 font-light uppercase">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-slate-50" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span className="text-xs sm:text-sm tracking-[0.3em] text-slate-600 font-light uppercase">
                Our Philosophy
              </span>
            </div>
            
            <h2 id="about-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block text-slate-900">Modern</span>
              <span className="block bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                Cuisine
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              We reimagine Italian tradition through contemporary innovation, creating culinary experiences that transcend the ordinary.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative group">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=700&fit=crop&crop=center"
                  alt="Modern Italian cuisine artfully plated with precision and creativity"
                  width={600}
                  height={400}
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Est. 2011
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Our kitchen operates as a laboratory where time-honored techniques meet cutting-edge culinary science.
                </p>
                <p className="text-base sm:text-lg">
                  Each dish is a carefully orchestrated symphony of flavors, textures, and visual artistry that tells a story of passion and precision.
                </p>
              </div>

              {/* Stats Cards - Mobile Optimized */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">95%</div>
                  <div className="text-xs sm:text-sm text-slate-600">Satisfaction</div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">4.9★</div>
                  <div className="text-xs sm:text-sm text-slate-600">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Utensils className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Fresh Daily</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Ingredients sourced fresh every morning from local suppliers</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Authentic</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Traditional Italian recipes passed down through generations</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Innovative</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Modern techniques that enhance traditional flavors</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Award Winning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Recognized for excellence in Italian fine dining</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-32 relative overflow-hidden bg-white" aria-labelledby="menu-heading">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span className="text-sm tracking-[0.3em] text-slate-600 font-light">
                SIGNATURE COLLECTION
              </span>
            </div>
            
            <h2 id="menu-heading" className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-amber-600 to-slate-900 bg-clip-text text-transparent">
                Featured Dishes
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meticulously crafted experiences that redefine Italian cuisine
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish, index) => (
              <article key={dish.name} className="group relative">
                <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors duration-300 shadow-lg">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={dish.image}
                      alt={`${dish.name} - ${dish.description} - £${dish.price} at Dona Theresa Italian restaurant`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-900 border border-slate-200">
                        {dish.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute top-6 right-6">
                      <div className="text-2xl font-bold text-white bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <FormattedCurrency amount={parseFloat(dish.price)} fallback={`£${dish.price}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {dish.description}
                    </p>
                    
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white rounded-full py-3 font-medium transition-colors duration-300">
                      Order Now
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              className="px-12 py-6 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-lg font-medium transition-colors duration-300"
            >
              <Link href="/menu" className="flex items-center gap-2">
                <span>Full Menu</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="experience" className="py-32 bg-slate-50" aria-labelledby="experience-heading">
        <header className="max-w-7xl mx-auto px-6 text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span className="text-sm tracking-[0.3em] text-slate-600 font-light">
              EXPERIENCE
            </span>
          </div>
          
          <h2 id="experience-heading" className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-amber-600 to-slate-900 bg-clip-text text-transparent">
              Immersive Dining
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Every detail designed to create unforgettable moments
          </p>
        </header>
        <HorizontalGallery />
      </section>

      {/* Reviews Section */}
      <section className="py-32 relative overflow-hidden bg-white" aria-labelledby="reviews-heading">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Quote className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span className="text-sm tracking-[0.3em] text-slate-600 font-light">
                TESTIMONIALS
              </span>
            </div>
            
            <h2 id="reviews-heading" className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-amber-600 to-slate-900 bg-clip-text text-transparent">
                Guest Reviews
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Hear what our valued guests say about their dining experience
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            {customerReviews.map((review, index) => (
              <article key={review.name} className="group">
                <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-300 shadow-lg h-full">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6">
                    <Quote className="w-8 h-8 text-amber-500/20" aria-hidden="true" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-slate-700 leading-relaxed text-lg mb-6 italic">
                    "{review.review}"
                  </blockquote>

                  {/* Author Info */}
                  <footer className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{review.name}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-2">
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Verified Customer
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">{review.date}</div>
                  </footer>
                </div>
              </article>
            ))}
          </div>

          {/* Reviews Summary */}
          <div className="mt-16 text-center">
            <div className="bg-slate-50 rounded-2xl p-8 inline-block border border-slate-200">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">4.9</div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <div className="text-sm text-slate-600">Average Rating</div>
                </div>
                <div className="w-px h-12 bg-slate-300" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">247</div>
                  <div className="text-sm text-slate-600">Total Reviews</div>
                </div>
                <div className="w-px h-12 bg-slate-300" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">98%</div>
                  <div className="text-sm text-slate-600">Recommend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 relative overflow-hidden bg-slate-50" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-400" />
                  <span className="text-sm tracking-[0.3em] text-slate-600 font-light">
                    RESERVATIONS
                  </span>
                </div>
                
                <h2 id="contact-heading" className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-slate-900">Reserve</span>
                  <span className="block bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                    Your Table
                  </span>
                </h2>
              </header>
              
              <p className="text-xl text-slate-700 leading-relaxed">
                Begin your culinary journey with us. Limited seating available 
                for an intimate and exclusive dining experience.
              </p>
              
              <address className="space-y-4 not-italic">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span>Tuesday - Sunday, 12:00 - 15:00, 18:00 - 23:00</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span>451 Uxbridge Rd, Pinner HA5 4JR</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <a href="tel:+442084215550" className="hover:text-amber-600 transition-colors">020 8421 5550</a>
                </div>
              </address>
            </div>

            <aside className="relative">
              <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-lg">
                <div className="space-y-8">
                  <header className="text-center">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Book Now</h3>
                    <p className="text-slate-600">
                      Secure your spot at the most exclusive dining destination
                    </p>
                  </header>
                  
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full py-6 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white rounded-full text-lg font-medium transition-colors duration-300"
                    >
                      <Link href="/reserve">
                        Make Reservation
                      </Link>
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="w-full py-6 border-slate-300 hover:border-slate-400 bg-white text-slate-900 hover:bg-slate-50 rounded-full text-lg font-medium transition-colors duration-300"
                    >
                      <Link href="/menu">
                        View Menu
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
