"use client"

import { menuData } from "@/lib/menu-data"
import { Utensils, Star, Crown, Sparkles, ChefHat, Wine } from "lucide-react"
import { useState } from "react"
import { FormattedPrice } from "@/components/locale/formatted-price"

const categoryIcons = {
  "Starters": Sparkles,
  "Main Course - Fish": Wine,
  "Main Course - Meat": Crown,
  "Main Course - Pasta": Utensils,
  "Salads": Star,
  "Side Orders": ChefHat,
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: '60vh', marginTop: '80px', paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Simplified Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-400" />
              <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                CULINARY EXCELLENCE
              </span>
              <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-400" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight">
              <span className="block text-white">DONA</span>
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                THERESA
              </span>
            </h1>
            
            <p className="text-2xl text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
              À La Carte Menu
            </p>
            
            <div className="text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              Experience our meticulously crafted dishes, each a symphony of flavors 
              that celebrates authentic Italian cuisine with modern innovation.
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories Navigation */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {menuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              return (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(activeCategory === section.category ? null : section.category)}
                  className={`group relative px-6 py-3 bg-zinc-900 rounded-xl border transition-colors duration-200 hover:border-amber-500 ${
                    activeCategory === section.category 
                      ? 'border-amber-500 bg-zinc-800' 
                      : 'border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-medium text-sm">{section.category}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

            {/* Menu Sections */}
      <section className="pb-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-16">
            {menuData.map((section) => {
              const IconComponent = categoryIcons[section.category as keyof typeof categoryIcons] || Utensils
              const isActive = activeCategory === null || activeCategory === section.category
              
              return (
                <div
                  key={section.category}
                  className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                >
                  <div className="bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden">
                    {/* Section Header */}
                    <div className="p-8 border-b border-zinc-700">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <IconComponent className="w-6 h-6 text-amber-400" />
                          <span className="text-sm tracking-[0.3em] text-zinc-400 font-light uppercase">
                            {section.category}
                          </span>
                        </div>
                        
                        <h2 className="text-4xl sm:text-5xl font-bold text-white">
                  {section.category}
                </h2>

                {section.note && (
                          <p className="text-zinc-400 italic text-lg">{section.note}</p>
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-8">
                      <div className="space-y-6">
                        {section.items.map((item) => (
                          <div
                            key={item.name}
                            className="group p-6 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-750 transition-all duration-200"
                          >
                            <div className="flex justify-between items-start gap-4 mb-3">
                              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                                {item.name}
                              </h3>
                              <div className="text-2xl font-bold text-amber-400 shrink-0">
                                <FormattedPrice price={item.price} fallback={item.price} />
                              </div>
                            </div>
                            
                      {item.description && (
                              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                {item.description}
                              </p>
                      )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer Information */}
      <section className="py-20 relative">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-8 sm:p-12">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <span className="text-sm tracking-[0.3em] text-zinc-400 font-light">
                  IMPORTANT INFORMATION
                </span>
              </div>

              <div className="space-y-4 text-zinc-300 text-center">
                <p>All fish and meat main courses served with potatoes and two vegetables.</p>
                <p>Gluten free pasta also available.</p>
                <p>(V) Denotes vegetarian dish.</p>
                <p>If you have any food allergies please inform the waiter when ordering.</p>
                <p className="text-amber-300 font-semibold">
                  10% Service Charge will be added to your bill.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
