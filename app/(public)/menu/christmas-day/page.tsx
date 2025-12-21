"use client"

import { christmasDayMenuData, christmasDayMenuPricing, christmasDayMenuNote } from "@/lib/christmas-day-menu-data"
import { Utensils, Star, Crown, Sparkles, Gift, Calendar, TreePine, Snowflake, PartyPopper } from "lucide-react"
import { useState } from "react"

export const dynamic = 'force-dynamic'

const categoryIcons = {
  "Starters": Sparkles,
  "Main Course": Crown,
  "Dessert": Gift,
}

const categoryDescriptions = {
  "Starters": "Begin your Christmas celebration with our selection of festive appetizers",
  "Main Course": "The heart of your Christmas feast awaits",
  "Dessert": "Sweet endings to complete your Christmas celebration",
}

export default function ChristmasDayMenuPage() {
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
      {/* Christmas Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-emerald-900 pt-20" style={{ minHeight: '85vh' }}>
        {/* Snowflake Pattern Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M40 0l2 2-2 2-2-2 2-2zm0 76l2 2-2 2-2-2 2-2zm38-38l2 2-2 2-2-2 2-2zM2 38l2 2-2 2-2-2 2-2z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-red-400/15 to-red-600/15 rounded-full blur-2xl" />
          
          {/* Floating Snowflakes */}
          <div className="absolute top-32 right-20 text-white/10">
            <Snowflake className="w-16 h-16" />
          </div>
          <div className="absolute bottom-40 left-16 text-white/10">
            <Snowflake className="w-12 h-12" />
          </div>
          <div className="absolute top-1/2 right-10 text-white/5">
            <TreePine className="w-20 h-20" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[85vh]">
          <div className="text-center space-y-8 py-16">
            {/* Christmas Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium shadow-2xl">
              <TreePine className="w-5 h-5 text-emerald-300" />
              <span className="tracking-[0.3em] uppercase font-light">25th December 2025</span>
              <Gift className="w-5 h-5 text-red-300" />
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <span className="block text-white drop-shadow-2xl">
                  CHRISTMAS
                </span>
                <span className="block text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text drop-shadow-2xl">
                  DAY
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  A Magical Italian Christmas Feast
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                  <Sparkles className="w-6 h-6 text-amber-300" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400/50 to-transparent"></div>
                </div>
                
                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                  Celebrate the joy of Christmas with your loved ones at Dona Theresa. 
                  Indulge in our specially curated three-course menu featuring traditional favorites with an Italian twist.
                </p>
              </div>
            </div>

            {/* Pricing Badge */}
            <div className="pt-6">
              <div className="inline-flex flex-col items-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 text-white px-12 py-8 rounded-3xl shadow-2xl">
                <span className="text-lg font-medium text-amber-200">Three Course Meal</span>
                <span className="text-5xl md:text-6xl font-black text-white">{christmasDayMenuPricing.threeCourseMeal.price}</span>
                <span className="text-sm text-white/70">+10% service charge</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-8">
              <div className="flex items-center gap-2 text-amber-300">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Special Occasion</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2 text-emerald-300">
                <TreePine className="w-5 h-5" />
                <span className="text-sm font-medium">Festive Atmosphere</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2 text-red-300">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Family Dining</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="py-4 md:py-8 bg-white border-b border-slate-200 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {christmasDayMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-3 py-2 md:px-6 md:py-3 bg-slate-50 hover:bg-red-50 rounded-xl md:rounded-2xl border border-slate-200 hover:border-red-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-red-100 to-emerald-100 group-hover:from-red-200 group-hover:to-emerald-200 rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-xs md:text-sm group-hover:text-red-700 transition-colors leading-tight">
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
      {christmasDayMenuData.map((section, sectionIndex) => {
        const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
        
        return (
          <section 
            key={section.category} 
            id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
            className={`py-20 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-b from-red-50/30 to-white'} relative overflow-hidden`}
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-5">
              <div className={`absolute ${sectionIndex % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-64 h-64 bg-gradient-to-br ${sectionIndex === 0 ? 'from-red-500' : sectionIndex === 1 ? 'from-emerald-500' : 'from-amber-500'} to-transparent rounded-full blur-3xl`}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              {/* Category Header */}
              <div className="mb-16 relative">
                <div className="relative">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent flex-1"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent flex-1"></div>
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
                    className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-1 text-slate-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Festive decorator */}
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
      {christmasDayMenuNote && (
        <section className="py-12 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-slate-700 italic">{christmasDayMenuNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          {/* Floating decorations */}
          <div className="absolute top-10 left-10 text-white/10">
            <Snowflake className="w-20 h-20" />
          </div>
          <div className="absolute bottom-10 right-10 text-white/10">
            <TreePine className="w-16 h-16" />
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
            <Calendar className="w-5 h-5" />
            <span className="tracking-wider uppercase">Book Christmas Day</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Reserve Your Christmas Table
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Create unforgettable Christmas memories with your family at Dona Theresa. Limited tables available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reserve"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-900 font-semibold rounded-full hover:bg-amber-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Make a Reservation</span>
              <Sparkles className="w-5 h-5" />
            </a>
            
            <a
              href="tel:+442084215550"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <span>Call +44 20 8421 5550</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

