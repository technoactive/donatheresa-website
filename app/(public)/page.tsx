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

      {/* Google Reviews Section - Luxury Design */}
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a]" aria-labelledby="reviews-heading">
        {/* Sophisticated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(180,140,80,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(180,140,80,0.1),transparent_50%)]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Elegant Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-xs tracking-[0.4em] text-amber-400/80 font-light uppercase">
                  Guest Testimonials
                </span>
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
              </div>
              <div className="h-px w-16 bg-gradient-to-r from-amber-500 via-amber-500/50 to-transparent" />
            </div>
            
            <h2 id="reviews-heading" className="text-5xl lg:text-7xl font-light mb-6 tracking-tight">
              <span className="text-white/90">What Our </span>
              <span className="italic font-normal bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Guests Say
              </span>
            </h2>
            
            {/* Google Rating Badge */}
            <div className="inline-flex items-center gap-4 mt-8 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="w-px h-4 bg-white/20" />
              <span className="text-white/70 text-sm">4.9 rating on Google</span>
            </div>
          </div>

          {/* Premium Review Cards */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Featured Large Review */}
            <div className="lg:col-span-7 group">
              <div className="relative h-full bg-gradient-to-br from-amber-500/10 via-transparent to-transparent rounded-[2rem] p-1">
                <div className="h-full bg-[#111] rounded-[1.875rem] p-10 lg:p-12 relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent" />
                  
                  <Quote className="absolute top-8 right-8 w-20 h-20 text-amber-500/10" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-2xl lg:text-3xl text-white/90 leading-relaxed mb-10 font-light">
                      "We have been here a few times now. Food is always amazing, authentic Italian. Staff are lovely. Great atmosphere. One of the best Italian restaurant I have been to in a long time. A must go to if you love Italian!"
                    </blockquote>
                    
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-xl shadow-amber-500/30">
                        SR
                      </div>
                      <div>
                        <div className="font-medium text-white text-lg">Shefalei Raval</div>
                        <div className="text-amber-400/70 text-sm flex items-center gap-2">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Local Guide
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked Reviews */}
            <div className="lg:col-span-5 space-y-6">
              {/* Review 2 */}
              <div className="group bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6 text-lg">
                  "Have been coming here for nearly 10 years now. The food here is honestly amazing. Once you're a regular you get treated like family!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white font-semibold">
                    SS
                  </div>
                  <div>
                    <div className="font-medium text-white">Sami Syed</div>
                    <div className="text-white/40 text-xs">10+ Year Guest</div>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="group bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6 text-lg">
                  "Absolutely beautiful place, if you don't book a table better luck next time, really amazing food!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white font-semibold">
                    MM
                  </div>
                  <div>
                    <div className="font-medium text-white">Marija Milovancevic</div>
                    <div className="text-white/40 text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Local Guide
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Review 4 */}
            <div className="group bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                "Really lovely restaurant! We went on a Wednesday evening and it was very busy and had a lovely atmosphere. Absolutely loved the bruschetta!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  MS
                </div>
                <div>
                  <div className="font-medium text-white text-sm">Megan Sherring</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>

            {/* Review 5 */}
            <div className="group bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                "Lovely food and friendly staff. Recommended. The quality of the ingredients is evident in every dish. A great find!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  WS
                </div>
                <div>
                  <div className="font-medium text-white text-sm">William Sheringham</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>

            {/* Review 6 */}
            <div className="group bg-[#111] rounded-2xl p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                "Lovely food and good atmosphere. Great service. Will definitely be back! The whole experience was wonderful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  PS
                </div>
                <div>
                  <div className="font-medium text-white text-sm">Pauline Sheringhame</div>
                  <div className="text-white/40 text-xs">Google Review</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link 
              href="https://www.google.com/maps/place/Dona+Theresa/@51.5947,-0.3697,17z/data=!4m8!3m7!1s0x487617a3ac7c7b9b:0x8e98bc8e5b9df4f!8m2!3d51.5947!4d-0.3697!9m1!1b1!16s%2Fg%2F11c3z_kmkx"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-amber-500/50 hover:bg-amber-500 text-amber-400 hover:text-white rounded-full font-medium transition-all duration-300"
            >
              View All Reviews on Google
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Discover More - Premium Local Areas Section */}
      <section className="py-32 relative overflow-hidden bg-white" aria-labelledby="areas-heading">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Elegant Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-amber-500" />
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs tracking-[0.4em] text-slate-500 font-light uppercase">
                  Explore
                </span>
              </div>
              <div className="h-px w-16 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent" />
            </div>
            
            <h2 id="areas-heading" className="text-5xl lg:text-7xl font-light mb-6 tracking-tight text-slate-900">
              Proudly Serving{' '}
              <span className="italic font-normal bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Northwest London
              </span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Voted the best Italian restaurant in Pinner & Hatch End
            </p>
          </div>
          
          {/* Premium Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Hatch End - Premium Card */}
            <Link 
              href="/restaurants-hatch-end" 
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 lg:p-12 overflow-hidden border border-slate-700/50 group-hover:border-amber-500/30 transition-all duration-500">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-8">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-amber-300 text-sm font-medium">#1 Rated in Area</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-light text-white mb-4 group-hover:text-amber-300 transition-colors">
                    Hatch End
                  </h3>
                  <p className="text-white/60 text-lg mb-8 max-w-md">
                    Best Italian restaurant on Uxbridge Road with complimentary parking for all guests
                  </p>
                  
                  <div className="flex items-center gap-3 text-amber-400">
                    <span className="font-medium">Explore Location</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Pinner - Premium Card */}
            <Link 
              href="/restaurants-pinner" 
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 lg:p-12 overflow-hidden border border-slate-700/50 group-hover:border-amber-500/30 transition-all duration-500">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-8">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium">Award Winning</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-light text-white mb-4 group-hover:text-amber-300 transition-colors">
                    Pinner
                  </h3>
                  <p className="text-white/60 text-lg mb-8 max-w-md">
                    Award-winning authentic Italian cuisine loved by locals for over a decade
                  </p>
                  
                  <div className="flex items-center gap-3 text-amber-400">
                    <span className="font-medium">Explore Location</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Row - Lunch Specials */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Lunch Special */}
            <Link 
              href="/lunch-pinner" 
              className="group relative bg-gradient-to-br from-amber-50 to-white rounded-[2rem] p-10 border border-amber-100 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-light text-slate-900">£19.95</div>
                  <div className="text-slate-500 text-sm">per person</div>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                Lunch Special
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                Signature 2-course lunch menu, available Tuesday to Sunday
              </p>
              <div className="flex items-center gap-3 text-amber-600">
                <span className="font-medium">View Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            {/* Early Bird */}
            <Link 
              href="/menu/lunchtime-earlybird" 
              className="group relative bg-gradient-to-br from-amber-50 to-white rounded-[2rem] p-10 border border-amber-100 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
                    <span className="text-amber-700 font-medium">12pm - 3pm</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                Early Bird Menu
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                Best value Italian dining, perfect for a leisurely lunch
              </p>
              <div className="flex items-center gap-3 text-amber-600">
                <span className="font-medium">View Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
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
