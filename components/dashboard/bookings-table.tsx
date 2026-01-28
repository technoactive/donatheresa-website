"use client"

import * as React from "react"
import { DotsHorizontalIcon, Pencil2Icon, Cross2Icon, CheckIcon, ClockIcon, ChatBubbleIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { DatePickerWithClear } from "./date-picker-with-clear"
import { toast } from "sonner"
import { updateBookingStatusAction } from "@/app/dashboard/bookings/actions"
import { DepositStatusBadge } from "./deposit-management"

interface BookingsTableProps {
  bookings: Booking[]
  isReadOnly?: boolean
  hideFilters?: boolean // Hide internal date filtering when controlled externally
  customerFilter?: string // External customer filter value
}

const StatusBadge = React.memo(({ status }: { status: string }) => (
  <Badge
    variant={status === "confirmed" ? "default" : status === "pending" ? "outline" : status === "completed" ? "secondary" : "destructive"}
    className={cn(
      "capitalize text-xs", // Added text-xs for smaller badge
      status === "confirmed" &&
        "bg-green-100 text-green-800 border-green-200",
      status === "pending" &&
        "bg-yellow-100 text-yellow-800 border-yellow-200",
      status === "completed" &&
        "bg-blue-100 text-blue-800 border-blue-200",
    )}
  >
    {status}
  </Badge>
))

const SourceBadge = React.memo(({ source }: { source: "website" | "dashboard" }) => (
  <Badge
    variant="outline"
    className={cn(
      "capitalize text-xs",
      source === "website" &&
        "bg-blue-50 text-blue-700 border-blue-200",
      source === "dashboard" &&
        "bg-purple-50 text-purple-700 border-purple-200",
    )}
  >
    {source}
  </Badge>
))

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

// Mobile card component for individual bookings - COMPACT DESIGN
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
  onStatusChange: (bookingId: string, status: "pending" | "confirmed" | "cancelled" | "completed") => void
  isReadOnly: boolean
  isPending: boolean
}) => (
  <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
    {/* Compact single row layout */}
    <div className="flex items-center justify-between gap-3">
      {/* Left side - Customer info and time */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h4 className="font-medium text-sm text-slate-900 truncate">{booking.customerName}</h4>
          {booking.bookingReference && (
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              #{booking.bookingReference}
            </span>
          )}
          <span className="text-xs text-slate-600">
            {new Date(booking.bookingTime).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </span>
          <span className="text-xs text-slate-600">• {booking.partySize} guests</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">
            {new Date(booking.bookingTime).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short'
            })}
          </span>
          <StatusBadge status={booking.status} />
          {/* Deposit badge */}
          <DepositStatusBadge 
            depositRequired={booking.deposit_required || false}
            depositStatus={booking.deposit_status || 'none'}
            depositAmount={booking.deposit_amount || null}
          />
          {/* Source icon */}
          <div className="flex items-center" title={booking.source === 'website' ? 'Website booking' : 'Dashboard booking'}>
            {booking.source === 'website' ? (
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            )}
          </div>
          {/* Notes indicator with popover */}
          {booking.notes && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="View customer notes"
                >
                  <ChatBubbleIcon className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-72 bg-white border-slate-200 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ChatBubbleIcon className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-sm text-slate-900">Customer Notes</h4>
                  </div>
                  <div className="text-sm text-slate-700 bg-slate-50 rounded-md p-3 border border-slate-100">
                    {booking.notes}
                  </div>
                  <p className="text-xs text-slate-500">
                    From: {booking.customerName}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {/* Right side - Action buttons */}
      {!isReadOnly && (
        <div className="flex items-center gap-2"> {/* Increased gap from gap-1 to gap-2 */}
          {/* Accept button - show if not confirmed and not completed */}
          {booking.status !== "confirmed" && booking.status !== "completed" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onStatusChange(booking.id, "confirmed")}
              disabled={isPending}
              className="h-11 w-11 text-green-600 hover:bg-green-50" // Increased from h-8 w-8 to h-11 w-11 (44px)
              title="Accept booking"
            >
              <CheckIcon className="h-5 w-5" /> {/* Increased icon size */}
            </Button>
          )}
          
          {/* Completed button - show if confirmed (past bookings) */}
          {booking.status === "confirmed" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onStatusChange(booking.id, "completed")}
              disabled={isPending}
              className="h-11 w-11 text-blue-600 hover:bg-blue-50"
              title="Mark as completed"
            >
              <CheckIcon className="h-5 w-5" />
            </Button>
          )}
          
          {/* Pending button - show if not pending and not completed */}
          {booking.status !== "pending" && booking.status !== "completed" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onStatusChange(booking.id, "pending")}
              disabled={isPending}
              className="h-11 w-11 text-yellow-600 hover:bg-yellow-50" // Increased from h-8 w-8 to h-11 w-11 (44px)
              title="Set to pending"
            >
              <ClockIcon className="h-5 w-5" /> {/* Increased icon size */}
            </Button>
          )}
          
          {/* Cancel button - show if not cancelled and not completed */}
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onStatusChange(booking.id, "cancelled")}
              disabled={isPending}
              className="h-11 w-11 text-red-600 hover:bg-red-50" // Increased from h-8 w-8 to h-11 w-11 (44px)
              title="Cancel booking"
            >
              <Cross2Icon className="h-5 w-5" /> {/* Increased icon size */}
            </Button>
          )}
          
          {/* Edit button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(booking)}
            className="h-11 w-11 text-slate-600 hover:bg-slate-50" // Increased from h-8 w-8 to h-11 w-11 (44px)
            title="Edit booking"
          >
            <Pencil2Icon className="h-5 w-5" /> {/* Increased icon size */}
          </Button>
        </div>
      )}
    </div>
  </div>
))

