"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Clock, Calendar, Percent, Sparkles, ChefHat } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OfferPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function OfferPopup({ isOpen, onClose }: OfferPopupProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleReserveNow = () => {
    onClose()
    router.push('/reserve')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full mx-4 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200 z-50 shadow-lg border border-gray-200"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-60" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-60" />

        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Percent className="w-8 h-8 text-white" />
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Save 20% Tonight!
            </h2>
            
            <p className="text-gray-600 leading-relaxed">
              Enjoy an exclusive discount on your food bill for evening reservations
            </p>
          </div>

          {/* Offer details */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Evening Dining Special</h3>
                <p className="text-amber-700 text-sm font-medium">20% OFF Food Bill</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-sm">
                  <span className="font-semibold">Time:</span> Bookings after 8:15 PM
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span className="text-sm">
                  <span className="font-semibold">Days:</span> Tuesday - Sunday
                </span>
              </div>
            </div>
          </div>

          {/* Fine print */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-600 leading-relaxed">
              * Offer valid for food items only. Cannot be combined with other promotions. 
              Advance booking required. Subject to availability. Valid for new reservations only.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleReserveNow}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Reserve Now & Save 20%
            </Button>
            
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useOfferPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Don't show popup on reservation page
    if (typeof window !== 'undefined' && window.location.pathname === '/reserve') {
      return
    }

    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('offer-popup-shown')
    
    if (!popupShown) {
      // Show popup after user has been on the page for a while
      const timer = setTimeout(() => {
        setIsOpen(true)
        sessionStorage.setItem('offer-popup-shown', 'true')
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const closePopup = () => {
    setIsOpen(false)
  }

  return { isOpen, closePopup }
} 