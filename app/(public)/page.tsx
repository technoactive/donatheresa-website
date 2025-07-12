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
    canonical: 'https://donatheresa.com',
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

      {/* Modern Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-yellow-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-100/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Modern Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 px-8 py-4 rounded-full text-sm font-medium mb-12 shadow-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              Over 500+ Happy Guests
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-none tracking-tight">
              Real
              <span className="block relative">
                <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Stories
                </span>
              </span>
            </h2>
            
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Authentic experiences from guests who discovered culinary excellence
            </p>
          </div>

          {/* Symmetrical Testimonials Grid */}
          <div className="max-w-7xl mx-auto">
            {/* First Row - Two Equal Large Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Featured Testimonial 1 */}
              <div className="bg-slate-900 rounded-[2rem] p-12 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quote Mark */}
                <div className="absolute top-6 right-6 text-amber-400/20 text-6xl font-serif leading-none">"</div>
                
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-amber-400 rounded-full shadow-lg"></div>
                    ))}
                    <span className="text-amber-400 font-bold text-lg ml-2">5.0</span>
                  </div>
                  
                  <blockquote className="text-2xl leading-relaxed mb-8 font-light tracking-wide">
                    "An extraordinary evening that redefined our understanding of fine dining. Every detail was perfection."
                  </blockquote>

                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-xl">
                      MS
                    </div>
                    <div>
                      <div className="font-bold text-xl">Maria Santos</div>
                      <div className="text-slate-300">Food Critic</div>
                      <div className="text-amber-400 text-sm mt-1">✓ Verified</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Testimonial 2 */}
              <div className="bg-white rounded-[2rem] p-12 border border-slate-200 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-yellow-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quote Mark */}
                <div className="absolute top-6 right-6 text-amber-400/20 text-6xl font-serif leading-none">"</div>
                
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-amber-400 rounded-full shadow-lg"></div>
                    ))}
                    <span className="text-amber-600 font-bold text-lg ml-2">5.0</span>
                  </div>
                  
                  <blockquote className="text-2xl text-slate-700 leading-relaxed mb-8 font-light tracking-wide">
                    "Perfect anniversary celebration! The romantic atmosphere and exceptional cuisine made our special night absolutely unforgettable."
                  </blockquote>

                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-xl">
                      JR
                    </div>
                    <div>
                      <div className="font-bold text-xl text-slate-900">João & Rita</div>
                      <div className="text-slate-600">Anniversary Couple</div>
                      <div className="text-blue-600 text-sm mt-1">✓ Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row - Three Equal Medium Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="group">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-amber-400 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    ))}
                  </div>
                  <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                    "Outstanding business dinner venue. The private dining space and sophisticated menu impressed all our clients."
                  </p>
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold mr-4">RL</div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">Ricardo Lima</div>
                      <div className="text-slate-500">Business Executive</div>
                      <div className="text-xs text-slate-400 mt-1">Dec 10, 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-amber-400 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    ))}
                  </div>
                  <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                    "Wine selection is phenomenal. The sommelier's expertise elevated our entire dining experience to new heights."
                  </p>
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold mr-4">AC</div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">Ana Costa</div>
                      <div className="text-slate-500">Wine Enthusiast</div>
                      <div className="text-xs text-slate-400 mt-1">Dec 8, 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-amber-400 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    ))}
                  </div>
                  <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                    "Family celebration made perfect. Great atmosphere for all ages with incredible attention to every detail."
                  </p>
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold mr-4">CF</div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">Carlos Family</div>
                      <div className="text-slate-500">Family Dinner</div>
                      <div className="text-xs text-slate-400 mt-1">Nov 28, 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Row - Two Equal Medium Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-amber-400 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    ))}
                  </div>
                  <p className="text-slate-700 text-xl mb-8 leading-relaxed font-medium">
                    "First visit exceeded all expectations. The tasting menu was an incredible culinary journey that we'll never forget."
                  </p>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">LM</div>
                    <div>
                      <div className="font-bold text-slate-900 text-xl">Luis Miguel</div>
                      <div className="text-slate-500 text-lg">First-time Guest</div>
                      <div className="text-sm text-slate-400 mt-1">Dec 3, 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-amber-400 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    ))}
                  </div>
                  <p className="text-slate-700 text-xl mb-8 leading-relaxed font-medium">
                    "Celebrating our 25th wedding anniversary here was the perfect choice. Exceptional service and unforgettable flavors."
                  </p>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">PM</div>
                    <div>
                      <div className="font-bold text-slate-900 text-xl">Pedro & Maria</div>
                      <div className="text-slate-500 text-lg">25th Anniversary</div>
                      <div className="text-sm text-slate-400 mt-1">Nov 22, 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern CTA */}
          <div className="mt-24">
            <div className="relative bg-slate-900 rounded-[3rem] p-16 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-yellow-600/10 to-amber-600/20 animate-pulse"></div>
              
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Your Story
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                    Starts Here
                  </span>
                </h3>
                
                <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                  Join our community of satisfied guests and create your own unforgettable dining experience
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
                  <button className="group bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-3 w-full sm:w-auto">
                    <span>Reserve Table</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  
                  <button className="border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                    Read All Reviews
                  </button>
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
