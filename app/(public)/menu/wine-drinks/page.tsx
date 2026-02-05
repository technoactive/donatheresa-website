"use client"

import { 
  whiteWines, roseWines, redWines, sparklingWines,
  softDrinks, beerAndCider, bottledWater,
  liqueurs, houseSpirits, premiumSpirits, aperitifs, otherSpirits, mixers,
  specialCocktails, otherCocktails, proseccoCocktails, mocktails
} from "@/lib/wine-drinks-menu-data"
import { Wine, Grape, Sparkles, Beer, GlassWater, Martini, Coffee, Phone, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

type TabType = "wines" | "drinks" | "cocktails"

export default function WineDrinksMenuPage() {
  const [activeTab, setActiveTab] = useState<TabType>("wines")

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-36 sm:pt-32 md:pt-36 lg:pt-40 pb-16 md:pb-20 overflow-hidden">
        {/* Dark elegant background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Decorative wine glass pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 sm:px-5 py-2 rounded-full mb-6 sm:mb-8">
            <Wine className="w-4 h-4 text-purple-400" />
            <span className="text-white/90 text-xs sm:text-sm font-medium">50+ Italian & World Wines</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-white">Wine &</span>
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-purple-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              Drinks
            </span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            From fine Italian wines to handcrafted cocktails, discover the perfect accompaniment for your meal
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab("wines")}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === "wines"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <span className="flex items-center gap-2">
                <Grape className="w-4 h-4" />
                Wines
              </span>
            </button>
            <button
              onClick={() => setActiveTab("drinks")}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === "drinks"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <span className="flex items-center gap-2">
                <Beer className="w-4 h-4" />
                Drinks
              </span>
            </button>
            <button
              onClick={() => setActiveTab("cocktails")}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === "cocktails"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <span className="flex items-center gap-2">
                <Martini className="w-4 h-4" />
                Cocktails
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Wines Tab Content */}
      {activeTab === "wines" && (
        <section className="py-12 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* White Wines */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-green-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wine className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-green-600">White Wine</h2>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-green-300" />
              </div>
              
              <div className="space-y-4">
                {whiteWines.map((wine, index) => (
                  <div key={index} className="bg-white rounded-xl border border-green-100 p-4 sm:p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base">{index + 1}. {wine.name}</h3>
                          {wine.tags?.map((tag, i) => (
                            <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <p className="text-green-600 text-xs sm:text-sm font-medium mb-2">{wine.origin}</p>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{wine.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">£{wine.bottlePrice}</div>
                        {wine.glassPrices && (
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            {wine.glassPrices.small && <div>125ml Glass £{wine.glassPrices.small}</div>}
                            {wine.glassPrices.medium && <div>175ml Glass £{wine.glassPrices.medium}</div>}
                            {wine.glassPrices.large && <div>250ml Glass £{wine.glassPrices.large}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rosé Wines */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-pink-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wine className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-pink-600">Rosé Wine</h2>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-pink-300" />
              </div>
              
              <div className="space-y-4">
                {roseWines.map((wine, index) => (
                  <div key={index} className="bg-white rounded-xl border border-pink-100 p-4 sm:p-6 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1">{index + 11}. {wine.name}</h3>
                        <p className="text-pink-600 text-xs sm:text-sm font-medium mb-2">{wine.origin}</p>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{wine.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-pink-600">£{wine.bottlePrice}</div>
                        {wine.glassPrices && (
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            {wine.glassPrices.small && <div>125ml Glass £{wine.glassPrices.small}</div>}
                            {wine.glassPrices.medium && <div>175ml Glass £{wine.glassPrices.medium}</div>}
                            {wine.glassPrices.large && <div>250ml Glass £{wine.glassPrices.large}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Wines */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-red-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wine className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-red-700">Red Wine</h2>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-red-300" />
              </div>
              
              <div className="space-y-4">
                {redWines.map((wine, index) => (
                  <div key={index} className="bg-white rounded-xl border border-red-100 p-4 sm:p-6 hover:border-red-300 hover:shadow-lg hover:shadow-red-50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1">{index + 13}. {wine.name}</h3>
                        <p className="text-red-700 text-xs sm:text-sm font-medium mb-2">{wine.origin}</p>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{wine.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-red-700">£{wine.bottlePrice}</div>
                        {wine.glassPrices && (
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            {wine.glassPrices.small && <div>125ml Glass £{wine.glassPrices.small}</div>}
                            {wine.glassPrices.medium && <div>175ml Glass £{wine.glassPrices.medium}</div>}
                            {wine.glassPrices.large && <div>250ml Glass £{wine.glassPrices.large}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sparkling & Champagne */}
            <div>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-amber-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-600">Sparkling & Champagne</h2>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-amber-300" />
              </div>
              
              <div className="space-y-4">
                {sparklingWines.map((wine, index) => (
                  <div key={index} className="bg-white rounded-xl border border-amber-100 p-4 sm:p-6 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1">{index + 25}. {wine.name}</h3>
                        <p className="text-amber-600 text-xs sm:text-sm font-medium mb-2">{wine.origin}</p>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{wine.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-amber-600">£{wine.bottlePrice}</div>
                        {wine.glassPrices && (
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            {wine.glassPrices.small && <div>125ml Glass £{wine.glassPrices.small}</div>}
                            {wine.glassPrices.medium && <div>175ml Glass £{wine.glassPrices.medium}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Drinks Tab Content */}
      {activeTab === "drinks" && (
        <section className="py-12 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Soft Drinks */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-slate-300" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-700">Soft Drinks - £{softDrinks.price}</h2>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-slate-300" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-slate-600">
                  {softDrinks.items.map((item, index) => (
                    <span key={index} className="bg-slate-50 px-3 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Beer & Cider */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-amber-300" />
                <div className="flex items-center gap-2">
                  <Beer className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-700">Beer & Cider</h2>
                </div>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-amber-300" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {beerAndCider.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">{item.name}</h3>
                        {item.description && <p className="text-slate-500 text-xs mt-1">{item.description}</p>}
                      </div>
                      {item.price && <span className="text-amber-600 font-bold">£{item.price}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottled Water */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-blue-300" />
                <div className="flex items-center gap-2">
                  <GlassWater className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-700">Bottled Water & Juices</h2>
                </div>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-blue-300" />
              </div>
              <div className="space-y-3">
                {bottledWater.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-blue-100 p-4 hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">{item.name}</h3>
                        {item.description && <p className="text-slate-500 text-xs mt-1">{item.description}</p>}
                      </div>
                      {item.price && <span className="text-blue-600 font-bold">£{item.price}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spirits Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Liqueurs */}
              <div className="bg-white rounded-xl border border-purple-100 p-5">
                <h3 className="font-bold text-purple-700 text-lg mb-1">Liqueurs - {liqueurs.size}</h3>
                <p className="text-2xl font-bold text-purple-600 mb-3">£{liqueurs.price}</p>
                <div className="flex flex-wrap gap-1.5">
                  {liqueurs.items.map((item, index) => (
                    <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">{item}</span>
                  ))}
                </div>
              </div>

              {/* House Spirits */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-700 text-lg mb-1">House Spirits - {houseSpirits.size}</h3>
                <p className="text-2xl font-bold text-slate-600 mb-3">£{houseSpirits.price}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {houseSpirits.items.map((item, index) => (
                    <span key={index} className="text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded">{item}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500">{houseSpirits.extras[0]}</p>
              </div>

              {/* Premium Spirits */}
              <div className="bg-white rounded-xl border border-amber-100 p-5">
                <h3 className="font-bold text-amber-700 text-lg mb-1">Premium Spirits - {premiumSpirits.size}</h3>
                <p className="text-2xl font-bold text-amber-600 mb-3">£{premiumSpirits.price}</p>
                <div className="flex flex-wrap gap-1.5">
                  {premiumSpirits.items.map((item, index) => (
                    <span key={index} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Aperitifs */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-orange-300" />
                <h2 className="text-xl sm:text-2xl font-bold text-orange-700">Aperitif - 50ml</h2>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-orange-300" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {aperitifs.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-orange-100 p-3 text-center hover:border-orange-200 transition-all">
                    <h3 className="font-semibold text-slate-800 text-sm">{item.name}</h3>
                    <span className="text-orange-600 font-bold text-sm">£{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Spirits */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-slate-300" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-700">Other World Spirits - {otherSpirits.size} £{otherSpirits.price}</h2>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-slate-300" />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-slate-600">
                  {otherSpirits.items.map((item, index) => (
                    <span key={index} className="bg-slate-50 px-3 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mixers */}
            <div className="text-center">
              <div className="inline-block bg-slate-100 rounded-full px-6 py-3">
                <span className="font-semibold text-slate-700">Mixers - £{mixers.price}</span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Cocktails Tab Content */}
      {activeTab === "cocktails" && (
        <section className="py-12 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Special Cocktails */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-slate-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Martini className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Special Cocktails</h2>
                  <p className="text-slate-500 mt-1">£10.50 each</p>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-slate-300" />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {specialCocktails.map((cocktail, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{cocktail.name}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">{cocktail.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Cocktails */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-slate-300" />
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Other Cocktails</h2>
                  <p className="text-slate-500 mt-1">£7.50 each</p>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-slate-300" />
              </div>
              
              <div className="grid sm:grid-cols-3 gap-3">
                {otherCocktails.map((cocktail, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all text-center">
                    <h3 className="font-bold text-slate-800 text-sm">{cocktail.name}</h3>
                    <p className="text-slate-500 text-xs mt-1">{cocktail.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prosecco Cocktails */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-amber-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-700">Prosecco Cocktails</h2>
                  <p className="text-amber-600 mt-1">£9.95 each</p>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-amber-300" />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {proseccoCocktails.map((cocktail, index) => (
                  <div key={index} className="bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-300 hover:shadow-md hover:shadow-amber-50 transition-all">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{cocktail.name}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">{cocktail.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mocktails */}
            <div>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-pink-300" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-pink-700">Mocktails</h2>
                  <p className="text-pink-600 mt-1">Non Alcoholic - £6.95 each</p>
                </div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-pink-300" />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {mocktails.map((cocktail, index) => (
                  <div key={index} className="bg-white rounded-xl border border-pink-100 p-4 hover:border-pink-300 hover:shadow-md hover:shadow-pink-50 transition-all">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{cocktail.name}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">{cocktail.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-rose-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Wine className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pair Your Wine with<br />Authentic Italian Cuisine
          </h2>
          
          <p className="text-base sm:text-xl text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Our knowledgeable staff will help you find the perfect wine to complement your meal
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100 text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full font-semibold shadow-2xl"
            >
              <Link href="/reserve">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Reserve a Table
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full font-semibold"
            >
              <a href="tel:02084215550">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                020 8421 5550
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-white/60 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>451 Uxbridge Road, Hatch End</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Tue-Sun 12pm-10pm</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
