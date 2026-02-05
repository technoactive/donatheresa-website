"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Crown, Clock, ArrowRight, Utensils, Heart, Flower2, Sparkles, Star, Phone, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

// Special event menus (seasonal/promotional)
const specialMenus = [
  {
    id: "mothers-day",
    title: "Mother's Day",
    date: "22nd March 2026",
    description: "Celebrate Mum with a delicious 3-course Italian feast",
    price: "£32.95",
    priceNote: "per person",
    icon: Flower2,
    link: "/menu/mothers-day",
    gradient: "from-pink-500 to-fuchsia-500",
    bgGradient: "from-pink-50 via-fuchsia-50 to-pink-50",
    accentColor: "pink",
    features: ["3 Courses", "12 Starters", "11 Mains", "8 Desserts"],
  },
  {
    id: "valentines-day",
    title: "Valentine's Day",
    date: "14th February 2026",
    description: "Romantic 3-course dinner in a candlelit atmosphere",
    price: "£39.95",
    priceNote: "per person",
    icon: Heart,
    link: "/menu/valentines-day",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 via-pink-50 to-rose-50",
    accentColor: "rose",
    features: ["3 Courses", "11 Starters", "11 Mains", "8 Desserts"],
  },
]

// Regular menus
const regularMenus = [
  {
    id: "a-la-carte",
    title: "À La Carte",
    subtitle: "Our Signature Collection",
    description: "Experience our full range of carefully crafted authentic Italian dishes",
    image: "/dish-filleto-rossini.png",
    icon: Crown,
    highlight: "Premium Selection",
    link: "/menu/a-la-carte",
    features: ["Starters", "Pasta", "Meat & Fish", "Desserts"],
  },
  {
    id: "lunchtime-earlybird",
    title: "Lunch & Early Bird",
    subtitle: "Exceptional Value",
    description: "2 courses at £19.95, available Tuesday-Sunday",
    image: "/pasta-carbonara.jpg",
    icon: Clock,
    highlight: "£19.95 for 2 Courses",
    link: "/menu/lunchtime-earlybird",
    features: ["Tue-Sun", "12-3pm & 5-7pm", "Great Value"],
  },
]

export default function MenuPageClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Elegant Hero Section */}
      <section className="relative overflow-hidden pt-28 md:pt-32 lg:pt-40 pb-16 md:pb-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/90 text-sm font-medium">Authentic Italian Cuisine Since 2011</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Our</span>
            <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Menus
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            From special celebrations to everyday dining, discover the perfect menu for your occasion
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100+</div>
              <div className="text-white/60 text-sm mt-1">Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">4</div>
              <div className="text-white/60 text-sm mt-1">Unique Menus</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-white/60 text-sm mt-1">Italian Wines</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Special Event Menus */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-amber-600 mb-4">
              <Star className="w-5 h-5 fill-amber-600" />
              <span className="text-sm font-semibold uppercase tracking-wider">Special Occasions</span>
              <Star className="w-5 h-5 fill-amber-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Celebration Menus
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Make your special moments unforgettable with our curated celebration menus
            </p>
          </div>

          {/* Special Menu Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {specialMenus.map((menu) => (
              <Link key={menu.id} href={menu.link} className="group block">
                <div className={`relative h-full bg-gradient-to-br ${menu.bgGradient} rounded-3xl overflow-hidden border border-${menu.accentColor}-100 shadow-lg hover:shadow-2xl hover:shadow-${menu.accentColor}-100/50 transition-all duration-500 hover:-translate-y-2`}>
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
                  </div>

                  <div className="relative p-8 md:p-10">
                    {/* Date Badge */}
                    <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm`}>
                      <Calendar className={`w-4 h-4 text-${menu.accentColor}-500`} />
                      <span className={`text-${menu.accentColor}-600 text-sm font-semibold`}>{menu.date}</span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${menu.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <menu.icon className="w-8 h-8 text-white" fill="currentColor" />
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-slate-800 mb-3">
                      {menu.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {menu.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {menu.features.map((feature, idx) => (
                        <span key={idx} className={`text-xs font-medium px-3 py-1 bg-white/60 text-slate-700 rounded-full`}>
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-4xl font-bold text-slate-800">{menu.price}</span>
                        <span className="text-slate-500 text-sm ml-2">{menu.priceNote}</span>
                        <div className={`text-${menu.accentColor}-500 text-xs mt-1`}>+ 10% service</div>
                      </div>
                      <div className={`flex items-center gap-2 text-${menu.accentColor}-600 font-semibold group-hover:gap-4 transition-all duration-300`}>
                        <span>View Menu</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Menus */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-slate-500 mb-4">
              <Utensils className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Everyday Dining</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Regular Menus
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Authentic Italian flavors for every occasion
            </p>
          </div>

          {/* Regular Menu Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {regularMenus.map((menu, index) => (
              <Link key={menu.id} href={menu.link} className="group block">
                <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={menu.image}
                      alt={menu.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    
                    {/* Highlight Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold shadow-lg">
                        {menu.highlight}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <menu.icon className="w-7 h-7 text-amber-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="text-amber-600 font-medium text-sm mb-2">{menu.subtitle}</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-amber-700 transition-colors">
                      {menu.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {menu.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {menu.features.map((feature, idx) => (
                        <span key={idx} className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                      <span>View Full Menu</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience<br />Authentic Italian Cuisine?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Book your table now and let us create an unforgettable dining experience for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-10 py-7 rounded-full shadow-xl shadow-amber-500/30"
            >
              <Link href="/reserve">
                <Calendar className="w-5 h-5 mr-2" />
                Reserve a Table
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-lg px-10 py-7 rounded-full"
            >
              <a href="tel:02084215550">
                <Phone className="w-5 h-5 mr-2" />
                020 8421 5550
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
