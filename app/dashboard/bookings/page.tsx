import React from "react"
import { AddBookingDialog } from "@/components/dashboard/add-booking-dialog"
import { BookingsPageClient } from "@/components/dashboard/bookings-page-client"
import { getBookings, getBookingSettings } from "@/lib/database"
import type { Booking } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
      source: booking.source as "website" | "dashboard",
      notes: booking.special_requests || ""
    }))

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bookings</h2>
            <p className="text-slate-600 mt-2">
              Manage all your restaurant reservations.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddBookingDialog
              availableTimes={bookingSettings?.available_times}
              maxPartySize={bookingSettings?.max_party_size}
            />
          </div>
        </div>

        {/* Client Component with Interactive Features */}
        <BookingsPageClient bookings={bookings} />
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
