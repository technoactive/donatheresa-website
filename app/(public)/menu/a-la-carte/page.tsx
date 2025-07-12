"use client"

import { menuData } from "@/lib/menu-data"
import { Utensils, Star, Crown, Sparkles, ChefHat, Wine, Scroll, Coffee } from "lucide-react"
import { useState } from "react"
import { FormattedPrice } from "@/components/locale/formatted-price"
import Image from "next/image"

const categoryIcons = {
  "Starters": Sparkles,
  "Main Course - Fish": Wine,
  "Main Course - Meat": Crown,
  "Main Course - Pasta": Utensils,
  "Salads": Star,
  "Side Orders": ChefHat,
}

const categoryDescriptions = {
  "Starters": "Begin your culinary journey with our exquisite selection of antipasti and appetizers",
  "Main Course - Fish": "Fresh catches prepared with Mediterranean finesse and seasonal accompaniments",
  "Main Course - Meat": "Premium cuts and traditional recipes crafted with contemporary techniques",
  "Main Course - Pasta": "Handcrafted pasta dishes celebrating authentic Italian traditions",
  "Salads": "Fresh, vibrant compositions perfect for lighter dining experiences",
  "Side Orders": "Carefully selected accompaniments to complement your main course",
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const scrollToSection = (category: string) => {
    const element = document.getElementById(`section-${category.replace(/\s+/g, '-').toLowerCase()}`)
    if (element) {
      // Scroll to show the section with the icon visible
      const elementRect = element.getBoundingClientRect()
      // Use larger offset for both mobile and desktop to ensure icon and decorative elements are visible
      const isMobile = window.innerWidth < 768
      const offset = isMobile ? 250 : 220 // Larger offset for both mobile and desktop to show icon
      window.scrollTo({
        top: window.scrollY + elementRect.top - offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Elegant Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/20 pt-20" style={{ minHeight: '70vh' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-100/30 to-yellow-100/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-amber-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-8 py-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-amber-200/50 text-slate-700 px-8 py-4 rounded-full text-sm font-medium shadow-lg">
              <Scroll className="w-4 h-4 text-amber-600" />
              <span className="tracking-[0.2em] uppercase">À La Carte Menu</span>
              <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <span className="block text-slate-900">DONA</span>
                <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  THERESA
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-slate-600 font-light leading-relaxed">
                  Culinary Excellence Since 2011
                </p>
                
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
                
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
                  Experience our meticulously crafted dishes, where authentic Italian traditions 
                  meet contemporary innovation in every plate we serve.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-amber-600">
                <ChefHat className="w-5 h-5" />
                <span className="text-sm font-medium">Chef's Selection</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2 text-amber-600">
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
            {menuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-3 py-2 md:px-6 md:py-3 bg-slate-50 hover:bg-amber-50 rounded-xl md:rounded-2xl border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-100 group-hover:bg-amber-200 rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-amber-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-xs md:text-sm group-hover:text-amber-700 transition-colors leading-tight">
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
            {menuData.map((section, sectionIndex) => {
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
                      <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
                    </div>
                    
                    <div className="space-y-4 max-w-4xl mx-auto">
                      <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                        {section.category}
                      </h2>
                      
                      <p className="text-xl text-slate-600 leading-relaxed">
                        {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                      </p>
                      
                      {section.note && (
                        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                          <Coffee className="w-4 h-4" />
                          {section.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="grid gap-6 max-w-5xl mx-auto">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={item.name}
                        className="group relative bg-white rounded-3xl border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-50/10 to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative p-8">
                          <div className="flex justify-between items-start gap-6">
                            {/* Item Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors duration-300 leading-tight">
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
                                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-amber-200 to-slate-200 group-hover:from-amber-200 group-hover:via-amber-300 group-hover:to-amber-200 transition-all duration-300"></div>
                                <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-3xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors duration-300">
                                <FormattedPrice price={item.price} fallback={item.price} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-3xl transition-all duration-300"></div>
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
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-yellow-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-100/15 to-amber-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Dining Information
            </h3>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Important details to enhance your dining experience with us
            </p>
          </div>

          {/* Information Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Main Courses</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All fish and meat main courses are served with potatoes and two carefully selected seasonal vegetables.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Dietary Options</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Gluten-free pasta alternatives are available upon request. <span className="font-semibold text-amber-700">(V)</span> denotes vegetarian dishes.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Wine className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Wine Pairings</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Expert wine pairings are available for all main courses. Please ask your server for recommendations.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Allergies</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Please inform your server of any food allergies or dietary requirements when placing your order.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-200 rounded-xl flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4 text-amber-700" />
                </div>
                <h4 className="font-semibold text-amber-900 text-lg">Service Charge</h4>
              </div>
              <p className="text-amber-800 leading-relaxed font-medium">
                A discretionary 10% service charge will be added to your bill
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Reservations</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                For reservations and inquiries: <span className="font-semibold text-slate-900">020 8866 3117</span>
              </p>
            </div>
          </div>

          {/* Contact Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-2xl font-bold mb-4">Ready to Experience Dona Theresa?</h4>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Book your table today and let us create an unforgettable dining experience for you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-amber-300">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Call: 020 8866 3117</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-slate-600"></div>
                <div className="flex items-center gap-2 text-amber-300">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
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
