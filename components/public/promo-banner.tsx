"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Flower2, X, Sparkles, ArrowRight, Calendar } from "lucide-react"

type PromoType = "valentines" | "mothers" | null

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(true) // Start hidden to prevent flash
  const [promoType, setPromoType] = useState<PromoType>(null)
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    setMounted(true)
    
    // Check if banner was dismissed in this session
    const wasDismissed = sessionStorage.getItem("promo-banner-dismissed")
    if (!wasDismissed) {
      setDismissed(false)
    }

    // Determine which promo to show based on current date
    const checkPromoType = () => {
      const now = new Date()
      const valentinesEnd = new Date("2026-02-14T23:59:59")
      const mothersDayEnd = new Date("2026-03-22T23:59:59")

      if (now <= valentinesEnd) {
        setPromoType("valentines")
        // Calculate time left
        const diff = valentinesEnd.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h left`)
        } else {
          setTimeLeft("Last chance!")
        }
      } else if (now <= mothersDayEnd) {
        setPromoType("mothers")
        const diff = mothersDayEnd.getTime() - now.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h left`)
        } else {
          setTimeLeft("Last chance!")
        }
      } else {
        setPromoType(null)
      }
    }

    checkPromoType()
    const interval = setInterval(checkPromoType, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem("promo-banner-dismissed", "true")
    // Dispatch event so header can adjust position
    window.dispatchEvent(new CustomEvent('promo-banner-dismissed'))
  }

  // Don't render anything if no promo or dismissed
  if (!mounted || dismissed || !promoType) return null

  const isValentines = promoType === "valentines"

  return (
    <>
      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes shimmer-bg {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float-heart {
          animation: float-heart 2s ease-in-out infinite;
        }
        .animate-shimmer-bg {
          background-size: 200% auto;
          animation: shimmer-bg 3s linear infinite;
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>

      <div 
        className={`relative overflow-hidden ${
          isValentines 
            ? "bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600" 
            : "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-500"
        } animate-shimmer-bg`}
      >
        {/* Floating decorative elements - Hidden on very small screens */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-heart opacity-20"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {isValentines ? (
                <Heart className="w-4 h-4 text-white fill-white" />
              ) : (
                <Flower2 className="w-4 h-4 text-white" />
              )}
            </div>
          ))}
        </div>

        {/* Sparkle accents */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
          <Sparkles className="w-5 h-5 text-white/50 animate-pulse" />
        </div>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:block">
          <Sparkles className="w-5 h-5 text-white/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Main content */}
        <div className="relative z-10 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 animate-pulse-scale">
              {isValentines ? (
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/80" />
              ) : (
                <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>

            {/* Text content */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white text-center">
              {/* Mobile: Compact text */}
              <span className="font-bold text-sm sm:text-base sm:hidden">
                {isValentines ? "Valentine's Day" : "Mother's Day"} Menu
              </span>
              
              {/* Desktop: Full text */}
              <span className="font-bold text-sm sm:text-base hidden sm:inline">
                {isValentines 
                  ? "Valentine's Day Special Menu" 
                  : "Mother's Day Special Menu"}
              </span>
              
              <span className="text-white/90 text-xs sm:text-sm hidden xs:inline">
                {isValentines 
                  ? "— Book your romantic dinner!" 
                  : "— Treat Mum to something special!"}
              </span>

              {/* Time left badge */}
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {timeLeft}
              </span>
            </div>

            {/* CTA Button */}
            <Link 
              href={isValentines ? "/menu/valentines-day" : "/menu/mothers-day"}
              className="flex-shrink-0 group flex items-center gap-1 bg-white text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
              style={{ color: isValentines ? "#e11d48" : "#d946ef" }}
            >
              <span className="hidden xs:inline">View Menu</span>
              <span className="xs:hidden">Book</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-full transition-colors ml-1"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Animated bottom border */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
          isValentines 
            ? "bg-gradient-to-r from-transparent via-white/50 to-transparent" 
            : "bg-gradient-to-r from-transparent via-white/50 to-transparent"
        }`} />
      </div>
    </>
  )
}
