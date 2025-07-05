"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { RestaurantInfo } from "@/components/locale/restaurant-info"
import { Bell, Home, Calendar, Users, UtensilsCrossed, Settings } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/bookings", label: "Bookings", icon: Calendar, badge: 6 },
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed top-0 left-0 z-40 w-[220px] lg:w-[280px] h-full border-r bg-muted/40 hidden md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <UtensilsCrossed className="h-6 w-6" />
            <span className=""><RestaurantInfo type="name" fallback="Dona Theresa" /></span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8 bg-transparent">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === link.href && "bg-muted text-primary",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {link.badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
