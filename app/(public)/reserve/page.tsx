"use client"

import { BookingForm } from "@/components/public/booking-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, MapPin, Phone, Star, Heart, Utensils, Crown, CheckCircle, Award, Sparkles } from "lucide-react"

export default function ReservePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header Section */}
      <section className="relative py-16 md:py-24 mt-16 md:mt-20 bg-gradient-to-b from-slate-50 via-white to-gray-50 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.5)_1px,_transparent_0)] bg-[length:24px_24px]" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="space-y-6 md:space-y-8">
            {/* Elegant badge */}
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-gray-700 tracking-wide uppercase">
                Reserve Your Table
              </span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight">
                <span className="block">Book Your</span>
                <span className="block mt-2 md:mt-0">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-medium" style={{lineHeight: '1.2', paddingBottom: '0.1em'}}>
                    Perfect Evening
                  </span>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Experience London's most exquisite dining destination. Reserve your table now and let us create 
                an unforgettable culinary journey just for you.
              </p>
            </div>

            {/* Restaurant highlights */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 pt-6 md:pt-8 px-4">
              <div className="flex items-center gap-2 text-gray-700 bg-white/60 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full border border-gray-200">
                <Heart className="w-3 md:w-4 h-3 md:h-4 text-amber-500" />
                <span className="text-xs md:text-sm font-medium">Family Owned</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-white/60 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full border border-gray-200">
                <Star className="w-3 md:w-4 h-3 md:h-4 text-amber-500" />
                <span className="text-xs md:text-sm font-medium">4.9★ Rating</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-white/60 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full border border-gray-200">
                <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-amber-500" />
                <span className="text-xs md:text-sm font-medium">Premium Service</span>
              </div>
            </div>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-12 md:mt-16 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 md:w-5 h-4 md:h-5 text-amber-600" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs md:text-sm text-gray-500">Location</div>
                <div className="font-medium text-sm md:text-base">451 Uxbridge Rd, Pinner</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 md:w-5 h-4 md:h-5 text-amber-600" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs md:text-sm text-gray-500">Reservations</div>
                <div className="font-medium text-sm md:text-base">020 8421 5550</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 md:w-5 h-4 md:h-5 text-amber-600" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs md:text-sm text-gray-500">Hours</div>
                <div className="font-medium text-sm md:text-base">Tue-Sun 12:00-23:00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Form Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Enhanced form container */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 lg:p-12 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-bl from-amber-50 to-transparent rounded-full -translate-y-32 md:-translate-y-48 translate-x-32 md:translate-x-48 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-32 md:translate-y-48 -translate-x-32 md:-translate-x-48 opacity-50" />
            
            <div className="relative z-10">
              <BookingForm />
            </div>
          </div>

          {/* Enhanced Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-20">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Star className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">4.9★</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Guest Rating</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Heart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">98%</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Return Rate</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Users className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">2-12</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Party Size</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Calendar className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">30</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Days Ahead</div>
              </div>
            </div>
          </div>

          {/* Special Occasions Card */}
          <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl md:rounded-3xl p-6 md:p-10 mt-16 md:mt-20 text-center border border-amber-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-2xl md:rounded-3xl" />
            <div className="relative z-10">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl">
                <Crown className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              <h4 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Celebrating Something Special?</h4>
              <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                Planning a romantic dinner, anniversary, or milestone celebration? Let us create 
                a bespoke experience with our private dining rooms and curated wine pairings.
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Arrange Private Dining
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Features */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              The Dona Theresa Difference
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 md:mb-6 px-4">
              Every Detail <span className="text-amber-500 font-medium">Perfected</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience our signature hospitality and meticulous attention to every aspect of your dining journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="group">
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-64 md:h-72 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Flexible Reservations</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">Complimentary rescheduling and cancellation with 24-hour notice. Your plans matter to us.</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-64 md:h-72 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Intimate Gatherings</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">Perfect for couples to groups of 12, with dedicated service and personalized attention.</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-64 md:h-72 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Curated Dining</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">Seasonal menu with expertly paired wines and our signature amuse-bouche welcome.</p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-64 md:h-72 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Crown className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Premium Service</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">White-glove service with sommelier recommendations and personalized dining experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Contact Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-bl from-amber-100 to-transparent rounded-full -translate-y-24 md:-translate-y-32 translate-x-24 md:translate-x-32 opacity-60" />
            <div className="relative z-10">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg">
                <Phone className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-4 md:mb-6 px-4">
                Questions About Your <span className="text-amber-500 font-medium">Reservation?</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed px-4">
                Our dedicated concierge team is here to ensure your dining experience exceeds every expectation. 
                We're available to assist with special requests, dietary accommodations, and event planning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  <Phone className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Call 020 8421 5550
                </Button>
                
                <Button
                  variant="outline"
                  asChild
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <Link href="/menu">
                    <Utensils className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    View Our Menu
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}