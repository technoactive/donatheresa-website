"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Calendar, Home, Menu, UtensilsCrossed, Users, Settings } from "lucide-react"
import { useState, useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { RestaurantInfo } from "@/components/locale/restaurant-info"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/bookings", label: "Bookings", icon: Calendar, badge: 6 },
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
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
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:pl-[220px] lg:pl-[280px]">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col z-[60]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="grid gap-2 text-lg font-medium">
            <button
              onClick={() => handleLinkClick("/dashboard")}
              className="flex items-center gap-2 text-lg font-semibold mb-4 text-left hover:opacity-80"
            >
              <UtensilsCrossed className="h-6 w-6" />
              <span><RestaurantInfo type="name" fallback="Dona Theresa" /></span>
            </button>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground text-left transition-colors",
                  pathname === link.href && "bg-muted text-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
                {link.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {link.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {isMounted && (
          <h1 className="font-semibold text-lg hidden md:block">
            {navLinks.find((link) => link.href === pathname)?.label}
          </h1>
        )}
      </div>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8 bg-transparent">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </header>
  )
}
