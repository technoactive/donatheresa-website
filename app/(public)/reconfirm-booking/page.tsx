"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, CheckCircle, XCircle, Loader2, AlertTriangle, PartyPopper } from "lucide-react"
import Link from "next/link"

interface BookingDetails {
  id: string
  booking_date: string
  booking_time: string
  party_size: number
  status: string
  special_requests: string | null
  booking_reference: string | null
  reconfirmation_status: string
  reconfirmation_deadline: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
}

function ReconfirmBookingContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const action = searchParams.get("action") // 'confirm' or 'cancel'
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError("Invalid reconfirmation link")
      setLoading(false)
      return
    }

    // Fetch booking details
    fetch(`/api/reconfirm-booking?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else if (data.booking) {
          setBooking(data.booking)
          // Check if already confirmed or cancelled
          if (data.booking.reconfirmation_status === "confirmed") {
            setConfirmed(true)
          }
          if (data.booking.status === "cancelled") {
            setCancelled(true)
          }
        }
        setLoading(false)
        
        // Auto-confirm if action=confirm in URL
        if (data.booking && action === 'confirm' && data.booking.reconfirmation_status !== 'confirmed' && data.booking.status !== 'cancelled') {
          handleConfirm()
        }
      })
      .catch(() => {
        setError("Failed to load booking details")
        setLoading(false)
      })
  }, [token, action])

  const handleConfirm = async () => {
    if (!token) return
    
    setProcessing(true)
    
    try {
      const res = await fetch(`/api/reconfirm-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: "confirm" })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setConfirmed(true)
      } else {
        setError(data.error || "Failed to confirm booking")
      }
    } catch {
      setError("Failed to confirm booking")
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!token) return
    
    setProcessing(true)
    
    try {
      const res = await fetch(`/api/reconfirm-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: "cancel" })
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
      setProcessing(false)
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

  // Format deadline
  const formatDeadline = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr)
    return deadline.toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
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
              If you need to confirm or modify your booking, please contact us directly.
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

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-32 pb-20">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
            <p className="text-slate-600 mb-6">
              Thank you for confirming! We look forward to seeing you.
            </p>
            {booking && (
              <div className="bg-green-50 rounded-xl p-6 mb-6 text-left border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-3">Your Reservation:</p>
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">{formatDate(booking.booking_date)}</p>
                  <p className="text-slate-600">{booking.booking_time} • {booking.party_size} {booking.party_size === 1 ? 'guest' : 'guests'}</p>
                  {booking.booking_reference && (
                    <p className="text-sm text-slate-500 font-mono mt-2">Ref: {booking.booking_reference}</p>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-3">
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                <Link href="/">Return Home</Link>
              </Button>
              <p className="text-center text-sm text-slate-500 pt-2">
                Need to make changes? Call us at{" "}
                <a href="tel:02084215550" className="text-amber-600 font-medium hover:underline">
                  020 8421 5550
                </a>
              </p>
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
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking Cancelled</h1>
            <p className="text-slate-600 mb-6">
              Your reservation has been cancelled. We hope to see you again soon!
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-32 pb-20">
      <div className="max-w-lg mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-6 text-white text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl font-bold">Please Confirm Your Booking</h1>
            <p className="text-white/80 mt-2 text-sm">
              We need you to confirm you&apos;re still coming
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="p-8">
              {/* Deadline Warning */}
              {booking.reconfirmation_deadline && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-amber-800 text-sm font-medium text-center">
                    ⏰ Please respond by: <span className="font-bold">{formatDeadline(booking.reconfirmation_deadline)}</span>
                  </p>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h2 className="font-semibold text-slate-800 mb-4">Your Reservation</h2>
                
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
                Are you still planning to join us? Please let us know so we can prepare for your visit.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleConfirm}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Yes, I&apos;m Coming!
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleCancel}
                  disabled={processing}
                  variant="outline" 
                  className="w-full py-6 text-red-600 border-red-200 hover:bg-red-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel My Booking
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500 pt-2">
                  Need to change the time or party size? Call us at{" "}
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

export default function ReconfirmBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <ReconfirmBookingContent />
    </Suspense>
  )
}
