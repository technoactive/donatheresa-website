import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { RealtimeNotifications } from "@/components/notifications/realtime-notifications"
import { DynamicSchema } from "@/components/locale/dynamic-schema"

// Force dynamic rendering for all dashboard routes
export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <DynamicSchema />
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="py-6 px-4 sm:px-6 lg:px-8 mt-16">
            {children}
          </main>
        </div>
        <RealtimeNotifications />
      </div>
    </NotificationProvider>
  )
}
