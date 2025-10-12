"use client"

import { decemberChristmasMenuData, decemberChristmasMenuPricing, decemberChristmasMenuNote } from "@/lib/december-christmas-menu-data"
import { Utensils, Star, Crown, Sparkles, ChefHat, Wine, Scroll, Coffee, TreePine, Snowflake, Gift, Calendar, Clock, Flame, Leaf } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

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
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          {/* Floating Ornaments */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 py-16"
          >
            {/* Festive Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium shadow-2xl"
            >
              <Snowflake className="w-5 h-5 animate-pulse" />
              <span className="tracking-[0.3em] uppercase font-light">December Festivities</span>
              <TreePine className="w-5 h-5 animate-pulse" />
            </motion.div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <motion.span 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="block text-white drop-shadow-2xl"
                >
                  FESTIVE
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="block text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 bg-clip-text drop-shadow-2xl"
                >
                  DECEMBER
                </motion.span>
              </h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  A Celebration of Seasonal Flavors
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                  <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent via-white/50 to-transparent"></div>
                </div>
                
                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                  Indulge in our specially curated set menus, where Italian tradition meets festive magic.
                  Available throughout December for lunch and dinner.
                </p>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex items-center justify-center gap-6 sm:gap-8 pt-8"
            >
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
            </motion.div>
          </motion.div>
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

      {/* Festive Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-white via-red-50/10 to-emerald-50/10 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-600 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-600 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-300"></div>
              <Sparkles className="w-8 h-8 text-red-600" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-300"></div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-slate-900 mb-4"
            >
              Choose Your Experience
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Select from our carefully curated lunch and dinner options
            </motion.p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Lunch Pricing Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
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
            </motion.div>
            
            {/* Dinner Pricing Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-emerald-900 to-red-900 opacity-95"></div>
              <div className="relative p-10 text-white">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-md border border-white/20">
                    <Star className="w-5 h-5" />
                    <span className="tracking-wider uppercase">Dinner Service</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Festive Dinner</h3>
                  <p className="text-white/80">5:30 PM - 10:30 PM</p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="relative flex justify-between items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                      <div>
                        <span className="text-lg font-semibold">Two Course Dinner</span>
                        <p className="text-sm text-white/70 mt-1">Starter + Main or Main + Dessert</p>
                      </div>
                      <span className="text-2xl font-bold text-amber-300">{decemberChristmasMenuPricing.dinner.twoCourse.price}</span>
                    </div>
                  </div>
                  
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
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
            </motion.div>
          </div>
          
          {/* Service Charge Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center bg-gradient-to-r from-red-100 via-white to-emerald-100 rounded-3xl p-8 border border-red-200/50 shadow-lg"
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              <Snowflake className="w-6 h-6 text-red-600" />
              <p className="text-slate-800 text-lg">
                <span className="font-medium">A</span>
                <span className="text-xl font-bold mx-2 text-red-600">{decemberChristmasMenuPricing.lunch.twoCourse.serviceCharge}</span>
                <span className="font-medium">service charge will be added to your bill</span>
              </p>
              <Snowflake className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-slate-600 text-sm">All prices shown are before service charge</p>
          </motion.div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-24">
            {decemberChristmasMenuData.map((section, sectionIndex) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              
              return (
                <div
                  key={section.category}
                  id={`section-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
                  className="scroll-mt-32"
                >
                  {/* Section Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                  >
                    <div className="inline-flex items-center gap-4 mb-8">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-24 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent origin-center"
                      />
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 200 }}
                        className="relative"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        {/* Festive sparkles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-400 rounded-full animate-pulse delay-300"></div>
                      </motion.div>
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-24 h-px bg-gradient-to-l from-transparent via-emerald-300 to-transparent origin-center"
                      />
                    </div>
                    
                    <div className="space-y-4 max-w-4xl mx-auto">
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-800 via-red-600 to-emerald-700 bg-clip-text text-transparent"
                      >
                        {section.category}
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-xl text-slate-600 leading-relaxed italic"
                      >
                        {categoryDescriptions[section.category as keyof typeof categoryDescriptions]}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Menu Items Grid */}
                  <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: itemIndex * 0.05 }}
                        className="group relative"
                      >
                        <div className="relative bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-red-200/50 overflow-hidden">
                          {/* Festive Corner Decoration */}
                          <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-red-100 via-emerald-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-3xl"></div>
                          
                          <div className="relative">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-red-700 transition-colors duration-300">
                                  {item.name}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {/* Festive Star */}
                              <Sparkles className="w-4 h-4 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer Information */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-red-50/20 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-emerald-100/20 to-red-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-red-100/15 to-emerald-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-emerald-300"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-300"></div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              December Dining Information
            </h3>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know for your December visit
            </p>
          </div>

          {/* Dietary Note */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-12 max-w-3xl mx-auto">
            <p className="text-slate-600 text-center italic">
              {decemberChristmasMenuNote}
            </p>
          </div>

          {/* Information Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Availability</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                December menu available throughout the month with special daily selections.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Group Bookings</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Perfect for office parties and family gatherings. Special group menus available.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Wine className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Festive Drinks</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Special December cocktails and mulled wine available throughout the month.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Early Booking</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Book early to secure your preferred date. December fills up quickly!
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-red-50 rounded-2xl border border-emerald-200 p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-200 rounded-xl flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="font-semibold text-emerald-900 text-lg">Service Charge</h4>
              </div>
              <p className="text-emerald-800 leading-relaxed font-medium">
                A discretionary 10% service charge will be added to your bill
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 text-lg">Reservations</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                December bookings: <span className="font-semibold text-slate-900">020 8866 3117</span>
              </p>
            </div>
          </div>

          {/* Contact Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-red-800 rounded-3xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-2xl font-bold mb-4">Make December Memorable</h4>
              <p className="text-emerald-100 text-lg mb-6 leading-relaxed">
                Reserve your December celebration and enjoy a month of festive Italian dining
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Call: 020 8866 3117</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-emerald-600"></div>
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
