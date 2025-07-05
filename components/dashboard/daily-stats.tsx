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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.totalGuests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.pending}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
