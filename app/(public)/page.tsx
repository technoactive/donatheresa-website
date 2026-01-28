import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HorizontalGallery } from "@/components/public/horizontal-gallery"
import { Star, ArrowRight, Play, Sparkles, Zap, Crown, Utensils, Quote } from "lucide-react"
import { FormattedCurrency } from "@/components/locale/formatted-date"
import { FAQSchema } from "@/components/locale/faq-schema"
import type { Metadata } from "next"

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

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
    image: "/pera-alforno.jpg",
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
    name: "theguruyt",
    rating: 5,
    review: "From the moment we stepped into Dona Theresa, we knew we had chosen the perfect place to celebrate our anniversary. This isn't just a restaurant; it's a slice of Italy right here in Pinner, where every detail, from the relaxed ambiance to the exceptional food, creates an unforgettable experience.",
    date: "5 months ago",
    verified: true,
    badge: "Local Guide"
  },
  {
    name: "Jasmine Singh",
    rating: 5,
    review: "The hostess was attentive and joyful giving suggestions on dishes and cocktails. The seafood pasta was delicious and cooked to perfection along with the ravioli, and they made the night even more special with a happy birthday singalong!",
    date: "2 months ago",
    verified: true
  },
  {
    name: "Dilyana Milenkova",
    rating: 5,
    review: "We randomly stumbled across this restaurant one night and we fell in love! Authentic romantic cosy place, fantastic food fresh and cooked as you like, service was really good and welcoming. Highly recommend this place.",
    date: "9 months ago",
    verified: true,
    badge: "Local Guide"
  },
  {
    name: "Sonali Kosrabe",
    rating: 5,
    review: "The best place ever for Italian food. We love this place so much that we like to celebrate our special occasion with them. All pastas are good and dessert too, specially Tarte cinco sensi cake!",
    date: "3 weeks ago",
    verified: true,
    badge: "Local Guide"
  },
  {
    name: "Daisy Perschky",
    rating: 5,
    review: "Loved our experience at Dona Theresa! A group of 5 of us celebrated a birthday here and it was delightful. The staff were so friendly, helpful, and attentive. The early bird menu was a great deal (£20pp for 2 courses) and the food was delicious.",
    date: "2 months ago",
    verified: true
  },
  {
    name: "Daren Kenward",
    rating: 5,
    review: "The food in this restaurant is cooked to perfection. Any special requests are not a problem even to the point of serving a fruit salad for my friends, which is not on the menu. Outstanding service!",
    date: "2 years ago",
    verified: true,
    badge: "Local Guide"
  }
]

export const metadata: Metadata = {
  title: "Dona Theresa | Best Italian Restaurant Hatch End & Pinner | Book Now",
  description: "⭐ Award-winning Italian in Hatch End! Fresh pasta • Steaks • Lunch £19.95 • FREE parking • 4.8★ TripAdvisor. Book ☎️ 020 8421 5550",
  keywords: "italian restaurant pinner, italian restaurant hatch end, best restaurants pinner, restaurants hatch end, italian near me, dona theresa, donna teresa, lunch pinner, italian food, hatch end restaurants, pinner restaurants",
  alternates: {
    canonical: 'https://donatheresa.com',
  },
}

