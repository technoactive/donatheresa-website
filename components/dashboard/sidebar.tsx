"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  console.log('Sidebar rendering, isCollapsed:', isCollapsed, 'mounted:', mounted)

  const handleToggle = () => {
    console.log('TOGGLE CLICKED! Current state:', isCollapsed)
    setIsCollapsed(!isCollapsed)
    console.log('New state will be:', !isCollapsed)
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Bookings", href: "/dashboard/bookings" },
    { name: "Customers", href: "/dashboard/customers" },
    { name: "Settings", href: "/dashboard/settings" },
  ]

  // Always render with expanded state until mounted to avoid hydration mismatch
  const currentCollapsed = mounted ? isCollapsed : false

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-full border-r border-slate-200 bg-white hidden md:block transition-all duration-300 ${
        currentCollapsed ? 'w-16' : 'w-[220px] lg:w-[280px]'
      }`}
      style={{ backgroundColor: currentCollapsed ? '#ffeeee' : '#ffffff' }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center border-b border-slate-200 px-4 lg:px-6">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="text-2xl">🍽️</span>
              {!currentCollapsed && <span>Dona Theresa</span>}
            </Link>
            
            {/* BIG RED TEST BUTTON */}
            <Button
              onClick={handleToggle}
              className="bg-red-500 hover:bg-red-600 text-white h-8 w-16 text-xs font-bold"
            >
              {currentCollapsed ? 'OPEN' : 'CLOSE'}
            </Button>
          </div>
        </header>
        
        {/* Show current state */}
        <div className="p-2 bg-yellow-200 text-black text-xs font-bold">
          STATE: {currentCollapsed ? 'COLLAPSED' : 'EXPANDED'} {!mounted && '(SSR)'}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-6">
          <ul className={`space-y-3 ${currentCollapsed ? 'px-2' : 'px-4 lg:px-5'}`}>
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
                      currentCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-4'
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
                    title={currentCollapsed ? item.name : undefined}
                  >
                    <span className="text-lg min-w-[24px]">
                      {item.name === 'Dashboard' && '🏠'}
                      {item.name === 'Bookings' && '📅'}
                      {item.name === 'Customers' && '👥'}
                      {item.name === 'Settings' && '⚙️'}
                    </span>
                    {!currentCollapsed && <span>{item.name}</span>}
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