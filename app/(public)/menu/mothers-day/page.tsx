"use client"

import { mothersDayMenuData, mothersDayMenuDetails, mothersDayMenuNotes } from "@/lib/mothers-day-menu-data"
import { Flower2, Calendar, Clock, Sparkles, Star, Phone, MapPin, Heart, UtensilsCrossed, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

// Floating flowers animation component
function FloatingFlowers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        >
          <Flower2 
            className={`text-pink-300 ${i % 3 === 0 ? 'w-5 h-5' : i % 3 === 1 ? 'w-7 h-7' : 'w-4 h-4'}`} 
          />
        </div>
      ))}
    </div>
  )
}

export default function MothersDayMenuPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-[#0f0a12] text-white min-h-screen">
      {/* Add custom animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes pulse-glow-pink {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
        }
        .animate-pulse-glow-pink {
          animation: pulse-glow-pink 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Stunning Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dark gradient background with pink/lavender tints */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a12] via-[#1a0f1e] to-[#0f0a12]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-900/5 rounded-full blur-[150px]" />
        </div>

        {/* Floating flowers */}
        {mounted && <FloatingFlowers />}

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          {/* Top ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-400" />
            <Flower2 className="w-6 h-6 text-pink-400 animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-400" />
          </div>

          {/* Date badge */}
          <div className="inline-flex items-center gap-3 bg-pink-500/10 border border-pink-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span className="text-pink-300 font-medium tracking-wider text-sm uppercase">
              Sunday, 22nd March 2026
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none">
            <span className="block text-white/90">Mother's</span>
            <span className="block mt-2 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-shimmer">
              Day Menu
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-pink-100/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Celebrate the most special woman in your life with an 
            exquisite Italian feast she'll never forget
          </p>

          {/* Price display */}
          <div className="inline-flex flex-col items-center gap-2 mb-10">
            <div className="inline-flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl font-bold text-white">£{mothersDayMenuDetails.price}</span>
              <span className="text-pink-300/80 text-lg">per person</span>
            </div>
            <span className="text-pink-400/70 text-sm">+ {mothersDayMenuDetails.serviceCharge} service charge</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white text-lg px-10 py-6 rounded-full shadow-2xl shadow-pink-500/25 animate-pulse-glow-pink"
            >
              <Link href="/reserve">
                <Gift className="w-5 h-5 mr-2" />
                Book for Mum
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="bg-white/5 border border-white/20 hover:bg-white/10 text-white text-lg px-10 py-6 rounded-full backdrop-blur-sm"
            >
              <a href="tel:02084215550">
                <Phone className="w-5 h-5 mr-2" />
                020 8421 5550
              </a>
            </Button>
          </div>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-pink-400/50" />
            <Sparkles className="w-5 h-5 text-pink-400/50" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-pink-400/50" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-pink-400/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-pink-400/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-gradient-to-b from-[#0f0a12] to-[#0a0710] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05)_0%,transparent_70%)]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A <span className="text-pink-400">Special Day</span> for Mum
            </h2>
            <p className="text-pink-100/60 max-w-xl mx-auto">
              Every detail crafted to show your appreciation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 rounded-3xl p-8 text-center hover:border-pink-500/40 transition-all duration-500">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3-Course Feast</h3>
              <p className="text-pink-100/60 text-sm">
                Authentic Italian dishes from our special Mother's Day menu
              </p>
            </div>

            <div className="group bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 rounded-3xl p-8 text-center hover:border-pink-500/40 transition-all duration-500">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Made with Love</h3>
              <p className="text-pink-100/60 text-sm">
                Fresh ingredients prepared by our expert Italian chefs
              </p>
            </div>

            <div className="group bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 rounded-3xl p-8 text-center hover:border-pink-500/40 transition-all duration-500">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Flower2 className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Elegant Atmosphere</h3>
              <p className="text-pink-100/60 text-sm">
                Beautiful setting perfect for celebrating with the family
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-[#0a0710] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-pink-400/50" />
              <Star className="w-5 h-5 text-pink-400" />
              <div className="h-px w-12 bg-pink-400/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Menu</h2>
            <p className="text-pink-100/60">Choose from our delicious selection</p>
          </div>

          {/* Starters */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-pink-400/30" />
              <h3 className="text-2xl md:text-3xl font-bold text-pink-400">Starters</h3>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-pink-400/30" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mothersDayMenuData.starters.map((item, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-pink-950/30 to-transparent border border-pink-500/10 rounded-xl p-5 hover:border-pink-500/30 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {item.name}
                        {item.dietary.length > 0 && (
                          <span className="ml-2 text-xs text-pink-400">
                            ({item.dietary.join(", ")})
                          </span>
                        )}
                      </h4>
                      <p className="text-pink-100/50 text-sm italic">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Courses */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-pink-400/30" />
              <h3 className="text-2xl md:text-3xl font-bold text-pink-400">Main Course</h3>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-pink-400/30" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mothersDayMenuData.mains.map((item, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-pink-950/30 to-transparent border border-pink-500/10 rounded-xl p-5 hover:border-pink-500/30 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {item.name}
                        {item.dietary.length > 0 && (
                          <span className="ml-2 text-xs text-pink-400">
                            ({item.dietary.join(", ")})
                          </span>
                        )}
                      </h4>
                      <p className="text-pink-100/50 text-sm italic">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-pink-400/30" />
              <h3 className="text-2xl md:text-3xl font-bold text-pink-400">Dessert</h3>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-pink-400/30" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mothersDayMenuData.desserts.map((item, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-b from-pink-950/30 to-transparent border border-pink-500/10 rounded-xl p-4 text-center hover:border-pink-500/30 transition-all"
                >
                  <h4 className="font-semibold text-white text-sm mb-1">{item.name}</h4>
                  {item.dietary.includes("Contains Nuts") && (
                    <span className="text-xs text-amber-400">*Contains Nuts</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Menu Notes */}
          <div className="bg-pink-950/20 border border-pink-500/10 rounded-2xl p-6 text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-pink-100/50">
              {mothersDayMenuNotes.map((note, index) => (
                <span key={index}>{note}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        
        {/* Floating flowers in CTA */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(10)].map((_, i) => (
            <Flower2 
              key={i}
              className="absolute text-white animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${16 + Math.random() * 16}px`,
                height: `${16 + Math.random() * 16}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8 backdrop-blur-sm">
            <Heart className="w-10 h-10 text-white fill-white/30" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Make Mum Feel<br />Extra Special
          </h2>
          
          <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
            Tables fill up fast for Mother's Day. 
            Reserve now to ensure the perfect celebration for your family.
          </p>
          
          <p className="text-lg text-white/70 mb-10">
            <span className="font-semibold">£{mothersDayMenuDetails.price}</span> per person + {mothersDayMenuDetails.serviceCharge} service charge
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-pink-600 hover:bg-pink-50 text-lg px-10 py-6 rounded-full font-semibold shadow-2xl"
            >
              <Link href="/reserve">
                <Flower2 className="w-5 h-5 mr-2" />
                Reserve Your Table
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white hover:text-pink-600 text-lg px-10 py-6 rounded-full font-semibold"
            >
              <a href="tel:02084215550">
                <Phone className="w-5 h-5 mr-2" />
                020 8421 5550
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-white/70 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>451 Uxbridge Road, Hatch End</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{mothersDayMenuDetails.times}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
