"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Crown, Wine, Clock, ArrowRight, Utensils, Heart, Flower2 } from "lucide-react"
import { useEffect, useState } from "react"

const menuCategories = [
  {
    id: "mothers-day",
    title: "Mother's Day",
    subtitle: "22nd March 2026",
    description: "Celebrate Mum with a delicious 3-course Italian feast the whole family will enjoy",
    image: "/hero-main.png",
    icon: Flower2,
    highlight: "£32.95 per person",
    link: "/menu/mothers-day",
    gradient: "from-pink-500 to-fuchsia-500",
    bgColor: "bg-pink-50",
  },
  {
    id: "valentines-day",
    title: "Valentine's Day",
    subtitle: "14th February 2026",
    description: "Celebrate love with a romantic 3-course Italian dinner in a candlelit atmosphere",
    image: "/valentines-romantic.jpg",
    icon: Heart,
    highlight: "£39.95 per person",
    link: "/menu/valentines-day",
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
  },
  {
    id: "a-la-carte",
    title: "À La Carte Menu",
    subtitle: "Our signature collection",
    description: "Experience our full range of carefully crafted dishes, from exquisite starters to premium main courses",
    image: "/dish-filleto-rossini.png",
    icon: Crown,
    highlight: "Signature Dishes",
    link: "/menu/a-la-carte",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
  },
  {
    id: "lunchtime-earlybird",
    title: "Lunchtime & Early Bird",
    subtitle: "Exceptional value",
    description: "2 course menu at £19.95, available Tuesday-Sunday for lunch and early dinner",
    image: "/pasta-carbonara.jpg",
    icon: Clock,
    highlight: "£19.95 - 2 Courses",
    link: "/menu/lunchtime-earlybird",
    gradient: "from-amber-500 to-yellow-500",
    bgColor: "bg-yellow-50",
  },
]

// Lightweight fade-in animation component
function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

export default function MenuPageClient() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Auto-scroll to menu categories on mobile only
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        const menuSection = document.getElementById('menu-categories')
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Optimized Hero Section */}
      <section className="relative overflow-hidden pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-28 contain-paint">
        {/* Simplified Background - No heavy animations on mobile */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50"></div>
          {/* Simple pattern without SVG data URL */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(30deg,#f0f0f0_12%,transparent_12.5%,transparent_87%,#f0f0f0_87.5%,#f0f0f0),linear-gradient(150deg,#f0f0f0_12%,transparent_12.5%,transparent_87%,#f0f0f0_87.5%,#f0f0f0),linear-gradient(30deg,#f0f0f0_12%,transparent_12.5%,transparent_87%,#f0f0f0_87.5%,#f0f0f0),linear-gradient(150deg,#f0f0f0_12%,transparent_12.5%,transparent_87%,#f0f0f0_87.5%,#f0f0f0)] bg-[20px_20px]"></div>
        </div>
        
        {/* Animated blobs only on desktop */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200 rounded-full filter blur-xl opacity-10"></div>
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full filter blur-xl opacity-10"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-10">
            {/* Simplified Badge */}
            <FadeIn>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="bg-white/95 backdrop-blur-sm border border-amber-100 shadow-lg px-8 py-3 rounded-full">
                    <div className="flex items-center space-x-2">
                      <Wine className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium tracking-wide text-slate-800">Authentic Italian Cuisine</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Simplified Heading */}
            <FadeIn delay={2}>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="block text-slate-900">Discover Our</span>
                  <span className="block mt-2 text-amber-600">
                    Exquisite Menus
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                  Savor authentic Italian flavors through our carefully selected dishes, 
                  each prepared with dedication and served with genuine Italian hospitality
                </p>
              </div>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Button 
                  size="lg" 
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all duration-300 px-10 py-7 text-lg rounded-full"
                  onClick={() => document.getElementById('menu-categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Utensils className="w-5 h-5 mr-3" />
                  Explore Our Menus
                </Button>
                  
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-10 py-7 text-lg rounded-full transition-all duration-300"
                  asChild
                >
                  <Link href="/reserve">
                    <Clock className="w-5 h-5 mr-3" />
                    Reserve Your Table
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Quick Stats - Simplified */}
            <FadeIn delay={6}>
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
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
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Menu Categories Section - Optimized */}
      <section id="menu-categories" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Each menu is thoughtfully designed to offer a unique culinary journey
            </p>
          </div>

          {/* Menu Cards Grid - Optimized */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {menuCategories.map((category, index) => (
              <div
                key={category.id}
                className="group transform transition-transform duration-300 hover:-translate-y-2"
              >
                <Link href={category.link} className="block h-full">
                  <div className={`relative h-full ${category.bgColor} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100 contain-paint`}>
                    {/* Image Container - Optimized */}
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading={index === 0 ? "eager" : "lazy"} // First image loads eager
                        priority={index === 0} // First image has priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-4 py-2 bg-gradient-to-r ${category.gradient} text-white rounded-full text-sm font-semibold shadow-lg`}>
                          {category.highlight}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="absolute bottom-4 left-4">
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
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
                        <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Features Section - Simplified */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Our Menu Stands Out
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every dish is crafted with passion and the finest ingredients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "⭐", title: "Fresh Daily", description: "Ingredients sourced fresh every morning" },
              { icon: "🍴", title: "Chef's Special", description: "Unique recipes from our master chef" },
              { icon: "🍷", title: "Wine Pairing", description: "Expert wine selection for every dish" },
              { icon: "☕", title: "Desserts", description: "Homemade desserts to complete your meal" }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}