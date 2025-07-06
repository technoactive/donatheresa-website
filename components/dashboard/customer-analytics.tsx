"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCustomerSegmentInfo, formatCustomerStats } from "@/lib/utils"
import type { Customer } from "@/lib/types"

// Customer segment summary component
const CustomerSegmentSummary = ({ customers }: { customers: Customer[] }) => {
  const segmentCounts = React.useMemo(() => {
    const counts = {
      new: 0,
      regular: 0,
      vip: 0,
      inactive: 0
    }
    
    customers.forEach(customer => {
      const segment = customer.customer_segment || 'new'
      counts[segment as keyof typeof counts]++
    })
    
    return counts
  }, [customers])

  const totalCustomers = customers.length
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(segmentCounts).map(([segment, count]) => {
        const segmentInfo = getCustomerSegmentInfo(segment)
        const percentage = totalCustomers > 0 ? ((count / totalCustomers) * 100).toFixed(1) : '0'
        
        return (
          <Card key={segment} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={`${segmentInfo.color} border`}>
                  {segmentInfo.label}
                </Badge>
                <span className="text-2xl font-bold text-slate-900">{count}</span>
              </div>
              <div className="text-sm text-slate-600">
                {percentage}% of customers
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {segmentInfo.description}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Top customers component
const TopCustomers = ({ customers }: { customers: Customer[] }) => {
  const topCustomers = React.useMemo(() => {
    return customers
      .filter(customer => (customer.total_bookings || 0) > 0)
      .sort((a, b) => (b.total_bookings || 0) - (a.total_bookings || 0))
      .slice(0, 5)
  }, [customers])

  if (topCustomers.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-500 py-4">
            No booking data available yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, index) => {
            const segmentInfo = getCustomerSegmentInfo(customer.customer_segment)
            const stats = formatCustomerStats(customer)
            
            return (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{customer.name}</span>
                      <Badge variant="outline" className={`text-xs ${segmentInfo.color} border`}>
                        {segmentInfo.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900">{stats.totalBookings}</div>
                  <div className="text-xs text-slate-600">bookings</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Customer insights component
const CustomerInsights = ({ customers }: { customers: Customer[] }) => {
  const insights = React.useMemo(() => {
    const totalCustomers = customers.length
    const customersWithBookings = customers.filter(c => (c.total_bookings || 0) > 0).length
    const totalBookings = customers.reduce((sum, c) => sum + (c.total_bookings || 0), 0)
    const avgBookingsPerCustomer = customersWithBookings > 0 ? (totalBookings / customersWithBookings).toFixed(1) : '0'
    
    const recentActiveCustomers = customers.filter(c => (c.recent_bookings || 0) > 0).length
    const activenessRate = totalCustomers > 0 ? ((recentActiveCustomers / totalCustomers) * 100).toFixed(1) : '0'
    
    const avgPartySize = customers
      .filter(c => (c.average_party_size || 0) > 0)
      .reduce((sum, c, _, arr) => sum + ((c.average_party_size || 0) / arr.length), 0)
      .toFixed(1) || '0'

    return {
      totalCustomers,
      customersWithBookings,
      totalBookings,
      avgBookingsPerCustomer,
      recentActiveCustomers,
      activenessRate,
      avgPartySize
    }
  }, [customers])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-slate-600 mb-1">Total Customers</div>
          <div className="text-2xl font-bold text-slate-900">{insights.totalCustomers}</div>
          <div className="text-xs text-slate-500">
            {insights.customersWithBookings} have made bookings
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-slate-600 mb-1">Recent Activity</div>
          <div className="text-2xl font-bold text-slate-900">{insights.activenessRate}%</div>
          <div className="text-xs text-slate-500">
            {insights.recentActiveCustomers} active in last 90 days
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-slate-600 mb-1">Avg Bookings</div>
          <div className="text-2xl font-bold text-slate-900">{insights.avgBookingsPerCustomer}</div>
          <div className="text-xs text-slate-500">
            per active customer
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export interface CustomerAnalyticsProps {
  customers: Customer[]
}

export function CustomerAnalytics({ customers }: CustomerAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Overview</h3>
        <CustomerInsights customers={customers} />
      </div>
      
      {/* Customer Segments */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Segments</h3>
        <CustomerSegmentSummary customers={customers} />
      </div>
      
      {/* Top Customers */}
      <div>
        <TopCustomers customers={customers} />
      </div>
    </div>
  )
} 