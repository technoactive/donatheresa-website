/**
 * Email Analytics Dashboard Component
 * Display comprehensive email performance metrics and charts
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Mail, 
  Eye, 
  MousePointer, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { EmailAnalytics } from '@/lib/email/types';

interface EmailAnalyticsDashboardProps {
  analytics: EmailAnalytics | null;
}

export function EmailAnalyticsDashboard({ analytics }: EmailAnalyticsDashboardProps) {
  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No email analytics data available</p>
      </div>
    );
  }

  // Calculate trends (mock data for now)
  const trends = {
    sent: +12,
    delivered: +8,
    opened: +15,
    clicked: +5
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSent.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <p className="text-xs text-green-600">+{trends.sent}% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.deliveryRate.toFixed(1)}%</div>
            <Progress value={analytics.deliveryRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.totalDelivered} of {analytics.totalSent} delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openRate.toFixed(1)}%</div>
            <Progress value={analytics.openRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.totalOpened} emails opened
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickRate.toFixed(1)}%</div>
            <Progress value={analytics.clickRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.totalClicked} links clicked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Email Status Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of email delivery statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Delivered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{analytics.totalDelivered}</span>
                  <Badge variant="outline">{analytics.deliveryRate.toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={analytics.deliveryRate} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Opened</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{analytics.totalOpened}</span>
                  <Badge variant="outline">{analytics.openRate.toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={analytics.openRate} className="h-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MousePointer className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Clicked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{analytics.totalClicked}</span>
                  <Badge variant="outline">{analytics.clickRate.toFixed(1)}%</Badge>
                </div>
              </div>
              <Progress value={analytics.clickRate} className="h-2" />

              {analytics.totalBounced > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Bounced</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{analytics.totalBounced}</span>
                      <Badge variant="outline">{analytics.bounceRate.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={analytics.bounceRate} className="h-2" />
                </>
              )}

              {analytics.totalFailed > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Failed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{analytics.totalFailed}</span>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Template Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Template Performance
            </CardTitle>
            <CardDescription>
              Performance metrics by email template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.templateStats.length > 0 ? (
              <div className="space-y-4">
                {analytics.templateStats.slice(0, 5).map((template, index) => (
                  <div key={template.template_key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{template.template_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.sent} sent • {template.opened} opened
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{template.open_rate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">open rate</p>
                      </div>
                    </div>
                    <Progress value={template.open_rate} className="h-1" />
                    {index < analytics.templateStats.length - 1 && index < 4 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No template data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      {analytics.dailyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Email Activity
            </CardTitle>
            <CardDescription>
              Email sending and engagement over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple bar chart representation */}
              <div className="grid gap-2">
                {analytics.dailyStats.slice(-7).map((day, index) => {
                  const maxValue = Math.max(...analytics.dailyStats.map(d => d.sent));
                  const sentPercentage = maxValue > 0 ? (day.sent / maxValue) * 100 : 0;
                  const openedPercentage = day.sent > 0 ? (day.opened / day.sent) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en-GB', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span>{day.sent} sent</span>
                          <span className="text-muted-foreground">{day.opened} opened</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <Progress value={sentPercentage} className="h-2" />
                          <div 
                            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(day.opened / maxValue) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Sent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Opened</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Email Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Email Activity
          </CardTitle>
          <CardDescription>
            Latest email sends and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentEmails.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentEmails.slice(0, 10).map((email, index) => (
                <div key={email.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{email.subject}</p>
                      <Badge 
                        variant={
                          email.status === 'delivered' || email.status === 'sent' ? 'default' :
                          email.status === 'opened' || email.status === 'clicked' ? 'default' :
                          email.status === 'failed' || email.status === 'bounced' ? 'destructive' :
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {email.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      To: {email.recipient_email} • {email.template_key.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(email.created_at).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(email.created_at).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent email activity
            </div>
          )}
        </CardContent>
      </Card>

      {/* Industry Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmarks</CardTitle>
          <CardDescription>
            How your email performance compares to restaurant industry averages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Delivery Rate</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">{analytics.deliveryRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Industry avg: 95%</p>
              </div>
              <Badge variant={analytics.deliveryRate >= 95 ? "default" : "secondary"}>
                {analytics.deliveryRate >= 95 ? "Excellent" : "Good"}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Open Rate</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">{analytics.openRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Industry avg: 25%</p>
              </div>
              <Badge variant={analytics.openRate >= 25 ? "default" : "secondary"}>
                {analytics.openRate >= 25 ? "Above Average" : "Below Average"}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Click Rate</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-600">{analytics.clickRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Industry avg: 3%</p>
              </div>
              <Badge variant={analytics.clickRate >= 3 ? "default" : "secondary"}>
                {analytics.clickRate >= 3 ? "Above Average" : "Below Average"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 