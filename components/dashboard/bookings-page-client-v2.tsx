"use client"

import React from "react"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { DatePickerWithClear } from "@/components/dashboard/date-picker-with-clear"
import type { Booking } from "@/lib/types"
import { Users, CalendarCheck, Clock, Users2, CalendarDays, Search, AlertCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const recentCutoff = new Date()
  recentCutoff.setHours(recentCutoff.getHours() - 24) // Last 24 hours
  
  const recentBookings = bookings.filter(booking => {
    // Assuming bookings have a createdAt field, otherwise we check if it's for today/tomorrow
    const bookingDate = new Date(booking.bookingTime)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return booking.status === "pending" && 
           (isSameDay(bookingDate, new Date()) || isSameDay(bookingDate, tomorrow))
  })
  
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
    <div className="space-y-6">
      {sortedDates.map(dateKey => {
        const date = new Date(dateKey)
        const dayBookings = bookingsByDate[dateKey]
          .filter(b => b.status !== "cancelled")
          .sort((a, b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime())
        
        if (dayBookings.length === 0) return null
        
        const isToday = isSameDay(date, new Date())
        const isTomorrow = isSameDay(date, (() => {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          return tomorrow
        })())
        
        return (
          <div key={dateKey} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 
                   date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <Badge variant="secondary">{dayBookings.length} bookings</Badge>
              </div>
            </div>
            <div className="divide-y">
              {dayBookings.map(booking => (
                <div key={booking.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{booking.customerName}</span>
                        <Badge variant={booking.status === "confirmed" ? "default" : "outline"} 
                               className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{new Date(booking.bookingTime).toLocaleTimeString('en-GB', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                        <span>{booking.partySize} guests</span>
                        <span>{booking.customerEmail}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Main improved client component
export function BookingsPageClientV2({ bookings }: { bookings: Booking[] }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)
  const [globalSearchTerm, setGlobalSearchTerm] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("upcoming")
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
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
  
  const pendingBookingsCount = bookings.filter(b => b.status === "pending").length
  
  return (
    <div className="space-y-6">
      {/* Page Header with global search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings Management</h2>
          <p className="text-muted-foreground">
            Manage your restaurant bookings efficiently
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all bookings by name or email..."
            value={globalSearchTerm}
            onChange={(e) => setGlobalSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
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
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Next 7 Days</span>
            <span className="sm:hidden">7 Days</span>
          </TabsTrigger>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Today
            {todayBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {todayBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tomorrow" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tomorrow
            {tomorrowBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {tomorrowBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Custom Date</span>
            <span className="sm:hidden">Custom</span>
          </TabsTrigger>
        </TabsList>
        
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
