"use client"

import React from "react"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { DatePickerWithClear } from "@/components/dashboard/date-picker-with-clear"
import type { Booking } from "@/lib/types"
import { Users, CalendarCheck, Clock, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

// Compact Daily Stats for iPad - Reactive to selected date
function CompactDailyStats({ bookings, selectedDate }: { bookings: Booking[]; selectedDate?: Date }) {
  const [isClient, setIsClient] = React.useState(false)
  
  React.useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Use selected date or default to today
  const displayDate = selectedDate || new Date()
  
  // Filter bookings for the selected/current date
  const dayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingTime)
    return isSameDay(bookingDate, displayDate)
  })

  // Calculate stats (include all non-cancelled bookings)
  const activeBookings = dayBookings.filter((b) => b.status !== "cancelled")
  const dailyStats = {
    totalBookings: activeBookings.length,
    totalGuests: activeBookings.reduce((sum, booking) => sum + booking.partySize, 0),
    confirmed: activeBookings.filter((b) => b.status === "confirmed").length,
    pending: activeBookings.filter((b) => b.status === "pending").length,
  }

  // Check if this is actually today
  const isToday = isSameDay(displayDate, new Date())
  
  // Format date - only after hydration to avoid mismatch
  const dateFormatted = isClient ? displayDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }) : ''

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 sm:p-4">
      {/* Compact Header with Today */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">{isToday ? 'TODAY' : 'SELECTED DATE'}</h3>
          {isClient && (
            <span className="text-xs sm:text-sm text-slate-600 font-medium truncate">{dateFormatted}</span>
          )}
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-500">Live Stats</p>
        </div>
      </div>

      {/* Responsive Stats Grid - 2 cols on mobile, 4 on larger screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Bookings */}
        <div className="text-center bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">BOOKINGS</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-900">{dailyStats.totalBookings}</div>
          <p className="text-xs text-blue-700">Total</p>
        </div>

        {/* Guests */}
        <div className="text-center bg-green-50 rounded-lg p-2 sm:p-3 border border-green-200">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">GUESTS</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-green-900">{dailyStats.totalGuests}</div>
          <p className="text-xs text-green-700">Total</p>
        </div>

        {/* Confirmed */}
        <div className="text-center bg-emerald-50 rounded-lg p-2 sm:p-3 border border-emerald-200">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CalendarCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-600">CONFIRMED</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-900">{dailyStats.confirmed}</div>
          <p className="text-xs text-emerald-700">Ready</p>
        </div>

        {/* Pending */}
        <div className="text-center bg-yellow-50 rounded-lg p-2 sm:p-3 border border-yellow-200">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600">PENDING</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-900">{dailyStats.pending}</div>
          <p className="text-xs text-yellow-700">Waiting</p>
        </div>
      </div>

      {/* Compact Summary Line */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap justify-center items-center gap-1 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">{dailyStats.totalBookings} bookings</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-semibold text-slate-800">{dailyStats.totalGuests} guests</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-semibold text-emerald-700">{dailyStats.confirmed} confirmed</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-semibold text-yellow-700">{dailyStats.pending} pending</span>
        </div>
      </div>
    </div>
  )
}

// Main client component for the interactive part
export function BookingsPageClient({ bookings }: { bookings: Booking[] }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date()) // Default to today
  const [isClient, setIsClient] = React.useState(false)
  const [customerFilter, setCustomerFilter] = React.useState("")
  
  React.useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Date Picker - Mobile optimized responsive layout */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Date selection section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-medium text-slate-900 whitespace-nowrap">View Date:</h3>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <DatePickerWithClear
                date={selectedDate}
                setDate={setSelectedDate}
                className="w-full sm:w-[180px] lg:w-[200px]"
              />
              {isClient && selectedDate && (
                <span className="hidden md:inline text-sm text-slate-600 font-medium truncate">
                  {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
          
          {/* Today button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="text-xs sm:text-sm w-full sm:w-auto"
          >
            Today
          </Button>
        </div>

        {/* Mobile-only: Show selected date in compact format */}
        {isClient && selectedDate && (
          <div className="mt-2 pt-2 border-t border-slate-100 md:hidden">
            <p className="text-sm text-slate-600 text-center">
              {selectedDate.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>

      {/* DAILY STATS - Reactive to selected date */}
      <CompactDailyStats bookings={bookings} selectedDate={selectedDate} />

      {/* All Bookings Table - Filtered by selected date */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        {/* Header with customer filter inline - Mobile optimized */}
        <div className="px-3 sm:px-4 py-3 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-sm sm:text-base font-medium text-slate-900">
              {selectedDate && isSameDay(selectedDate, new Date()) ? 'Today\'s Bookings' : 'Bookings'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap hidden sm:inline">Filter:</span>
              <Input
                placeholder="Search customer name..."
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="w-full sm:w-56 md:w-64 lg:w-72 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <BookingsTable 
          bookings={selectedDate ? bookings.filter(booking => 
            isSameDay(new Date(booking.bookingTime), selectedDate)
          ) : bookings}
          hideFilters={true}
          customerFilter={customerFilter}
        />
      </div>
    </div>
  )
} 