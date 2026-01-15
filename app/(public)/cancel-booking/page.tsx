"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface BookingDetails {
  id: string
  booking_date: string
  booking_time: string
  party_size: number
  status: string
  special_requests: string | null
  booking_reference: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
}

function CancelBookingContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError("Invalid cancellation link")
      setLoading(false)
      return
    }

    // Fetch booking details
    fetch(`/api/cancel-booking?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else if (data.booking) {
          setBooking(data.booking)
          if (data.booking.status === "cancelled") {
            setCancelled(true)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load booking details")
        setLoading(false)
      })
  }, [token])

  const handleCancel = async () => {
    if (!token) return
    
    setCancelling(true)
    
    try {
      const res = await fetch(`/api/cancel-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setCancelled(true)
      } else {
        setError(data.error || "Failed to cancel booking")
      }
    } catch {
      setError("Failed to cancel booking")
    } finally {
      setCancelling(false)
    }
  }

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Invalid Link</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <p className="text-sm text-slate-500 mb-6">
              If you need to cancel your booking, please contact us directly.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                <a href="tel:02084215550">Call 020 8421 5550</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking Cancelled</h1>
            <p className="text-slate-600 mb-6">
              Your reservation has been successfully cancelled. We hope to see you again soon!
            </p>
            {booking && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-slate-500 mb-2">Cancelled Booking Details:</p>
                <p className="font-medium text-slate-700">{formatDate(booking.booking_date)}</p>
                <p className="text-slate-600">{booking.booking_time} • {booking.party_size} {booking.party_size === 1 ? 'guest' : 'guests'}</p>
              </div>
            )}
            <div className="space-y-3">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                <Link href="/reserve">Make a New Booking</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
      <div className="max-w-lg mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-500 px-8 py-6 text-white text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl font-bold">Cancel Your Booking?</h1>
            <p className="text-white/80 mt-2 text-sm">This action cannot be undone</p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="p-8">
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h2 className="font-semibold text-slate-800 mb-4">Booking Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-medium text-slate-800">{formatDate(booking.booking_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Time</p>
                      <p className="font-medium text-slate-800">{booking.booking_time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Party Size</p>
                      <p className="font-medium text-slate-800">{booking.party_size} {booking.party_size === 1 ? 'guest' : 'guests'}</p>
                    </div>
                  </div>

                  {booking.booking_reference && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-sm text-slate-500">Reference: <span className="font-mono font-medium text-slate-700">{booking.booking_reference}</span></p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 text-center mb-6">
                Are you sure you want to cancel this reservation? 
                If you need to change the date or time, please call us instead.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel My Booking"
                  )}
                </Button>
                
                <Button asChild variant="outline" className="w-full py-6">
                  <Link href="/">
                    No, Keep My Booking
                  </Link>
                </Button>

                <p className="text-center text-sm text-slate-500 pt-2">
                  Need help? Call us at{" "}
                  <a href="tel:02084215550" className="text-amber-600 font-medium hover:underline">
                    020 8421 5550
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CancelBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <CancelBookingContent />
    </Suspense>
  )
}
