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
  Loader2
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

export default function AnalyticsPage() {
  const [errorData, setErrorData] = useState<ErrorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [excludeBots, setExcludeBots] = useState(true)

  const fetchErrors = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/log-error?days=${period}&excludeBots=${excludeBots}`)
      if (response.ok) {
        const data = await response.json()
        setErrorData(data)
      }
    } catch (error) {
      console.error('Failed to fetch error data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchErrors()
  }, [period, excludeBots])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
            <p className="text-slate-600 mt-2">
              Track website performance, conversion funnel, and identify issues
            </p>
          </div>
          <Button onClick={fetchErrors} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="funnel" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="errors">404 Errors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Conversion Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Booking Conversion Funnel
              </CardTitle>
              <CardDescription>
                Based on your GA4 data from the last 28 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Funnel Visualization */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-blue-100 rounded-lg p-4 text-center">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">804</div>
                    <div className="text-sm text-blue-700">New Visitors</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 bg-amber-100 rounded-lg p-4 text-center">
                    <ShoppingCart className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-900">55</div>
                    <div className="text-sm text-amber-700">Started Checkout</div>
                    <div className="text-xs text-amber-600 mt-1">6.8% of visitors</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 bg-green-100 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">36</div>
                    <div className="text-sm text-green-700">Bookings</div>
                    <div className="text-xs text-green-600 mt-1">65% completion</div>
                  </div>
                </div>

                {/* Funnel Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">4.5%</div>
                    <div className="text-sm text-slate-600">Overall Conversion</div>
                    <div className="text-xs text-green-600 mt-1">↑ Good for restaurants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">65%</div>
                    <div className="text-sm text-slate-600">Checkout Completion</div>
                    <div className="text-xs text-amber-600 mt-1">19 abandoned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">£900</div>
                    <div className="text-sm text-slate-600">Est. Revenue/Week</div>
                    <div className="text-xs text-slate-500 mt-1">At £25 avg.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Organic Search (Google)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">60%</span>
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium">Direct</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">39%</span>
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '39%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="font-medium">Social Media</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">1%</span>
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '1%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Table Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Booking Sizes</CardTitle>
              <CardDescription>Table sizes that customers book most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900">44</div>
                  <div className="text-sm text-amber-700">Table for 4</div>
                  <Badge className="mt-2 bg-amber-200 text-amber-800">Most Popular</Badge>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                  <div className="text-3xl font-bold text-slate-900">24</div>
                  <div className="text-sm text-slate-600">Table for 6</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                  <div className="text-3xl font-bold text-slate-900">22</div>
                  <div className="text-sm text-slate-600">Table for 2</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                  <div className="text-3xl font-bold text-slate-900">21</div>
                  <div className="text-sm text-slate-600">Table for 3</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Good Insights */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-900">Strong Organic Traffic</div>
                    <p className="text-sm text-green-700 mt-1">
                      60% of your traffic comes from Google searches. Your SEO strategy is working well!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-900">Good Checkout Completion</div>
                    <p className="text-sm text-green-700 mt-1">
                      65% of people who start booking complete it. Industry average is around 50-60%.
                    </p>
                  </div>
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-900">Abandoned Checkouts</div>
                    <p className="text-sm text-amber-700 mt-1">
                      19 people started booking but didn't complete. Consider adding:
                    </p>
                    <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                      <li>Progress indicator showing steps</li>
                      <li>Trust badges near the submit button</li>
                      <li>Clearer confirmation of what happens after booking</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-900">Social Media Opportunity</div>
                    <p className="text-sm text-blue-700 mt-1">
                      Only 1% of traffic comes from social media. Posting more frequently on Instagram 
                      and TikTok could bring more customers, especially for special menus like Valentine's Day.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>Quick wins to improve your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-medium">Add Progress Steps to Booking Form</div>
                    <div className="text-sm text-slate-600">Show customers they're almost done</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">High Impact</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-medium">Post Valentine's Menu on Social</div>
                    <div className="text-sm text-slate-600">71 views already, amplify with posts</div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700">Medium</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-medium">Fix Any 404 Errors</div>
                    <div className="text-sm text-slate-600">Check the errors tab for broken links</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Maintenance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
