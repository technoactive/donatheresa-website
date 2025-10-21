'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cookie, X, Check, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
      setTimeout(() => setShowBanner(true), 1000)
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
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {!showSettings ? (
              // Main consent banner
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Cookie className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      We value your privacy 🍪
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies. You can manage your preferences by clicking "Cookie Settings".
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept All
                      </Button>
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Reject All
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Cookie Settings
                      </Button>
                      <Link href="/cookie-policy" className="ml-auto">
                        <Button variant="link" className="text-amber-600 hover:text-amber-700">
                          Cookie Policy
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              // Cookie settings panel
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cookie Settings
                  </h3>
                  <p className="text-gray-600">
                    Choose which cookies you want to accept. You can change these preferences at any time.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="necessary"
                      checked={preferences.necessary}
                      disabled
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <label htmlFor="necessary" className="block">
                        <span className="font-medium text-gray-900">Strictly Necessary</span>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Always Active</span>
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies are essential for the website to function properly and cannot be disabled.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="analytics" className="block cursor-pointer">
                        <span className="font-medium text-gray-900">Performance & Analytics</span>
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies help us understand how visitors interact with our website by collecting anonymous information.
                      </p>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="functional"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="functional" className="block cursor-pointer">
                        <span className="font-medium text-gray-900">Functionality</span>
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="marketing" className="block cursor-pointer">
                        <span className="font-medium text-gray-900">Marketing & Advertising</span>
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies may be used to show you relevant advertisements about our services on other websites.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Link href="/cookie-policy" className="ml-auto">
                    <Button variant="link" className="text-amber-600 hover:text-amber-700">
                      Cookie Policy
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
