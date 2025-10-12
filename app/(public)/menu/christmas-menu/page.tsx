"use client"

import { christmasMenuData } from "@/lib/christmas-menu-data"
import { Utensils, Star, Crown, Sparkles, ChefHat, Wine, Scroll, Coffee, TreePine, Snowflake, Gift } from "lucide-react"
import { useState } from "react"
import { FormattedPrice } from "@/components/locale/formatted-price"
import Image from "next/image"

const categoryIcons = {
  "Christmas Starters": Sparkles,
  "Christmas Main Courses": Crown,
  "Christmas Desserts": Gift,
  // Add more category icons as needed
}

const categoryDescriptions = {
  "Christmas Starters": "Begin your festive celebration with our special Christmas appetizers",
  "Christmas Main Courses": "Traditional Christmas favorites with an authentic Italian touch",
  "Christmas Desserts": "Sweet endings to complete your Christmas feast",
  // Add more descriptions as needed
}

export default function ChristmasMenuPage() {
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
      {/* Elegant Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-green-50/20 pt-20" style={{ minHeight: '70vh' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-100/30 to-green-100/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100/20 to-red-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-8 py-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-red-200/50 text-slate-700 px-8 py-4 rounded-full text-sm font-medium shadow-lg">
              <TreePine className="w-4 h-4 text-red-600" />
              <span className="tracking-[0.2em] uppercase">Christmas Menu</span>
              <Snowflake className="w-4 h-4 text-green-600" />
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <span className="block text-slate-900">FESTIVE</span>
                <span className="block bg-gradient-to-r from-red-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                  CELEBRATION
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-slate-600 font-light leading-relaxed">
                  A Special Christmas Experience
                </p>
                
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
                
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
                  Celebrate the festive season with our specially crafted Christmas menu, 
                  where Italian tradition meets holiday magic.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-red-600">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Festive Specials</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2 text-green-600">
                <Wine className="w-5 h-5" />
                <span className="text-sm font-medium">Wine Pairings Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="py-4 md:py-8 bg-white border-b border-slate-200 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {christmasMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-3 py-2 md:px-6 md:py-3 bg-slate-50 hover:bg-red-50 rounded-xl md:rounded-2xl border border-slate-200 hover:border-red-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-red-100 to-green-100 group-hover:from-red-200 group-hover:to-green-200 rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300">
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

      {/* Menu Sections */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-24">
            {christmasMenuData.map((section, sectionIndex) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              
              return (
                <div
                  key={section.category}
                  id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
                  className="scroll-mt-32"
                >
                  {/* Section Header */}
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-4 mb-8">
                      <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-300"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-16 h-px bg-gradient-to-l from-transparent to-green-300"></div>
                    </div>
                    
                    <div className="space-y-4 max-w-4xl mx-auto">
                      <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                        {section.category}
                      </h2>
                      
                      <p className="text-xl text-slate-600 leading-relaxed">
                        {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="grid gap-6 max-w-5xl mx-auto">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={item.name}
                        className="group relative bg-white rounded-3xl border border-slate-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-50/10 to-green-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative p-8">
                          <div className="flex justify-between items-start gap-6">
                            {/* Item Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-red-700 transition-colors duration-300 leading-tight">
                                    {item.name}
                                  </h3>
                                  
                                  {item.description && (
                                    <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed mt-2 text-lg">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Decorative Line */}
                              <div className="flex items-center gap-3 mt-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-red-200 to-slate-200 group-hover:from-red-200 group-hover:via-green-300 group-hover:to-red-200 transition-all duration-300"></div>
                                <div className="w-2 h-2 bg-red-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-3xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-300">
                                <FormattedPrice price={item.price} fallback={item.price} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-200 rounded-3xl transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer Information */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-white to-green-50/20 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-red-100/20 to-green-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-green-100/15 to-red-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-300"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-green-300"></div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Christmas Dining Information
            </h3>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Important details for your festive dining experience
            </p>
          </div>

          {/* Information Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Festive Service</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Christmas menu available throughout the festive season with special service times.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Dietary Options</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Special dietary requirements can be accommodated. Please inform us when booking.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <Wine className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Wine Pairings</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Specially selected festive wine pairings available for all courses.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Booking Essential</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Advance booking essential for Christmas dining. Limited availability.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-2xl border border-red-200 p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-200 rounded-xl flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4 text-red-700" />
                </div>
                <h4 className="font-semibold text-red-900 text-lg">Service Charge</h4>
              </div>
              <p className="text-red-800 leading-relaxed font-medium">
                A discretionary 10% service charge will be added to your bill
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Reservations</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                For Christmas reservations: <span className="font-semibold text-slate-900">020 8866 3117</span>
              </p>
            </div>
          </div>

          {/* Contact Banner */}
          <div className="bg-gradient-to-r from-red-900 to-green-800 rounded-3xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-2xl font-bold mb-4">Ready for a Festive Feast?</h4>
              <p className="text-red-100 text-lg mb-6 leading-relaxed">
                Book your Christmas celebration at Dona Theresa and create magical memories
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Call: 020 8866 3117</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-red-600"></div>
                <div className="flex items-center gap-2 text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">451 Uxbridge Rd, Pinner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
