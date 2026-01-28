"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  ArrowRight,
  User,
  Globe,
  Bell,
  Mail,
  BarChart3,
  CreditCard
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
              <div className="p-2 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">User Settings</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Manage your account and profile information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-slate-600 hover:bg-slate-700 text-white group-hover:bg-slate-500 h-10"
            >
              <Link href="/dashboard/settings/user" className="flex items-center justify-center gap-2">
                Manage Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

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

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">Email Settings</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Configure email notifications, templates, and delivery
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white group-hover:bg-purple-500 h-10"
            >
              <Link href="/dashboard/settings/email" className="flex items-center justify-center gap-2">
                Manage Email Settings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">Google Analytics</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Configure website tracking and analytics
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white group-hover:bg-indigo-500 h-10"
            >
              <Link href="/dashboard/settings/analytics" className="flex items-center justify-center gap-2">
                Manage Analytics
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900 text-base sm:text-lg">Deposit Settings</CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  Configure booking deposits and payment collection
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Button 
              asChild 
              className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-500 h-10"
            >
              <Link href="/dashboard/settings/deposits" className="flex items-center justify-center gap-2">
                Manage Deposits
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 