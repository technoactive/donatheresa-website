"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Reserve", href: "/reserve" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      {/* Top Bar with fixed height */}
      <div className="bg-slate-900 text-white py-2 hidden md:block h-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between text-sm h-6">
            <div className="flex items-center space-x-6">
              <a href="tel:02084215550" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span>020 8421 5550</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>451 Uxbridge Road, Pinner</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mon-Sun: 12:00 - 22:30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with fixed height */}
      <header
        className={cn(
          "fixed top-0 md:top-10 left-0 right-0 z-50 transition-all duration-300 h-20",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo with fixed dimensions */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow" />
                <div className="absolute inset-[2px] bg-white rounded-md flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    DT
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-slate-900">Dona Theresa</h1>
                <p className="text-xs text-slate-600">Italian Restaurant</p>
              </div>
            </Link>

            {/* Desktop Navigation with fixed height items */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 h-10 flex items-center",
                    pathname === item.href
                      ? "bg-amber-100 text-amber-900"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons with fixed dimensions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-amber-500 text-amber-600 hover:bg-amber-50 h-10 px-4"
              >
                <a href="tel:02084215550">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              
              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl h-10 px-6"
              >
                <Link href="/reserve">
                  Book Table
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button with fixed size */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump - matches header height */}
      <div className="h-20 md:h-[120px]" />

      {/* Mobile Menu with smooth transition */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div
          className={cn(
            "absolute right-0 top-20 bottom-0 w-80 max-w-[calc(100vw-3rem)] bg-white shadow-2xl transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="p-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-colors h-12",
                  pathname === item.href
                    ? "bg-amber-100 text-amber-900"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-6 space-y-3 border-t border-slate-200 mt-6">
              <Button
                variant="outline"
                className="w-full justify-center border-amber-500 text-amber-600 hover:bg-amber-50 h-12"
                asChild
              >
                <a href="tel:02084215550">
                  <Phone className="w-4 h-4 mr-2" />
                  020 8421 5550
                </a>
              </Button>
              
              <Button
                className="w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12"
                asChild
              >
                <Link href="/reserve" onClick={() => setIsMobileMenuOpen(false)}>
                  Reserve Table
                </Link>
              </Button>
            </div>
            
            <div className="pt-6 border-t border-slate-200 mt-6">
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>451 Uxbridge Road, Pinner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sun: 12:00 - 22:30</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
