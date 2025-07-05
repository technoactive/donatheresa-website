import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HorizontalGallery } from "@/components/public/horizontal-gallery"
import { Star, ArrowRight, Play, Sparkles, Zap, Crown, Utensils } from "lucide-react"
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

export const metadata: Metadata = {
  title: "Dona Theresa | Fine Italian Restaurant in Pinner | Authentic Cuisine Since 2011",
  description: "Experience authentic Italian fine dining at Dona Theresa in Pinner. Award-winning restaurant serving modern Italian cuisine since 2011. Book your table today for an unforgettable culinary journey.",
  alternates: {
    canonical: 'https://dona-theresa.com',
  },
}

export default function HomePage() {
  return (
    <div className="bg-black text-white overflow-x-hidden min-h-screen">
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
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-zinc-900/40 to-black/60 z-10" />
          
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
                filter: 'brightness(0.7) contrast(1.1)'
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
                  <span className="text-xs sm:text-sm tracking-[0.3em] text-zinc-400 font-light">
                    CULINARY EXCELLENCE
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight">
                  <span className="block text-white drop-shadow-2xl">DONA</span>
                  <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
                    THERESA
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-zinc-100 font-light leading-relaxed max-w-lg drop-shadow-lg">
                  Where modern gastronomy meets timeless sophistication. 
                  An elevated dining experience in the heart of the city.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              asChild
                  className="group relative px-6 sm:px-8 py-5 sm:py-6 bg-white text-black hover:bg-zinc-100 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 shadow-2xl"
                >
                  <Link href="/reserve" className="flex items-center justify-center gap-2">
                    <span>Reserve Table</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  asChild
                  className="group px-6 sm:px-8 py-5 sm:py-6 border-zinc-400 hover:border-white bg-black/20 text-white hover:bg-white hover:text-black rounded-full text-sm sm:text-base font-medium transition-colors duration-300 shadow-2xl"
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
                  <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl lg:rounded-2xl border border-zinc-700/50 hover:border-zinc-600 transition-colors duration-300">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-xs tracking-[0.2em] text-zinc-400 font-light">
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
      <section className="py-32 relative overflow-hidden" aria-labelledby="about-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                    OUR PHILOSOPHY
                  </span>
                </div>
                
                <h2 id="about-heading" className="text-5xl lg:text-6xl font-bold leading-tight mb-8">
                  <span className="block text-white">Modern</span>
                  <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    Cuisine
                  </span>
                </h2>
              </div>
              
              <div className="space-y-6 text-zinc-300 leading-relaxed">
                <p className="text-lg">
                  We reimagine Italian tradition through the lens of contemporary innovation. 
                  Each dish is a carefully orchestrated symphony of flavors, textures, and visual artistry.
                </p>
                <p>
                  Our kitchen operates as a laboratory where time-honored techniques meet 
                  cutting-edge culinary science, creating experiences that transcend the ordinary.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-zinc-400">Customer Satisfaction</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-zinc-400">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 relative">
              <div className="relative group">
            <Image
              src="/tomatoes-table.jpg"
                  alt="Fresh tomatoes and ingredients showcasing modern culinary artistry at Dona Theresa restaurant - premium Italian cuisine preparation"
                  width={800}
                  height={600}
                  className="relative rounded-2xl object-cover w-full h-[500px] shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-zinc-300 mb-1">Featured Chef</div>
                        <div className="text-xl font-bold text-white">Marco Benedetti</div>
                      </div>
                      <Crown className="w-8 h-8 text-amber-400" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-32 relative overflow-hidden" aria-labelledby="menu-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-amber-950" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                SIGNATURE COLLECTION
              </span>
            </div>
            
            <h2 id="menu-heading" className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Featured Dishes
              </span>
            </h2>
            
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Meticulously crafted experiences that redefine Italian cuisine
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish, index) => (
              <article key={dish.name} className="group relative">
                <div className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-3xl overflow-hidden border border-zinc-700/50 hover:border-zinc-600 transition-colors duration-300">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20">
                        {dish.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute top-6 right-6">
                      <div className="text-2xl font-bold text-white">
                        <FormattedCurrency amount={parseFloat(dish.price)} fallback={`£${dish.price}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                      {dish.description}
                    </p>
                    
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-full py-3 font-medium transition-colors duration-300">
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
              className="px-12 py-6 bg-white text-black hover:bg-zinc-100 rounded-full text-lg font-medium transition-colors duration-300"
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
      <section id="experience" className="py-32 bg-gradient-to-b from-black to-zinc-950" aria-labelledby="experience-heading">
        <header className="max-w-7xl mx-auto px-6 text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
              EXPERIENCE
            </span>
          </div>
          
          <h2 id="experience-heading" className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
              Immersive Dining
            </span>
          </h2>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Every detail designed to create unforgettable moments
          </p>
        </header>
        <HorizontalGallery />
      </section>

      {/* Contact Section */}
      <section className="py-32 relative overflow-hidden" aria-labelledby="contact-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-amber-950/20" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-400" />
                  <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                    RESERVATIONS
                  </span>
                </div>
                
                <h2 id="contact-heading" className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-white">Reserve</span>
                  <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    Your Table
                  </span>
                </h2>
              </header>
              
              <p className="text-xl text-zinc-300 leading-relaxed">
                Begin your culinary journey with us. Limited seating available 
                for an intimate and exclusive dining experience.
              </p>
              
              <address className="space-y-4 not-italic">
                <div className="flex items-center gap-4 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span>Tuesday - Sunday, 12:00 - 15:00, 18:00 - 23:00</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span>451 Uxbridge Rd, Pinner HA5 4JR</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <a href="tel:+442084215550" className="hover:text-amber-400 transition-colors">020 8421 5550</a>
                </div>
              </address>
            </div>

            <aside className="relative">
              <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-3xl p-12 border border-zinc-700/50">
                <div className="space-y-8">
                  <header className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">Book Now</h3>
                    <p className="text-zinc-400">
                      Secure your spot at the most exclusive dining destination
                    </p>
                  </header>
                  
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full py-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-full text-lg font-medium transition-colors duration-300"
                    >
                      <Link href="/reserve">
                        Make Reservation
                      </Link>
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="w-full py-6 border-zinc-600 hover:border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full text-lg font-medium transition-colors duration-300"
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
