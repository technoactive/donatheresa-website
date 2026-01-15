"use client"

import { valentinesMenuData, valentinesMenuDetails, valentinesMenuNotes } from "@/lib/valentines-menu-data"
import { Heart, Calendar, Clock, Sparkles, Star, Phone, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

// Floating hearts animation component
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
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
          <Heart 
            className={`text-rose-300 ${i % 3 === 0 ? 'w-4 h-4' : i % 3 === 1 ? 'w-6 h-6' : 'w-3 h-3'}`} 
            fill="currentColor" 
          />
        </div>
      ))}
    </div>
  )
}

export default function ValentinesDayMenuPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-[#1a0a0a] text-white min-h-screen">
      {/* Add custom animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(244, 63, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(244, 63, 94, 0.6); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
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
        {/* Dark gradient background with rose tints */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2d0a14] to-[#1a0a0a]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/5 rounded-full blur-[150px]" />
        </div>

        {/* Floating hearts */}
        {mounted && <FloatingHearts />}

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-rose-400 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-rose-400 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          {/* Top ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-400" />
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400 animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-400" />
          </div>

          {/* Date badge */}
          <div className="inline-flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Calendar className="w-4 h-4 text-rose-400" />
            <span className="text-rose-300 font-medium tracking-wider text-sm uppercase">
              Friday, 14th February 2026
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none">
            <span className="block text-white/90">Valentine's</span>
            <span className="block mt-2 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-shimmer">
              Day Menu
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-rose-100/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            An intimate evening of authentic Italian cuisine, 
            crafted with love for you and your special someone
          </p>

          {/* Price display */}
          <div className="inline-flex items-baseline gap-2 mb-10">
            <span className="text-6xl md:text-7xl font-bold text-white">£{valentinesMenuDetails.price}</span>
            <span className="text-rose-300/80 text-lg">per person</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg px-10 py-6 rounded-full shadow-2xl shadow-rose-500/25 animate-pulse-glow"
            >
              <Link href="/reserve">
                <Heart className="w-5 h-5 mr-2 fill-white" />
                Reserve Your Table
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
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-rose-400/50" />
            <Sparkles className="w-5 h-5 text-rose-400/50" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-rose-400/50" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-rose-400/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-rose-400/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-gradient-to-b from-[#1a0a0a] to-[#0f0505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_70%)]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your <span className="text-rose-400">Romantic Evening</span>
            </h2>
            <p className="text-rose-100/60 max-w-xl mx-auto">
              Every detail crafted to create an unforgettable Valentine's experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-rose-500/10 to-transparent border border-rose-500/20 rounded-3xl p-8 text-center hover:border-rose-500/40 transition-all duration-500">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3-Course Dinner</h3>
              <p className="text-rose-100/60 text-sm">
                Exquisite Italian dishes prepared by our expert chefs
              </p>
            </div>

            <div className="group bg-gradient-to-b from-rose-500/10 to-transparent border border-rose-500/20 rounded-3xl p-8 text-center hover:border-rose-500/40 transition-all duration-500">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Candlelit Ambiance</h3>
              <p className="text-rose-100/60 text-sm">
                Intimate atmosphere with soft lighting and romantic décor
              </p>
            </div>

            <div className="group bg-gradient-to-b from-rose-500/10 to-transparent border border-rose-500/20 rounded-3xl p-8 text-center hover:border-rose-500/40 transition-all duration-500">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attentive Service</h3>
              <p className="text-rose-100/60 text-sm">
                Dedicated staff ensuring your evening is perfect
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-[#0f0505] relative">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-rose-400/50" />
              <Star className="w-5 h-5 text-rose-400" />
              <div className="h-px w-12 bg-rose-400/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Menu</h2>
            <p className="text-rose-100/60">Select one dish from each course</p>
          </div>

          {/* Starters */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center border border-rose-500/30">
                <Star className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Starters</h3>
                <p className="text-rose-300/60 text-sm">Begin your romantic journey</p>
              </div>
            </div>
            <div className="space-y-4">
              {valentinesMenuData.starters.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-gradient-to-r from-rose-950/50 to-transparent border border-rose-500/10 rounded-2xl p-6 hover:border-rose-500/30 hover:bg-rose-950/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-rose-100/50 mt-1 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {item.dietary.map((d, i) => (
                        <span key={i} className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Courses */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center border border-rose-500/30">
                <Heart className="w-7 h-7 text-rose-400 fill-rose-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Main Courses</h3>
                <p className="text-rose-300/60 text-sm">The heart of your evening</p>
              </div>
            </div>
            <div className="space-y-4">
              {valentinesMenuData.mains.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-gradient-to-r from-rose-950/50 to-transparent border border-rose-500/10 rounded-2xl p-6 hover:border-rose-500/30 hover:bg-rose-950/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-rose-100/50 mt-1 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {item.dietary.map((d, i) => (
                        <span key={i} className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center border border-rose-500/30">
                <Sparkles className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Desserts</h3>
                <p className="text-rose-300/60 text-sm">A sweet ending together</p>
              </div>
            </div>
            <div className="space-y-4">
              {valentinesMenuData.desserts.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-gradient-to-r from-rose-950/50 to-transparent border border-rose-500/10 rounded-2xl p-6 hover:border-rose-500/30 hover:bg-rose-950/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-rose-100/50 mt-1 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {item.dietary.map((d, i) => (
                        <span key={i} className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
            <h4 className="font-semibold text-rose-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-400 rounded-full" />
              Please Note
            </h4>
            <ul className="space-y-2 text-sm text-rose-100/50">
              {valentinesMenuNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-rose-400/60 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        
        {/* Floating hearts in CTA */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(10)].map((_, i) => (
            <Heart 
              key={i}
              className="absolute text-white animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${16 + Math.random() * 16}px`,
                height: `${16 + Math.random() * 16}px`,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8 backdrop-blur-sm">
            <Heart className="w-10 h-10 text-white fill-white/30" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Make This Valentine's Day<br />Unforgettable
          </h2>
          
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tables are limited for this special evening. 
            Reserve now to ensure you and your loved one have the perfect romantic dinner.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-rose-600 hover:bg-rose-50 text-lg px-10 py-6 rounded-full font-semibold shadow-2xl"
            >
              <Link href="/reserve">
                <Heart className="w-5 h-5 mr-2 fill-rose-600" />
                Reserve Your Table
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white hover:text-rose-600 text-lg px-10 py-6 rounded-full font-semibold"
            >
              <a href="tel:02084215550">
                <Phone className="w-5 h-5 mr-2" />
                020 8421 5550
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>451 Uxbridge Road, Hatch End</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>From 6:00 PM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
