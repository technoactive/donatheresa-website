import * as React from "react"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import type { Booking } from "@/lib/types"
import { RefreshCw, Users, CalendarCheck, Clock, Users2 } from "lucide-react"
import { getBookings, getBookingSettings, type BookingWithCustomer } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Server-side daily stats component
function ServerDailyStats({ bookings }: { bookings: Booking[] }) {
  // Calculate today's bookings
  const today = new Date()
  const todaysBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingTime)
    return bookingDate.toDateString() === today.toDateString()
  })

  // Calculate stats
  const activeBookings = todaysBookings.filter((b) => b.status !== "cancelled")
  const dailyStats = {
    totalBookings: activeBookings.length,
    totalGuests: activeBookings.reduce((sum, booking) => sum + booking.partySize, 0),
    confirmed: activeBookings.filter((b) => b.status === "confirmed").length,
    pending: activeBookings.filter((b) => b.status === "pending").length,
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Guests</CardTitle>
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
}

async function refreshBookings() {
  'use server'
  revalidatePath('/dashboard/bookings')
  redirect('/dashboard/bookings')
}

export default async function BookingsPage() {
  let bookingsData: BookingWithCustomer[] = []
  let bookingSettings = null
  let error = null

  try {
    console.log('[SERVER] Loading bookings page...')
    const results = await Promise.allSettled([
      getBookings(),
      getBookingSettings()
    ])
    
    if (results[0].status === 'fulfilled') {
      bookingsData = results[0].value
      console.log('[SERVER] Bookings loaded:', bookingsData.length)
    } else {
      console.error('[SERVER] Failed to load bookings:', results[0].reason)
      error = 'Failed to load bookings'
    }
    
    if (results[1].status === 'fulfilled') {
      bookingSettings = results[1].value
    } else {
      console.error('[SERVER] Failed to load booking settings:', results[1].reason)
    }
  } catch (err) {
    console.error('[SERVER] Error in bookings page:', err)
    error = 'Database connection error'
  }

  // Transform BookingWithCustomer to Booking format for the table
  const bookings: Booking[] = bookingsData.map(booking => ({
    id: booking.id,
    customerName: booking.customer.name,
    customerEmail: booking.customer.email,
    partySize: booking.party_size,
    bookingTime: new Date(`${booking.booking_date}T${booking.booking_time}`),
    status: booking.status,
    notes: booking.special_requests || ""
  }))

  // Show error state if data failed to load
  if (error) {
    return (
      <div className="w-full max-w-full space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Booking Management</h1>
            <p className="text-red-500 text-sm sm:text-base">Error: {error}</p>
          </div>
          
          <form action={refreshBookings}>
            <Button type="submit" variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </form>
        </div>

        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Unable to load booking data. Please check your database connection and try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Booking Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage reservations ({bookings.length} total)
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <form action={refreshBookings}>
            <Button
              type="submit"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </form>
          
          {/* Toggle Bookings Button - TODO: Implement later */}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full space-y-4 md:space-y-6">
        <ServerDailyStats bookings={bookings} />
        <Card className="w-full transition-colors hover:bg-accent/5">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <BookingsTable
              bookings={bookings}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
