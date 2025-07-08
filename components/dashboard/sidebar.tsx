"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Bookings", href: "/dashboard/bookings" },
    { name: "Customers", href: "/dashboard/customers" },
    { name: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <aside className={`fixed top-0 left-0 z-40 h-full border-r border-slate-200 bg-white hidden md:block transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[220px] lg:w-[280px]'}`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center border-b border-slate-200 px-4 lg:px-6">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="text-2xl">🍽️</span>
              {!isCollapsed && <span>Dona Theresa</span>}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0 hover:bg-slate-100"
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
          <ul className={`space-y-3 ${isCollapsed ? 'px-2' : 'px-4 lg:px-5'}`}>
            {menuItems.map((item) => {
              const isCurrentPage = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    style={{
                      backgroundColor: isCurrentPage ? '#16a34a' : 'transparent',
                      color: isCurrentPage ? 'white' : '#475569',
                    }}
                    className={`flex items-center rounded-lg min-h-[48px] text-base font-semibold transition-all duration-200 ${
                      isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-4'
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
                    title={isCollapsed ? item.name : undefined}
                  >
                    <span className="text-lg min-w-[24px]">
                      {item.name === 'Dashboard' && '🏠'}
                      {item.name === 'Bookings' && '📅'}
                      {item.name === 'Customers' && '👥'}
                      {item.name === 'Settings' && '⚙️'}
                    </span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
} 