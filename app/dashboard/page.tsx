import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Star, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getDashboardStats, getRecentBookings } from "@/lib/database"
import { Badge } from "@/components/ui/badge"


// Force dynamic rendering since this page uses cookies for authentication
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Fetch real data from Supabase
  const [dashboardStats, recentBookings] = await Promise.all([
    getDashboardStats().catch(error => {
      console.error('Failed to load dashboard stats:', error)
      return {
        todayBookings: 0,
        yesterdayBookings: 0,
        totalCustomers: 0,
        newCustomersThisWeek: 0,
        confirmedToday: 0,
        pendingToday: 0,
        totalGuestsToday: 0,
        totalSeats: 0,
        occupancyPercentage: 0,
        bookingChange: 0,
        customerGrowth: 0
      }
    }),
    getRecentBookings(5).catch(error => {
      console.error('Failed to load recent bookings:', error)
      return []
    })
  ])

  // Format change indicators
  const formatChange = (change: number) => {
    if (change > 0) return { text: `+${change} from yesterday`, trend: 'up' }
    if (change < 0) return { text: `${change} from yesterday`, trend: 'down' }
    return { text: 'No change from yesterday', trend: 'neutral' }
  }

  const formatGrowth = (growth: number) => {
    if (growth > 0) return `+${growth} new this week`
    if (growth < 0) return `${Math.abs(growth)} fewer this week`
    return 'No new customers this week'
  }

  // Format occupancy status
  const formatOccupancyStatus = () => {
    if (dashboardStats.totalSeats === 0) {
      return "Set capacity in settings"
    }
    return `${dashboardStats.totalGuestsToday} of ${dashboardStats.totalSeats} seats`
  }

  const bookingChange = formatChange(dashboardStats.bookingChange)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Restaurant Dashboard
            </h1>
            <p className="text-lg text-slate-600 mt-2">
              Monitor your restaurant's performance and bookings
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl px-4 py-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Today's Bookings
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {dashboardStats.todayBookings}
            </div>
            <div className="flex items-center space-x-1">
              {bookingChange.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-600" />}
              {bookingChange.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-600" />}
              <p className={`text-xs font-medium ${
                bookingChange.trend === 'up' ? 'text-green-600' : 
                bookingChange.trend === 'down' ? 'text-red-600' : 'text-slate-500'
              }`}>
                {bookingChange.text}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Total Guests Today
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {dashboardStats.totalGuestsToday}
            </div>
            <p className="text-xs font-medium text-slate-600">
              {dashboardStats.totalCustomers} total customers
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Occupancy Rate
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {dashboardStats.occupancyPercentage}%
            </div>
            <p className="text-xs font-medium text-slate-600">
              {formatOccupancyStatus()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Booking Status
            </CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {dashboardStats.confirmedToday}
            </div>
            <p className="text-xs font-medium text-slate-600">
              Confirmed, {dashboardStats.pendingToday} pending
            </p>
          </CardContent>
        </Card>
      </div>
      


      {/* Analytics and Recent Bookings */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Analytics */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-slate-900">Booking Analytics</CardTitle>
            <CardDescription className="text-slate-600">
              Detailed breakdown of today's reservation activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">Confirmed</p>
                    <p className="text-2xl font-bold text-green-900">{dashboardStats.confirmedToday}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 uppercase tracking-wide">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">{dashboardStats.pendingToday}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700 mb-1">Customer Growth</p>
                <p className="text-lg font-bold text-slate-900">{formatGrowth(dashboardStats.newCustomersThisWeek)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Bookings */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-slate-900">Recent Bookings</CardTitle>
            <CardDescription className="text-slate-600">
              Latest reservation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <div key={booking.id} className={`flex items-center justify-between p-4 rounded-xl ${
                    index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  } border border-slate-100`}>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 text-sm">
                        {booking.customer.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        Party of {booking.party_size} • {' '}
                        {new Date(booking.booking_date).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })} {' '}
                        {booking.booking_time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : 
                        booking.status === "pending" ? "outline" : 
                        "destructive"
                      }
                      className={`capitalize ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-800 border-green-200" :
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="font-semibold text-slate-900">No recent bookings</p>
                  <p className="text-sm text-slate-600 mt-1">New reservations will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
