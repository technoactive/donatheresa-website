"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Calendar, ArrowRight, Phone, Gift } from "lucide-react"
import { christmasMenuDetails, christmasMenuPricing } from "@/lib/christmas-menu-data"
import { ChristmasStyles, Snowfall, FairyLights, Holly, GoldDivider, christmasScript, XMAS } from "@/components/public/christmas-theme"

const STORAGE_KEY = "christmas-popup-2026-dismissed"
const HIDDEN_ON = ["/menu/christmas", "/reserve", "/cancel-booking", "/reconfirm-booking"]

export function ChristmasPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (new Date() > christmasMenuDetails.showUntil) return
    if (HIDDEN_ON.some((p) => pathname?.startsWith(p))) return
    if (sessionStorage.getItem(STORAGE_KEY)) return

    // Mark as shown the moment it opens, so it appears once per session
    // even if the visitor navigates away without closing it.
    const t = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1")
      setOpen(true)
    }, 1800)
    return () => clearTimeout(t)
  }, [pathname])

  const dismiss = () => setOpen(false)
  const { lunch, dinner } = christmasMenuPricing

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => (v ? setOpen(true) : dismiss())}>
      <DialogPrimitive.Portal>
        <ChristmasStyles />
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl p-[2px] shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300 max-h-[calc(100vh-2rem)]"
          style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight}, ${XMAS.gold})` }}
        >
          <div className="grid md:grid-cols-5 rounded-[22px] overflow-hidden xmas-glow max-h-[calc(100vh-2rem-4px)] overflow-y-auto" style={{ backgroundColor: XMAS.cream }}>
            {/* Festive panel */}
            <div className="relative md:col-span-2 h-72 md:h-auto md:min-h-[24rem] overflow-hidden" style={{ backgroundColor: XMAS.burgundyDeep }}>
              <Image src="/christmas-dinner.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover opacity-60" priority />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(63,10,18,0.2), ${XMAS.burgundyDeep})` }} />
              <Snowfall count={26} />
              <FairyLights count={7} className="h-12 md:h-16" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pt-14">
                <p className={`${christmasScript.className} text-6xl md:text-7xl xmas-gold-text`}>Christmas</p>
                <p className="font-playfair tracking-[0.35em] uppercase text-sm md:text-base mt-1" style={{ color: XMAS.cream }}>Carte</p>
                <Holly size={44} className="mt-3" />
                <p className="text-xs mt-3 tracking-[0.2em] uppercase" style={{ color: "rgba(246,223,164,0.8)" }}>{christmasMenuDetails.dates}</p>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3 p-6 sm:p-8 md:p-10 relative">
              <DialogPrimitive.Close
                className="absolute right-4 top-4 rounded-full p-2 text-stone-500 hover:text-stone-900 hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e3b458]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </DialogPrimitive.Close>

              <DialogPrimitive.Title className="font-playfair text-2xl sm:text-3xl font-semibold leading-tight pr-8" style={{ color: XMAS.burgundy }}>
                Book your Christmas table in Hatch End
              </DialogPrimitive.Title>
              <p className="text-stone-600 mt-3 leading-relaxed">
                Norfolk roast turkey with all the trimmings, alongside our Italian classics. Two or three courses,
                lunch or dinner, all through December.
              </p>

              <GoldDivider className="my-5" />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ backgroundColor: XMAS.burgundy }}>
                  <Snowfall count={8} className="opacity-50" />
                  <div className="relative">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#f6dfa4]/80 mb-1">Lunch</div>
                    <div className="font-playfair text-3xl font-semibold text-[#f6dfa4]">£{lunch.twoCourse}</div>
                    <div className="text-xs text-white/75 mt-1">2 courses · 3 for £{lunch.threeCourse}</div>
                  </div>
                </div>
                <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ backgroundColor: XMAS.green }}>
                  <Snowfall count={8} className="opacity-50" />
                  <div className="relative">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#f6dfa4]/80 mb-1">Dinner</div>
                    <div className="font-playfair text-3xl font-semibold text-[#f6dfa4]">£{dinner.twoCourse}</div>
                    <div className="text-xs text-white/75 mt-1">2 courses · 3 for £{dinner.threeCourse}</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-2">Per person, plus {christmasMenuPricing.serviceCharge} service.</p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href="/menu/christmas"
                  onClick={dismiss}
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg transition-transform hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${XMAS.gold}, ${XMAS.goldLight})`, color: XMAS.burgundyDeep }}
                >
                  <Gift className="w-4 h-4" />
                  See the menu
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/reserve"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors hover:brightness-110"
                  style={{ backgroundColor: XMAS.green }}
                >
                  <Calendar className="w-4 h-4" />
                  Book a table
                </Link>
              </div>

              <a href="tel:02084215550" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mt-5">
                <Phone className="w-4 h-4" /> or call 020 8421 5550
              </a>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
