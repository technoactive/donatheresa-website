import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Users, Users2, Clock, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { getBookings, getBookingStats } from "@/lib/database"
import type { Booking } from "@/lib/types"

export default async function Dashboard() {
  try {
    const [bookingsData, stats] = await Promise.all([
      getBookings().catch(error => {
        console.error('Error fetching bookings:', error);
        return [];
      }),
      getBookingStats().catch(error => {
        console.error('Error fetching stats:', error);
        return {
          totalBookings: 0,
          pendingBookings: 0,
          todayBookings: 0,
          totalCustomers: 0
        };
      })
    ])

    // Transform BookingWithCustomer to Booking format for the table
    const bookings: Booking[] = bookingsData.map(booking => ({
      id: booking.id,
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      partySize: booking.party_size,
      bookingTime: new Date(`${booking.booking_date}T${booking.booking_time}`),
      status: booking.status as "pending" | "confirmed" | "cancelled",
      notes: booking.special_requests || ""
    }))

    const todaysBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingTime)
      const today = new Date()
      return bookingDate.toDateString() === today.toDateString()
    })

    // Calculate daily stats directly (no useMemo needed in server components)
    const activeBookings = todaysBookings.filter((b) => b.status !== "cancelled")
    const dailyStats = {
      totalBookings: activeBookings.length,
      totalGuests: activeBookings.reduce((sum, booking) => sum + booking.partySize, 0),
      confirmed: activeBookings.filter((b) => b.status === "confirmed").length,
      pending: activeBookings.filter((b) => b.status === "pending").length,
    }

    return (
      <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-8">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">Today's Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">A summary of your restaurant's activity for today.</p>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Today's Bookings</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{dailyStats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Today's Guests</CardTitle>
              <Users2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{dailyStats.totalGuests}</div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Confirmed</CardTitle>
              <CalendarCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{dailyStats.confirmed}</div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Pending</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{dailyStats.pending}</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 gap-2 px-3 sm:px-6">
              <div className="space-y-1 sm:space-y-2 flex-1">
                <CardTitle className="text-base sm:text-lg md:text-xl">Today's Bookings</CardTitle>
                <CardDescription className="text-xs sm:text-sm">A list of reservations for today.</CardDescription>
              </div>
              <Button asChild size="sm" className="gap-1 w-full sm:w-auto shrink-0 h-8 sm:h-9">
                <Link href="/dashboard/bookings">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All Bookings</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
              <BookingsTable bookings={todaysBookings} isReadOnly />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Dashboard error:', error);
    
    // Return a fallback UI if there's an error
    return (
      <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-8">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">Unable to load dashboard data at this time.</p>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Today's Bookings</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">-</div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Today's Guests</CardTitle>
              <Users2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">-</div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Confirmed</CardTitle>
              <CalendarCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">-</div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium leading-none">Pending</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 gap-2 px-3 sm:px-6">
              <div className="space-y-1 sm:space-y-2 flex-1">
                <CardTitle className="text-base sm:text-lg md:text-xl">Today's Bookings</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Unable to load booking data.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }
}
