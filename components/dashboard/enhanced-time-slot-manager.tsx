"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Trash2, Coffee, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServicePeriod {
  id: string
  name: string
  startTime: string
  endTime: string
  interval: number
  enabled: boolean
  icon: "lunch" | "dinner" | "break"
}

interface EnhancedTimeSlotManagerProps {
  availableTimes: string[]
  onSlotsChange: (slots: string[]) => void
}

export function EnhancedTimeSlotManager({ availableTimes, onSlotsChange }: EnhancedTimeSlotManagerProps) {
  const [servicePeriods, setServicePeriods] = React.useState<ServicePeriod[]>(() => {
    // Parse existing times into service periods
    const lunchTimes = availableTimes.filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour >= 12 && hour < 16
    })
    
    const dinnerTimes = availableTimes.filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour >= 18 && hour <= 23
    })

    return [
      {
        id: "lunch",
        name: "Lunch Service",
        startTime: lunchTimes[0] || "12:00",
        endTime: lunchTimes[lunchTimes.length - 1] || "15:00",
        interval: 30,
        enabled: lunchTimes.length > 0,
        icon: "lunch"
      },
      {
        id: "dinner",
        name: "Dinner Service",
        startTime: dinnerTimes[0] || "18:00",
        endTime: dinnerTimes[dinnerTimes.length - 1] || "22:00",
        interval: 30,
        enabled: dinnerTimes.length > 0,
        icon: "dinner"
      }
    ]
  })

  // Generate time slots based on service periods
  const generateTimeSlots = React.useCallback(() => {
    const slots: string[] = []
    
    servicePeriods.forEach(period => {
      if (!period.enabled) return
      
      const start = new Date(`2000-01-01T${period.startTime}:00`)
      const end = new Date(`2000-01-01T${period.endTime}:00`)
      const current = new Date(start)
      
      while (current <= end) {
        const timeStr = current.toTimeString().slice(0, 5)
        if (!slots.includes(timeStr)) {
          slots.push(timeStr)
        }
        current.setMinutes(current.getMinutes() + period.interval)
      }
    })
    
    return slots.sort()
  }, [servicePeriods])

  const generatedSlots = generateTimeSlots()

  // Update slots when periods change
  React.useEffect(() => {
    onSlotsChange(generatedSlots)
  }, [generatedSlots, onSlotsChange])

  const updateServicePeriod = (id: string, updates: Partial<ServicePeriod>) => {
    setServicePeriods(prev => 
      prev.map(period => 
        period.id === id ? { ...period, ...updates } : period
      )
    )
  }

  const addServicePeriod = () => {
    const newPeriod: ServicePeriod = {
      id: `period_${Date.now()}`,
      name: "Custom Period",
      startTime: "16:00",
      endTime: "17:30",
      interval: 30,
      enabled: true,
      icon: "break"
    }
    setServicePeriods(prev => [...prev, newPeriod])
  }

  const removeServicePeriod = (id: string) => {
    setServicePeriods(prev => prev.filter(period => period.id !== id))
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case "lunch": return <UtensilsCrossed className="w-4 h-4" />
      case "dinner": return <Clock className="w-4 h-4" />
      case "break": return <Coffee className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getIconColor = (icon: string) => {
    switch (icon) {
      case "lunch": return "text-amber-500 bg-amber-500/10 border-amber-500/20"
      case "dinner": return "text-blue-500 bg-blue-500/10 border-blue-500/20"
      case "break": return "text-green-500 bg-green-500/10 border-green-500/20"
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          Enhanced Time Slot Manager
        </CardTitle>
        <CardDescription className="text-sm">
          Configure service periods with flexible time ranges and automatic slot generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Periods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Service Periods</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addServicePeriod}
              className="h-8 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Period
            </Button>
          </div>

          {servicePeriods.map((period) => (
            <div key={period.id} className={cn("p-4 rounded-lg border", getIconColor(period.icon))}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getIcon(period.icon)}
                  <Input
                    value={period.name}
                    onChange={(e) => updateServicePeriod(period.id, { name: e.target.value })}
                    className="bg-transparent border-none p-0 h-auto font-medium text-white focus-visible:ring-0 w-32"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={period.enabled}
                    onCheckedChange={(enabled) => updateServicePeriod(period.id, { enabled })}
                  />
                  {servicePeriods.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServicePeriod(period.id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {period.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-400">Start Time</Label>
                    <Input
                      type="time"
                      value={period.startTime}
                      onChange={(e) => updateServicePeriod(period.id, { startTime: e.target.value })}
                      className="bg-zinc-900 border-zinc-600 text-white h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-400">End Time</Label>
                    <Input
                      type="time"
                      value={period.endTime}
                      onChange={(e) => updateServicePeriod(period.id, { endTime: e.target.value })}
                      className="bg-zinc-900 border-zinc-600 text-white h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-400">Interval</Label>
                    <Select 
                      value={period.interval.toString()} 
                      onValueChange={(value) => updateServicePeriod(period.id, { interval: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-600 text-white h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-400">Type</Label>
                    <Select 
                      value={period.icon} 
                      onValueChange={(value: "lunch" | "dinner" | "break") => 
                        updateServicePeriod(period.id, { icon: value })
                      }
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-600 text-white h-8">
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
              )}
            </div>
          ))}
        </div>

        {/* Generated Time Slots Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Generated Time Slots</h3>
            <Badge variant="secondary" className="text-xs">
              {generatedSlots.length} slots
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700 max-h-32 overflow-y-auto">
            {generatedSlots.map((slot) => (
              <Badge 
                key={slot} 
                variant="outline" 
                className="text-xs text-center justify-center bg-zinc-800 border-zinc-600 text-zinc-200"
              >
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        {/* Hidden inputs for form submission */}
        {generatedSlots.map((slot) => (
          <input
            key={slot}
            type="hidden"
            name={`timeSlot_${slot.replace(':', '_')}`}
            value="on"
          />
        ))}
      </CardContent>
    </Card>
  )
} 