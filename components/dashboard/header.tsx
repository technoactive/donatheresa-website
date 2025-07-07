"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, UtensilsCrossed, X } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { NotificationCenter } from "@/components/notifications/notification-center"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/bookings", label: "Bookings" },
    { href: "/dashboard/customers", label: "Customers" },
    { href: "/dashboard/settings", label: "Settings" },
  ]

  // Handle mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm px-4 lg:h-[60px] lg:px-6 md:pl-[220px] lg:pl-[280px]">
      {/* Sidebar area overlay with right border to continue the line */}
      <div className="absolute top-0 left-0 w-[220px] lg:w-[280px] h-full border-r border-slate-200 bg-white/95 backdrop-blur-sm hidden md:block">
        {/* Restaurant name */}
        <div className="flex h-full items-center px-4 lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900 hover:text-slate-700 transition-colors">
            <UtensilsCrossed className="h-5 w-5 lg:h-6 lg:w-6 text-slate-700" />
            <span className="truncate">Dona Theresa</span>
          </Link>
        </div>
      </div>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-white border-slate-200 hover:bg-slate-50" style={{ color: '#16a34a' }}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col z-[60] bg-white border-slate-200 [&>button]:hidden">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          
          {/* Header */}
          <header className="flex h-14 items-center justify-between border-b border-slate-200 px-4 mb-4">
            <button
              onClick={() => handleLinkClick("/dashboard")}
              className="flex items-center gap-2 font-semibold text-slate-900 hover:text-slate-700 transition-colors"
            >
              <span className="text-2xl">🍽️</span>
              <span>Dona Theresa</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              style={{ color: '#16a34a' }}
            >
              <X className="h-6 w-6 font-bold" strokeWidth={3} />
            </button>
          </header>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-auto py-6">
            <ul className="space-y-3 px-4">
              {navLinks.map((link) => {
                const isCurrentPage = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))
                
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      style={{
                        backgroundColor: isCurrentPage ? '#16a34a' : 'transparent',
                        color: isCurrentPage ? 'white' : '#475569',
                      }}
                      className="flex items-center gap-4 rounded-lg px-4 py-4 min-h-[48px] text-base font-semibold transition-all duration-200 text-left w-full"
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
                        {link.label === 'Dashboard' && '🏠'}
                        {link.label === 'Bookings' && '📅'}
                        {link.label === 'Customers' && '👥'}
                        {link.label === 'Settings' && '⚙️'}
                      </span>
                      <span>{link.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1 relative z-10">
        {isMounted && (
          <h1 className="font-semibold text-lg text-slate-900 hidden md:block ml-6">
            {navLinks.find((link) => link.href === pathname)?.label}
          </h1>
        )}
      </div>
      
      <div className="ml-auto relative z-10">
        <NotificationCenter />
      </div>
    </header>
  )
}
