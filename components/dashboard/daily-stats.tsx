"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarCheck, Clock, Users2 } from "lucide-react"
import { DatePickerWithClear } from "@/components/dashboard/date-picker-with-clear"
import type { Booking } from "@/lib/types"

interface DailyStatsProps {
  bookings: Booking[]
}

export const DailyStats = React.memo(({ bookings }: DailyStatsProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  // Filter bookings by date if date is selected
  const filteredBookings = React.useMemo(() => {
    if (!date) return bookings
    const targetDate = date.toDateString()
    return bookings.filter(booking => booking.bookingTime.toDateString() === targetDate)
  }, [bookings, date])

  const dailyStats = React.useMemo(() => {
    const activeBookings = filteredBookings.filter((b) => b.status !== "cancelled")
    return {
      totalBookings: activeBookings.length,
      totalGuests: activeBookings.reduce((sum, booking) => sum + booking.partySize, 0),
      confirmed: activeBookings.filter((b) => b.status === "confirmed").length,
      pending: activeBookings.filter((b) => b.status === "pending").length,
    }
  }, [filteredBookings])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DatePickerWithClear date={date} setDate={setDate} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{dailyStats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Guests</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Users2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{dailyStats.totalGuests}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Confirmed</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CalendarCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{dailyStats.confirmed}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{dailyStats.pending}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
