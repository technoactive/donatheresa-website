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
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-28">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
        </div>
        
        {/* Floating Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-10">
            {/* Premium Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white/95 backdrop-blur-md border-0 shadow-xl px-8 py-3 rounded-full">
                  <div className="flex items-center space-x-2">
                    <Wine className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium tracking-wide text-slate-800">Authentic Italian Cuisine</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Heading */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-slate-900">Discover Our</span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-500 blur-xl opacity-30"></span>
                    <span className="relative bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                      Exquisite Menus
                    </span>
                  </span>
                </span>
              </h1>

              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                Savor authentic Italian flavors through our carefully selected dishes, 
                each prepared with dedication and served with genuine Italian hospitality
              </p>
            </motion.div>

            {/* Premium CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white shadow-2xl transition-all duration-300 px-10 py-7 text-lg rounded-full"
                onClick={() => document.getElementById('menu-categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <Utensils className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Our Menus
                </span>
              </Button>
                
              <Button 
                variant="outline" 
                size="lg" 
                className="group border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-10 py-7 text-lg rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/reserve">
                  <Clock className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Reserve Your Table
                </Link>
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100+</div>
                <div className="text-sm text-slate-600 mt-1">Authentic Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">50+</div>
                <div className="text-sm text-slate-600 mt-1">Italian Wines</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">Since 2011</div>
                <div className="text-sm text-slate-600 mt-1">Serving Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>

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
