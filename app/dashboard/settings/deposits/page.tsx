"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  RefreshCw, 
  Save, 
  CreditCard,
  Users,
  Clock,
  Percent,
  PoundSterling,
  AlertCircle,
  CheckCircle,
  Info,
  Shield,
  Zap
} from "lucide-react"
import { getBookingSettingsAction, updateBookingSettingsAction } from "../../bookings/actions"
import { type BookingSettings } from "@/lib/types"
import { SettingsLayout } from "@/components/dashboard/settings-layout"

export default function DepositSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasStripeKeys, setHasStripeKeys] = useState(false)
  
  const [depositSettings, setDepositSettings] = useState({
    deposit_enabled: false,
    deposit_min_party_size: 6,
    deposit_amount_per_person: 1000, // £10.00 in pence
    deposit_cancellation_hours: 48,
    deposit_late_cancel_charge_percent: 100
  })

  useEffect(() => {
    loadData()
    checkStripeKeys()
  }, [])

  const checkStripeKeys = async () => {
    // Check if Stripe keys are configured
    try {
      const response = await fetch('/api/stripe/check-config')
      if (response.ok) {
        const data = await response.json()
        setHasStripeKeys(data.configured)
      }
    } catch {
      setHasStripeKeys(false)
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      const settings = await getBookingSettingsAction()
      
      setDepositSettings({
        deposit_enabled: settings.deposit_enabled || false,
        deposit_min_party_size: settings.deposit_min_party_size || 6,
        deposit_amount_per_person: settings.deposit_amount_per_person || 1000,
        deposit_cancellation_hours: settings.deposit_cancellation_hours || 48,
        deposit_late_cancel_charge_percent: settings.deposit_late_cancel_charge_percent || 100
      })
    } catch (error) {
      console.error('Error loading deposit settings:', error)
      toast.error('Failed to load deposit settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const formData = new FormData()
      formData.append('deposit_enabled', depositSettings.deposit_enabled.toString())
      formData.append('deposit_min_party_size', depositSettings.deposit_min_party_size.toString())
      formData.append('deposit_amount_per_person', depositSettings.deposit_amount_per_person.toString())
      formData.append('deposit_cancellation_hours', depositSettings.deposit_cancellation_hours.toString())
      formData.append('deposit_late_cancel_charge_percent', depositSettings.deposit_late_cancel_charge_percent.toString())
      
      const result = await updateBookingSettingsAction(formData)
      
      if (result.success) {
        toast.success('Deposit settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving deposit settings:', error)
      toast.error('Failed to save deposit settings')
    } finally {
      setIsSaving(false)
    }
  }

  // Format pence to pounds for display
  const formatPounds = (pence: number) => {
    return (pence / 100).toFixed(2)
  }

  // Parse pounds input to pence
  const parsePencefromPounds = (pounds: string) => {
    const value = parseFloat(pounds)
    return isNaN(value) ? 0 : Math.round(value * 100)
  }

  // Calculate example deposit
  const exampleDeposit = depositSettings.deposit_amount_per_person * depositSettings.deposit_min_party_size

  if (isLoading) {
    return (
      <SettingsLayout
        title="Deposit Settings"
        description="Configure booking deposits and payment collection"
      >
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout
      title="Deposit Settings"
      description="Configure booking deposits and payment collection"
    >
      <div className="space-y-6">
        {/* Stripe Status Alert */}
        {!hasStripeKeys && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Stripe Not Configured</AlertTitle>
            <AlertDescription className="text-amber-700">
              To collect deposits, you need to configure your Stripe API keys. Add <code className="bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code> and <code className="bg-amber-100 px-1 rounded">STRIPE_PUBLISHABLE_KEY</code> to your environment variables.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Enable/Disable Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Deposit Collection</CardTitle>
                  <CardDescription className="text-slate-600">
                    Enable or disable deposit requirements for bookings
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={depositSettings.deposit_enabled ? "default" : "secondary"} className={depositSettings.deposit_enabled ? "bg-green-100 text-green-800" : ""}>
                  {depositSettings.deposit_enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={depositSettings.deposit_enabled}
                  onCheckedChange={(checked) => setDepositSettings(prev => ({ ...prev, deposit_enabled: checked }))}
                  disabled={!hasStripeKeys}
                />
              </div>
            </div>
          </CardHeader>
          {depositSettings.deposit_enabled && (
            <CardContent className="pt-0">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Deposits are active</p>
                    <p className="text-green-700 text-sm mt-1">
                      Bookings with {depositSettings.deposit_min_party_size}+ guests will require a £{formatPounds(depositSettings.deposit_amount_per_person)} deposit per person.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Configuration Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Party Size Threshold */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 text-base">Minimum Party Size</CardTitle>
                  <CardDescription className="text-slate-600 text-sm">
                    Deposits required for parties of this size or larger
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={depositSettings.deposit_min_party_size}
                    onChange={(e) => setDepositSettings(prev => ({ 
                      ...prev, 
                      deposit_min_party_size: parseInt(e.target.value) || 1 
                    }))}
                    className="w-24 text-center text-lg font-semibold"
                  />
                  <span className="text-slate-600">guests or more</span>
                </div>
                <p className="text-sm text-slate-500">
                  <Info className="w-4 h-4 inline mr-1" />
                  Bookings with fewer than {depositSettings.deposit_min_party_size} guests won't need a deposit
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Amount */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <PoundSterling className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 text-base">Deposit Amount</CardTitle>
                  <CardDescription className="text-slate-600 text-sm">
                    Amount charged per person
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-400">£</span>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    step={0.5}
                    value={formatPounds(depositSettings.deposit_amount_per_person)}
                    onChange={(e) => setDepositSettings(prev => ({ 
                      ...prev, 
                      deposit_amount_per_person: parsePencefromPounds(e.target.value)
                    }))}
                    className="w-28 text-center text-lg font-semibold"
                  />
                  <span className="text-slate-600">per person</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm text-slate-600">
                    <strong>Example:</strong> Party of {depositSettings.deposit_min_party_size} = <span className="font-semibold text-slate-900">£{formatPounds(exampleDeposit)}</span> total deposit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancellation Policy */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">Cancellation Policy</CardTitle>
                <CardDescription className="text-slate-600">
                  Configure how cancellations and refunds are handled
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Free Cancellation Window */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Free Cancellation Window</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    value={depositSettings.deposit_cancellation_hours}
                    onChange={(e) => setDepositSettings(prev => ({ 
                      ...prev, 
                      deposit_cancellation_hours: parseInt(e.target.value) || 24 
                    }))}
                    className="w-24 text-center"
                  />
                  <span className="text-slate-600">hours before booking</span>
                </div>
                <p className="text-sm text-slate-500">
                  Cancellations made more than {depositSettings.deposit_cancellation_hours} hours in advance receive a full refund
                </p>
              </div>

              {/* Late Cancellation Charge */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Late Cancellation Charge</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={depositSettings.deposit_late_cancel_charge_percent}
                    onChange={(e) => setDepositSettings(prev => ({ 
                      ...prev, 
                      deposit_late_cancel_charge_percent: parseInt(e.target.value) || 0 
                    }))}
                    className="w-24 text-center"
                  />
                  <span className="text-slate-600">% of deposit</span>
                </div>
                <p className="text-sm text-slate-500">
                  {depositSettings.deposit_late_cancel_charge_percent === 100 
                    ? "Full deposit is charged for late cancellations" 
                    : depositSettings.deposit_late_cancel_charge_percent === 0
                    ? "No charge for late cancellations (not recommended)"
                    : `${depositSettings.deposit_late_cancel_charge_percent}% of deposit charged for late cancellations`}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Policy Summary */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                Policy Summary
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Parties of <strong>{depositSettings.deposit_min_party_size}+</strong> guests require a <strong>£{formatPounds(depositSettings.deposit_amount_per_person)}</strong> deposit per person</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Free cancellation up to <strong>{depositSettings.deposit_cancellation_hours} hours</strong> before booking time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Late cancellations: <strong>{depositSettings.deposit_late_cancel_charge_percent}%</strong> of deposit charged</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>No-shows: <strong>100%</strong> of deposit charged</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Guests who attend: <strong>Deposit is NOT charged</strong> (card authorization only)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Info className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-slate-900">How Deposits Work</CardTitle>
                <CardDescription className="text-slate-600">
                  Understanding the deposit flow for you and your guests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-700 font-bold">1</span>
                </div>
                <h4 className="font-medium text-blue-900 mb-2">Guest Books</h4>
                <p className="text-sm text-blue-700">
                  For qualifying bookings, guest enters card details. Card is <strong>authorized</strong> but not charged.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-700 font-bold">2</span>
                </div>
                <h4 className="font-medium text-green-900 mb-2">Guest Arrives</h4>
                <p className="text-sm text-green-700">
                  Mark as "attended" in dashboard. Authorization is <strong>released</strong> - no charge applied.
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-red-700 font-bold">3</span>
                </div>
                <h4 className="font-medium text-red-900 mb-2">No-Show</h4>
                <p className="text-sm text-red-700">
                  Mark as "no-show" in dashboard. Deposit is <strong>captured</strong> and charged to the card.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  )
}