export const BookingsTable = React.memo(function BookingsTable({ bookings, isReadOnly = false, hideFilters = false, customerFilter }: BookingsTableProps) {
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null)
  const [filterValue, setFilterValue] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date()) // Default to today
  const [isPending, startTransition] = React.useTransition()
  const [mounted, setMounted] = React.useState(false)

  // Only render interactive elements after mounting to prevent hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Filter bookings based on customer name and selected date
  const filteredBookings = React.useMemo(() => {
    let filtered = bookings

    // Filter by customer name (use external filter if provided, otherwise internal)
    const activeFilter = customerFilter !== undefined ? customerFilter : filterValue
    if (activeFilter) {
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(activeFilter.toLowerCase())
      )
    }

    // Filter by selected date (only if not controlled externally)
    if (!hideFilters && selectedDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingTime)
        return isSameDay(bookingDate, selectedDate)
      })
    }

    // Sort by booking time (earliest first)
    return filtered.sort((a, b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime())
  }, [bookings, customerFilter, filterValue, selectedDate, hideFilters])

  const handleEdit = React.useCallback((booking: Booking) => {
    setEditingBooking(booking)
  }, [])

  const handleCancel = React.useCallback((booking: Booking) => {
    startTransition(async () => {
      // TODO: Implement Supabase update logic here
      toast.success("Booking cancelled.")
    })
  }, [])

  const handleStatusChange = React.useCallback((bookingId: string, status: "pending" | "confirmed" | "cancelled" | "completed") => {
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

  // Count of filtered bookings
  const bookingCount = filteredBookings.length
  const totalGuests = filteredBookings.reduce((sum, booking) => sum + booking.partySize, 0)

  return (
    <div className="w-full space-y-4 touch-spacing overflow-hidden">
      {/* Filters and Summary */}
      {mounted && !isReadOnly && !hideFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Date filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Filter by date:</span>
              <DatePickerWithClear
                date={selectedDate}
                setDate={setSelectedDate}
                className="w-[200px] sm:w-[240px]"
              />
            </div>
            
            {/* Customer name filter */}
            <Input
              placeholder="Filter by customer name..."
              value={filterValue}
              onChange={handleFilterChange}
              className="w-full sm:max-w-sm input-touch filter-touch bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          
          {/* Summary info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
            <span className="font-medium">
              {selectedDate ? (
                <>
                  {selectedDate.toLocaleDateString('en-GB', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </>
              ) : (
                'All dates'
              )}:
            </span>
            <span>{bookingCount} booking{bookingCount !== 1 ? 's' : ''}</span>
            <span className="text-slate-400">•</span>
            <span>{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Simple customer name filter when date is controlled externally and no external filter is provided */}
      {mounted && !isReadOnly && hideFilters && customerFilter === undefined && (
        <div className="flex justify-center">
          <Input
            placeholder="Filter by customer name..."
            value={filterValue}
            onChange={handleFilterChange}
            className="w-full max-w-sm input-touch filter-touch bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      )}
      
      {/* Mobile view - Compact cards for phones and tablets */}
      <div className="block xl:hidden space-y-2 touch-spacing"> {/* Changed from lg:hidden to xl:hidden */}
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
              <p className="text-slate-600">
                {(customerFilter !== undefined ? customerFilter : filterValue) ? 
                  'No bookings found matching your search.' :
                  hideFilters ? 
                    'No bookings found.' :
                    selectedDate ? 
                      `No bookings found for ${selectedDate.toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}.` :
                      'No bookings found.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>


      
      {/* Desktop view - Full table for extra large screens */}
      <div className="hidden xl:block">
        <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="table-row border-slate-200 hover:bg-slate-50">
                <TableHead className="text-slate-700 w-[25%]">Customer</TableHead>
                <TableHead className="text-slate-700 w-[12%]">Status</TableHead>
                <TableHead className="text-slate-700 w-[12%]">Source</TableHead>
                <TableHead className="text-right text-slate-700 w-[18%]">Booking Time</TableHead>
                <TableHead className="text-center text-slate-700 w-[10%]">Guests</TableHead>
                {mounted && !isReadOnly && <TableHead className="text-right text-slate-700 w-[23%]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="table-row border-slate-200 hover:bg-slate-50">
                    <TableCell className="truncate">
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-slate-900 truncate">{booking.customerName}</div>
                          {booking.bookingReference && (
                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex-shrink-0">
                              #{booking.bookingReference}
                            </span>
                          )}
                          {booking.notes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button 
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                  title="View customer notes"
                                >
                                  <ChatBubbleIcon className="w-4 h-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent 
                                className="w-80 bg-white border-slate-200 shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <ChatBubbleIcon className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-semibold text-sm text-slate-900">Customer Notes</h4>
                                  </div>
                                  <div className="text-sm text-slate-700 bg-slate-50 rounded-md p-3 border border-slate-100 whitespace-pre-wrap">
                                    {booking.notes}
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    From: {booking.customerName}
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 truncate">{booking.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={booking.status} />
                        <DepositStatusBadge 
                          depositRequired={booking.deposit_required || false}
                          depositStatus={booking.deposit_status || 'none'}
                          depositAmount={booking.deposit_amount || null}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <SourceBadge source={booking.source} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">
                          {new Date(booking.bookingTime).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-slate-600">
                          {new Date(booking.bookingTime).toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium text-slate-900">
                        {booking.partySize}
                      </div>
                    </TableCell>
                    {mounted && !isReadOnly && (
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1 flex-wrap">
                          {/* Same icon buttons as mobile/tablet */}
                          {booking.status !== "confirmed" && booking.status !== "completed" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              disabled={isPending}
                              className="h-10 w-10 text-green-600 hover:bg-green-50"
                              title="Accept booking"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Completed button - show if confirmed (past bookings) */}
                          {booking.status === "confirmed" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "completed")}
                              disabled={isPending}
                              className="h-10 w-10 text-blue-600 hover:bg-blue-50"
                              title="Mark as completed"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {booking.status !== "pending" && booking.status !== "completed" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "pending")}
                              disabled={isPending}
                              className="h-10 w-10 text-yellow-600 hover:bg-yellow-50"
                              title="Set to pending"
                            >
                              <ClockIcon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {booking.status !== "cancelled" && booking.status !== "completed" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              disabled={isPending}
                              className="h-10 w-10 text-red-600 hover:bg-red-50"
                              title="Cancel booking"
                            >
                              <Cross2Icon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(booking)}
                            className="h-10 w-10 text-slate-600 hover:bg-slate-50"
                            title="Edit booking"
                          >
                            <Pencil2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className="table-row border-slate-200 hover:bg-slate-50">
                  <TableCell colSpan={mounted && !isReadOnly ? 6 : 5} className="h-24 text-center table-cell text-slate-600">
                    {(customerFilter !== undefined ? customerFilter : filterValue) ? 
                      'No bookings found matching your search.' :
                      hideFilters ? 
                        'No bookings found.' :
                        selectedDate ? 
                          `No bookings found for ${selectedDate.toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}.` :
                          'No bookings found.'
                    }
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