export default function HomePage() {
  return (
    <>
      <FAQSchema />
      <div className="bg-white text-slate-900 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative flex items-center overflow-hidden pt-20" 
        style={{ 
          minHeight: 'max(100vh, 700px)'
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
                  Best Italian restaurant Pinner & Hatch End. Award-winning authentic 
                  Italian cuisine. Lunch £19.95. 451 Uxbridge Road, HA5 4JR.
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
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">4.5★</div>
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

      {/* Google Reviews Section - Premium Dark Design */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-slate-900" aria-labelledby="reviews-heading">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(251,191,36,0.05),transparent_30%)]" />

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm tracking-[0.2em] text-amber-400 font-medium uppercase">
                Guest Reviews
              </span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            
            <h2 id="reviews-heading" className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Loved by </span>
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Our Guests
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Don&apos;t just take our word for it — hear from the guests who&apos;ve experienced our authentic Italian hospitality
            </p>
            
            {/* Rating Summary - Enhanced */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 sm:px-10 py-5 bg-gradient-to-r from-white/[0.08] to-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">4.5</div>
                <div className="flex items-center gap-0.5 mt-2 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="text-center sm:text-left">
                <div className="text-white font-semibold text-lg">500+ Reviews</div>
                <div className="text-slate-400 text-sm">Verified on Google</div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="text-center sm:text-left">
                <div className="text-white font-semibold text-lg">Since 2011</div>
                <div className="text-slate-400 text-sm">Serving Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Quote */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 md:mb-20 relative z-10">
          <div className="relative">
            <Quote className="absolute -top-6 -left-2 md:-top-8 md:-left-6 w-16 h-16 md:w-24 md:h-24 text-amber-500/20" />
            <blockquote className="text-center">
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed italic">
                &ldquo;From the moment we stepped into Dona Theresa, we knew we had chosen the perfect place. This isn&apos;t just a restaurant; it&apos;s a slice of Italy right here in Pinner.&rdquo;
              </p>
              <footer className="mt-6 flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-amber-500/30">TG</div>
                <div className="text-left">
                  <cite className="not-italic font-medium text-white">theguruyt</cite>
                  <div className="text-amber-400/70 text-sm flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Infinite Scrolling Marquee - Row 1 */}
        <div className="relative mb-6 overflow-hidden">
          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-6 animate-marquee">
            {/* Review Cards - First Set */}
            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "From the moment we stepped into Dona Theresa, we knew we had chosen the perfect place to celebrate our anniversary. A slice of Italy right here in Pinner!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">TG</div>
                <div>
                  <div className="font-medium text-white text-sm">theguruyt</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "The hostess was attentive and joyful giving suggestions on dishes and cocktails. They made the night even more special with a happy birthday singalong!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">JS</div>
                <div>
                  <div className="font-medium text-white text-sm">Jasmine Singh</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "The best place ever for Italian food. We love this place so much that we celebrate our special occasions with them. All pastas are good and dessert too!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">SK</div>
                <div>
                  <div className="font-medium text-white text-sm">Sonali Kosrabe</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "A group of 5 of us celebrated a birthday here and it was delightful. The early bird menu was a great deal (£20pp for 2 courses) and the food was delicious."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">DP</div>
                <div>
                  <div className="font-medium text-white text-sm">Daisy Perschky</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "The food in this restaurant is cooked to perfection. Any special requests are not a problem. Outstanding service that goes above and beyond!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">DK</div>
                <div>
                  <div className="font-medium text-white text-sm">Daren Kenward</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "We randomly stumbled across this restaurant and we fell in love! Authentic romantic cosy place, fantastic food fresh and cooked as you like."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">DM</div>
                <div>
                  <div className="font-medium text-white text-sm">Dilyana Milenkova</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "From the moment we stepped into Dona Theresa, we knew we had chosen the perfect place to celebrate our anniversary. A slice of Italy right here in Pinner!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">TG</div>
                <div>
                  <div className="font-medium text-white text-sm">theguruyt</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "The hostess was attentive and joyful giving suggestions on dishes and cocktails. They made the night even more special with a happy birthday singalong!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">JS</div>
                <div>
                  <div className="font-medium text-white text-sm">Jasmine Singh</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "The best place ever for Italian food. We love this place so much that we celebrate our special occasions with them. All pastas are good and dessert too!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">SK</div>
                <div>
                  <div className="font-medium text-white text-sm">Sonali Kosrabe</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infinite Scrolling Marquee - Row 2 (Reverse) */}
        <div className="relative overflow-hidden">
          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-6 animate-marquee-reverse">
            {/* Review Cards - Second Set */}
            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "Great Xmas Lunch, delicious & very reasonably priced. Table was beautifully decorated. Prompt drinks service & set menus with abundant choices."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">AF</div>
                <div>
                  <div className="font-medium text-white text-sm">Alison Friend</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "What wonderful tasty food!! Staff are so friendly which made the experience even more wonderful!! I love the homemade tiramisu!!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">RI</div>
                <div>
                  <div className="font-medium text-white text-sm">Ria</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "Fine Italian food indeed. My family have been frequenting this fine establishment for several years, and it never disappoints."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">JA</div>
                <div>
                  <div className="font-medium text-white text-sm">Jason</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "Second visit this evening, delicious food and the staff are so lovely. They gave us free dessert to make up for the wait, so kind!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">EW</div>
                <div>
                  <div className="font-medium text-white text-sm">Elle Ward</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "A beautiful evening with lovely food and an even better atmosphere. They made my grandfather feel very special on his 89th birthday."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">MS</div>
                <div>
                  <div className="font-medium text-white text-sm">Moses Seitler</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "Cannot thank you enough! We had our Christening party here. Everything was perfect - the food, service, and atmosphere were exceptional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">GD</div>
                <div>
                  <div className="font-medium text-white text-sm">Georgiana Daviduca</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "Great Xmas Lunch, delicious & very reasonably priced. Table was beautifully decorated. Prompt drinks service & set menus with abundant choices."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">AF</div>
                <div>
                  <div className="font-medium text-white text-sm">Alison Friend</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "What wonderful tasty food!! Staff are so friendly which made the experience even more wonderful!! I love the homemade tiramisu!!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">RI</div>
                <div>
                  <div className="font-medium text-white text-sm">Ria</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-[350px] md:w-[400px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 group">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-5 text-[15px] group-hover:text-white/90 transition-colors">
                "Fine Italian food indeed. My family have been frequenting this fine establishment for several years, and it never disappoints."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-amber-500/20">JA</div>
                <div>
                  <div className="font-medium text-white text-sm">Jason</div>
                  <div className="text-amber-400/70 text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> Local Guide</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured On Platforms */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 md:mt-20 relative z-20">
          <div className="text-center mb-8">
            <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Featured On</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
            <Link href="https://www.google.com/maps/place/Dona+Theresa/@51.5947,-0.3697,17z" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">Google</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />))}
                <span className="text-white/50 text-xs ml-1">4.5</span>
              </div>
            </Link>

            <Link href="https://www.tripadvisor.co.uk/Restaurant_Review-g7380842-d3226259-Reviews-Dona_Theresa-Pinner_Greater_London_England.html" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#34E0A1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">TripAdvisor</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (<div key={i} className="w-2.5 h-2.5 rounded-full bg-[#34E0A1]" />))}
              </div>
            </Link>

            <Link href="https://www.facebook.com/profile.php?id=100063506503168" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">Facebook</span>
              </div>
              <span className="text-white/50 text-xs">Recommended</span>
            </Link>

            <Link href="https://restaurantguru.com/Dona-Theresa-London" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded flex items-center justify-center"><Utensils className="w-3 h-3 text-white" /></div>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">Restaurant Guru</span>
              </div>
              <span className="text-white/50 text-xs">Top Rated</span>
            </Link>

            <Link href="https://www.thefork.co.uk/restaurant/dona-theresa-r756380" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A86B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">TheFork</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#00A86B] font-bold text-sm">9.2</span>
                <span className="text-white/50 text-xs">/10</span>
              </div>
            </Link>

            <Link href="https://www.yell.com/biz/dona-theresa-pinner-9488177/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#FFD200] rounded flex items-center justify-center"><span className="text-black font-black text-[10px]">Y</span></div>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">Yell</span>
              </div>
              <span className="text-white/50 text-xs">Business Directory</span>
            </Link>

            <Link href="https://www.viamichelin.co.uk/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#005BBB] rounded-full flex items-center justify-center"><span className="text-white font-bold text-[10px]">M</span></div>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">ViaMichelin</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#005BBB] font-bold text-sm">9.5</span>
                <span className="text-white/50 text-xs">/10</span>
              </div>
            </Link>

            <Link href="https://tableagent.com/london/dona-theresa/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center"><span className="text-white font-bold text-[10px]">TA</span></div>
                <span className="text-white/70 font-medium text-sm group-hover:text-white transition-colors">Table Agent</span>
              </div>
              <span className="text-white/50 text-xs">Book Online</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Discover More - Premium Local Areas Section */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50" aria-labelledby="areas-heading">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        {/* Decorative Blurs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Elegant Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-amber-100/80 rounded-full border border-amber-200/50">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm tracking-[0.2em] text-amber-700 font-medium uppercase">
                Our Locations
              </span>
            </div>
            
            <h2 id="areas-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900">
              Proudly Serving{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Northwest London
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Voted the best Italian restaurant in Pinner & Hatch End — conveniently located for guests across the region
            </p>
          </div>
          
          {/* Main Location Cards */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Hatch End Card */}
            <Link href="/restaurants-hatch-end" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden border border-slate-700/50 group-hover:border-amber-500/50 transition-all duration-500 shadow-2xl shadow-slate-900/20">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_50%)] group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full border border-amber-500/30">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-amber-300 text-sm font-medium">#1 Rated</span>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
                    Hatch End
                  </h3>
                  <p className="text-white/70 text-lg mb-6 max-w-sm leading-relaxed">
                    Best Italian restaurant on Uxbridge Road with complimentary parking for all guests
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-amber-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Free Parking</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span>451 Uxbridge Road</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Pinner Card */}
            <Link href="/restaurants-pinner" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden border border-slate-700/50 group-hover:border-amber-500/50 transition-all duration-500 shadow-2xl shadow-slate-900/20">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_50%)] group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full border border-amber-500/30">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 text-sm font-medium">Award Winning</span>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
                    Pinner
                  </h3>
                  <p className="text-white/70 text-lg mb-6 max-w-sm leading-relaxed">
                    Award-winning authentic Italian cuisine loved by locals for over a decade
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>4.5 Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <span>Since 2011</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Lunch & Menu Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Lunch Special */}
            <Link href="/lunch-pinner" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-slate-200 group-hover:border-amber-300 shadow-lg shadow-slate-200/50 group-hover:shadow-xl group-hover:shadow-amber-200/30 transition-all duration-500 overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-100 to-transparent opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Utensils className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold text-slate-900">£19.95</div>
                      <div className="text-slate-500 text-sm">per person</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    Lunch Special
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Signature 2-course lunch menu, available Tuesday to Sunday
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600 font-medium">
                      <span>View Menu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Best Value
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Early Bird */}
            <Link href="/menu/lunchtime-earlybird" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-slate-200 group-hover:border-amber-300 shadow-lg shadow-slate-200/50 group-hover:shadow-xl group-hover:shadow-amber-200/30 transition-all duration-500 overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-100 to-transparent opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-medium text-sm">
                      12pm - 3pm
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    Early Bird Menu
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Best value Italian dining, perfect for a leisurely lunch
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600 font-medium">
                      <span>View Menu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      Popular
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links - Other Areas */}
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-slate-500 mb-6">Also serving guests from nearby areas</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/restaurants-harrow" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-colors text-sm">
                Harrow
              </Link>
              <Link href="/restaurants-northwood" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-colors text-sm">
                Northwood
              </Link>
              <Link href="/restaurants-ruislip" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-colors text-sm">
                Ruislip
              </Link>
              <Link href="/restaurants-watford" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-colors text-sm">
                Watford
              </Link>
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
                Visit the best Italian restaurant near me in Pinner & Hatch End. 
                Top-rated among all restaurants Pinner. Limited seating for intimate dining.
              </p>
              
              <address className="space-y-4 not-italic">
                  <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span>Tuesday - Sunday, 12:00 - 15:00, 18:00 - 23:00</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span>451 Uxbridge Road, Hatch End, Pinner HA5 4JR</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span>Easy access from Pinner & Hatch End • Free parking available</span>
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
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Book Your Table</h3>
                  <p className="text-slate-600">
                    Reserve at the best Italian restaurant Pinner & Hatch End - Dona Theresa
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
    </>
  )
}
