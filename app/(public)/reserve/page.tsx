"use client"

import { BookingForm } from "@/components/public/booking-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, MapPin, Phone, Star, Heart, Utensils, Crown } from "lucide-react"

export default function ReservePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Clean Header without background image */}
      <section className="py-20 mt-20 bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-yellow-500" />
              <span className="text-sm tracking-widest text-yellow-400 font-semibold uppercase">
                Make Reservation
              </span>
              <div className="w-12 h-px bg-yellow-500" />
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-light text-white">
              <span className="block">Book Your</span>
              <span className="block text-yellow-400 font-medium">Table</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Reserve your place at London's most distinguished dining destination. 
              Complete the form below and receive confirmation within 2 hours.
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="flex items-center justify-center gap-3 text-white bg-zinc-800/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-700">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">451 Uxbridge Rd, Pinner</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white bg-zinc-800/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-700">
              <Phone className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">020 8421 5550</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white bg-zinc-800/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-700">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">Tue-Sun 12:00-23:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section - HIGHLY VISIBLE WHITE FORM */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* BRIGHT WHITE FORM CONTAINER WITH YELLOW BORDER - MAXIMUM VISIBILITY */}
          <div className="bg-white rounded-2xl border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20 p-8 lg:p-12">
            <BookingForm />
          </div>

          {/* Stats with better backgrounds */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-6 text-center border border-zinc-700/50 shadow-xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-sm text-gray-400">Guest Rating</div>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-6 text-center border border-zinc-700/50 shadow-xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-black" />
              </div>
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-400">Return Rate</div>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-6 text-center border border-zinc-700/50 shadow-xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div className="text-2xl font-bold text-white">2-12</div>
              <div className="text-sm text-gray-400">Party Size</div>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-6 text-center border border-zinc-700/50 shadow-xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div className="text-2xl font-bold text-white">30</div>
              <div className="text-sm text-gray-400">Days Ahead</div>
            </div>
          </div>

          {/* Special Occasions with better background */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-black/80 backdrop-blur-sm rounded-xl p-8 mt-16 text-center border-2 border-yellow-500/50 shadow-xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h4 className="text-2xl font-semibold text-white mb-4">Celebrating Something Special?</h4>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Planning a romantic dinner, anniversary, or milestone celebration? Let us create 
              a bespoke experience with our private dining rooms and curated wine pairings.
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Arrange Private Dining
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us with textured background */}
      <section className="py-20 bg-gradient-to-br from-black via-zinc-950 to-black relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgba(234,179,8,0.3)_1px,_transparent_0)] bg-[length:40px_40px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-white mb-6">
              The <span className="text-yellow-400 font-medium">Dona Theresa</span> Experience
            </h2>
            <p className="text-lg text-gray-300">
              Every reservation includes our signature hospitality and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 backdrop-blur-sm rounded-lg p-8 text-center border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Flexible Reservations</h3>
              <p className="text-gray-400">Complimentary rescheduling and cancellation with 24-hour notice</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 backdrop-blur-sm rounded-lg p-8 text-center border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Intimate Gatherings</h3>
              <p className="text-gray-400">Perfect for couples to groups of 12, with dedicated service</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 backdrop-blur-sm rounded-lg p-8 text-center border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Utensils className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Curated Dining</h3>
              <p className="text-gray-400">Seasonal menu with wine pairings and signature amuse-bouche</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 backdrop-blur-sm rounded-lg p-8 text-center border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Premium Service</h3>
              <p className="text-gray-400">White-glove service with sommelier recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with elegant background */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-light text-white mb-6">
            Questions About Your <span className="text-yellow-400 font-medium">Reservation?</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Our concierge team is available to ensure your dining experience exceeds expectations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Call 020 8421 5550
            </Button>
            
            <Button
              variant="outline"
              asChild
              className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black rounded-lg px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link href="/menu">
                View Menu
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}