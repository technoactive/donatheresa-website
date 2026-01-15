"use client"

import { valentinesMenuData, valentinesMenuDetails, valentinesMenuNotes } from "@/lib/valentines-menu-data"
import { Heart, Calendar, Clock, Sparkles, Star, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function ValentinesDayMenuPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Romantic Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 pt-20" style={{ minHeight: '75vh' }}>
        {/* Floating Hearts Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-6 h-6 text-rose-200 animate-pulse">❤️</div>
          <div className="absolute top-40 right-20 w-8 h-8 text-rose-200 animate-pulse delay-75">💕</div>
          <div className="absolute bottom-40 left-1/4 w-5 h-5 text-rose-200 animate-pulse delay-150">💗</div>
          <div className="absolute top-1/3 right-1/3 w-7 h-7 text-rose-200 animate-pulse delay-300">💖</div>
          <div className="absolute bottom-20 right-10 w-6 h-6 text-rose-200 animate-pulse delay-500">❤️</div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-rose-200/40 to-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-red-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[75vh]">
          <div className="text-center space-y-8 py-16">
            {/* Romantic Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-700 px-8 py-4 rounded-full text-sm font-medium shadow-lg">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span className="tracking-[0.15em] uppercase">Valentine's Day 2026</span>
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  An Evening of
                </span>
                <br />
                <span className="text-slate-800">Romance</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Celebrate love with an unforgettable Italian dining experience
              </p>
            </div>

            {/* Price & Date */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-rose-100">
                <div className="text-4xl font-bold text-rose-600">£{valentinesMenuDetails.price}</div>
                <div className="text-sm text-slate-600">{valentinesMenuDetails.priceNote}</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-rose-100">
                <div className="flex items-center gap-2 text-slate-800">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  <span className="font-semibold">{valentinesMenuDetails.dates}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{valentinesMenuDetails.times}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-lg px-8 shadow-lg">
                <Link href="/reserve">
                  <Heart className="w-5 h-5 mr-2" />
                  Book Your Table
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-50 text-lg px-8">
                <a href="tel:02084215550">
                  Call 020 8421 5550
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Your <span className="text-rose-600">Valentine's Experience</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="text-center p-6 bg-rose-50 rounded-2xl">
              <Sparkles className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="font-semibold text-slate-800">3-Course Dinner</p>
            </div>
            <div className="text-center p-6 bg-rose-50 rounded-2xl">
              <Flame className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="font-semibold text-slate-800">Candlelit Atmosphere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="py-16 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Valentine's Day Menu
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Choose one dish from each course
          </p>

          {/* Starters */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Starters</h3>
            </div>
            <div className="space-y-4">
              {valentinesMenuData.starters.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-slate-600 mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {item.dietary.map((d, i) => (
                        <span key={i} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Courses */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Main Courses</h3>
            </div>
            <div className="space-y-4">
              {valentinesMenuData.mains.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-slate-600 mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {item.dietary.map((d, i) => (
                        <span key={i} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desserts */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Desserts</h3>
            </div>
            <div className="space-y-4">
              {valentinesMenuData.desserts.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-slate-600 mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {item.dietary.map((d, i) => (
                        <span key={i} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-rose-50 rounded-2xl p-6 border border-rose-200">
            <h4 className="font-semibold text-slate-800 mb-3">Please Note</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {valentinesMenuNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 fill-white/20" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Make This Valentine's Day Unforgettable
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Limited tables available. Book now to secure your romantic evening at Dona Theresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-rose-600 hover:bg-rose-50 text-lg px-8">
              <Link href="/reserve">
                <Heart className="w-5 h-5 mr-2 fill-rose-600" />
                Reserve Your Table
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
              <a href="tel:02084215550">
                Call 020 8421 5550
              </a>
            </Button>
          </div>
          <p className="mt-6 text-white/70 text-sm">
            {valentinesMenuDetails.note}
          </p>
        </div>
      </section>
    </div>
  )
}
