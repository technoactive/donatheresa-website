import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
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
    if (change > 0) return `+${change} from yesterday`
    if (change < 0) return `${change} from yesterday`
    return 'No change from yesterday'
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here's an overview of your restaurant bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayBookings}</div>
            <p className="text-xs text-muted-foreground">
              {formatChange(dashboardStats.bookingChange)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Guests Today
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalGuestsToday}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalCustomers} total customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Occupancy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.occupancyPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {formatOccupancyStatus()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.confirmedToday}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed, {dashboardStats.pendingToday} pending
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Booking Analytics</CardTitle>
            <CardDescription>
              Key metrics for your restaurant operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Confirmed Today</p>
                  <p className="text-2xl font-bold">{dashboardStats.confirmedToday}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Pending Today</p>
                  <p className="text-2xl font-bold">{dashboardStats.pendingToday}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Customer Growth</p>
              <p className="text-lg font-semibold">{formatGrowth(dashboardStats.newCustomersThisWeek)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest reservation requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
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
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent bookings</p>
                  <p className="text-sm">New reservations will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
