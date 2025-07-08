import type React from "react"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { RealtimeNotifications } from "@/components/notifications/realtime-notifications"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { NotificationToastContainer } from "@/components/notifications/notification-toast"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  return (
    <NotificationProvider>
      <RealtimeNotifications>
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
          {/* Fixed Header - always visible across all screen sizes */}
          <Header />
          
          {/* Fixed Sidebar - desktop only */}
          <Sidebar />

          {/* Main Content Area - scrollable with fixed padding */}
          <main className="pt-14 lg:pt-[60px] md:pl-[220px] lg:pl-[280px] min-h-screen">
            <div className="h-full overflow-auto p-4 md:p-6 lg:p-8 max-w-full">
              <div className="mx-auto max-w-7xl w-full">
                {children}
              </div>
            </div>
          </main>
          
          {/* Toast notifications container */}
          <NotificationToastContainer />
        </div>
      </RealtimeNotifications>
    </NotificationProvider>
  )
}
