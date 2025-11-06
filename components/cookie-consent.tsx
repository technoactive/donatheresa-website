'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cookie, X, Check, Settings2, Shield, BarChart3, Megaphone, Wrench } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

const COOKIE_CONSENT_KEY = 'dona-theresa-cookie-consent'
const COOKIE_PREFERENCES_KEY = 'dona-theresa-cookie-preferences'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be changed
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!hasConsented) {
      // Small delay before showing to improve UX
      setTimeout(() => setShowBanner(true), 1500)
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    savePreferences(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    savePreferences(onlyNecessary)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs))
    setShowBanner(false)
    setShowSettings(false)
    
    // Trigger Google Analytics based on preferences
    if (prefs.analytics && typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      })
    } else if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setShowBanner(false)}
          />
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed z-50",
            "bottom-0 left-0 right-0", // Mobile: full width bottom sheet
            "lg:bottom-6 lg:left-6 lg:right-auto lg:w-[440px]", // Desktop: bottom left corner
            "px-4 pb-4 pt-0", // Mobile padding
            "lg:p-0" // Desktop: no extra padding
          )}
        >
          <div className={cn(
            "bg-white dark:bg-gray-900 overflow-hidden",
            "rounded-t-3xl", // Mobile: rounded top corners
            "lg:rounded-2xl", // Desktop: fully rounded
            "shadow-[0_-4px_20px_rgba(0,0,0,0.1)]", // Mobile: top shadow
            "lg:shadow-2xl lg:shadow-black/20", // Desktop: all around shadow
            "border border-gray-100 dark:border-gray-800"
          )}>
            {!showSettings ? (
              // Main consent banner
              <div className="relative">
                {/* Mobile drag handle */}
                <div className="lg:hidden flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Close button - desktop only */}
                <button
                  onClick={() => setShowBanner(false)}
                  className="hidden lg:block absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 lg:p-8 lg:pr-12">
                  {/* Header with icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Cookie className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Cookie Preferences
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                    We use cookies to enhance your experience and analyze our traffic. 
                    Choose your preferences below.
                  </p>

                  {/* Quick stats */}
                  <div className="flex items-center gap-4 mb-6 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Privacy First</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>

                  {/* Action buttons - stacked on mobile */}
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className={cn(
                          "bg-gradient-to-r from-amber-500 to-amber-600",
                          "hover:from-amber-600 hover:to-amber-700",
                          "text-white font-medium",
                          "shadow-lg shadow-amber-500/25",
                          "transition-all duration-200"
                        )}
                        size="lg"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                        size="lg"
                      >
                        Reject All
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      className="w-full hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                      size="lg"
                    >
                      <Settings2 className="w-4 h-4 mr-2" />
                      Manage Preferences
                    </Button>
                  </div>

                  {/* Policy link */}
                  <div className="text-center">
                    <Link 
                      href="/cookie-policy" 
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 underline-offset-4 hover:underline transition-colors"
                    >
                      Read our Cookie Policy
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Cookie settings panel - mobile optimized
              <div className="relative h-full max-h-[80vh] lg:max-h-[600px] flex flex-col">
                {/* Mobile drag handle */}
                <div className="lg:hidden flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0 lg:p-8 lg:pb-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Manage Cookies
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 lg:px-8 lg:py-6">
                  <div className="space-y-3">
                    {/* Necessary Cookies */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">Essential</span>
                            <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                              Always On
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Required for the website to function.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="w-5 h-5 text-amber-600 border-gray-300 rounded cursor-not-allowed opacity-50"
                        />
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <label className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <BarChart3 className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            Analytics
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Help us improve by collecting anonymous usage data.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="w-5 h-5 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500"
                        />
                      </div>
                    </label>

                    {/* Functional Cookies */}
                    <label className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            Functional
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remember your preferences and settings.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                          className="w-5 h-5 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500"
                        />
                      </div>
                    </label>

                    {/* Marketing Cookies */}
                    <label className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Megaphone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            Marketing
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Show you relevant ads on other sites.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="w-5 h-5 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Footer buttons - sticky */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 lg:p-8 bg-white dark:bg-gray-900">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleSavePreferences}
                      className={cn(
                        "flex-1",
                        "bg-gradient-to-r from-amber-500 to-amber-600",
                        "hover:from-amber-600 hover:to-amber-700",
                        "text-white font-medium",
                        "shadow-lg shadow-amber-500/25"
                      )}
                      size="lg"
                    >
                      Save Preferences
                    </Button>
                    <Link href="/cookie-policy" className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        size="lg"
                      >
                        Cookie Policy
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}