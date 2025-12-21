"use client"

import { newYearMenuData, newYearMenuPricing, newYearMenuNote } from "@/lib/new-year-menu-data"
import { Utensils, Star, Crown, Sparkles, Gift, Calendar, PartyPopper, Wine, Flame, Clock } from "lucide-react"
import { useState } from "react"

export const dynamic = 'force-dynamic'

const categoryIcons = {
  "Starters": Sparkles,
  "Main Course": Crown,
  "Dessert": Gift,
}

const categoryDescriptions = {
  "Starters": "Begin your New Year's celebration with our exquisite selection",
  "Main Course": "Ring in 2026 with our magnificent main courses",
  "Dessert": "Sweet endings to start the New Year right",
}

export default function NewYearMenuPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const scrollToSection = (category: string) => {
    const element = document.getElementById(`section-${category.replace(/\s+/g, '-').toLowerCase()}`)
    if (element) {
      const elementRect = element.getBoundingClientRect()
      const isMobile = window.innerWidth < 768
      const offset = isMobile ? 250 : 220
      window.scrollTo({
        top: window.scrollY + elementRect.top - offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* New Year Hero Section - Luxurious Black & Gold */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 pt-20" style={{ minHeight: '85vh' }}>
        {/* Sparkle Pattern Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23D4AF37%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%221%22/%3E%3Ccircle cx=%2225%22 cy=%2225%22 r=%220.5%22/%3E%3Ccircle cx=%2275%22 cy=%2275%22 r=%220.5%22/%3E%3Ccircle cx=%2225%22 cy=%2275%22 r=%220.5%22/%3E%3Ccircle cx=%2275%22 cy=%2225%22 r=%220.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          
          {/* Golden Glow Effects */}
          <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-yellow-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-amber-400/15 to-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-2xl" />
          
          {/* Floating Decorations */}
          <div className="absolute top-32 right-20 text-amber-400/20">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="absolute bottom-40 left-16 text-amber-400/15">
            <PartyPopper className="w-14 h-14" />
          </div>
          <div className="absolute top-1/2 right-16 text-amber-400/10">
            <Wine className="w-12 h-12" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[85vh]">
          <div className="text-center space-y-8 py-16">
            {/* New Year Badge */}
            <div className="inline-flex items-center gap-3 bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 px-8 py-4 rounded-full text-sm font-medium shadow-2xl">
              <PartyPopper className="w-5 h-5" />
              <span className="tracking-[0.3em] uppercase font-light">31st December 2025</span>
              <Sparkles className="w-5 h-5" />
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <span className="block text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text drop-shadow-2xl">
                  NEW YEAR
                </span>
                <span className="block text-white drop-shadow-2xl">
                  EVE
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-amber-100/90 font-light leading-relaxed">
                  A Night of Glamour & Italian Excellence
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                  <Star className="w-6 h-6 text-amber-400" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400/50 to-transparent"></div>
                </div>
                
                <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
                  Welcome 2026 in style at Dona Theresa. An unforgettable evening of exceptional cuisine, 
                  fine wines, and celebration awaits you and your loved ones.
                </p>
              </div>
            </div>

            {/* Pricing Badge - Premium Look */}
            <div className="pt-6">
              <div className="inline-flex flex-col items-center gap-3 bg-gradient-to-b from-amber-500/20 to-amber-600/10 backdrop-blur-md border border-amber-400/40 text-white px-12 py-8 rounded-3xl shadow-2xl">
                <span className="text-lg font-medium text-amber-300">Three Course Meal</span>
                <span className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text">{newYearMenuPricing.threeCourseMeal.price}</span>
                <span className="text-sm text-amber-200/70">+10% service charge</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-8">
              <div className="flex items-center gap-2 text-amber-400">
                <PartyPopper className="w-5 h-5" />
                <span className="text-sm font-medium">Celebrate 2026</span>
              </div>
              <div className="w-px h-6 bg-amber-400/30"></div>
              <div className="flex items-center gap-2 text-amber-400">
                <Wine className="w-5 h-5" />
                <span className="text-sm font-medium">Fine Wines</span>
              </div>
              <div className="w-px h-6 bg-amber-400/30"></div>
              <div className="flex items-center gap-2 text-amber-400">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-medium">Elegant Dining</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="py-4 md:py-8 bg-white border-b border-slate-200 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {newYearMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-3 py-2 md:px-6 md:py-3 bg-slate-50 hover:bg-amber-50 rounded-xl md:rounded-2xl border border-slate-200 hover:border-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-amber-100 to-yellow-100 group-hover:from-amber-200 group-hover:to-yellow-200 rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-amber-700" />
                    </div>
                    <span className="text-slate-700 font-medium text-xs md:text-sm group-hover:text-amber-800 transition-colors leading-tight">
                      {section.category}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Menu Items Sections */}
      {newYearMenuData.map((section, sectionIndex) => {
        const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
        
        return (
          <section 
            key={section.category} 
            id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
            className={`py-20 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-b from-amber-50/30 to-white'} relative overflow-hidden`}
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5">
              <div className={`absolute ${sectionIndex % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-64 h-64 bg-gradient-to-br from-amber-500 to-transparent rounded-full blur-3xl`}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              {/* Category Header */}
              <div className="mb-16 relative">
                <div className="relative">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-amber-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1"></div>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-bold text-center text-slate-900 mb-4">
                    {section.category}
                  </h2>
                  
                  <p className="text-xl text-slate-600 text-center max-w-2xl mx-auto">
                    {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                  </p>
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid gap-4 max-w-5xl mx-auto">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-1 text-slate-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Golden decorator */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Menu Note */}
      {newYearMenuNote && (
        <section className="py-12 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-slate-700 italic">{newYearMenuNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Glamorous */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23D4AF37%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%221%22/%3E%3Ccircle cx=%2225%22 cy=%2225%22 r=%220.5%22/%3E%3Ccircle cx=%2275%22 cy=%2275%22 r=%220.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          
          {/* Floating decorations */}
          <div className="absolute top-10 left-10 text-amber-400/10">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="absolute bottom-10 right-10 text-amber-400/10">
            <PartyPopper className="w-20 h-20" />
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-amber-500/20 backdrop-blur-sm text-amber-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-amber-400/30">
            <Calendar className="w-5 h-5" />
            <span className="tracking-wider uppercase">Book New Year's Eve</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Celebrate the New Year in Style
          </h2>
          
          <p className="text-xl text-amber-100/80 mb-10 max-w-2xl mx-auto">
            Join us for an unforgettable New Year's Eve celebration. Limited availability—reserve your table now!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reserve"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-semibold rounded-full hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Make a Reservation</span>
              <PartyPopper className="w-5 h-5" />
            </a>
            
            <a
              href="tel:+442084215550"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-amber-400/30 hover:bg-white/20 transition-all duration-300"
            >
              <span>Call +44 20 8421 5550</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

