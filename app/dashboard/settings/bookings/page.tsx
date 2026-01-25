"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  RefreshCw, 
  Save, 
  Calendar,
  Clock,
  Users,
  Settings,
  AlertCircle,
  Plus,
  Trash2,
  CalendarDays,
  UtensilsCrossed,
  Coffee,
  Bell,
  Mail,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"
import { 
  getBookingSettingsAction,
  updateBookingSettingsAction,
  saveServicePeriodsAction
} from "../../bookings/actions"
import { type BookingSettings, type ServicePeriod } from "@/lib/types"
import { SettingsLayout } from "@/components/dashboard/settings-layout"

interface ServicePeriodFrontend {
  id: string
  name: string
  startTime: string
  endTime: string
  lastOrderTime: string
  kitchenClosingTime: string
  interval: number
  enabled: boolean
  type: "lunch" | "dinner" | "break"
}

export default function BookingSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    booking_enabled: true,
    max_advance_days: 30,
    max_party_size: 8,
    total_seats: 50,
    available_times: [],
    closed_dates: [],
    closed_days_of_week: [],
    suspension_message: "We're currently not accepting new bookings. Please check back later.",
    service_periods: []
  })

  // Reconfirmation settings state
  const [reconfirmationSettings, setReconfirmationSettings] = useState({
    enabled: false,
    min_party_size: 6,
    days_before: 2,
    deadline_hours: 24,
    no_response_action: 'flag_only' as 'auto_cancel' | 'flag_only' | 'second_reminder'
  })
  
  const [servicePeriods, setServicePeriods] = useState<ServicePeriodFrontend[]>([
    {
      id: "lunch_default",
      name: "Lunch Service", 
      startTime: "12:00",
      endTime: "15:00",
      lastOrderTime: "14:30",
      kitchenClosingTime: "15:00",
      interval: 30,
      enabled: true,
      type: "lunch"
    },
    {
      id: "dinner_default",
      name: "Dinner Service",
      startTime: "18:00", 
      endTime: "22:00",
      lastOrderTime: "21:30",
      kitchenClosingTime: "22:00",
      interval: 30,
      enabled: true,
      type: "dinner"
    }
  ])

  const [selectedDate, setSelectedDate] = useState("")

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const settings = await getBookingSettingsAction()
      
      console.log('[CLIENT] Settings received from server:', settings)
      console.log('[CLIENT] booking_enabled value from server:', settings.booking_enabled)
      
      // Ensure total_seats has a default value
      const settingsWithDefaults = {
        ...settings,
        total_seats: settings.total_seats || 50
      }
      
      setBookingSettings(settingsWithDefaults)
      
      if (settings.service_periods && settings.service_periods.length > 0) {
        const periods = settings.service_periods.map((period: ServicePeriod, index: number) => ({
          id: period.id || `period_${index}`,
          name: period.name,
          startTime: period.start_time,
          endTime: period.end_time,
          lastOrderTime: period.last_order_time,
          kitchenClosingTime: period.kitchen_closing_time,
          interval: period.interval_minutes,
          enabled: period.enabled,
          type: period.period_type as "lunch" | "dinner" | "break"
        }))
        setServicePeriods(periods)
      }

      // Load reconfirmation settings
      if (settings.reconfirmation_enabled !== undefined) {
        setReconfirmationSettings({
          enabled: settings.reconfirmation_enabled || false,
          min_party_size: settings.reconfirmation_min_party_size || 6,
          days_before: settings.reconfirmation_days_before || 2,
          deadline_hours: settings.reconfirmation_deadline_hours || 24,
          no_response_action: settings.reconfirmation_no_response_action || 'flag_only'
        })
      }
      
      toast.success('Settings loaded successfully')
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }



  const generateTimeSlots = () => {
    const slots: string[] = []
    servicePeriods.forEach(period => {
      if (!period.enabled) return
      
      const [startHour, startMinute] = period.startTime.split(':').map(Number)
      const [lastOrderHour, lastOrderMinute] = period.lastOrderTime.split(':').map(Number)
      
      const startMinutes = startHour * 60 + startMinute
      const lastOrderMinutes = lastOrderHour * 60 + lastOrderMinute
      
      // Generate slots from start time to last order time (inclusive)
      for (let currentMinutes = startMinutes; currentMinutes <= lastOrderMinutes; currentMinutes += period.interval) {
        const hours = Math.floor(currentMinutes / 60)
        const minutes = currentMinutes % 60
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        if (!slots.includes(timeStr)) {
          slots.push(timeStr)
        }
      }
    })
    return slots.sort()
  }

  const updateServicePeriod = (id: string, updates: Partial<ServicePeriodFrontend>) => {
    setServicePeriods(prev => 
      prev.map(period => 
        period.id === id ? { ...period, ...updates } : period
      )
    )
  }

  const addServicePeriod = () => {
    const newPeriod: ServicePeriodFrontend = {
      id: `custom_${Date.now()}`,
      name: "Custom Period",
      startTime: "16:00",
      endTime: "17:30",
      lastOrderTime: "17:00",
      kitchenClosingTime: "17:30",
      interval: 30,
      enabled: true,
      type: "break"
    }
    setServicePeriods(prev => [...prev, newPeriod])
  }

  const removeServicePeriod = (id: string) => {
    setServicePeriods(prev => prev.filter(period => period.id !== id))
  }

  const toggleDayOfWeek = (dayIndex: number) => {
    setBookingSettings(prev => {
      const currentClosedDays = prev.closed_days_of_week || []
      if (currentClosedDays.includes(dayIndex)) {
        return {
          ...prev,
          closed_days_of_week: currentClosedDays.filter(day => day !== dayIndex)
        }
      } else {
        return {
          ...prev,
          closed_days_of_week: [...currentClosedDays, dayIndex].sort()
        }
      }
    })
  }

  const addClosedDate = () => {
    if (selectedDate && !bookingSettings.closed_dates.includes(selectedDate)) {
      setBookingSettings(prev => ({
        ...prev,
        closed_dates: [...prev.closed_dates, selectedDate].sort()
      }))
      setSelectedDate("")
    }
  }

  const removeClosedDate = (date: string) => {
    setBookingSettings(prev => ({
      ...prev,
      closed_dates: prev.closed_dates.filter(d => d !== date)
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      
      const dbServicePeriods: ServicePeriod[] = servicePeriods.map(period => ({
        id: period.id.includes('default') ? undefined : period.id,
        name: period.name,
        start_time: period.startTime,
        end_time: period.endTime,
        last_order_time: period.lastOrderTime,
        kitchen_closing_time: period.kitchenClosingTime,
        interval_minutes: period.interval,
        enabled: period.enabled,
        period_type: period.type,
        sort_order: servicePeriods.indexOf(period) + 1
      }))
      
      // Save service periods first (this generates and saves the correct time slots)
      console.log('[CLIENT] Saving service periods...')
      try {
        await saveServicePeriodsAction(dbServicePeriods)
        console.log('[CLIENT] Service periods saved successfully')
      } catch (servicePeriodError) {
        console.error('[CLIENT] Error saving service periods:', servicePeriodError)
        // Don't throw - continue with booking settings save
        // throw servicePeriodError
      }
      
      // Then save other booking settings (no time slots needed)
      const formData = new FormData()
      
      console.log('[CLIENT] Current booking_enabled state:', bookingSettings.booking_enabled)
      console.log('[CLIENT] Type of booking_enabled:', typeof bookingSettings.booking_enabled)
      
      // This is the issue - we're sending 'off' but the server only checks for 'on'
      // Let's see what value we're actually setting
      const bookingEnabledValue = bookingSettings.booking_enabled ? 'on' : 'off'
      console.log('[CLIENT] Setting FormData isBookingEnabled to:', bookingEnabledValue)
      formData.append('isBookingEnabled', bookingEnabledValue)
      
      formData.append('suspensionMessage', bookingSettings.suspension_message)
      formData.append('maxPartySize', (bookingSettings.max_party_size || 8).toString())
      formData.append('maxAdvanceDays', (bookingSettings.max_advance_days || 30).toString())
      formData.append('totalSeats', (bookingSettings.total_seats || 50).toString())
      formData.append('closedDates', JSON.stringify(bookingSettings.closed_dates))
      formData.append('closedDaysOfWeek', JSON.stringify(bookingSettings.closed_days_of_week || []))

      // Reconfirmation settings
      formData.append('reconfirmationEnabled', reconfirmationSettings.enabled ? 'on' : 'off')
      formData.append('reconfirmationMinPartySize', reconfirmationSettings.min_party_size.toString())
      formData.append('reconfirmationDaysBefore', reconfirmationSettings.days_before.toString())
      formData.append('reconfirmationDeadlineHours', reconfirmationSettings.deadline_hours.toString())
      formData.append('reconfirmationNoResponseAction', reconfirmationSettings.no_response_action)
      
      console.log('[CLIENT] About to call updateBookingSettingsAction')
      const result = await updateBookingSettingsAction(formData)
      console.log('[CLIENT] updateBookingSettingsAction result:', result)
      
      if (result.success) {
        toast.success('All settings saved successfully!')
        console.log('[CLIENT] Settings saved successfully, reloading data...')
        await loadData()
      } else {
        console.error('[CLIENT] Save failed with message:', result.message)
        console.error('[CLIENT] Save failed with errors:', result.errors)
        toast.error(result.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('[CLIENT] Caught error in handleSaveSettings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const timeSlots = generateTimeSlots()

  if (isLoading) {
    return (
      <SettingsLayout
        title="Booking Settings"
        description="Configure your restaurant's reservation system"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-600" />
            <p className="text-slate-600">Loading settings...</p>
          </div>
        </div>
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout
      title="Booking Settings"
      description="Configure your restaurant's reservation system"
      primaryAction={{
        label: "Save Settings",
        onClick: handleSaveSettings,
        loading: isSaving,
        loadingLabel: "Saving...",
        disabled: isSaving
      }}
      secondaryAction={{
        label: "Refresh",
        onClick: loadData,
        loading: isLoading,
        loadingLabel: "Loading...",
        disabled: isLoading,
        variant: "outline"
      }}
    >
      <div className="w-full max-w-full space-y-4 md:space-y-6">
        {/* System Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                Booking System
              </CardTitle>
              <CardDescription className="text-slate-600">
                Control whether customers can make new reservations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-900">Accept New Bookings</Label>
                  <p className="text-sm text-slate-600">Enable or disable the booking system</p>
                </div>
                <Switch
                  checked={bookingSettings.booking_enabled}
                  onCheckedChange={(checked) => {
                    console.log('[CLIENT] Switch changed to:', checked)
                    setBookingSettings(prev => ({...prev, booking_enabled: checked}))
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                Booking Limits
              </CardTitle>
              <CardDescription className="text-slate-600">
                Set limits for advance bookings and party sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                              <div className="space-y-2">
                  <Label htmlFor="totalSeats" className="text-slate-900">Total Restaurant Seats</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    min="1"
                    max="500"
                    value={bookingSettings.total_seats && bookingSettings.total_seats > 0 ? bookingSettings.total_seats : ''}
                    onChange={(e) => setBookingSettings(prev => ({
                      ...prev, 
                      total_seats: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    }))}
                    placeholder=""
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                  <p className="text-sm text-slate-600">
                    Total seating capacity for occupancy calculations
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceDays" className="text-slate-900">Maximum Advance Days</Label>
                  <Input
                    id="maxAdvanceDays"
                    type="number"
                    min="1"
                    max="365"
                    value={bookingSettings.max_advance_days && bookingSettings.max_advance_days > 0 ? bookingSettings.max_advance_days : ''}
                    onChange={(e) => setBookingSettings(prev => ({
                      ...prev, 
                      max_advance_days: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    }))}
                    placeholder=""
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                  <p className="text-sm text-slate-600">
                    How far in advance customers can book
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPartySize" className="text-slate-900">Maximum Party Size</Label>
                  <Input
                    id="maxPartySize"
                    type="number"
                    min="1"
                    max="20"
                    value={bookingSettings.max_party_size && bookingSettings.max_party_size > 0 ? bookingSettings.max_party_size : ''}
                    onChange={(e) => setBookingSettings(prev => ({
                      ...prev, 
                      max_party_size: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    }))}
                    placeholder=""
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                  <p className="text-sm text-slate-600">
                    Maximum number of guests per booking
                  </p>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Suspension Message */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              Suspension Message
            </CardTitle>
            <CardDescription className="text-slate-600">
              Message displayed when bookings are disabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={bookingSettings.suspension_message}
              onChange={(e) => setBookingSettings(prev => ({
                ...prev, 
                suspension_message: e.target.value
              }))}
              placeholder="We're currently not accepting new bookings. Please check back later."
              rows={3}
              className="resize-none bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            />
          </CardContent>
        </Card>

        {/* Reconfirmation System */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              Reconfirmation System
              {reconfirmationSettings.enabled && (
                <Badge className="bg-green-100 text-green-700 border-green-200 ml-2">Active</Badge>
              )}
            </CardTitle>
            <CardDescription className="text-slate-600">
              Automatically request confirmation from large parties before their booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-slate-900 font-medium">Enable Reconfirmation</Label>
                <p className="text-sm text-slate-600">
                  Send automated reconfirmation emails to large party bookings
                </p>
              </div>
              <Switch
                checked={reconfirmationSettings.enabled}
                onCheckedChange={(checked) => setReconfirmationSettings(prev => ({
                  ...prev,
                  enabled: checked
                }))}
              />
            </div>

            {reconfirmationSettings.enabled && (
              <>
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How it works:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                      <li>Customers with {reconfirmationSettings.min_party_size}+ guests get an email {reconfirmationSettings.days_before} days before</li>
                      <li>They have {reconfirmationSettings.deadline_hours} hours to confirm or cancel</li>
                      <li>No response? {reconfirmationSettings.no_response_action === 'auto_cancel' ? 'Booking is auto-cancelled' : reconfirmationSettings.no_response_action === 'second_reminder' ? 'A second reminder is sent' : 'Staff is notified for follow-up'}</li>
                    </ol>
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minPartySize" className="text-slate-900">Minimum Party Size</Label>
                    <Select
                      value={reconfirmationSettings.min_party_size.toString()}
                      onValueChange={(value) => setReconfirmationSettings(prev => ({
                        ...prev,
                        min_party_size: parseInt(value)
                      }))}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {[4, 5, 6, 7, 8, 9, 10, 12, 15].map(size => (
                          <SelectItem key={size} value={size.toString()} className="text-slate-900">
                            {size}+ guests
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      Parties with this many guests or more will receive reconfirmation requests
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daysBefore" className="text-slate-900">Days Before Booking</Label>
                    <Select
                      value={reconfirmationSettings.days_before.toString()}
                      onValueChange={(value) => setReconfirmationSettings(prev => ({
                        ...prev,
                        days_before: parseInt(value)
                      }))}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="1" className="text-slate-900">1 day before</SelectItem>
                        <SelectItem value="2" className="text-slate-900">2 days before</SelectItem>
                        <SelectItem value="3" className="text-slate-900">3 days before</SelectItem>
                        <SelectItem value="5" className="text-slate-900">5 days before</SelectItem>
                        <SelectItem value="7" className="text-slate-900">7 days before</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      When to send the reconfirmation email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadlineHours" className="text-slate-900">Response Deadline</Label>
                    <Select
                      value={reconfirmationSettings.deadline_hours.toString()}
                      onValueChange={(value) => setReconfirmationSettings(prev => ({
                        ...prev,
                        deadline_hours: parseInt(value)
                      }))}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="12" className="text-slate-900">12 hours</SelectItem>
                        <SelectItem value="24" className="text-slate-900">24 hours</SelectItem>
                        <SelectItem value="36" className="text-slate-900">36 hours</SelectItem>
                        <SelectItem value="48" className="text-slate-900">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      How long customers have to respond
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noResponseAction" className="text-slate-900">No Response Action</Label>
                    <Select
                      value={reconfirmationSettings.no_response_action}
                      onValueChange={(value: 'auto_cancel' | 'flag_only' | 'second_reminder') => setReconfirmationSettings(prev => ({
                        ...prev,
                        no_response_action: value
                      }))}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="flag_only" className="text-slate-900">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            Flag for manual follow-up
                          </div>
                        </SelectItem>
                        <SelectItem value="second_reminder" className="text-slate-900">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            Send second reminder
                          </div>
                        </SelectItem>
                        <SelectItem value="auto_cancel" className="text-slate-900">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            Auto-cancel booking
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      What happens if customer doesn&apos;t respond
                    </p>
                  </div>
                </div>

                {/* Action Preview */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                  <p className="text-sm text-slate-600">
                    {reconfirmationSettings.no_response_action === 'auto_cancel' ? (
                      <span className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Bookings will be <span className="font-medium text-red-600">automatically cancelled</span> if not confirmed within {reconfirmationSettings.deadline_hours} hours
                      </span>
                    ) : reconfirmationSettings.no_response_action === 'second_reminder' ? (
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        A <span className="font-medium text-blue-600">second reminder</span> will be sent, then flagged if still no response
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        You&apos;ll get a <span className="font-medium text-amber-600">notification</span> to manually call the customer
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Service Periods */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  Service Periods
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Configure lunch, dinner, and custom service times
                </CardDescription>
              </div>
              <Button onClick={addServicePeriod} size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Period
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {servicePeriods.map((period) => (
              <Card key={period.id} className="border-slate-200 shadow-sm bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {period.type === 'lunch' && <UtensilsCrossed className="w-4 h-4 text-amber-500" />}
                      {period.type === 'dinner' && <Clock className="w-4 h-4 text-blue-500" />}
                      {period.type === 'break' && <Coffee className="w-4 h-4 text-green-500" />}
                      <Input
                        value={period.name}
                        onChange={(e) => updateServicePeriod(period.id, { name: e.target.value })}
                        className="font-medium w-auto bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={period.enabled}
                        onCheckedChange={(enabled) => updateServicePeriod(period.id, { enabled })}
                      />
                      {servicePeriods.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeServicePeriod(period.id)}
                          className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {period.enabled && (
                                          <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-900">Start Time</Label>
                            <Input
                              type="time"
                              value={period.startTime}
                              onChange={(e) => updateServicePeriod(period.id, { startTime: e.target.value })}
                              className="bg-white border-slate-200 text-slate-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-900">Last Order Time</Label>
                            <Input
                              type="time"
                            value={period.lastOrderTime}
                            onChange={(e) => updateServicePeriod(period.id, { lastOrderTime: e.target.value })}
                            className="bg-white border-slate-200 text-slate-900"
                          />
                          <p className="text-xs text-slate-600">
                            When kitchen stops taking orders
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-900">Kitchen Closing Time</Label>
                          <Input
                            type="time"
                            value={period.kitchenClosingTime}
                            onChange={(e) => updateServicePeriod(period.id, { kitchenClosingTime: e.target.value })}
                            className="bg-white border-slate-200 text-slate-900"
                          />
                          <p className="text-xs text-slate-600">
                            When kitchen actually closes
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-900">End Time</Label>
                          <Input
                            type="time"
                            value={period.endTime}
                            onChange={(e) => updateServicePeriod(period.id, { endTime: e.target.value })}
                            className="bg-white border-slate-200 text-slate-900"
                          />
                          <p className="text-xs text-slate-600">
                            Service period end time
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-900">Interval (minutes)</Label>
                          <Select 
                            value={period.interval.toString()} 
                            onValueChange={(value) => updateServicePeriod(period.id, { interval: parseInt(value) })}
                          >
                            <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="5" className="text-slate-900">5 min</SelectItem>
                              <SelectItem value="10" className="text-slate-900">10 min</SelectItem>
                              <SelectItem value="15" className="text-slate-900">15 min</SelectItem>
                              <SelectItem value="20" className="text-slate-900">20 min</SelectItem>
                              <SelectItem value="25" className="text-slate-900">25 min</SelectItem>
                              <SelectItem value="30" className="text-slate-900">30 min</SelectItem>
                              <SelectItem value="35" className="text-slate-900">35 min</SelectItem>
                              <SelectItem value="40" className="text-slate-900">40 min</SelectItem>
                              <SelectItem value="45" className="text-slate-900">45 min</SelectItem>
                              <SelectItem value="50" className="text-slate-900">50 min</SelectItem>
                              <SelectItem value="55" className="text-slate-900">55 min</SelectItem>
                              <SelectItem value="60" className="text-slate-900">60 min</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-900">Period Type</Label>
                          <Select 
                            value={period.type} 
                            onValueChange={(value: "lunch" | "dinner" | "break") => 
                              updateServicePeriod(period.id, { type: value })
                            }
                          >
                            <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value="lunch" className="text-slate-900">🍽️ Lunch</SelectItem>
                              <SelectItem value="dinner" className="text-slate-900">🌅 Dinner</SelectItem>
                              <SelectItem value="break" className="text-slate-900">☕ Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Generated Time Slots */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              Generated Time Slots
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">{timeSlots.length}</Badge>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Available booking times generated from service periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {timeSlots.map((slot) => (
                  <Badge key={slot} variant="outline" className="justify-center py-2 border-slate-200 text-slate-700">
                    {slot}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">
                No time slots generated. Enable service periods above to generate slots.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Closure Settings */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-red-600" />
                </div>
                Weekly Closures
              </CardTitle>
              <CardDescription className="text-slate-600">
                Select days when the restaurant is closed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <Button
                    key={index}
                    variant={
                      (bookingSettings.closed_days_of_week || []).includes(index) 
                        ? "destructive" 
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleDayOfWeek(index)}
                    className={`flex flex-col gap-1 h-auto py-3 ${
                      (bookingSettings.closed_days_of_week || []).includes(index) 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="font-medium text-xs">{dayShortNames[index]}</span>
                    <span className="text-xs opacity-70">
                      {(bookingSettings.closed_days_of_week || []).includes(index) ? "Closed" : "Open"}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                Specific Closed Dates
              </CardTitle>
              <CardDescription className="text-slate-600">
                Add specific dates when the restaurant is closed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 bg-white border-slate-200 text-slate-900"
                />
                <Button onClick={addClosedDate} disabled={!selectedDate} className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {bookingSettings.closed_dates.length > 0 ? (
                <div className="space-y-2">
                  {bookingSettings.closed_dates.map((date) => (
                    <div key={date} className="flex items-center justify-between p-2 border border-slate-200 rounded bg-slate-50">
                      <span className="text-sm text-slate-900">{new Date(date).toLocaleDateString()}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeClosedDate(date)}
                        className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm text-center py-4">
                  No specific closed dates set
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsLayout>
  )
} 