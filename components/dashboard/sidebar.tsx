"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Bookings", href: "/dashboard/bookings" },
    { name: "Customers", href: "/dashboard/customers" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <aside className="fixed top-0 left-0 z-40 h-full w-[220px] lg:w-[280px] border-r border-slate-200 bg-white hidden md:block">
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center border-b border-slate-200 px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="text-2xl">🍽️</span>
            <span>Dona Theresa</span>
          </Link>
        </header>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-6">
          <ul className="space-y-3 px-4 lg:px-5">
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
                    className="flex items-center gap-4 px-4 py-4 rounded-lg min-h-[48px] text-base font-semibold transition-all duration-200"
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
                    <span className="text-lg min-w-[24px]">
                      {item.name === 'Dashboard' && '🏠'}
                      {item.name === 'Bookings' && '📅'}
                      {item.name === 'Customers' && '👥'}
                      {item.name === 'Analytics' && '📊'}
                      {item.name === 'Settings' && '⚙️'}
                    </span>
                    <span>{item.name}</span>
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