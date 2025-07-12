import { BookingForm } from "@/components/public/booking-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, Users, Phone, Star, Heart, Utensils, Crown, Sparkles } from "lucide-react"
import { getBookingSettings } from "@/lib/database"
import { Suspense } from "react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Skeleton loader component for stats
function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg h-32 md:h-40 flex flex-col justify-between animate-pulse">
      <div className="w-10 md:w-12 h-10 md:h-12 bg-gray-200 rounded-lg md:rounded-xl mx-auto" />
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-6 md:h-8 bg-gray-200 rounded mb-2 w-16 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
      </div>
    </div>
  )
}

export default async function ReservePage() {
  // Fetch booking settings from database
  const bookingSettings = await getBookingSettings()
  
  return (
    <div className="bg-white min-h-screen">
      {/* Main Booking Form Section */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Enhanced form container with fixed min-height to prevent shifts */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 lg:p-12 relative overflow-hidden min-h-[600px] md:min-h-[700px]">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-bl from-amber-50 to-transparent rounded-full -translate-y-32 md:-translate-y-48 translate-x-32 md:translate-x-48 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-32 md:translate-y-48 -translate-x-32 md:-translate-x-48 opacity-50" />
            
            <div className="relative z-10">
              <Suspense fallback={
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-full w-40 mx-auto mb-6" />
                  <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-8" />
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                </div>
              }>
                <BookingForm />
              </Suspense>
            </div>
          </div>

          {/* Enhanced Statistics with proper loading states */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-20">
            <Suspense fallback={<StatSkeleton />}>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Star className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">4.9★</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Guest Rating</div>
                </div>
              </div>
            </Suspense>
            
            <Suspense fallback={<StatSkeleton />}>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Heart className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">98%</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Return Rate</div>
                </div>
              </div>
            </Suspense>
            
            <Suspense fallback={<StatSkeleton />}>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Users className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">1-{bookingSettings.max_party_size || 8}</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Party Size</div>
                </div>
              </div>
            </Suspense>
            
            <Suspense fallback={<StatSkeleton />}>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-32 md:h-40 flex flex-col justify-between">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Calendar className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{bookingSettings.max_advance_days || 30}</div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">Days Ahead</div>
                </div>
              </div>
            </Suspense>
          </div>

          {/* Special Occasions Card with fixed height */}
          <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl md:rounded-3xl p-6 md:p-10 mt-16 md:mt-20 text-center border border-amber-200 relative overflow-hidden min-h-[400px] md:min-h-[450px]">
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

      {/* Experience Features with fixed heights */}
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
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">Perfect for couples to groups of {bookingSettings.max_party_size || 8}, with dedicated service and personalized attention.</p>
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

      {/* Final Contact Section with fixed height */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 relative overflow-hidden min-h-[450px] md:min-h-[500px]">
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