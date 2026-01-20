'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  ShoppingCart, 
  Target,
  RefreshCw,
  ExternalLink,
  Bot,
  User,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  Calendar,
  TrendingDown
} from "lucide-react"

interface ErrorData {
  summary: {
    totalErrors: number
    botErrors: number
    realErrors: number
    uniquePaths: number
    periodDays: number
  }
  topPaths: Array<{
    path: string
    count: number
    lastSeen: string
    referrers: string[]
  }>
  recentErrors: Array<{
    id: string
    path: string
    url: string
    referrer: string | null
    created_at: string
    is_bot: boolean
  }>
}

interface BookingStats {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  totalGuests: number
  avgPartySize: number
  bookingsBySize: Record<number, number>
  bookingsByDay: Record<string, number>
  bookingsBySource: { website: number; dashboard: number }
  topCustomers: Array<{ name: string; email: string; bookings: number; segment: string }>
  conversionRate: number
  periodDays: number
}

export default function AnalyticsPage() {
  const [errorData, setErrorData] = useState<ErrorData | null>(null)
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [excludeBots, setExcludeBots] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [errorResponse, statsResponse] = await Promise.all([
        fetch(`/api/log-error?days=${period}&excludeBots=${excludeBots}`),
        fetch(`/api/analytics/booking-stats?days=${period}`)
      ])
      
      if (errorResponse.ok) {
        const data = await errorResponse.json()
        setErrorData(data)
      }
      
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setBookingStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [period, excludeBots])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get top party sizes sorted by count
  const getTopPartySizes = () => {
    if (!bookingStats?.bookingsBySize) return []
    return Object.entries(bookingStats.bookingsBySize)
      .map(([size, count]) => ({ size: parseInt(size), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
            <p className="text-slate-600 mt-2">
              Live data from your bookings database
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="errors">404 Errors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Bookings Analytics Tab */}
        <TabsContent value="bookings" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : bookingStats ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{bookingStats.totalBookings}</div>
                        <div className="text-sm text-slate-600">Total Bookings</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{bookingStats.confirmedBookings}</div>
                        <div className="text-sm text-slate-600">Confirmed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{bookingStats.totalGuests}</div>
                        <div className="text-sm text-slate-600">Total Guests</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{bookingStats.avgPartySize.toFixed(1)}</div>
                        <div className="text-sm text-slate-600">Avg Party Size</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Sources</CardTitle>
                  <CardDescription>Where bookings come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ExternalLink className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-blue-900">Website</span>
                      </div>
                      <div className="text-4xl font-bold text-blue-900">{bookingStats.bookingsBySource.website}</div>
                      <div className="text-sm text-blue-700 mt-1">
                        {bookingStats.totalBookings > 0 
                          ? `${Math.round((bookingStats.bookingsBySource.website / bookingStats.totalBookings) * 100)}%`
                          : '0%'
                        } of bookings
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-semibold text-green-900">Dashboard (Manual)</span>
                      </div>
                      <div className="text-4xl font-bold text-green-900">{bookingStats.bookingsBySource.dashboard}</div>
                      <div className="text-sm text-green-700 mt-1">
                        {bookingStats.totalBookings > 0 
                          ? `${Math.round((bookingStats.bookingsBySource.dashboard / bookingStats.totalBookings) * 100)}%`
                          : '0%'
                        } of bookings
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Table Sizes - LIVE DATA */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Table Sizes</CardTitle>
                  <CardDescription>Live data from your bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getTopPartySizes().map((item, index) => (
                      <div 
                        key={item.size}
                        className={`rounded-xl p-4 text-center border ${
                          index === 0 
                            ? 'bg-amber-50 border-amber-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className={`text-3xl font-bold ${index === 0 ? 'text-amber-900' : 'text-slate-900'}`}>
                          {item.count}
                        </div>
                        <div className={`text-sm ${index === 0 ? 'text-amber-700' : 'text-slate-600'}`}>
                          Table for {item.size}
                        </div>
                        {index === 0 && (
                          <Badge className="mt-2 bg-amber-200 text-amber-800">Most Popular</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Rate */}
              {bookingStats.cancelledBookings > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      Cancellations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-3xl font-bold text-red-600">{bookingStats.cancelledBookings}</div>
                        <div className="text-sm text-slate-600">Cancelled bookings</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-900">
                          {bookingStats.totalBookings > 0 
                            ? `${Math.round((bookingStats.cancelledBookings / bookingStats.totalBookings) * 100)}%`
                            : '0%'
                          }
                        </div>
                        <div className="text-sm text-slate-600">Cancellation rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <p>Failed to load booking data. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : bookingStats?.topCustomers ? (
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Your most loyal guests in the last {period} days</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingStats.topCustomers.length > 0 ? (
                  <div className="space-y-3">
                    {bookingStats.topCustomers.map((customer, index) => (
                      <div 
                        key={customer.email}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                        } border`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-amber-500' : 
                            index === 1 ? 'bg-slate-400' : 
                            index === 2 ? 'bg-amber-700' : 'bg-slate-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{customer.name}</div>
                            <div className="text-sm text-slate-500">{customer.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            customer.segment === 'vip' ? 'default' :
                            customer.segment === 'regular' ? 'secondary' : 'outline'
                          } className={
                            customer.segment === 'vip' ? 'bg-purple-100 text-purple-800' :
                            customer.segment === 'regular' ? 'bg-blue-100 text-blue-800' : ''
                          }>
                            {customer.segment}
                          </Badge>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-900">{customer.bookings}</div>
                            <div className="text-xs text-slate-500">bookings</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No customer data available for this period
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* 404 Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Label>Time Period:</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="14">Last 14 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="exclude-bots"
                    checked={excludeBots}
                    onCheckedChange={setExcludeBots}
                  />
                  <Label htmlFor="exclude-bots">Exclude bot traffic</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : errorData ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{errorData.summary.realErrors}</div>
                        <div className="text-sm text-slate-600">Real 404s</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{errorData.summary.botErrors}</div>
                        <div className="text-sm text-slate-600">Bot Requests</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{errorData.summary.uniquePaths}</div>
                        <div className="text-sm text-slate-600">Unique Paths</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{errorData.summary.periodDays}d</div>
                        <div className="text-sm text-slate-600">Period</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top 404 Paths */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 404 Pages</CardTitle>
                  <CardDescription>
                    Pages that visitors are trying to access but don't exist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {errorData.topPaths.length > 0 ? (
                    <div className="space-y-3">
                      {errorData.topPaths.map((item, index) => (
                        <div
                          key={item.path}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                          } border`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm text-slate-900 truncate">
                              {item.path}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Last seen: {formatDate(item.lastSeen)}
                              {item.referrers.length > 0 && (
                                <span className="ml-2">
                                  • From: {item.referrers.slice(0, 2).join(', ')}
                                  {item.referrers.length > 2 && ` +${item.referrers.length - 2} more`}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge variant={item.count > 5 ? 'destructive' : 'secondary'}>
                            {item.count} hits
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p className="font-medium">No 404 errors found</p>
                      <p className="text-sm">Great! Your website has no broken links.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Errors */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent 404 Errors</CardTitle>
                  <CardDescription>Most recent page not found errors from real visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  {errorData.recentErrors.length > 0 ? (
                    <div className="space-y-2">
                      {errorData.recentErrors.map((error) => (
                        <div
                          key={error.id}
                          className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg text-sm"
                        >
                          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono truncate">{error.path}</div>
                            {error.referrer && (
                              <div className="text-xs text-slate-500 truncate">
                                From: {error.referrer}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex-shrink-0">
                            {formatDate(error.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No recent errors from real visitors
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <p>Failed to load error data. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Live Performance Insights
              </CardTitle>
              <CardDescription>Based on your actual booking data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookingStats && (
                <>
                  {/* Website vs Dashboard bookings insight */}
                  {bookingStats.bookingsBySource.website > bookingStats.bookingsBySource.dashboard && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-green-900">Website Bookings Dominant</div>
                          <p className="text-sm text-green-700 mt-1">
                            {Math.round((bookingStats.bookingsBySource.website / bookingStats.totalBookings) * 100)}% of bookings come from your website.
                            Your online presence is working well!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Low cancellation rate */}
                  {bookingStats.totalBookings > 0 && (bookingStats.cancelledBookings / bookingStats.totalBookings) < 0.1 && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-green-900">Low Cancellation Rate</div>
                          <p className="text-sm text-green-700 mt-1">
                            Only {Math.round((bookingStats.cancelledBookings / bookingStats.totalBookings) * 100)}% cancellation rate.
                            Customers are committed to their reservations!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* High cancellation warning */}
                  {bookingStats.totalBookings > 0 && (bookingStats.cancelledBookings / bookingStats.totalBookings) >= 0.1 && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-amber-900">Higher Cancellation Rate</div>
                          <p className="text-sm text-amber-700 mt-1">
                            {Math.round((bookingStats.cancelledBookings / bookingStats.totalBookings) * 100)}% cancellation rate.
                            Consider:
                          </p>
                          <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                            <li>Sending reminder emails closer to booking date</li>
                            <li>Implementing a deposit system</li>
                            <li>Making cancellation policy clearer</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Average party size insight */}
                  {bookingStats.avgPartySize >= 3 && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-blue-900">Good Average Party Size</div>
                          <p className="text-sm text-blue-700 mt-1">
                            Average of {bookingStats.avgPartySize.toFixed(1)} guests per booking.
                            You're attracting group diners which typically spend more.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 404 Errors insight */}
              {errorData && errorData.summary.realErrors > 5 && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-900">404 Errors Detected</div>
                      <p className="text-sm text-red-700 mt-1">
                        {errorData.summary.realErrors} broken links found. Check the 404 Errors tab to fix them.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errorData && errorData.summary.realErrors === 0 && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-green-900">No Broken Links</div>
                      <p className="text-sm text-green-700 mt-1">
                        Your website has no 404 errors from real visitors. Great job!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Summary */}
          {bookingStats && (
            <Card>
              <CardHeader>
                <CardTitle>Period Summary</CardTitle>
                <CardDescription>Last {period} days at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900">{bookingStats.totalBookings}</div>
                    <div className="text-sm text-slate-600">Total Bookings</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900">{bookingStats.totalGuests}</div>
                    <div className="text-sm text-slate-600">Total Guests</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900">
                      £{(bookingStats.totalGuests * 25).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Est. Revenue</div>
                    <div className="text-xs text-slate-400">at £25/guest</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900">
                      {bookingStats.topCustomers.filter(c => c.segment === 'vip' || c.segment === 'regular').length}
                    </div>
                    <div className="text-sm text-slate-600">Returning Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
