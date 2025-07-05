import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Fixed Header - always visible across all screen sizes */}
      <Header />
      
      {/* Fixed Sidebar - desktop only */}
      <Sidebar />

      {/* Main Content Area - scrollable */}
      <main className="pt-14 lg:pt-[60px] md:pl-[220px] lg:pl-[280px] min-h-screen">
        <div className="h-full overflow-auto p-4 md:p-6 lg:p-8 max-w-full">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
