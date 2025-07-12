"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Crown, Wine, Coffee, Star, Utensils, Calendar, Clock, Heart, Sparkles, ChefHat, ArrowRight } from "lucide-react"
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
    id: "wine-list",
    title: "Wine Collection",
    subtitle: "Curated selections",
    description: "Discover our extensive wine collection featuring exceptional vintages from renowned Italian vineyards",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop&crop=center",
    icon: Wine,
    highlight: "Premium Wines",
    link: "/menu/wine-list",
    gradient: "from-purple-500 to-red-500",
    bgGradient: "from-purple-50 to-red-50",
  },
  {
    id: "desserts",
    title: "Dolci & Coffee",
    subtitle: "Sweet endings",
    description: "Indulge in our artisanal desserts and premium coffee selection, the perfect finale to your meal",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&crop=center",
    icon: Coffee,
    highlight: "Artisan Desserts",
    link: "/menu/desserts",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
  },
]

const specialExperiences = [
  {
    title: "Chef's Tasting Menu",
    description: "A seven-course journey through our finest creations",
    price: "£85 per person",
    icon: ChefHat,
    features: ["7 Courses", "Wine Pairing Available", "Chef's Selection"],
    gradient: "from-slate-600 to-slate-800",
  },
  {
    title: "Romantic Evening",
    description: "Perfect for special occasions and intimate celebrations",
    price: "£120 for two",
    icon: Heart,
    features: ["3 Courses Each", "Bottle of Prosecco", "Special Table Setting"],
    gradient: "from-red-600 to-rose-800",
  },
  {
    title: "Business Lunch",
    description: "Express menu designed for the working professional",
    price: "£28 per person",
    icon: Calendar,
    features: ["2 Courses", "Express Service", "Available 12-3pm"],
    gradient: "from-blue-600 to-indigo-800",
  },
]

export default function MenuOverviewPage() {
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/20" style={{ minHeight: '80vh' }}>
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
          
          {/* Floating Sparkles */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-amber-400/20 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [10, -15, 10],
              x: [5, -5, 5],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute top-3/4 right-1/3 w-3 h-3 bg-yellow-400/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [-5, 20, -5],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-orange-400/25 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 py-16"
          >
            {/* Main Title */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-amber-200/50 text-slate-700 px-8 py-4 rounded-full text-sm font-medium shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="tracking-[0.2em] uppercase">Culinary Collection</span>
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
              </motion.div>
              
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tight">
                <span className="block text-slate-900">OUR</span>
                <span className="block bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  MENUS
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-2xl md:text-3xl text-slate-600 font-light leading-relaxed">
                  Discover Exceptional Dining Experiences
                </p>
                
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
                
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
                  From our signature à la carte selections to carefully curated wine pairings, 
                  explore the full spectrum of Italian culinary artistry at Dona Theresa.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center gap-3 text-amber-600 group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">50+ Dishes</div>
                  <div className="text-sm text-slate-600">Authentic Recipes</div>
                </div>
              </motion.div>
              
              <div className="w-px h-16 bg-slate-300 hidden sm:block"></div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex items-center gap-3 text-amber-600 group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Wine className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">120+ Wines</div>
                  <div className="text-sm text-slate-600">Premium Selection</div>
                </div>
              </motion.div>
              
              <div className="w-px h-16 bg-slate-300 hidden sm:block"></div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex items-center gap-3 text-amber-600 group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">13 Years</div>
                  <div className="text-sm text-slate-600">Excellence</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Menu Categories */}
      <section id="menu-categories" className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-sm tracking-[0.3em] text-slate-600 font-light uppercase">
                Menu Collection
              </span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Culinary Experiences
            </h2>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Each menu tells a story of passion, tradition, and innovation, 
              carefully crafted to create unforgettable dining moments.
            </p>
          </div>

          {/* Menu Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {menuCategories.map((menu, index) => {
              const IconComponent = menu.icon
              return (
                <div
                  key={menu.id}
                  className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={menu.image}
                      alt={menu.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6">
                      <div className={`bg-gradient-to-r ${menu.gradient} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}>
                        {menu.highlight}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute top-6 right-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                        {menu.subtitle}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors duration-300">
                        {menu.title}
                      </h3>
                      
                      <p className="text-slate-600 leading-relaxed">
                        {menu.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${menu.gradient} hover:shadow-lg transition-all duration-300 group-hover:scale-105 text-white rounded-2xl py-6 text-lg font-medium`}
                    >
                      <Link href={menu.link} className="flex items-center justify-center gap-2">
                        <span>Explore Menu</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Special Experiences */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-br from-amber-100/30 to-orange-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-100/20 to-amber-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-sm tracking-[0.3em] text-slate-600 font-light uppercase">
                Special Occasions
              </span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Curated Experiences
            </h2>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Specially designed dining experiences for life's most important moments, 
              each thoughtfully crafted to create lasting memories.
            </p>
          </div>

          {/* Experience Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {specialExperiences.map((experience, index) => {
              const IconComponent = experience.icon
              return (
                <div
                  key={experience.title}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${experience.gradient} rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full`}>
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-2xl font-bold leading-tight">
                        {experience.title}
                      </h3>
                      
                      <p className="text-white/90 leading-relaxed">
                        {experience.description}
                      </p>
                      
                      <div className="text-2xl font-bold text-amber-300">
                        {experience.price}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {experience.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-white/90">
                          <div className="w-1.5 h-1.5 bg-amber-300 rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 rounded-2xl py-3 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Link href="/reserve" className="flex items-center justify-center gap-2">
                        <span>Reserve Experience</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-yellow-100/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-100/15 to-amber-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 md:p-16">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-6 py-3 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="tracking-[0.2em] uppercase">Ready to Dine?</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight pb-2">
                  Ready to Begin Your
                  <span className="block bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Culinary Journey?
                  </span>
                </h2>
                
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Reserve your table today and let us create an extraordinary dining experience 
                  that celebrates the finest Italian culinary traditions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  asChild
                  className="group px-10 py-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <Link href="/reserve" className="flex items-center gap-3">
                    <span>Reserve Your Table</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-3 text-amber-600">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">020 8866 3117</div>
                    <div className="text-sm text-slate-600">Open Tuesday - Sunday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 