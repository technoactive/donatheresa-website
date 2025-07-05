"use client"

import { BookingForm } from "@/components/public/booking-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, MapPin, Phone, Star, Heart, Utensils, Crown } from "lucide-react"

export default function ReservePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Mobile-Optimized Header */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden mt-16 sm:mt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-10" />
          <Image
            src="/gallery-table-setting.png"
            alt="Elegant table setting"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
              <span className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-zinc-400 font-light">
                MAKE RESERVATION
              </span>
              <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-amber-500 to-yellow-500" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
              <span className="block text-white">BOOK YOUR</span>
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                TABLE
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto px-2">
              Secure your seat at London's most exclusive dining destination. 
              Complete the form below and we'll confirm within 2 hours.
            </p>
          </div>

          {/* Mobile-Optimized Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-zinc-300">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">451 Uxbridge Rd, Pinner</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-zinc-300">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">020 8421 5550</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-zinc-300">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Tue-Sun 12:00-23:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Reservation Form */}
      <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />
        
        {/* Form Highlight Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full bg-gradient-to-r from-amber-500/5 via-yellow-500/10 to-amber-500/5 blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Mobile-Optimized Booking Form */}
          <div className="bg-gradient-to-br from-white/95 to-zinc-100/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-amber-200/50 overflow-hidden mb-8 sm:mb-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-yellow-50/20" />
            <div className="relative z-10">
              <BookingForm />
            </div>
          </div>

          {/* Mobile-Optimized Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="bg-gradient-to-br from-white/10 to-zinc-100/5 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200/30 text-center">
              <Star className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-bold text-white">4.9★</div>
              <div className="text-xs text-zinc-300">Rating</div>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-zinc-100/5 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200/30 text-center">
              <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-bold text-white">98%</div>
              <div className="text-xs text-zinc-300">Return Rate</div>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-zinc-100/5 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200/30 text-center">
              <Users className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-bold text-white">2-12</div>
              <div className="text-xs text-zinc-300">Party Size</div>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-zinc-100/5 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200/30 text-center">
              <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-lg font-bold text-white">30</div>
              <div className="text-xs text-zinc-300">Days Ahead</div>
            </div>
          </div>

          {/* Mobile-Optimized Special Occasions */}
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-amber-400/50 text-center">
            <Crown className="w-6 sm:w-8 h-6 sm:h-8 text-amber-400 mx-auto mb-3 sm:mb-4" />
            <h4 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4">Special Occasions?</h4>
            <p className="text-sm sm:text-base text-zinc-200 mb-4 sm:mb-6 leading-relaxed px-2">
              Celebrating something special? Call us to discuss custom arrangements, 
              private dining, or our exclusive chef's table experience.
            </p>
            <Button className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base transition-colors duration-300">
              Call for Special Arrangements
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Features */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                Why Choose Dona Theresa
              </span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto px-4">
              Every reservation includes exclusive benefits and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700/40 text-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-lg sm:rounded-xl w-fit mx-auto mb-3 sm:mb-4 border border-amber-400/30">
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Flexible Booking</h3>
              <p className="text-xs sm:text-sm text-zinc-400">Easy rescheduling and cancellation options</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700/40 text-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-lg sm:rounded-xl w-fit mx-auto mb-3 sm:mb-4 border border-amber-400/30">
                <Users className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Group Dining</h3>
              <p className="text-xs sm:text-sm text-zinc-400">Perfect for celebrations up to 12 guests</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700/40 text-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-lg sm:rounded-xl w-fit mx-auto mb-3 sm:mb-4 border border-amber-400/30">
                <Utensils className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Curated Experience</h3>
              <p className="text-xs sm:text-sm text-zinc-400">Signature welcome and personalized service</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-700/40 text-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-lg sm:rounded-xl w-fit mx-auto mb-3 sm:mb-4 border border-amber-400/30">
                <Crown className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Premium Service</h3>
              <p className="text-xs sm:text-sm text-zinc-400">Dedicated staff for perfect dining experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Call to Action */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-950/10 to-black" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-white">Questions about your</span>
              <span className="block bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Reservation?
              </span>
            </h2>
            
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed px-4">
              Our team is here to help make your dining experience perfect.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-full text-sm sm:text-base font-medium transition-colors duration-300">
                Call 020 8421 5550
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="px-6 sm:px-8 py-3 sm:py-4 border-zinc-600 hover:border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full text-sm sm:text-base font-medium transition-colors duration-300"
              >
                <Link href="/menu">
                  View Our Menu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}