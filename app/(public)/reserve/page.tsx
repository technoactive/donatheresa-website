import { Metadata } from "next"
import { BookingForm } from "@/components/public/booking-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, Users, Phone, Star, Heart, Utensils, Crown, Sparkles } from "lucide-react"
import { getBookingSettings } from "@/lib/database"
import { Suspense } from "react"

// Force dynamic rendering and disable all caching
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: "Book Table | Dona Theresa Italian Restaurant Pinner",
  description: "📅 Book your table now! Lunch £19.95 • Dinner Tue-Sun • FREE parking • Instant confirmation. ☎️ 020 8421 5550",
  keywords: [
    "restaurants near me booking",
    "italian restaurant near me reserve",
    "best restaurants pinner booking",
    "best restaurants hatch end booking",
    "restaurants pinner reserve",
    "restaurants hatch end book table",
    "dona theresa booking",
    "donna teresa reservations",
    "italian pinner booking",
    "italian hatch end reserve",
    "lunch booking pinner",
    "lunch reservations hatch end",
    "places to eat pinner booking",
    "restaurant booking uxbridge road"
  ],
  openGraph: {
    title: "Book Table Online | Dona Theresa Italian Restaurant Pinner",
    description: "Reserve your table at Dona Theresa. Online booking 24/7. Lunch specials £19.95. Authentic Italian dining in Hatch End.",
    type: "website",
    locale: "en_GB",
    url: "https://donatheresa.co.uk/reserve",
    siteName: "Dona Theresa Restaurant",
    images: [
      {
        url: "https://donatheresa.co.uk/og-reserve.jpg",
        width: 1200,
        height: 630,
        alt: "Book a table at Dona Theresa Italian Restaurant"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Online | Dona Theresa Italian Restaurant Pinner",
    description: "Quick & easy table booking at Dona Theresa. Lunch £19.95. Open Tue-Sun. Book now for tonight!",
    images: ["https://donatheresa.co.uk/og-reserve.jpg"]
  },
  alternates: {
    canonical: "https://donatheresa.co.uk/reserve"
  }
}

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
                <BookingForm bookingSettings={bookingSettings} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Hero/Info Section with enhanced visuals */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center bg-amber-50 text-amber-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium mb-4 md:mb-6 shadow-sm">
              <Sparkles className="w-4 md:w-5 h-4 md:h-5 mr-2" />
              Reserve Your Experience
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Book Your Table at
              <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-2">
                Dona Theresa
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for an unforgettable dining experience where traditional Italian 
              cuisine meets contemporary elegance in the heart of Hatch End, Pinner
            </p>
          </div>

          {/* Stats Grid with enhanced styling */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            <Suspense fallback={
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            }>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-shadow h-32 md:h-40 flex flex-col justify-between">
                <Heart className="w-10 md:w-12 h-10 md:h-12 text-red-500 mx-auto flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">4.9</div>
                  <div className="text-xs md:text-sm text-gray-600">Guest Rating</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-shadow h-32 md:h-40 flex flex-col justify-between">
                <Users className="w-10 md:w-12 h-10 md:h-12 text-blue-600 mx-auto flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{bookingSettings.total_seats}</div>
                  <div className="text-xs md:text-sm text-gray-600">Seats Available</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-shadow h-32 md:h-40 flex flex-col justify-between">
                <Utensils className="w-10 md:w-12 h-10 md:h-12 text-amber-600 mx-auto flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">12+</div>
                  <div className="text-xs md:text-sm text-gray-600">Years of Excellence</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-gray-100 shadow-lg hover:shadow-xl transition-shadow h-32 md:h-40 flex flex-col justify-between">
                <Crown className="w-10 md:w-12 h-10 md:h-12 text-purple-600 mx-auto flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">VIP</div>
                  <div className="text-xs md:text-sm text-gray-600">Experience</div>
                </div>
              </div>
            </Suspense>
          </div>

          {/* Features Grid with icons */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 md:w-10 h-8 md:h-10 text-amber-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-sm md:text-base text-gray-600">Reserve your table online in seconds with instant confirmation</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-8 md:w-10 h-8 md:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Flexible Times</h3>
              <p className="text-sm md:text-base text-gray-600">Lunch and dinner service with multiple time slots available</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-8 md:w-10 h-8 md:h-10 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-sm md:text-base text-gray-600">Call us directly at 020 8421 5550 for special requests</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Need Help with Your Reservation?
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
            Our team is here to assist you with special requests, group bookings, or any questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild className="border-amber-600 text-amber-700 hover:bg-amber-50">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
            <Button size="lg" asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
              <a href="tel:+442084215550">
                <Phone className="w-5 h-5 mr-2" />
                Call 020 8421 5550
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}