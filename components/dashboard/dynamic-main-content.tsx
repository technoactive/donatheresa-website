"use client"

import type React from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { NotificationToastContainer } from "@/components/notifications/notification-toast"
import { useSidebar } from "@/lib/sidebar-context"

export function DynamicMainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const leftPadding = isCollapsed ? 'md:pl-16' : 'md:pl-[220px] lg:pl-[280px]'
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Fixed Header - always visible across all screen sizes */}
      <Header />
      
      {/* Fixed Sidebar - desktop only */}
      <Sidebar />

      {/* Main Content Area - scrollable with dynamic padding */}
      <main className={`pt-14 lg:pt-[60px] ${leftPadding} min-h-screen transition-all duration-300 ease-in-out`}>
        <div className="h-full overflow-auto p-4 md:p-6 lg:p-8 max-w-full">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </div>
      </main>
      
      {/* Toast notifications container */}
      <NotificationToastContainer />
    </div>
  )
} 