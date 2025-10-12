"use client"

import { lunchtimeEarlybirdMenuData, lunchtimeEarlybirdMenuPricing, lunchtimeEarlybirdMenuDetails, lunchtimeEarlybirdMenuNotes } from "@/lib/lunchtime-earlybird-menu-data"
import { Clock, Sun, Moon, Utensils, Leaf, Coffee, Info, Calendar, Star, ChevronRight, Sparkles, Timer, AlertCircle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700 pt-20" style={{ minHeight: '85vh' }}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          {/* Animated Decorative Elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[85vh]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 py-16"
          >
            {/* Premium Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium shadow-2xl"
            >
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="tracking-[0.3em] uppercase font-light">Exceptional Value Menu</span>
              <Star className="w-5 h-5 text-yellow-300" />
            </motion.div>
            
            {/* Main Title with Animation */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <motion.span 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="block text-white drop-shadow-2xl"
                >
                  LUNCHTIME
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="block text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 bg-clip-text drop-shadow-2xl"
                >
                  SPECIALS
                </motion.span>
              </h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  Exquisite Dining at an Unbeatable Price
                </p>
                
                {/* Time Display */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-300" />
                    <span className="font-medium">{lunchtimeEarlybirdMenuDetails.days}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-amber-300" />
                    <span>{lunchtimeEarlybirdMenuDetails.orderCutoff}</span>
                  </div>
                </div>
                
                {/* Friday/Saturday Alert */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="inline-flex items-center gap-3 bg-red-600/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-6 py-3 rounded-full text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                  <span>{lunchtimeEarlybirdMenuDetails.fridaySaturdayNote}</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Enhanced Price Display */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 blur-xl opacity-50"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-amber-200 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    SPECIAL OFFER
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <p className="text-amber-700 text-lg font-bold uppercase tracking-wider">2 Course Menu</p>
                  <div className="relative">
                    <p className="text-7xl font-black text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
                      {lunchtimeEarlybirdMenuPricing.twoCourse.price}
                    </p>
                    <div className="absolute -right-8 top-0">
                      <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">Plus {lunchtimeEarlybirdMenuPricing.twoCourse.serviceCharge} service charge</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Navigation Menu */}
      <section className="py-6 md:py-10 bg-gradient-to-b from-white to-amber-50/30 border-b border-amber-200 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {lunchtimeEarlybirdMenuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <motion.button
                  key={section.category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(section.category)}
                  className="group relative px-6 py-4 md:px-8 md:py-5 bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="text-slate-900 font-bold text-sm md:text-base block group-hover:text-amber-700 transition-colors">
                        {section.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {section.items.length} Options
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Important Information Banner - Enhanced */}
      <section className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-y-2 border-amber-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-amber-900 font-bold text-lg">Important Notice</p>
              <p className="text-amber-800 text-sm mt-1">
                {lunchtimeEarlybirdMenuDetails.partyRestriction}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Menu Items Sections */}
      {lunchtimeEarlybirdMenuData.map((section, sectionIndex) => {
        const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
        
        return (
          <section 
            key={section.category} 
            id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
            className={`py-24 ${sectionIndex % 2 === 0 ? 'bg-gradient-to-b from-white to-amber-50/20' : 'bg-gradient-to-b from-amber-50/20 to-white'} relative overflow-hidden`}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5">
              <div className={`absolute ${sectionIndex % 2 === 0 ? 'top-0 right-0' : 'top-0 left-0'} w-96 h-96 bg-gradient-to-br ${sectionIndex === 0 ? 'from-amber-600' : 'from-orange-600'} to-transparent rounded-full blur-3xl`}></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
              {/* Enhanced Category Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-20"
              >
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-xs"></div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl"
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent flex-1 max-w-xs"></div>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-black text-center text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text mb-4">
                  {section.category}
                </h2>
                
                <p className="text-xl text-slate-600 text-center max-w-2xl mx-auto font-light">
                  {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                </p>
              </motion.div>

              {/* Enhanced Menu Items Grid */}
              <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: itemIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setHoveredItem(`${section.category}-${itemIndex}`)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative p-8 bg-white rounded-2xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-2">
                            {item.name}
                            {item.name.includes("(V)") && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                <Leaf className="w-3 h-3" />
                                Vegetarian
                              </span>
                            )}
                          </h3>
                          {item.description && (
                            <p className="text-slate-600 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Hover Indicator */}
                        <div className={`transition-all duration-300 ${hoveredItem === `${section.category}-${itemIndex}` ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Enhanced Menu Notes */}
      <section className="py-16 bg-gradient-to-b from-white via-amber-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 rounded-3xl p-10 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Good to Know</h3>
            </div>
            <div className="space-y-3">
              {lunchtimeEarlybirdMenuNotes.map((note, index) => (
                <motion.p 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-slate-700 flex items-start gap-3"
                >
                  <span className="text-amber-600 text-xl mt-0.5">•</span>
                  <span className="leading-relaxed">{note}</span>
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-24 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-sm font-medium mb-10 border border-white/20">
              <Calendar className="w-5 h-5" />
              <span className="tracking-wider uppercase">Limited Time Offer</span>
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Don't Miss Out on This<br />
              <span className="text-transparent bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text">
                Incredible Value
              </span>
            </h2>
            
            <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
              Experience exceptional cuisine at an unbeatable price. Perfect for business lunches or early dinners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/reserve"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-amber-700 font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <span>Reserve Your Table</span>
                <ChevronRight className="w-5 h-5" />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+442084215550"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white/30 hover:border-white/60 backdrop-blur-sm transition-all duration-300"
              >
                <span>Call +44 20 8421 5550</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}