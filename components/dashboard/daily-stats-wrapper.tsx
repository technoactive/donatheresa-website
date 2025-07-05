"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { DailyStats } from "@/components/dashboard/daily-stats"
import type { Booking } from "@/lib/types"

interface DailyStatsWrapperProps {
  bookings: Booking[]
}

export function DailyStatsWrapper({ bookings }: DailyStatsWrapperProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading skeleton until mounted
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <div className="w-[280px] h-10 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-6">
                <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-8 bg-muted animate-pulse rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render actual component after mounting
  return <DailyStats bookings={bookings} />
} 