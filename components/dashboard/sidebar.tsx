"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Bookings", href: "/dashboard/bookings", icon: "📅" },
    { name: "Customers", href: "/dashboard/customers", icon: "👥" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ]

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-[220px] lg:w-[280px]'

  return (
    <aside className={`fixed top-0 left-0 z-40 ${sidebarWidth} h-full border-r border-slate-200 bg-white hidden md:block transition-all duration-300 ease-in-out`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center border-b border-slate-200 px-4 lg:px-6">
          <div className="flex items-center justify-between w-full">
            {isCollapsed ? (
              <div className="flex items-center justify-center w-full">
                <span className="text-xl">🍽️</span>
              </div>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
                <span className="text-2xl">🍽️</span>
                <span>Dona Theresa</span>
              </Link>
            )}
            
            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`h-8 w-8 p-0 hover:bg-slate-100 ${isCollapsed ? 'ml-0' : 'ml-2'} shrink-0`}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-6">
          <TooltipProvider delayDuration={0}>
            <ul className={`space-y-3 ${isCollapsed ? 'px-2' : 'px-4 lg:px-5'}`}>
              {menuItems.map((item) => {
                const isCurrentPage = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                
                const linkContent = (
                  <Link
                    href={item.href}
                    style={{
                      backgroundColor: isCurrentPage ? '#16a34a' : 'transparent',
                      color: isCurrentPage ? 'white' : '#475569',
                    }}
                    className={`flex items-center rounded-lg min-h-[48px] text-base font-semibold transition-all duration-200 ${
                      isCollapsed 
                        ? 'justify-center p-3' 
                        : 'gap-4 px-4 py-4'
                    }`}
                    onMouseEnter={(e) => {
                      if (!isCurrentPage) {
                        e.currentTarget.style.backgroundColor = '#f8fafc'
                        e.currentTarget.style.color = '#0f172a'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentPage) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#475569'
                      }
                    }}
                  >
                    <span className="text-lg min-w-[24px] flex items-center justify-center">
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="transition-opacity duration-300">{item.name}</span>
                    )}
                  </Link>
                )

                return (
                  <li key={item.name}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-2">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkContent
                    )}
                  </li>
                )
              })}
            </ul>
          </TooltipProvider>
        </nav>
      </div>
    </aside>
  )
} 