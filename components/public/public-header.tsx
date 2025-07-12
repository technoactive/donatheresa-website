"use client"

import type React from "react"
import Link from "next/link"
import { Menu, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { RestaurantInfo } from "@/components/locale/restaurant-info"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact" },
]

export function PublicHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98])
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeSheet = () => setIsSheetOpen(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const elem = document.getElementById(href.substring(1))
      elem?.scrollIntoView({ behavior: "smooth" })
    }
    closeSheet()
  }

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 h-20 flex items-center"
      style={{ 
        backgroundColor: `rgba(0, 0, 0, ${scrolled ? 0.9 : 0.7})`,
        backdropFilter: `blur(${scrolled ? 16 : 8}px)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-zinc-900/80 to-black/80 backdrop-blur-xl" />
      <div className="absolute inset-0 border-b border-zinc-700/50" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <div className="space-y-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent tracking-tight">
              <RestaurantInfo type="name" fallback="DONA THERESA" className="uppercase" />
            </div>
            <div className="text-xs tracking-[0.3em] text-zinc-400 font-light -mt-1">
              CULINARY EXCELLENCE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "group relative text-sm font-medium transition-all duration-300",
                  pathname === link.href 
                    ? "text-white" 
                    : "text-zinc-300 hover:text-white"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                <div className={cn(
                  "absolute -bottom-1 left-0 h-px bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300",
                  pathname === link.href 
                    ? "w-full" 
                    : "w-0 group-hover:w-full"
                )} />
              </Link>
            </div>
          ))}
          
          <div>
            <Button
              asChild
              className="group relative px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-full text-sm font-medium border-0 overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <Link href="/reserve" className="flex items-center gap-2">
                <span>Reserve Table</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button 
                type="button"
                className="relative h-10 w-10 inline-flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl border border-zinc-700/50 hover:border-amber-500/70 text-white hover:bg-zinc-800/50 rounded-xl transition-all duration-300 group"
              >
                <Menu className="h-5 w-5 text-white group-hover:text-amber-400 transition-colors duration-300 pointer-events-none" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full bg-white backdrop-blur-xl border-slate-200 max-w-none"
            >
              <div className="p-6 border-b border-slate-200">
                <div>
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    <RestaurantInfo type="name" fallback="DONA THERESA" className="uppercase" />
                  </SheetTitle>
                  <div className="text-xs tracking-[0.2em] text-slate-500 font-light">
                    CULINARY EXCELLENCE
                  </div>
                </div>
              </div>
              
              <nav className="flex flex-col gap-3 p-6">
                {navLinks.map((link, index) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link.href)
                        closeSheet()
                      }}
                      className="group relative flex items-center gap-4 px-6 py-5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all duration-300"
                    >
                      <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-semibold text-lg">{link.label}</span>
                    </Link>
                  </div>
                ))}
                
                <div className="mt-8">
                  <Button
                    asChild
                    className="w-full py-6 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white rounded-xl text-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/reserve" onClick={closeSheet} className="flex items-center justify-center gap-3">
                      <span>Reserve Table</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
