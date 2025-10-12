"use client"

import { lunchtimeEarlybirdMenuData, lunchtimeEarlybirdMenuPricing, lunchtimeEarlybirdMenuDetails, lunchtimeEarlybirdMenuNotes } from "@/lib/lunchtime-earlybird-menu-data"
import { Clock, Sun, Moon, Utensils, Leaf, Coffee, Info, Calendar, Star, ChevronRight, Sparkles, Timer, AlertCircle } from "lucide-react"
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
      {/* Clean Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white pt-20" style={{ minHeight: '70vh' }}>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23d97706%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          {/* Simple Decorative Elements */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-8 py-16">
            {/* Clean Badge */}
            <div className="inline-flex items-center gap-3 bg-amber-100 text-amber-800 px-6 py-3 rounded-full text-sm font-medium border border-amber-200">
              <Clock className="w-4 h-4" />
              <span className="tracking-wider uppercase">Exceptional Value Menu</span>
              <Sun className="w-4 h-4" />
            </div>
            
            {/* Simple Title */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-slate-900">
                  Lunchtime &
                </span>
                <span className="block text-amber-600">
                  Early Bird Special
                </span>
              </h1>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed">
                  Enjoy our carefully selected menu at an exceptional price
                </p>
                
                {/* Time Display */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{lunchtimeEarlybirdMenuDetails.days}</span>
                  </div>
                  <div className="hidden sm:block w-px h-5 bg-slate-300"></div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-amber-600" />
                    <span>{lunchtimeEarlybirdMenuDetails.orderCutoff}</span>
                  </div>
                </div>
                
                {/* Friday/Saturday Alert */}
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{lunchtimeEarlybirdMenuDetails.fridaySaturdayNote}</span>
                </div>
              </div>
            </div>

            {/* Clean Price Display */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-200 max-w-sm mx-auto">
              <div className="text-center space-y-3">
                <p className="text-amber-700 text-sm font-semibold uppercase tracking-wider">2 Course Menu</p>
                <p className="text-5xl font-bold text-slate-900">
                  {lunchtimeEarlybirdMenuPricing.twoCourse.price}
                </p>
                <p className="text-slate-500 text-sm">Plus {lunchtimeEarlybirdMenuPricing.twoCourse.serviceCharge} service charge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="py-4 md:py-6 bg-white border-b border-slate-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {lunchtimeEarlybirdMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-4 py-3 md:px-6 md:py-3 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 hover:border-amber-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <IconComponent className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-slate-700 font-medium text-sm group-hover:text-amber-800 transition-colors">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
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
            className={`py-16 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Category Header */}
              <div className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px bg-amber-200 flex-1 max-w-xs"></div>
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-amber-700" />
                  </div>
                  <div className="h-px bg-amber-200 flex-1 max-w-xs"></div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-3">
                  {section.category}
                </h2>
                
                <p className="text-slate-600 text-center max-w-2xl mx-auto">
                  {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                </p>
              </div>

              {/* Menu Items Grid */}
              <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group p-5 bg-white rounded-xl border border-amber-100 hover:border-amber-300 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-1 text-slate-600 text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
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
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Important Information</h3>
            <div className="space-y-2">
              {lunchtimeEarlybirdMenuNotes.map((note, index) => (
                <p key={index} className="text-slate-700 text-sm flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>{note}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Reserve Your Table Today
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience exceptional cuisine at an unbeatable price
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reserve"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-colors duration-200"
            >
              <span>Book Your Table</span>
              <Clock className="w-4 h-4" />
            </a>
            
            <a
              href="tel:+442084215550"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors duration-200"
            >
              <span>Call +44 20 8421 5550</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}