"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Crown, Clock, ArrowRight, Utensils, Heart, Flower2, Sparkles, Star, Phone, Calendar, Wine, ChefHat, Grape } from "lucide-react"
import { useEffect, useState } from "react"

// All menus with beautiful gradient designs
const allMenus = [
  {
    id: "valentines-day",
    title: "Valentine's Day",
    subtitle: "14th February 2026",
    description: "Romantic 3-course dinner in a candlelit atmosphere for you and your special someone",
    price: "£39.95",
    priceNote: "per person",
    serviceCharge: "+ 10% service",
    icon: Heart,
    link: "/menu/valentines-day",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 via-pink-50/80 to-rose-50",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
    accentColor: "rose",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    hoverShadow: "hover:shadow-rose-200/50",
    features: ["3 Courses", "11 Starters", "11 Mains", "8 Desserts"],
    badge: "Special Event",
    badgeColor: "bg-rose-500",
  },
  {
    id: "mothers-day",
    title: "Mother's Day",
    subtitle: "22nd March 2026",
    description: "Celebrate Mum with a delicious 3-course Italian feast the whole family will enjoy",
    price: "£32.95",
    priceNote: "per person",
    serviceCharge: "+ 10% service",
    icon: Flower2,
    link: "/menu/mothers-day",
    gradient: "from-pink-500 to-fuchsia-500",
    bgGradient: "from-pink-50 via-fuchsia-50/80 to-pink-50",
    iconBg: "bg-gradient-to-br from-pink-500 to-fuchsia-500",
    accentColor: "pink",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
    hoverShadow: "hover:shadow-pink-200/50",
    features: ["3 Courses", "12 Starters", "11 Mains", "8 Desserts"],
    badge: "Special Event",
    badgeColor: "bg-pink-500",
  },
  {
    id: "a-la-carte",
    title: "À La Carte",
    subtitle: "Our Signature Collection",
    description: "Experience our full range of carefully crafted authentic Italian dishes, from classic starters to premium mains",
    price: null,
    priceNote: null,
    serviceCharge: null,
    icon: Crown,
    link: "/menu/a-la-carte",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 via-orange-50/80 to-amber-50",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    accentColor: "amber",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    hoverShadow: "hover:shadow-amber-200/50",
    features: ["Antipasti", "Pasta & Risotto", "Meat & Fish", "Dolci"],
    badge: "Premium",
    badgeColor: "bg-amber-500",
  },
  {
    id: "lunchtime-earlybird",
    title: "Lunch & Early Bird",
    subtitle: "Exceptional Value",
    description: "Enjoy our popular 2-course menu at an incredible price, available Tuesday to Sunday",
    price: "£19.95",
    priceNote: "2 courses",
    serviceCharge: null,
    icon: Clock,
    link: "/menu/lunchtime-earlybird",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 via-teal-50/80 to-emerald-50",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    accentColor: "emerald",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    hoverShadow: "hover:shadow-emerald-200/50",
    features: ["Tue-Sun", "12pm-3pm", "5pm-7pm", "Great Value"],
    badge: "Best Value",
    badgeColor: "bg-emerald-500",
  },
  {
    id: "wine-drinks",
    title: "Wine & Drinks",
    subtitle: "50+ Fine Selections",
    description: "Explore our extensive wine list featuring Italian classics, French champagnes, craft cocktails and more",
    price: null,
    priceNote: null,
    serviceCharge: null,
    icon: Grape,
    link: "/menu/wine-drinks",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 via-indigo-50/80 to-purple-50",
    iconBg: "bg-gradient-to-br from-purple-500 to-indigo-500",
    accentColor: "purple",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    hoverShadow: "hover:shadow-purple-200/50",
    features: ["White Wine", "Red Wine", "Cocktails", "Spirits"],
    badge: "Wine List",
    badgeColor: "bg-purple-500",
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
      <section className="relative overflow-hidden pt-36 sm:pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-24">
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
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 sm:px-5 py-2 rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/90 text-xs sm:text-sm font-medium">Authentic Italian Since 2011</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-white">Our</span>
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Menus
            </span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            From special celebrations to everyday dining, discover the perfect menu for your occasion
          </p>

          {/* Quick stats */}
          <div className="flex justify-center gap-6 sm:gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">100+</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">5</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Menus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Wines</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:flex">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* All Menus Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 text-amber-600 mb-3 sm:mb-4">
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Choose Your Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Explore Our Menus
            </h2>
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
              Each menu is thoughtfully designed to offer a unique culinary journey through authentic Italian cuisine
            </p>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            {allMenus.map((menu) => (
              <Link key={menu.id} href={menu.link} className="group block">
                <div className={`relative h-full bg-gradient-to-br ${menu.bgGradient} rounded-3xl overflow-hidden border ${menu.borderColor} shadow-lg hover:shadow-2xl ${menu.hoverShadow} transition-all duration-500 hover:-translate-y-2`}>
                  {/* Decorative background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-white/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-white/40 to-transparent rounded-full translate-y-1/3 -translate-x-1/4" />
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                  </div>

                  <div className="relative p-5 sm:p-8 md:p-10">
                    {/* Top Row - Badge and Icon */}
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      {/* Badge */}
                      <div className={`${menu.badgeColor} text-white text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg`}>
                        {menu.badge}
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 ${menu.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <menu.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill={menu.id === 'valentines-day' || menu.id === 'mothers-day' ? 'currentColor' : 'none'} />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className={`${menu.textColor} font-medium text-xs sm:text-sm mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2`}>
                      {(menu.id === 'mothers-day' || menu.id === 'valentines-day') && (
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      {menu.subtitle}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-slate-900 transition-colors">
                      {menu.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                      {menu.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                      {menu.features.map((feature, idx) => (
                        <span key={idx} className="text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 bg-white/70 backdrop-blur-sm text-slate-700 rounded-full shadow-sm">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-end justify-between pt-4 border-t border-white/50">
                      <div>
                        {menu.price ? (
                          <>
                            <span className="text-2xl sm:text-4xl font-bold text-slate-800">{menu.price}</span>
                            <span className="text-slate-500 text-xs sm:text-sm ml-1 sm:ml-2">{menu.priceNote}</span>
                            {menu.serviceCharge && (
                              <div className={`${menu.textColor} text-xs mt-1`}>{menu.serviceCharge}</div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Wine className={`w-4 h-4 sm:w-5 sm:h-5 ${menu.textColor}`} />
                            <span className={`${menu.textColor} font-semibold text-sm sm:text-base`}>Full Selection</span>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 sm:gap-2 ${menu.textColor} font-semibold text-sm sm:text-base group-hover:gap-3 sm:group-hover:gap-4 transition-all duration-300`}>
                        <span>View</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Why Dine With Us
            </h2>
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Every dish tells a story of tradition, passion, and the finest ingredients
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: "🍅", title: "Fresh Daily", description: "Ingredients sourced every morning" },
              { icon: "👨‍🍳", title: "Expert Chefs", description: "Authentic Italian recipes" },
              { icon: "🍷", title: "Fine Wines", description: "50+ Italian selections" },
              { icon: "⭐", title: "Since 2011", description: "Award-winning cuisine" }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Experience<br />Authentic Italian Cuisine?
          </h2>
          <p className="text-base sm:text-xl text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Book your table now and let us create an unforgettable dining experience for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-white text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full shadow-xl shadow-amber-500/30"
            >
              <Link href="/reserve">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Reserve a Table
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full"
            >
              <a href="tel:02084215550">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                020 8421 5550
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
