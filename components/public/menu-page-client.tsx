"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Crown, Wine, Coffee, Star, Utensils, Clock, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect } from "react"

const menuCategories = [
  {
    id: "a-la-carte",
    title: "À La Carte Menu",
    subtitle: "Our signature collection",
    description: "Experience our full range of carefully crafted dishes, from exquisite starters to premium main courses",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center",
    icon: Crown,
    highlight: "Signature Dishes",
    link: "/menu/a-la-carte",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    id: "lunchtime-earlybird",
    title: "Lunchtime & Early Bird",
    subtitle: "Exceptional value",
    description: "2 course menu at £19.95, available Tuesday-Sunday for lunch and early dinner",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&crop=center",
    icon: Clock,
    highlight: "£19.95 - 2 Courses",
    link: "/menu/lunchtime-earlybird",
    gradient: "from-amber-500 to-yellow-500",
    bgGradient: "from-amber-50 to-yellow-50",
  },
  {
    id: "december-christmas-menu",
    title: "December Menu",
    subtitle: "Festive celebration",
    description: "Enjoy our special December menu with 2 or 3 course options, featuring seasonal favorites with an Italian twist",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=600&fit=crop&crop=center",
    icon: Sparkles,
    highlight: "December Special",
    link: "/menu/december-christmas-menu",
    gradient: "from-emerald-500 to-red-500",
    bgGradient: "from-emerald-50 to-red-50",
  },
]

export default function MenuPageClient() {
  useEffect(() => {
    // Auto-scroll to menu categories when page loads from navigation - MOBILE ONLY
    const timer = setTimeout(() => {
      // Only scroll on mobile devices (width < 768px)
      if (window.innerWidth < 768) {
        const menuSection = document.getElementById('menu-categories')
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 500) // Small delay to allow page to fully load

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/20 pt-20" style={{ minHeight: '80vh' }}>
        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-100/30 to-yellow-100/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-amber-100/30 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-100/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full"
          >
            {/* Decorative Top Element */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Utensils className="w-16 h-16 text-amber-500" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-16 h-16"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 absolute -top-2 left-1/2 transform -translate-x-1/2" />
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -right-2 top-1/2 transform -translate-y-1/2" />
                  <Sparkles className="w-4 h-4 text-amber-400 absolute -bottom-2 left-1/2 transform -translate-x-1/2" />
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -left-2 top-1/2 transform -translate-y-1/2" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title with Animation */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="block text-slate-900 mb-2">Our</span>
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-gradient-x">
                Exquisite Menus
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Discover our carefully curated selection of authentic Italian dishes, 
              from traditional favorites to modern interpretations
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg group"
                onClick={() => document.getElementById('menu-categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Explore Our Menus</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-amber-500 text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg"
                asChild
              >
                <Link href="/reserve">
                  Book a Table
                </Link>
              </Button>
            </motion.div>

            {/* Decorative Divider */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-12 rounded-full"
            />
          </motion.div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-amber-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Menu Categories Section */}
      <section id="menu-categories" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Each menu is thoughtfully designed to offer a unique culinary journey
            </p>
          </motion.div>

          {/* Menu Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {menuCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={category.link} className="block h-full">
                  <div className={`relative h-full bg-gradient-to-br ${category.bgGradient} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100`}>
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-4 py-2 bg-gradient-to-r ${category.gradient} text-white rounded-full text-sm font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {category.highlight}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="absolute bottom-4 left-4">
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <category.icon className="w-7 h-7 text-slate-800" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-amber-700 font-medium mb-3">
                        {category.subtitle}
                      </p>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {category.description}
                      </p>
                      
                      {/* Action Button */}
                      <div className="flex items-center text-amber-700 font-semibold group-hover:text-amber-800 transition-colors">
                        <span>View Menu</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Our Menu Stands Out
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every dish is crafted with passion and the finest ingredients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Star, title: "Fresh Daily", description: "Ingredients sourced fresh every morning" },
              { icon: Utensils, title: "Chef's Special", description: "Unique recipes from our master chef" },
              { icon: Wine, title: "Wine Pairing", description: "Expert wine selection for every dish" },
              { icon: Coffee, title: "Desserts", description: "Homemade desserts to complete your meal" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
