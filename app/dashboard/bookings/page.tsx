import React from "react"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { getBookings, getBookingSettings } from "@/lib/database"
import type { Booking } from "@/lib/types"
import { RefreshCw, Users, CalendarCheck, Clock, Users2 } from "lucide-react"
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
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Bookings</CardTitle>
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
            <CardTitle className="text-sm font-medium text-slate-600">Today's Guests</CardTitle>
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
}

async function refreshBookings() {
  'use server'
  revalidatePath('/dashboard/bookings')
  redirect('/dashboard/bookings')
}

// Force dynamic rendering since this page uses cookies for authentication
export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
  console.log('[SERVER] Loading bookings page...')
  
  try {
    const [bookingsData, bookingSettings] = await Promise.all([
      getBookings().catch(error => {
        console.error('[SERVER] Failed to load bookings:', error);
        return [];
      }),
      getBookingSettings().catch(error => {
        console.error('[SERVER] Failed to load booking settings:', error);
        return null;
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

    return (
      <div className="space-y-6">
        <div className="pb-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bookings</h2>
          <p className="text-slate-600 mt-2">
            Manage all your restaurant reservations.
          </p>
        </div>
        <BookingsTable bookings={bookings} />
      </div>
    )
  } catch (error) {
    console.error('[SERVER] Error in BookingsPage:', error)
    return (
      <div className="space-y-6">
        <div className="pb-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bookings</h2>
          <p className="text-slate-600 mt-2">
            Unable to load bookings at this time.
          </p>
        </div>
      </div>
    )
  }
}
