"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useActionState, useEffect, useMemo } from "react"
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Plus, Minus, Loader2 } from "lucide-react"
import { createBooking, getBookingSettingsForClient } from "@/app/(public)/reserve/actions"
import { format, addDays, isBefore, startOfDay, parse } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { SubmitButton } from "@/components/public/submit-button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import type { BookingSettings } from "@/lib/database"

type FormState = {
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
  description?: string
  bookingId?: string
}

// Loading skeleton for the form
function BookingFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
      <div className="h-12 bg-gray-200 rounded" />
    </div>
  )
}

export function BookingForm() {
  const router = useRouter()
  const [state, formAction] = useActionState<FormState, FormData>(createBooking, {})
  const [isLoading, setIsLoading] = useState(true)
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [partySize, setPartySize] = useState(2)
  const [isFormValid, setIsFormValid] = useState(false)

  // Load booking settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await getBookingSettingsForClient()
        if (result.success && result.settings) {
          setBookingSettings(result.settings)
        }
      } catch (error) {
        console.error("Failed to load booking settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Define the booking form schema based on settings
  const bookingFormSchema = useMemo(() => z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.union([
      z.string().email({
        message: "Please enter a valid email address.",
      }),
      z.string().length(0),
    ]).transform(val => val || undefined).optional(),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number.",
    }).regex(/^[\d\s\-\+\(\)]+$/, {
      message: "Phone number can only contain numbers, spaces, dashes, and parentheses.",
    }),
    date: z.string().min(1, {
      message: "Please select a date.",
    }),
    time: z.string().min(1, {
      message: "Please select a time.",
    }),
    partySize: z.number().min(1).max(bookingSettings?.max_party_size || 8, {
      message: `Party size must be between 1 and ${bookingSettings?.max_party_size || 8}.`,
    }),
    notes: z.string().optional(),
  }), [bookingSettings])

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      partySize: 2,
      notes: "",
    },
  })

  // Watch form values for validation
  const watchedValues = form.watch()
  
  useEffect(() => {
    const isValid = watchedValues.name && watchedValues.phone && watchedValues.date && watchedValues.time
    setIsFormValid(!!isValid)
  }, [watchedValues])

  // Handle success redirect
  useEffect(() => {
    if (state?.success && state?.bookingId) {
      const timer = setTimeout(() => {
        router.push('/')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state?.success, state?.bookingId, router])

  const disabledDates = useMemo(() => {
    if (!bookingSettings) return []
    
    const dates: Date[] = []
    
    // Add closed dates
    bookingSettings.closed_dates?.forEach(dateStr => {
      dates.push(new Date(dateStr))
    })
    
    // Add dates beyond max advance days
    const maxDate = addDays(new Date(), bookingSettings.max_advance_days)
    const futureDate = addDays(maxDate, 1)
    const endDate = addDays(maxDate, 365) // Add many future dates to ensure they're disabled
    
    for (let d = futureDate; isBefore(d, endDate); d = addDays(d, 1)) {
      dates.push(new Date(d))
    }
    
    return dates
  }, [bookingSettings])

  const disabledDaysOfWeek = useMemo(() => {
    return bookingSettings?.closed_days_of_week || []
  }, [bookingSettings])

  const getAvailableTimesForDate = (date: Date) => {
    if (!bookingSettings) return []
    
    const dayOfWeek = date.getDay()
    if (disabledDaysOfWeek.includes(dayOfWeek)) {
      return []
    }
    
    const dateStr = format(date, 'yyyy-MM-dd')
    if (bookingSettings.closed_dates?.includes(dateStr)) {
      return []
    }
    
    const today = startOfDay(new Date())
    const selectedDay = startOfDay(date)
    
    if (isBefore(selectedDay, today)) {
      return []
    }
    
    if (selectedDay.getTime() === today.getTime()) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      
      return bookingSettings.available_times.filter(timeStr => {
        const time = parse(timeStr, 'HH:mm', new Date())
        const timeInMinutes = time.getHours() * 60 + time.getMinutes()
        return timeInMinutes > currentTime + 30
      })
    }
    
    return bookingSettings.available_times
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      form.setValue("date", format(date, "yyyy-MM-dd"))
      setSelectedTime("")
      form.setValue("time", "")
    } else {
      form.setValue("date", "")
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    form.setValue("time", time)
  }

  const incrementPartySize = () => {
    const maxSize = bookingSettings?.max_party_size || 8
    if (partySize < maxSize) {
      const newSize = partySize + 1
      setPartySize(newSize)
      form.setValue("partySize", newSize)
    }
  }

  const decrementPartySize = () => {
    if (partySize > 1) {
      const newSize = partySize - 1
      setPartySize(newSize)
      form.setValue("partySize", newSize)
    }
  }

  // Show loading skeleton while settings load
  if (isLoading) {
    return <BookingFormSkeleton />
  }

  // Show maintenance message if booking is disabled
  if (bookingSettings && !bookingSettings.booking_enabled) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Booking Temporarily Unavailable</h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {bookingSettings.suspension_message || "Online booking is currently suspended. Please call us at 020 8421 5550 to make a reservation."}
        </p>
      </div>
    )
  }

  return (
    <div className="relative isolate">
      {/* Header section with fixed height */}
      <div className="text-center mb-8 md:mb-12 min-h-[200px]">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
          <Calendar className="w-3 md:w-4 h-3 md:h-4" />
          Secure Reservation
        </div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 md:mb-6">
          Reserve Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-medium">Table</span>
        </h3>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
          Complete the form below and your reservation will be confirmed instantly. 
          Our team is dedicated to making your dining experience exceptional.
        </p>
      </div>

      {/* Success message */}
      {state?.success && state?.bookingId && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold mb-1">{state.message}</div>
            <div>{state.description}</div>
            <div className="mt-2 text-sm text-green-700">Redirecting to home page in 5 seconds...</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {state?.message && !state?.success && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-semibold">{state.message}</div>
            {state.description && <div className="mt-1">{state.description}</div>}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Form {...form}>
        <form action={formAction} className="space-y-6">
          {/* Contact Information with fixed min-height */}
          <div className="space-y-6 min-h-[180px]">
            <div className="space-y-1">
              <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" />
                Contact Information
              </h4>
              <p className="text-sm text-gray-600">We'll use this to confirm your reservation</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      {...field} 
                      className="h-12 text-base bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      Email (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        {...field} 
                        className="h-12 text-base bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Phone Number *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="020 1234 5678" 
                        {...field} 
                        className="h-12 text-base bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Reservation Details with fixed min-height */}
          <div className="space-y-6 pt-8 border-t border-gray-200 min-h-[220px]">
            <div className="space-y-1">
              <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                Reservation Details
              </h4>
              <p className="text-sm text-gray-600">Select your preferred date and time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Date *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 text-base justify-start text-left font-normal bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-amber-500",
                              !selectedDate && "text-gray-500"
                            )}
                          >
                            {selectedDate ? (
                              format(selectedDate, "EEE, dd MMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => {
                            const today = startOfDay(new Date())
                            const selectedDay = startOfDay(date)
                            const maxDate = bookingSettings ? addDays(today, bookingSettings.max_advance_days) : addDays(today, 30)
                            
                            return (
                              isBefore(selectedDay, today) ||
                              selectedDay > maxDate ||
                              disabledDates.some(d => d.toDateString() === date.toDateString()) ||
                              disabledDaysOfWeek.includes(date.getDay())
                            )
                          }}
                          initialFocus
                          className="rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Time *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          className="w-full h-12 px-3 text-base bg-gray-50 border border-gray-200 rounded-md focus:border-amber-500 focus:ring-amber-500 appearance-none cursor-pointer"
                          value={selectedTime}
                          onChange={(e) => handleTimeSelect(e.target.value)}
                          disabled={!selectedDate}
                        >
                          <option value="">Select a time</option>
                          {selectedDate && getAvailableTimesForDate(selectedDate).map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Party Size with fixed height */}
            <FormField
              control={form.control}
              name="partySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    Party Size *
                  </FormLabel>
                  <FormControl>
                    <>
                      <input type="hidden" name="partySize" value={partySize} />
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={decrementPartySize}
                          disabled={partySize <= 1}
                          className="h-12 w-12 rounded-full border-gray-200 hover:bg-gray-100 hover:border-amber-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-2xl font-semibold text-gray-900">
                            {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={incrementPartySize}
                          disabled={partySize >= (bookingSettings?.max_party_size || 8)}
                          className="h-12 w-12 rounded-full border-gray-200 hover:bg-gray-100 hover:border-amber-500"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Special Requests with fixed min-height */}
          <div className="space-y-6 pt-8 border-t border-gray-200 min-h-[180px]">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    Special Requests (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Let us know about any dietary requirements, allergies, or special occasions..."
                      className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-amber-500 focus:ring-amber-500 text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <SubmitButton />
          </div>
        </form>
      </Form>
    </div>
  )
}
