"use client"

import * as React from "react"
import { DotsHorizontalIcon, Pencil2Icon, Cross2Icon, CheckIcon, ClockIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Booking } from "@/lib/types"
import { cn } from "@/lib/utils"
import { EditBookingDialog } from "./edit-booking-dialog"
import { toast } from "sonner"
import { updateBookingStatusAction } from "@/app/dashboard/bookings/actions"

interface BookingsTableProps {
  bookings: Booking[]
  isReadOnly?: boolean
}

const StatusBadge = React.memo(({ status }: { status: string }) => (
  <Badge
    variant={status === "confirmed" ? "default" : status === "pending" ? "outline" : "destructive"}
    className={cn(
      "capitalize",
      status === "confirmed" &&
        "bg-green-100 text-green-800 border-green-200",
      status === "pending" &&
        "bg-yellow-100 text-yellow-800 border-yellow-200",
    )}
  >
    {status}
  </Badge>
))

// Status Action Buttons Component for iPad-friendly status changes
const StatusActionButtons = React.memo(({ 
  booking, 
  onStatusChange, 
  isPending 
}: {
  booking: Booking
  onStatusChange: (bookingId: string, status: "pending" | "confirmed" | "cancelled") => void
  isPending: boolean
}) => (
  <div className="flex flex-wrap gap-2 touch-spacing">
    {booking.status !== "confirmed" && (
      <Button
        size="sm"
        onClick={() => onStatusChange(booking.id, "confirmed")}
        disabled={isPending}
        className="touch-target btn-touch bg-green-600 hover:bg-green-700 text-white min-w-[5.5rem]"
      >
        <CheckIcon className="w-4 h-4 mr-1" />
        Accept
      </Button>
    )}
    {booking.status !== "pending" && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onStatusChange(booking.id, "pending")}
        disabled={isPending}
        className="touch-target btn-touch border-yellow-400 text-yellow-600 hover:bg-yellow-50 bg-white min-w-[5.5rem]"
      >
        <ClockIcon className="w-4 h-4 mr-1" />
        Pending
      </Button>
    )}
    {booking.status !== "cancelled" && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onStatusChange(booking.id, "cancelled")}
        disabled={isPending}
        className="touch-target btn-touch border-red-400 text-red-600 hover:bg-red-50 bg-white min-w-[5.5rem]"
      >
        <Cross2Icon className="w-4 h-4 mr-1" />
        Cancel
      </Button>
    )}
  </div>
))

