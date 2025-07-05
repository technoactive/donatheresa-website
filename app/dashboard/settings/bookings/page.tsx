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
  Coffee
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
  const [mounted, setMounted] = useState(false)
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
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const settings = await getBookingSettingsAction()
      
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
      
      toast.success('Settings loaded successfully')
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
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
      await saveServicePeriodsAction(dbServicePeriods)
      
      // Then save other booking settings (no time slots needed)
      const formData = new FormData()
      formData.append('isBookingEnabled', bookingSettings.booking_enabled ? 'on' : 'off')
      formData.append('suspensionMessage', bookingSettings.suspension_message)
      formData.append('maxPartySize', (bookingSettings.max_party_size || 8).toString())
      formData.append('maxAdvanceDays', (bookingSettings.max_advance_days || 30).toString())
      formData.append('totalSeats', (bookingSettings.total_seats || 50).toString())
      formData.append('closedDates', JSON.stringify(bookingSettings.closed_dates))
      formData.append('closedDaysOfWeek', JSON.stringify(bookingSettings.closed_days_of_week || []))
      
      const result = await updateBookingSettingsAction(formData)
      
      if (result.success) {
        toast.success('All settings saved successfully!')
        await loadData()
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
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
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading settings...</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking System
              </CardTitle>
              <CardDescription>
                Control whether customers can make new reservations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accept New Bookings</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable the booking system</p>
                </div>
                <Switch
                  checked={bookingSettings.booking_enabled}
                  onCheckedChange={(checked) => 
                    setBookingSettings(prev => ({...prev, booking_enabled: checked}))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Booking Limits
              </CardTitle>
              <CardDescription>
                Set limits for advance bookings and party sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total Restaurant Seats</Label>
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
                />
                <p className="text-sm text-muted-foreground">
                  Total seating capacity for occupancy calculations
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAdvanceDays">Maximum Advance Days</Label>
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
                />
                <p className="text-sm text-muted-foreground">
                  How far in advance customers can book
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPartySize">Maximum Party Size</Label>
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
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of guests per booking
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suspension Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Suspension Message
            </CardTitle>
            <CardDescription>
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
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Service Periods */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Service Periods
                </CardTitle>
                <CardDescription>
                  Configure lunch, dinner, and custom service times
                </CardDescription>
              </div>
              <Button onClick={addServicePeriod} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Period
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {servicePeriods.map((period) => (
              <Card key={period.id} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {period.type === 'lunch' && <UtensilsCrossed className="w-4 h-4 text-amber-500" />}
                      {period.type === 'dinner' && <Clock className="w-4 h-4 text-blue-500" />}
                      {period.type === 'break' && <Coffee className="w-4 h-4 text-green-500" />}
                      <Input
                        value={period.name}
                        onChange={(e) => updateServicePeriod(period.id, { name: e.target.value })}
                        className="font-medium w-auto"
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
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={period.startTime}
                            onChange={(e) => updateServicePeriod(period.id, { startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Order Time</Label>
                          <Input
                            type="time"
                            value={period.lastOrderTime}
                            onChange={(e) => updateServicePeriod(period.id, { lastOrderTime: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            When kitchen stops taking orders
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Kitchen Closing Time</Label>
                          <Input
                            type="time"
                            value={period.kitchenClosingTime}
                            onChange={(e) => updateServicePeriod(period.id, { kitchenClosingTime: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            When kitchen actually closes
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={period.endTime}
                            onChange={(e) => updateServicePeriod(period.id, { endTime: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Service period end time
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Interval (minutes)</Label>
                          <Select 
                            value={period.interval.toString()} 
                            onValueChange={(value) => updateServicePeriod(period.id, { interval: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 min</SelectItem>
                              <SelectItem value="10">10 min</SelectItem>
                              <SelectItem value="15">15 min</SelectItem>
                              <SelectItem value="20">20 min</SelectItem>
                              <SelectItem value="25">25 min</SelectItem>
                              <SelectItem value="30">30 min</SelectItem>
                              <SelectItem value="35">35 min</SelectItem>
                              <SelectItem value="40">40 min</SelectItem>
                              <SelectItem value="45">45 min</SelectItem>
                              <SelectItem value="50">50 min</SelectItem>
                              <SelectItem value="55">55 min</SelectItem>
                              <SelectItem value="60">60 min</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Period Type</Label>
                          <Select 
                            value={period.type} 
                            onValueChange={(value: "lunch" | "dinner" | "break") => 
                              updateServicePeriod(period.id, { type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lunch">🍽️ Lunch</SelectItem>
                              <SelectItem value="dinner">🌅 Dinner</SelectItem>
                              <SelectItem value="break">☕ Other</SelectItem>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Generated Time Slots
              <Badge variant="secondary">{timeSlots.length}</Badge>
            </CardTitle>
            <CardDescription>
              Available booking times generated from service periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {timeSlots.map((slot) => (
                  <Badge key={slot} variant="outline" className="justify-center py-2">
                    {slot}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No time slots generated. Enable service periods above to generate slots.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Closure Settings */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Weekly Closures
              </CardTitle>
              <CardDescription>
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
                    className="flex flex-col gap-1 h-auto py-3"
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Specific Closed Dates
              </CardTitle>
              <CardDescription>
                Add specific dates when the restaurant is closed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addClosedDate} disabled={!selectedDate}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {bookingSettings.closed_dates.length > 0 ? (
                <div className="space-y-2">
                  {bookingSettings.closed_dates.map((date) => (
                    <div key={date} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeClosedDate(date)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
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