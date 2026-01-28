"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Ban,
  DollarSign,
  Clock,
  User
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface DepositManagementProps {
  bookingId: string
  depositRequired: boolean
  depositAmount: number | null // in pence
  depositStatus: 'none' | 'pending' | 'authorized' | 'captured' | 'cancelled' | 'refunded' | 'partially_refunded'
  partySize: number
  customerName: string
  onStatusChange?: () => void
}

const statusConfig = {
  none: {
    label: 'No Deposit',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: CreditCard
  },
  pending: {
    label: 'Pending Payment',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  authorized: {
    label: 'Card Authorized',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle
  },
  captured: {
    label: 'Deposit Charged',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: DollarSign
  },
  cancelled: {
    label: 'Authorization Cancelled',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Ban
  },
  refunded: {
    label: 'Fully Refunded',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: RefreshCw
  },
  partially_refunded: {
    label: 'Partially Refunded',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: RefreshCw
  }
}

export function DepositManagement({
  bookingId,
  depositRequired,
  depositAmount,
  depositStatus,
  partySize,
  customerName,
  onStatusChange
}: DepositManagementProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [actionType, setActionType] = React.useState<string | null>(null)

  const formatAmount = (pence: number | null) => {
    if (!pence) return '£0.00'
    return `£${(pence / 100).toFixed(2)}`
  }

  const handleCaptureDeposit = async () => {
    setIsLoading(true)
    setActionType('capture')
    try {
      const response = await fetch('/api/stripe/capture-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId, 
          reason: 'No-show - deposit captured via dashboard' 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture deposit')
      }

      toast.success(`Deposit of ${formatAmount(depositAmount)} captured successfully`)
      onStatusChange?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to capture deposit')
    } finally {
      setIsLoading(false)
      setActionType(null)
    }
  }

  const handleCancelDeposit = async () => {
    setIsLoading(true)
    setActionType('cancel')
    try {
      const response = await fetch('/api/stripe/cancel-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId, 
          reason: 'Guest attended - authorization cancelled' 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel deposit')
      }

      toast.success('Deposit authorization cancelled - customer will not be charged')
      onStatusChange?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel deposit')
    } finally {
      setIsLoading(false)
      setActionType(null)
    }
  }

  const handleRefundDeposit = async () => {
    setIsLoading(true)
    setActionType('refund')
    try {
      const response = await fetch('/api/stripe/refund-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId, 
          reason: 'Refund requested via dashboard' 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refund deposit')
      }

      toast.success(`Refund of ${formatAmount(data.refundedAmount)} processed successfully`)
      onStatusChange?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to refund deposit')
    } finally {
      setIsLoading(false)
      setActionType(null)
    }
  }

  // If no deposit required, show minimal info
  if (!depositRequired || depositStatus === 'none') {
    return (
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 text-slate-600">
          <CreditCard className="w-4 h-4" />
          <span className="text-sm">No deposit required for this booking</span>
        </div>
      </div>
    )
  }

  const config = statusConfig[depositStatus] || statusConfig.none
  const StatusIcon = config.icon

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-base">Deposit Information</CardTitle>
          </div>
          <Badge className={cn("text-xs", config.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
        <CardDescription>
          Manage the deposit for {customerName}&apos;s booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deposit Details */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Amount</p>
            <p className="text-lg font-semibold text-slate-900">{formatAmount(depositAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Party Size</p>
            <p className="text-lg font-semibold text-slate-900">{partySize} guests</p>
          </div>
        </div>

        {/* Status-specific info */}
        {depositStatus === 'authorized' && (
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Card has been authorized. The customer has NOT been charged yet.
              <br />
              <strong>If guest attends:</strong> Release authorization (no charge)
              <br />
              <strong>If no-show:</strong> Capture the deposit
            </AlertDescription>
          </Alert>
        )}

        {depositStatus === 'captured' && (
          <Alert className="border-red-200 bg-red-50">
            <DollarSign className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Deposit has been charged to the customer&apos;s card.
              You can issue a refund if needed.
            </AlertDescription>
          </Alert>
        )}

        {depositStatus === 'pending' && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Waiting for customer to complete payment.
              The booking will be confirmed once payment is authorized.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Guest Attended - Release Authorization */}
          {depositStatus === 'authorized' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  disabled={isLoading}
                >
                  {isLoading && actionType === 'cancel' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Guest Attended
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Release Deposit Authorization?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will release the hold on {customerName}&apos;s card. 
                    They will NOT be charged the {formatAmount(depositAmount)} deposit.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCancelDeposit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirm - Release Authorization
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* No-Show - Capture Deposit */}
          {depositStatus === 'authorized' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  disabled={isLoading}
                >
                  {isLoading && actionType === 'capture' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  No-Show
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Charge Deposit for No-Show?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will charge {formatAmount(depositAmount)} to {customerName}&apos;s card.
                    This action cannot be undone (but you can refund later).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCaptureDeposit}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirm - Charge Deposit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Refund - For captured deposits */}
          {depositStatus === 'captured' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  disabled={isLoading}
                >
                  {isLoading && actionType === 'refund' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refund Deposit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Refund Deposit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will refund {formatAmount(depositAmount)} to {customerName}&apos;s card.
                    Refunds typically take 5-10 business days to appear.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleRefundDeposit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Confirm - Issue Refund
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact badge for table views
export function DepositStatusBadge({ 
  depositRequired, 
  depositStatus,
  depositAmount 
}: { 
  depositRequired: boolean
  depositStatus: string
  depositAmount: number | null
}) {
  if (!depositRequired || depositStatus === 'none') {
    return null
  }

  const config = statusConfig[depositStatus as keyof typeof statusConfig] || statusConfig.none
  const StatusIcon = config.icon
  const amount = depositAmount ? `£${(depositAmount / 100).toFixed(0)}` : ''

  return (
    <Badge className={cn("text-xs gap-1", config.color)}>
      <StatusIcon className="w-3 h-3" />
      {amount}
    </Badge>
  )
}
