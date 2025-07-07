"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  ArrowRight,
  Settings2,
  Globe,
  Bell
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
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">Booking Settings</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
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

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">Locale Settings</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
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

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">Notification Settings</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Configure alerts, sounds, and notification preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-500 h-10"
            >
              <Link href="/dashboard/settings/notifications" className="flex items-center justify-center gap-2">
                Manage Notifications
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group opacity-50 bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              </div>
              <div>
                <CardTitle className="text-slate-500 text-base sm:text-lg">Staff Settings</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  User accounts and permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button disabled className="w-full h-10 bg-slate-100 text-slate-400 border-slate-200" variant="outline">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 