// Mobile card component for individual bookings
const MobileBookingCard = React.memo(({ 
  booking, 
  onEdit, 
  onCancel, 
  onStatusChange,
  isReadOnly, 
  isPending 
}: {
  booking: Booking
  onEdit: (booking: Booking) => void
  onCancel: (booking: Booking) => void
  onStatusChange: (bookingId: string, status: "pending" | "confirmed" | "cancelled") => void
  isReadOnly: boolean
  isPending: boolean
}) => (
  <Card className="w-full mobile-card-touch card-touch swipe-indicator bg-white border-slate-200 shadow-sm">
    <CardContent className="p-4 space-y-4">
      {/* Header with name and status */}
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight text-slate-900">{booking.customerName}</h3>
          <p className="text-sm text-slate-600 truncate">{booking.customerEmail}</p>
        </div>
        <div className="badge-touch">
          <StatusBadge status={booking.status} />
        </div>
      </div>
      
      {/* Booking details */}
      <div className="grid grid-cols-2 gap-4 text-sm touch-spacing">
        <div>
          <p className="text-slate-600">Date</p>
          <p className="font-medium text-slate-900">
            {new Date(booking.bookingTime).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>
        <div>
          <p className="text-slate-600">Time</p>
          <p className="font-medium text-slate-900">
            {new Date(booking.bookingTime).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-slate-600">Party Size</p>
          <p className="font-medium text-slate-900">{booking.partySize} guests</p>
        </div>
      </div>

      {/* Direct Status Action Buttons for iPad */}
      {!isReadOnly && (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-600 mb-2">Quick Actions</p>
            <StatusActionButtons 
              booking={booking} 
              onStatusChange={onStatusChange} 
              isPending={isPending} 
            />
          </div>
          
          {/* Additional actions dropdown */}
          <div className="flex justify-center pt-2 border-t border-slate-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="touch-target card-action-touch text-slate-700 hover:text-slate-900 hover:bg-slate-50">
                  <DotsHorizontalIcon className="h-4 w-4 mr-2" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="touch-spacing bg-white border-slate-200">
                <DropdownMenuLabel className="text-slate-900">Additional Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(booking)} className="touch-target card-action-touch text-slate-700 hover:text-slate-900 hover:bg-slate-50">
                  <Pencil2Icon className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
))

export const BookingsTable = React.memo(function BookingsTable({ bookings, isReadOnly = false }: BookingsTableProps) {
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null)
  const [filterValue, setFilterValue] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const [mounted, setMounted] = React.useState(false)

  // Only render interactive elements after mounting to prevent hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Filter bookings based on customer name
  const filteredBookings = React.useMemo(() => {
    if (!filterValue) return bookings
    return bookings.filter(booking => 
      booking.customerName.toLowerCase().includes(filterValue.toLowerCase())
    )
  }, [bookings, filterValue])

  const handleEdit = React.useCallback((booking: Booking) => {
    setEditingBooking(booking)
  }, [])

  const handleCancel = React.useCallback((booking: Booking) => {
    startTransition(async () => {
      // TODO: Implement Supabase update logic here
      toast.success("Booking cancelled.")
    })
  }, [])

  const handleStatusChange = React.useCallback((bookingId: string, status: "pending" | "confirmed" | "cancelled") => {
    startTransition(async () => {
      try {
        const result = await updateBookingStatusAction(bookingId, status)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(result.data)
        }
      } catch (error) {
        toast.error("Failed to update booking status")
      }
    })
  }, [])

  const handleSaveBooking = React.useCallback((updatedBooking: Booking) => {
    setEditingBooking(null)
    toast.success("Booking updated successfully")
  }, [])

  const handleFilterChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
  }, [])

  return (
    <div className="w-full space-y-4 touch-spacing">
      {/* Filter input - responsive */}
      {mounted && !isReadOnly && (
        <div className="flex items-center">
          <Input
            placeholder="Filter by customer name..."
            value={filterValue}
            onChange={handleFilterChange}
            className="w-full sm:max-w-sm input-touch filter-touch bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      )}
      
      {/* Mobile view - Card layout for screens smaller than md */}
      <div className="block md:hidden space-y-3 touch-spacing">
        {filteredBookings.length ? (
          filteredBookings.map((booking) => (
            <MobileBookingCard
              key={booking.id}
              booking={booking}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onStatusChange={handleStatusChange}
              isReadOnly={isReadOnly}
              isPending={isPending}
            />
          ))
        ) : (
          <Card className="card-touch bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-slate-600">No bookings found.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Desktop view - Table layout for md screens and larger */}
      <div className="hidden md:block">
        <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-x-auto scroll-area-touch">
          <Table className="table-touch">
            <TableHeader>
              <TableRow className="table-row border-slate-200 hover:bg-slate-50">
                <TableHead className="min-w-[200px] table-cell text-slate-700">Customer</TableHead>
                <TableHead className="min-w-[100px] table-cell text-slate-700">Status</TableHead>
                <TableHead className="text-right min-w-[140px] table-cell text-slate-700">Booking Time</TableHead>
                <TableHead className="text-center min-w-[100px] table-cell text-slate-700">Party Size</TableHead>
                {mounted && !isReadOnly && <TableHead className="text-center min-w-[200px] table-cell text-slate-700">Quick Actions</TableHead>}
                {mounted && !isReadOnly && <TableHead className="text-center min-w-[80px] table-cell text-slate-700">More</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="table-row border-slate-200 hover:bg-slate-50">
                    <TableCell className="min-w-[200px] table-cell">
                      <div className="font-medium text-slate-900">{booking.customerName}</div>
                      <div className="text-sm text-slate-600">{booking.customerEmail}</div>
                    </TableCell>
                    <TableCell className="min-w-[100px] table-cell">
                      <div className="badge-touch">
                        <StatusBadge status={booking.status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right min-w-[140px] table-cell">
                      <div className="font-medium text-slate-900">
                        {new Date(booking.bookingTime).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-slate-600">
                        {new Date(booking.bookingTime).toLocaleTimeString('en-GB', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium min-w-[100px] table-cell text-slate-900">
                      {booking.partySize}
                    </TableCell>
                    {mounted && !isReadOnly && (
                      <TableCell className="min-w-[200px] table-cell">
                        <StatusActionButtons 
                          booking={booking} 
                          onStatusChange={handleStatusChange} 
                          isPending={isPending} 
                        />
                      </TableCell>
                    )}
                    {mounted && !isReadOnly && (
                      <TableCell className="text-center min-w-[80px] table-cell">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 touch-target card-action-touch text-slate-700 hover:text-slate-900 hover:bg-slate-50">
                              <span className="sr-only">Open menu</span>
                              <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="touch-spacing bg-white border-slate-200">
                            <DropdownMenuLabel className="text-slate-900">More Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(booking)} className="touch-target card-action-touch text-slate-700 hover:text-slate-900 hover:bg-slate-50">
                              <Pencil2Icon className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className="table-row border-slate-200 hover:bg-slate-50">
                  <TableCell colSpan={mounted && !isReadOnly ? 6 : 4} className="h-24 text-center table-cell text-slate-600">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Edit booking dialog */}
      {mounted && !isReadOnly && editingBooking && (
        <EditBookingDialog
          booking={editingBooking}
          onSave={handleSaveBooking}
          onOpenChange={() => setEditingBooking(null)}
        />
      )}
    </div>
  )
})
