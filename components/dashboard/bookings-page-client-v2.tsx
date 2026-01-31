"use client"

import React from "react"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { DatePickerWithClear } from "@/components/dashboard/date-picker-with-clear"
import { EditBookingDialog } from "@/components/dashboard/edit-booking-dialog"
import type { Booking } from "@/lib/types"
import { Users, CalendarCheck, Clock, Users2, CalendarDays, Search, AlertCircle, ChevronRight, Check, X, Pencil, MessageSquare, Download } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { updateBookingStatusAction } from "@/app/dashboard/bookings/actions"

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

// Helper to get date range bookings
const getDateRangeBookings = (bookings: Booking[], startDate: Date, endDate: Date) => {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingTime)
    return bookingDate >= startDate && bookingDate <= endDate
  })
}

// Compact stats card for date sections
function DateStatsCard({ 
  title, 
  date, 
  bookings,
  showAlert = false 
}: { 
  title: string
  date?: Date
  bookings: Booking[]
  showAlert?: boolean
}) {
  const activeBookings = bookings.filter((b) => b.status !== "cancelled")
  const stats = {
    totalBookings: activeBookings.length,
    totalGuests: activeBookings.reduce((sum, booking) => sum + booking.partySize, 0),
    confirmed: activeBookings.filter((b) => b.status === "confirmed").length,
    pending: activeBookings.filter((b) => b.status === "pending").length,
  }
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {date && (
              <span className="text-sm text-muted-foreground">
                {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
          {showAlert && stats.pending > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {stats.pending} pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">Guests</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// New bookings alert component
function NewBookingsAlert({ bookings }: { bookings: Booking[] }) {
  const [recentBookings, setRecentBookings] = React.useState<Booking[]>([])
  
  React.useEffect(() => {
    // Calculate on client only to avoid hydration mismatch
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const filtered = bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingTime)
      return booking.status === "pending" && 
             (isSameDay(bookingDate, today) || isSameDay(bookingDate, tomorrow))
    })
    setRecentBookings(filtered)
  }, [bookings])
  
  if (recentBookings.length === 0) return null
  
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">New Bookings Require Attention</AlertTitle>
      <AlertDescription className="text-blue-700">
        You have {recentBookings.length} pending {recentBookings.length === 1 ? 'booking' : 'bookings'} that need confirmation.
      </AlertDescription>
    </Alert>
  )
}

// Upcoming bookings list component
function UpcomingBookingsList({ bookings }: { bookings: Booking[] }) {
  const [expandedDate, setExpandedDate] = React.useState<string | null>(null)
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const [todayStr, setTodayStr] = React.useState<string>("")
  const [tomorrowStr, setTomorrowStr] = React.useState<string>("")
  
  // Set today/tomorrow strings on client only
  React.useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setTodayStr(today.toDateString())
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setTomorrowStr(tomorrow.toDateString())
  }, [])
  
  // Action handlers
  const handleEdit = React.useCallback((booking: Booking) => {
    setEditingBooking(booking)
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
  
  // Group bookings by date
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const dateKey = new Date(booking.bookingTime).toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(booking)
    return acc
  }, {} as Record<string, Booking[]>)
  
  // Sort dates
  const sortedDates = Object.keys(bookingsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )
  
  return (
    <div className="space-y-4">
      {sortedDates.map(dateKey => {
        const date = new Date(dateKey)
        const dayBookings = bookingsByDate[dateKey]
          .filter(b => b.status !== "cancelled")
          .sort((a, b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime())
        
        if (dayBookings.length === 0) return null
        
        const isToday = todayStr ? date.toDateString() === todayStr : false
        const isTomorrow = tomorrowStr ? date.toDateString() === tomorrowStr : false
        
        const pendingCount = dayBookings.filter(b => b.status === "pending").length
        const isExpanded = expandedDate === dateKey || isToday || isTomorrow
        
        return (
          <div key={dateKey} className="border rounded-lg overflow-hidden shadow-sm">
            <div 
              className={`px-4 py-4 cursor-pointer transition-colors touch-manipulation active:opacity-80 ${
                isExpanded ? 'bg-blue-50 border-b' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
              }`}
              onClick={() => setExpandedDate(isExpanded && !isToday && !isTomorrow ? null : dateKey)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm">
                    {isToday ? '📍 TODAY' : isTomorrow ? '📅 TOMORROW' : 
                     date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  {pendingCount > 0 && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                      {pendingCount} pending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{dayBookings.length} bookings</Badge>
                  <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </div>
            {isExpanded && (
              <div className="divide-y bg-white">
                {dayBookings.map(booking => (
                  <div key={booking.id} className="px-4 py-4 md:py-3 hover:bg-blue-50/50 active:bg-blue-100/50 transition-colors group touch-manipulation">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{booking.customerName}</span>
                          <Badge 
                            variant={booking.status === "confirmed" ? "default" : "outline"} 
                            className={`text-xs ${
                              booking.status === "confirmed" 
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium text-black">
                            🕐 {new Date(booking.bookingTime).toLocaleTimeString('en-GB', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <span>👥 {booking.partySize} guests</span>
                          <span className="truncate">📧 {booking.customerEmail}</span>
                          {booking.notes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button 
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  <span>View notes</span>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent 
                                className="w-80 bg-white border-slate-200 shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600" />
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
                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {/* Edit button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(booking)}
                          disabled={isPending}
                          className="h-11 w-11 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all touch-manipulation"
                          title="Edit booking"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        
                        {/* Status buttons */}
                        {booking.status !== "confirmed" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            disabled={isPending}
                            className="h-11 w-11 text-green-600 hover:bg-green-50 active:scale-95 transition-all touch-manipulation"
                            title="Confirm booking"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                        )}
                        
                        {booking.status !== "pending" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleStatusChange(booking.id, "pending")}
                            disabled={isPending}
                            className="h-11 w-11 text-yellow-600 hover:bg-yellow-50 active:scale-95 transition-all touch-manipulation"
                            title="Set to pending"
                          >
                            <Clock className="h-5 w-5" />
                          </Button>
                        )}
                        
                        {booking.status !== "cancelled" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            disabled={isPending}
                            className="h-11 w-11 text-red-600 hover:bg-red-50 active:scale-95 transition-all touch-manipulation"
                            title="Cancel booking"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
      
      {/* Edit Booking Dialog */}
      {editingBooking && (
        <EditBookingDialog
          booking={editingBooking}
          isOpen={!!editingBooking}
          onOpenChange={(open) => {
            if (!open) setEditingBooking(null)
          }}
          onSave={handleSaveBooking}
        />
      )}
    </div>
  )
}

// CSV Export utility function
function exportBookingsToCSV(bookings: Booking[], filename: string = 'bookings') {
  // Define CSV headers
  const headers = [
    'Booking Reference',
    'Customer Name',
    'Email',
    'Phone',
    'Date',
    'Time',
    'Party Size',
    'Status',
    'Source',
    'Special Requests'
  ]
  
  // Convert bookings to CSV rows
  const rows = bookings.map(booking => {
    const bookingDate = new Date(booking.bookingTime)
    return [
      booking.bookingReference || booking.id.substring(0, 8),
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone || '',
      bookingDate.toLocaleDateString('en-GB'),
      bookingDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      booking.partySize.toString(),
      booking.status,
      booking.source,
      (booking.notes || '').replace(/"/g, '""') // Escape quotes
    ]
  })
  
  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  const dateStr = new Date().toISOString().split('T')[0]
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${dateStr}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Main improved client component
export function BookingsPageClientV2({ bookings }: { bookings: Booking[] }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)
  const [globalSearchTerm, setGlobalSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all-upcoming")
  const [mounted, setMounted] = React.useState(false)
  
  // Use state for dates to avoid hydration mismatch
  const [today, setToday] = React.useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [tomorrow, setTomorrow] = React.useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 1)
    return d
  })
  const [nextWeek, setNextWeek] = React.useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 7)
    return d
  })
  
  // Set mounted flag after hydration
  React.useEffect(() => {
    setMounted(true)
    // Update dates on client after mount to ensure consistency
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    setToday(now)
    
    const tmrw = new Date(now)
    tmrw.setDate(tmrw.getDate() + 1)
    setTomorrow(tmrw)
    
    const week = new Date(now)
    week.setDate(week.getDate() + 7)
    setNextWeek(week)
  }, [])
  
  // Filter bookings based on search term
  const searchFilteredBookings = globalSearchTerm
    ? bookings.filter(booking => 
        booking.customerName.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(globalSearchTerm.toLowerCase())
      )
    : bookings
  
  // Get bookings for different views
  const todayBookings = searchFilteredBookings.filter(booking => 
    isSameDay(new Date(booking.bookingTime), today)
  )
  
  const tomorrowBookings = searchFilteredBookings.filter(booking => 
    isSameDay(new Date(booking.bookingTime), tomorrow)
  )
  
  const next7DaysBookings = getDateRangeBookings(searchFilteredBookings, today, nextWeek)
    .sort((a, b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime())
  
  // Get ALL upcoming bookings (from today onwards)
  const allUpcomingBookings = searchFilteredBookings.filter(booking => {
    const bookingDate = new Date(booking.bookingTime)
    return bookingDate >= today && booking.status !== "cancelled"
  }).sort((a, b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime())
  
  const pendingBookingsCount = bookings.filter(b => b.status === "pending").length
  
  // Add iPad optimization on mount
  React.useEffect(() => {
    // Check if we're on an iPad or touch device
    const isIPad = /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    
    if (isIPad || isTouchDevice) {
      document.body.classList.add('touch-device')
    }
  }, [])
  
  return (
    <div className="space-y-6 booking-management-ipad">
      {/* Page Header with global search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings Management</h2>
          <p className="text-muted-foreground">
            Manage your restaurant bookings efficiently
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all bookings by name or email..."
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportBookingsToCSV(allUpcomingBookings, 'upcoming_bookings')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>
      
      {/* New bookings alert */}
      <NewBookingsAlert bookings={bookings} />
      
      {/* Quick Stats Overview */}
      {pendingBookingsCount > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 font-medium">
            You have {pendingBookingsCount} pending {pendingBookingsCount === 1 ? 'booking' : 'bookings'} across all dates that require confirmation.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all-upcoming" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">All Upcoming</span>
            <span className="sm:hidden">All</span>
            {allUpcomingBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {allUpcomingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Today</span>
            <span className="sm:hidden">Today</span>
            {todayBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {todayBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tomorrow" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Tomorrow</span>
            <span className="sm:hidden">Tmrw</span>
            {tomorrowBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {tomorrowBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Next 7 Days</span>
            <span className="sm:hidden">7 Days</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Custom</span>
            <span className="sm:hidden">Date</span>
          </TabsTrigger>
        </TabsList>
        
        {/* All Upcoming Bookings View */}
        <TabsContent value="all-upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Upcoming Bookings</CardTitle>
              <CardDescription>
                Complete list of all future bookings in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allUpcomingBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming bookings found
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-900">{allUpcomingBookings.length}</div>
                      <p className="text-sm text-blue-700">Total Bookings</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-2xl font-bold text-green-900">
                        {allUpcomingBookings.reduce((sum, b) => sum + b.partySize, 0)}
                      </div>
                      <p className="text-sm text-green-700">Total Guests</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-900">
                        {allUpcomingBookings.filter(b => b.status === "confirmed").length}
                      </div>
                      <p className="text-sm text-emerald-700">Confirmed</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-900">
                        {allUpcomingBookings.filter(b => b.status === "pending").length}
                      </div>
                      <p className="text-sm text-yellow-700">Pending</p>
                    </div>
                  </div>
                  
                  {/* Bookings List */}
                  <UpcomingBookingsList bookings={allUpcomingBookings} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Upcoming 7 Days View */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings - Next 7 Days</CardTitle>
              <CardDescription>
                All bookings from today to {nextWeek.toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {next7DaysBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings found for the next 7 days
                </div>
              ) : (
                <UpcomingBookingsList bookings={next7DaysBookings} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Today View */}
        <TabsContent value="today" className="space-y-4">
          <DateStatsCard 
            title="Today's Bookings" 
            date={today} 
            bookings={todayBookings}
            showAlert={true}
          />
          <Card>
            <CardContent className="pt-6">
              <BookingsTable 
                bookings={todayBookings}
                hideFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tomorrow View */}
        <TabsContent value="tomorrow" className="space-y-4">
          <DateStatsCard 
            title="Tomorrow's Bookings" 
            date={tomorrow} 
            bookings={tomorrowBookings}
            showAlert={true}
          />
          <Card>
            <CardContent className="pt-6">
              <BookingsTable 
                bookings={tomorrowBookings}
                hideFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Custom Date View */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select a Date</CardTitle>
              <CardDescription>Choose a specific date to view bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <DatePickerWithClear
                  date={selectedDate}
                  setDate={setSelectedDate}
                  className="w-[240px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
              </div>
              
              {selectedDate && (
                <>
                  <DateStatsCard 
                    title="Selected Date Bookings" 
                    date={selectedDate} 
                    bookings={searchFilteredBookings.filter(booking => 
                      isSameDay(new Date(booking.bookingTime), selectedDate)
                    )}
                  />
                  <BookingsTable 
                    bookings={searchFilteredBookings.filter(booking => 
                      isSameDay(new Date(booking.bookingTime), selectedDate)
                    )}
                    hideFilters={true}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Search Results Summary */}
      {globalSearchTerm && (
        <div className="text-sm text-muted-foreground text-center">
          Found {searchFilteredBookings.length} {searchFilteredBookings.length === 1 ? 'booking' : 'bookings'} matching "{globalSearchTerm}"
        </div>
      )}
    </div>
  )
}
