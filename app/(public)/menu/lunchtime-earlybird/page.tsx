"use client"

import { lunchtimeEarlybirdMenuData, lunchtimeEarlybirdMenuPricing, lunchtimeEarlybirdMenuDetails, lunchtimeEarlybirdMenuNotes } from "@/lib/lunchtime-earlybird-menu-data"
import { Clock, Sun, Moon, Utensils, Leaf, Coffee, Info, Calendar } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export const dynamic = 'force-dynamic'

const categoryIcons = {
  "Starters": Sun,
  "Main Course": Utensils,
}

const categoryDescriptions = {
  "Starters": "Light and flavorful beginnings to your meal",
  "Main Course": "Hearty and satisfying dishes for lunch or early dinner",
}

export default function LunchtimeEarlybirdMenuPage() {
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 pt-20" style={{ minHeight: '70vh' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-8 py-16">
            {/* Time Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-amber-200 text-amber-800 px-8 py-4 rounded-full text-sm font-medium shadow-lg">
              <Clock className="w-5 h-5" />
              <span className="tracking-[0.2em] uppercase font-light">Lunchtime & Early Bird</span>
              <Moon className="w-5 h-5" />
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                <span className="block text-slate-900">
                  EXCEPTIONAL
                </span>
                <span className="block text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text">
                  VALUE
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-slate-800 font-light leading-relaxed">
                  Savor Our Special Menu
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                  <Sun className="w-6 h-6 text-amber-500" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent"></div>
                </div>
                
                <div className="space-y-4 text-lg text-slate-700">
                  <p className="font-medium">{lunchtimeEarlybirdMenuDetails.days}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-base">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      {lunchtimeEarlybirdMenuDetails.orderCutoff}
                    </span>
                    <span className="hidden sm:inline text-amber-400">•</span>
                    <span className="text-red-600 font-medium">
                      {lunchtimeEarlybirdMenuDetails.fridaySaturdayNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-amber-700 text-sm uppercase tracking-wider mb-2">2 Course Menu</p>
                <p className="text-5xl font-bold text-slate-900">{lunchtimeEarlybirdMenuPricing.twoCourse.price}</p>
                <p className="text-sm text-slate-600 mt-2">Plus {lunchtimeEarlybirdMenuPricing.twoCourse.serviceCharge} service charge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="py-4 md:py-8 bg-white border-b border-slate-200 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {lunchtimeEarlybirdMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-3 py-2 md:px-6 md:py-3 bg-amber-50 hover:bg-amber-100 rounded-xl md:rounded-2xl border border-amber-200 hover:border-amber-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300">
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

      {/* Important Information Banner */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-900 text-sm font-medium">
              {lunchtimeEarlybirdMenuDetails.partyRestriction}
            </p>
          </div>
        </div>
      </section>

      {/* Menu Items Sections */}
      {lunchtimeEarlybirdMenuData.map((section, sectionIndex) => {
        const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
        
        return (
          <section 
            key={section.category} 
            id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
            className={`py-20 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-b from-amber-50/30 to-white'} relative overflow-hidden`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Category Header */}
              <div className="mb-16 relative">
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute ${sectionIndex % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-64 h-64 bg-gradient-to-br ${sectionIndex === 0 ? 'from-amber-400' : 'from-orange-400'} to-transparent rounded-full blur-3xl`}></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-8 h-8 text-amber-700" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1"></div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">
                    {section.category}
                  </h2>
                  
                  <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto">
                    {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                  </p>
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid gap-4 max-w-5xl mx-auto">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group relative p-6 bg-white rounded-2xl border border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-lg"
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
                      
                      {/* Vegetarian indicator */}
                      {item.name.includes("(V)") && (
                        <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Menu Notes */}
      <section className="py-12 bg-gradient-to-b from-white to-amber-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-amber-200 rounded-2xl p-8 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Important Information</h3>
            {lunchtimeEarlybirdMenuNotes.map((note, index) => (
              <p key={index} className="text-slate-700 text-sm leading-relaxed flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>{note}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-amber-800 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-amber-200">
            <Calendar className="w-5 h-5" />
            <span className="tracking-wider uppercase">Reserve Your Table</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Experience Exceptional Value
          </h2>
          
          <p className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto">
            Join us for lunch or early dinner and enjoy our carefully crafted menu at an unbeatable price.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reserve"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Book Your Table</span>
              <Clock className="w-5 h-5" />
            </a>
            
            <a
              href="tel:+442084215550"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-full border-2 border-amber-300 hover:bg-amber-50 transition-all duration-300"
            >
              <span>Call +44 20 8421 5550</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
