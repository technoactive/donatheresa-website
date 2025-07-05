"use client"

import React from "react"
import { useActionState } from "react"
import { createBooking } from "@/app/(public)/reserve/actions"
import { Button } from "@/components/ui/button"
import { CalendarIcon, User, Mail, Phone, Users, Clock, MessageSquare, Send, CheckCircle, AlertTriangle, Settings } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { enGB } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
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
      <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 p-8 space-y-8 rounded-3xl">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-zinc-400">
            <Settings className="w-5 h-5 animate-spin" />
            Loading booking system...
          </div>
        </div>
      </div>
    )
  }

  // Check if bookings are suspended
  if (!bookingSettings.booking_enabled) {
    return (
      <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 p-8 space-y-8 rounded-3xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 rounded-full flex items-center justify-center border border-amber-400/30">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">Bookings Temporarily Suspended</h3>
            <p className="text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              {bookingSettings.suspension_message}
            </p>
          </div>

                      <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/10 border-amber-400/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-amber-300">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">
                    Call us directly: <RestaurantPhoneLink className="hover:text-amber-200 transition-colors">
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

  return (
    <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 p-8 space-y-8 rounded-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-2">Complete Your Reservation</h3>
        <p className="text-zinc-300">Fill in your details below and we'll confirm within 2 hours</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {state?.success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-white">{state?.message}</h4>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl px-8 py-3"
            >
              Make Another Reservation
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            className="space-y-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <label className="block text-white font-medium text-sm tracking-wide">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <label className="block text-white font-medium text-sm tracking-wide">
                    Email <span className="text-zinc-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Phone Number */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <label className="block text-white font-medium text-sm tracking-wide">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                  />
                </div>
              </motion.div>
            </div>

            {/* Reservation Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Party Size */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <label className="block text-white font-medium text-sm tracking-wide">
                    Party Size *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                    <input
                      id="partySize"
                      name="partySize"
                      type="number"
                      min={1}
                      max={bookingSettings.max_party_size}
                      placeholder="1"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                    />
                  </div>
                  <p className="text-xs text-zinc-400">
                    1 - {bookingSettings.max_party_size} guests
                  </p>
                </motion.div>

                {/* Date */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <label className="block text-white font-medium text-sm tracking-wide">
                    Preferred Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-left transition-all duration-300 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
                          !date && "text-zinc-500",
                          date && "text-white"
                        )}
                      >
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                        {date ? <FormattedDate date={date} fallback={format(date, "PPP", { locale: enGB })} /> : "Select date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={enGB}
                        disabled={(day) => {
                          // Note: For proper timezone handling, we should use restaurant timezone
                          // However, calendar component runs client-side, so we use browser timezone
                          // Server-side validation will use restaurant timezone for accuracy
                          
                          // Normalize today to midnight for accurate date comparison
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          
                          const maxDate = new Date()
                          maxDate.setDate(maxDate.getDate() + bookingSettings.max_advance_days)
                          maxDate.setHours(23, 59, 59, 999)
                          
                          // Disable past dates (before today) and dates beyond max advance days
                          if (day < today || day > maxDate) return true
                          
                          // Disable weekly closure days (0 = Sunday, 1 = Monday, etc.)
                          const dayOfWeek = day.getDay()
                          if (bookingSettings.closed_days_of_week?.includes(dayOfWeek)) return true
                          
                          // Disable specific closed dates
                          const dateString = format(day, "yyyy-MM-dd")
                          if (bookingSettings.closed_dates?.includes(dateString)) return true
                          
                          return false
                        }}
                        className="bg-zinc-900 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-400">
                      Up to {bookingSettings.max_advance_days} days in advance
                    </p>
                    {bookingSettings.closed_days_of_week && bookingSettings.closed_days_of_week.length > 0 && (
                      <p className="text-xs text-amber-400">
                        ⚠️ {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                          .filter((_, index) => bookingSettings.closed_days_of_week?.includes(index))
                          .join(', ')} - Restaurant closed
                      </p>
                    )}
                  </div>
                  <input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
                </motion.div>
              </div>

              {/* Time Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <label className="block text-white font-medium text-sm tracking-wide">
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
                          "py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 border",
                          selectedTime === time
                            ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-amber-500 shadow-lg"
                            : "bg-zinc-900/50 text-zinc-300 border-zinc-700/50 hover:border-amber-400/50 hover:bg-zinc-800/50"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Times shown are available booking slots (kitchen stops taking orders at closing time)
                  </p>
                </div>
                <input type="hidden" name="time" value={selectedTime} />
              </motion.div>
            </div>

            {/* Special Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <label className="block text-white font-medium text-sm tracking-wide">
                Special Requests <span className="text-zinc-500">(Optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-amber-400" />
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Dietary restrictions, special occasions, seating preferences..."
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl resize-none"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isPending || !selectedTime || !date}
                className="w-full py-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Reservation...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Confirm Reservation
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Error Messages */}
            {state?.message && !state?.success && !isPending && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-900/50 text-amber-300 border border-amber-700/50 p-4 rounded-xl text-center font-medium"
              >
                {state?.message}
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center space-y-2 pt-6 border-t border-zinc-600/50"
      >
        <p className="text-zinc-300 text-sm">
          Your reservation will be confirmed within 2 hours via phone.
        </p>
        <p className="text-zinc-400 text-xs">
          For same-day bookings or groups over {bookingSettings.max_party_size}, please call us directly at{' '}
          <RestaurantPhoneLink className="hover:text-zinc-300 transition-colors">
            <RestaurantInfo type="phone" fallback="020 8421 5550" />
          </RestaurantPhoneLink>
        </p>
      </motion.div>
    </div>
  )
}
