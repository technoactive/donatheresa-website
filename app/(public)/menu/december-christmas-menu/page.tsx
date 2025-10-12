"use client"

import { decemberChristmasMenuData, decemberChristmasMenuPricing, decemberChristmasMenuNote } from "@/lib/december-christmas-menu-data"
import { Utensils, Star, Crown, Sparkles, ChefHat, Wine, Scroll, Coffee, TreePine, Snowflake, Gift, Calendar, Clock, Flame, Leaf } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

// Simplified version without animations
export const dynamic = 'force-dynamic'

const categoryIcons = {
  "Starters": Sparkles,
  "Main Course": Crown,
  "Dessert": Gift,
}

const categoryDescriptions = {
  "Starters": "Begin your festive journey with our selection of appetizers",
  "Main Course": "Savor the heart of your celebration",
  "Dessert": "Sweet endings to complete your festive experience",
}

export default function DecemberChristmasMenuPage() {
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
      {/* Festive Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-emerald-800 to-red-900 pt-20" style={{ minHeight: '80vh' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          {/* Static Decorative Elements */}
          <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-8 py-16">
            {/* Festive Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium shadow-2xl">
              <Snowflake className="w-5 h-5" />
              <span className="tracking-[0.3em] uppercase font-light">December Festivities</span>
              <TreePine className="w-5 h-5" />
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <span className="block text-white drop-shadow-2xl">
                  FESTIVE
                </span>
                <span className="block text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 bg-clip-text drop-shadow-2xl">
                  DECEMBER
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  A Celebration of Seasonal Flavors
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                  <Sparkles className="w-6 h-6 text-amber-300" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent via-white/50 to-transparent"></div>
                </div>
                
                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                  Indulge in our specially curated set menus, where Italian tradition meets festive magic.
                  Available throughout December for lunch and dinner.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-8">
              <div className="flex items-center gap-2 text-amber-300">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-medium">Warm & Festive</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2 text-amber-300">
                <Wine className="w-5 h-5" />
                <span className="text-sm font-medium">Wine Pairings</span>
              </div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="flex items-center gap-2 text-amber-300">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">Special Occasions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="py-4 md:py-8 bg-white border-b border-slate-200 sticky top-20 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {decemberChristmasMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-3 py-2 md:px-6 md:py-3 bg-slate-50 hover:bg-emerald-50 rounded-xl md:rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-emerald-100 to-red-100 group-hover:from-emerald-200 group-hover:to-red-200 rounded-lg md:rounded-xl flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-xs md:text-sm group-hover:text-emerald-700 transition-colors leading-tight">
                      {section.category}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-white via-red-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-600 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-600 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-300"></div>
              <Sparkles className="w-8 h-8 text-red-600" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-300"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
              Choose Your Experience
            </h2>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Select from our carefully curated lunch and dinner options
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Lunch Pricing Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-50 opacity-50"></div>
              <div className="relative p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-md">
                    <Clock className="w-5 h-5" />
                    <span className="tracking-wider uppercase">Lunch Service</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Festive Lunch</h3>
                  <p className="text-slate-600">12:00 PM - 3:00 PM</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-transparent opacity-0 group-hover/item:opacity-50 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="relative flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 hover:border-amber-300 transition-all duration-300">
                      <div>
                        <span className="text-lg font-semibold text-slate-800">Two Course Lunch</span>
                        <p className="text-sm text-slate-500 mt-1">Starter + Main or Main + Dessert</p>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">{decemberChristmasMenuPricing.lunch.twoCourse.price}</span>
                    </div>
                  </div>
                  
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-transparent opacity-0 group-hover/item:opacity-50 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="relative flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 hover:border-amber-300 transition-all duration-300">
                      <div>
                        <span className="text-lg font-semibold text-slate-800">Three Course Lunch</span>
                        <p className="text-sm text-slate-500 mt-1">Complete festive experience</p>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">{decemberChristmasMenuPricing.lunch.threeCourse.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dinner Pricing Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-emerald-900 to-red-900 opacity-95"></div>
              <div className="relative p-10 text-white">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-md border border-white/20">
                    <Star className="w-5 h-5" />
                    <span className="tracking-wider uppercase">Dinner Service</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Festive Dinner</h3>
                  <p className="text-white/80">5:00 PM - 10:00 PM</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/item:opacity-50 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="relative flex justify-between items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                      <div>
                        <span className="text-lg font-semibold">Two Course Dinner</span>
                        <p className="text-sm text-white/70 mt-1">Starter + Main or Main + Dessert</p>
                      </div>
                      <span className="text-2xl font-bold text-amber-300">{decemberChristmasMenuPricing.dinner.twoCourse.price}</span>
                    </div>
                  </div>
                  
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/item:opacity-50 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="relative flex justify-between items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                      <div>
                        <span className="text-lg font-semibold">Three Course Dinner</span>
                        <p className="text-sm text-white/70 mt-1">Complete festive experience</p>
                      </div>
                      <span className="text-2xl font-bold text-amber-300">{decemberChristmasMenuPricing.dinner.threeCourse.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-slate-600 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
            <p>Prices shown are before service charge. A 10% service charge will be added to your bill.</p>
          </div>
        </div>
      </section>

      {/* Menu Items Sections */}
      {decemberChristmasMenuData.map((section, sectionIndex) => {
        const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
        
        return (
          <section 
            key={section.category} 
            id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
            className={`py-20 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-b from-slate-50 to-white'} relative overflow-hidden`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Category Header */}
              <div className="mb-16 relative">
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute ${sectionIndex % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-64 h-64 bg-gradient-to-br ${sectionIndex === 0 ? 'from-emerald-500' : sectionIndex === 1 ? 'from-red-500' : 'from-amber-500'} to-transparent rounded-full blur-3xl`}></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
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
                    className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
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
      {decemberChristmasMenuNote && (
        <section className="py-12 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-slate-700 italic">{decemberChristmasMenuNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-emerald-900 to-red-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
            <Calendar className="w-5 h-5" />
            <span className="tracking-wider uppercase">Book Your Celebration</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Reserve Your Festive Experience
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join us for an unforgettable December celebration. Limited availability throughout the festive season.
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