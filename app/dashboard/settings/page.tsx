"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  ArrowRight,
  Settings2,
  Globe
} from "lucide-react"
import { SettingsLayout } from "@/components/dashboard/settings-layout"

export default function SettingsPage() {
  return (
    <SettingsLayout
      title="Settings"
      description="Manage your restaurant's system settings"
      showBackButton={false}
    >
      {/* Settings Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-zinc-900/50 border-zinc-700 flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-white text-base sm:text-lg">Booking Settings</CardTitle>
                <CardDescription className="text-zinc-400 text-sm">
                  Configure reservations, time slots, and availability
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white group-hover:bg-amber-500 h-10"
            >
              <Link href="/dashboard/settings/bookings" className="flex items-center justify-center gap-2">
                Manage Booking Settings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-zinc-900/50 border-zinc-700 flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-white text-base sm:text-lg">Locale Settings</CardTitle>
                <CardDescription className="text-zinc-400 text-sm">
                  Configure timezone, currency, and formatting
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group-hover:bg-emerald-500 h-10"
            >
              <Link href="/dashboard/settings/locale" className="flex items-center justify-center gap-2">
                Manage Locale Settings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group opacity-50 bg-zinc-900/30 border-zinc-700/50 flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-500/10 rounded-lg">
                <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
              </div>
              <div>
                <CardTitle className="text-zinc-500 text-base sm:text-lg">Staff Settings</CardTitle>
                <CardDescription className="text-zinc-600 text-sm">
                  User accounts and permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button disabled className="w-full h-10" variant="outline">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 