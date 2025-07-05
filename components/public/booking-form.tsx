"use client"

import React from "react"
import { useActionState } from "react"
import { createBooking } from "@/app/(public)/reserve/actions"
import { Button } from "@/components/ui/button"
import { CalendarIcon, User, Mail, Phone, Users, Clock, MessageSquare, Send, CheckCircle, AlertTriangle, Settings, ChevronUp, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"
import { FormattedDate } from "@/components/locale/formatted-date"
import { type BookingSettings } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { RestaurantInfo, RestaurantPhoneLink } from "@/components/locale/restaurant-info"

const initialState = {
  message: "",
  success: false,
}

export function BookingForm() {
  const [state, formAction, isPending] = useActionState(createBooking, initialState)
  const [date, setDate] = React.useState<Date>()
  const [selectedTime, setSelectedTime] = React.useState<string>("")
  const [partySize, setPartySize] = React.useState<number>(1)
  const [bookingSettings, setBookingSettings] = React.useState<BookingSettings | null>(null)

  // Load booking settings from API with simple polling (client-side only)
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('[DEBUG] Fetching booking settings from API...')
        const response = await fetch('/api/booking-settings')
        if (response.ok) {
          const settings = await response.json()
          console.log('[DEBUG] Booking settings loaded from Supabase via API:', settings)
          setBookingSettings(settings)
        } else {
          console.error('Failed to fetch booking settings')
        }
      } catch (error) {
        console.error('Error fetching booking settings:', error)
      }
    }

    // Initial load
    loadSettings()

    // Poll for settings changes every 30 seconds
    const interval = setInterval(loadSettings, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Reset form after successful submission
  React.useEffect(() => {
    if (state?.success) {
      setDate(undefined)
      setSelectedTime("")
      setPartySize(1)
      // Reset form inputs
      const form = document.querySelector('form') as HTMLFormElement
      if (form) {
        form.reset()
      }
    }
  }, [state?.success])

  // Show loading state
  if (!bookingSettings) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Settings className="w-5 h-5 animate-spin" />
            <span className="text-lg font-medium">Loading reservation system...</span>
          </div>
        </div>
      </div>
    )
  }

  // Check if bookings are suspended
  if (!bookingSettings.booking_enabled) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">Reservations Temporarily Suspended</h3>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              {bookingSettings.suspension_message}
            </p>
          </div>

          <Card className="bg-yellow-50 border-yellow-200 mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-yellow-800">
                <Phone className="w-5 h-5" />
                <span className="font-medium">
                  Call us directly: <RestaurantPhoneLink className="hover:text-yellow-900 transition-colors font-semibold">
                    <RestaurantInfo type="phone" fallback="020 8421 5550" />
                  </RestaurantPhoneLink>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const incrementPartySize = () => {
    if (partySize < bookingSettings.max_party_size) {
      setPartySize(partySize + 1)
    }
  }

  const decrementPartySize = () => {
    if (partySize > 1) {
      setPartySize(partySize - 1)
    }
  }

  return (
    <div className="relative isolate">
      <div className="text-center mb-10">
        <h3 className="text-4xl font-semibold text-gray-900 mb-4">Make a Reservation</h3>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Book your table now and experience exceptional dining. We'll confirm your reservation within 2 hours.
        </p>
      </div>

      {state?.success ? (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-2xl font-semibold text-gray-900">{state?.message}</h4>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-8 py-3 font-medium"
            >
              Make Another Reservation
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form action={formAction} className="space-y-8 relative">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <User className="w-5 h-5 text-yellow-600" />
                <h4 className="text-xl font-semibold text-gray-900">Personal Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-900 font-medium text-sm">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 relative"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-900 font-medium text-sm">
                    Email <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 relative"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-900 font-medium text-sm">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 relative"
                  />
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h4 className="text-xl font-semibold text-gray-900">Reservation Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-900 font-medium text-sm">
                    Party Size *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                    <input
                      id="partySize"
                      name="partySize"
                      type="text"
                      value={partySize}
                      readOnly
                      className="w-full pl-10 pr-16 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 relative"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col z-20">
                      <button
                        type="button"
                        onClick={incrementPartySize}
                        disabled={partySize >= bookingSettings.max_party_size}
                        className="p-1 hover:bg-yellow-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        type="button"
                        onClick={decrementPartySize}
                        disabled={partySize <= 1}
                        className="p-1 hover:bg-yellow-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-4 h-4 text-yellow-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    1 - {bookingSettings.max_party_size} guests
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-900 font-medium text-sm">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 relative",
                            !date && "text-gray-500",
                            date && "text-gray-900"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                          {date ? <FormattedDate date={date} fallback={format(date, "PPP", { locale: enGB })} /> : "Select date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-auto p-0 bg-white border border-gray-300 z-50" 
                        align="start"
                        side="bottom"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={enGB}
                          disabled={(day) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            
                            const maxDate = new Date()
                            maxDate.setDate(maxDate.getDate() + bookingSettings.max_advance_days)
                            maxDate.setHours(23, 59, 59, 999)
                            
                            if (day < today || day > maxDate) return true
                            
                            const dayOfWeek = day.getDay()
                            if (bookingSettings.closed_days_of_week?.includes(dayOfWeek)) return true
                            
                            const dateString = format(day, "yyyy-MM-dd")
                            if (bookingSettings.closed_dates?.includes(dateString)) return true
                            
                            return false
                          }}
                          className="text-gray-900"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      Up to {bookingSettings.max_advance_days} days in advance
                    </p>
                    {bookingSettings.closed_days_of_week && bookingSettings.closed_days_of_week.length > 0 && (
                      <p className="text-xs text-yellow-600">
                        ⚠️ {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                          .filter((_, index) => bookingSettings.closed_days_of_week?.includes(index))
                          .join(', ')} - Restaurant closed
                      </p>
                    )}
                  </div>
                  <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-gray-900 font-medium text-sm">
                  Preferred Time *
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {bookingSettings.available_times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "py-3 px-4 rounded-lg text-sm font-medium border transition-all duration-200 relative",
                          selectedTime === time
                            ? "bg-yellow-500 text-black border-yellow-500"
                            : "bg-gray-50 text-gray-900 border-gray-300 hover:border-yellow-300 hover:bg-yellow-50"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Available reservation times (kitchen closes at service end)
                  </p>
                </div>
                <input type="hidden" name="time" value={selectedTime} />
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
                <h4 className="text-xl font-semibold text-gray-900">Special Requests <span className="text-gray-600 font-normal text-base">(Optional)</span></h4>
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-500 z-10" />
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Dietary requirements, allergies, special occasions, seating preferences..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none relative"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isPending || !selectedTime || !date}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg relative z-10"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Confirming Reservation...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Confirm Reservation
                  </div>
                )}
              </Button>
            </div>

            {state?.message && !state?.success && !isPending && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg text-center font-medium">
                {state?.message}
              </div>
            )}
          </form>
        </div>
      )}

      <div className="text-center space-y-2 pt-8 border-t border-gray-200 mt-8">
        <p className="text-gray-700 text-sm">
          Your reservation will be confirmed within 2 hours via phone.
        </p>
        <p className="text-gray-600 text-xs">
          For same-day reservations or parties over {bookingSettings.max_party_size}, please call us directly at{' '}
          <RestaurantPhoneLink className="hover:text-gray-800 transition-colors font-medium text-gray-700">
            <RestaurantInfo type="phone" fallback="020 8421 5550" />
          </RestaurantPhoneLink>
        </p>
      </div>
    </div>
  )
}
