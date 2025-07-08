import type React from "react"
import { NotificationProvider } from "@/components/notifications/notification-provider"
import { RealtimeNotifications } from "@/components/notifications/realtime-notifications"
import { SidebarProvider } from "@/lib/sidebar-context"
import { DynamicMainContent } from "@/components/dashboard/dynamic-main-content"
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
    <SidebarProvider>
      <NotificationProvider>
        <RealtimeNotifications>
          <DynamicMainContent>
            {children}
          </DynamicMainContent>
        </RealtimeNotifications>
      </NotificationProvider>
    </SidebarProvider>
  )
}
