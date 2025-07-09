"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Plus, Search, User, Check, Clock, Users, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createManualBookingAction, getBookingSettingsAction, searchCustomersAction } from "@/app/dashboard/bookings/actions"

// Form validation schema
const formSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name must be at least 2 characters." }),
  customerEmail: z.string().email({ message: "Please enter a valid email address." }),
  customerPhone: z.string().optional(),
  date: z.date({ required_error: "Please select a booking date." }),
  time: z.string({ required_error: "Please select a booking time." }),
  partySize: z.number().min(1, { message: "Party size must be at least 1." }).max(20, { message: "Party size cannot exceed 20." }),
  specialRequests: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  total_bookings?: number
  recent_bookings?: number
  last_booking_date?: string
  average_party_size?: number
  customer_segment?: 'new' | 'regular' | 'vip' | 'inactive'
}

interface BookingSettings {
  booking_enabled: boolean
  max_advance_days: number
  max_party_size: number
  available_times: string[]
  closed_dates: string[]
  closed_days_of_week: number[]
  suspension_message: string
  maintenance_mode?: boolean
}

interface AddBookingDialogProps {
  availableTimes?: string[]
  maxPartySize?: number
  children?: React.ReactNode
}

export function AddBookingDialog({ 
  availableTimes = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ],
  maxPartySize = 8,
  children
}: AddBookingDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showCustomerDropdown, setShowCustomerDropdown] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [bookingSettings, setBookingSettings] = React.useState<BookingSettings | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = React.useState(false)
  const [activeField, setActiveField] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)
  
  // Form refs
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Simple iOS detection
  const [isIOS, setIsIOS] = React.useState(false)
  
  React.useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const iosDevice = /ipad|iphone|ipod/.test(userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(iosDevice)
    console.log('🔥 iOS Detection:', iosDevice, 'User Agent:', userAgent.substring(0, 50))
  }, [])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      partySize: 2,
      specialRequests: "",
    },
  })

  // Customer helper functions
  const getCustomerSegmentInfo = (segment?: string) => {
    switch (segment) {
      case 'vip':
        return { label: 'VIP', color: 'bg-purple-50 text-purple-700 border-purple-200' }
      case 'regular':
        return { label: 'Regular', color: 'bg-blue-50 text-blue-700 border-blue-200' }
      case 'new':
        return { label: 'New', color: 'bg-green-50 text-green-700 border-green-200' }
      case 'inactive':
        return { label: 'Inactive', color: 'bg-gray-50 text-gray-700 border-gray-200' }
      default:
        return { label: 'Customer', color: 'bg-slate-50 text-slate-700 border-slate-200' }
    }
  }

  const formatCustomerStats = (customer: Customer) => {
    const totalBookings = customer.total_bookings || 0
    const recentBookings = customer.recent_bookings || 0
    const lastBooking = customer.last_booking_date 
      ? new Date(customer.last_booking_date).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short' 
        })
      : 'Never'
    
    return {
      totalBookings,
      recentBookings,
      lastBooking,
      hasRecentActivity: recentBookings > 0
    }
  }

  // Load booking settings
  React.useEffect(() => {
    if (open && !bookingSettings) {
      const loadSettings = async () => {
        setIsLoadingSettings(true)
        try {
          console.log('🔄 Loading booking settings...')
          const settings = await getBookingSettingsAction()
          console.log('✅ Booking settings loaded:', settings)
          console.log('📅 Available times from database:', settings.available_times)
          setBookingSettings(settings)
        } catch (error) {
          console.error('❌ Error loading booking settings:', error)
          setBookingSettings({
            booking_enabled: true,
            max_advance_days: 30,
            max_party_size: 8,
            available_times: availableTimes,
            closed_dates: [],
            closed_days_of_week: [],
            suspension_message: "",
            maintenance_mode: false
          })
        } finally {
          setIsLoadingSettings(false)
        }
      }
      loadSettings()
    }
  }, [open, bookingSettings, availableTimes])

  // Customer search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const searchCustomers = React.useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true)
        try {
          const results = await searchCustomersAction(query)
          setCustomers(results)
          setShowCustomerDropdown(true)
        } catch (error) {
          console.error('Error searching customers:', error)
          setCustomers([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setCustomers([])
        setShowCustomerDropdown(false)
      }
    }, 300)
  }, [])

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value)
    form.setValue("customerName", value)
    
    if (selectedCustomer && value !== selectedCustomer.name) {
      setSelectedCustomer(null)
    }
    
    searchCustomers(value)
  }, [form, searchCustomers, selectedCustomer])

  const handleCustomerSelect = React.useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setSearchQuery(customer.name)
    form.setValue("customerName", customer.name)
    form.setValue("customerEmail", customer.email)
    form.setValue("customerPhone", customer.phone || "")
    setShowCustomerDropdown(false)
    setCustomers([])
  }, [form])

  const handleEmailChange = React.useCallback((value: string) => {
    if (selectedCustomer && value !== selectedCustomer.email) {
      setSelectedCustomer(null)
    }
  }, [selectedCustomer])

  // Date validation
  const isDateDisabled = React.useCallback((date: Date) => {
    if (!bookingSettings) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + bookingSettings.max_advance_days)

    if (checkDate < today) return true
    if (checkDate > maxDate) return true

    const dayOfWeek = checkDate.getDay()
    if (bookingSettings.closed_days_of_week.includes(dayOfWeek)) return true

    const dateString = format(checkDate, 'yyyy-MM-dd')
    if (bookingSettings.closed_dates.includes(dateString)) return true

    return false
  }, [bookingSettings])

  // Form submission
  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("name", data.customerName)
        formData.append("email", data.customerEmail)
        formData.append("phone", data.customerPhone || "")
        formData.append("date", format(data.date, "yyyy-MM-dd"))
        formData.append("time", data.time)
        formData.append("partySize", data.partySize.toString())
        formData.append("specialRequests", data.specialRequests || "")
        formData.append("source", "dashboard")

        const result = await createManualBookingAction(formData)
        
        if (result.success) {
          toast.success(result.message)
          setOpen(false)
          form.reset()
          setSelectedCustomer(null)
          setSearchQuery("")
          setCustomers([])
          setShowCustomerDropdown(false)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error("Failed to create booking")
      }
    })
  }

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedCustomer(null)
      setSearchQuery("")
      setCustomers([])
      setShowCustomerDropdown(false)
      setDatePickerOpen(false)
      setActiveField(null)
    }
  }, [open, form])

  // Get current settings
  const currentAvailableTimes = bookingSettings?.available_times || availableTimes
  const currentMaxPartySize = bookingSettings?.max_party_size || maxPartySize
  
  // Debug logging
  React.useEffect(() => {
    if (bookingSettings) {
      console.log('🎯 Current available times being used:', currentAvailableTimes)
      console.log('🏪 From database:', bookingSettings.available_times)
      console.log('📦 Fallback times:', availableTimes)
      console.log('📊 Times count - DB:', bookingSettings.available_times?.length || 0, 'Fallback:', availableTimes.length)
    }
  }, [bookingSettings, currentAvailableTimes, availableTimes])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="booking-dialog-mobile w-[95vw] max-w-4xl h-[90vh] max-h-none rounded-2xl border-0 bg-white shadow-2xl overflow-hidden">
        <style jsx>{`
          /* Hide default DialogContent close button */
          .booking-dialog-mobile [data-radix-dialog-close] {
            display: none !important;
          }
          .booking-dialog-mobile button[aria-label="Close"] {
            display: none !important;
          }
          
          @media (max-width: 768px) {
            .booking-dialog-mobile {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100% !important;
              height: 100% !important;
              max-width: none !important;
              max-height: none !important;
              border-radius: 0 !important;
              margin: 0 !important;
              transform: none !important;
            }
            .mobile-header {
              padding: 1.25rem !important;
            }
            .mobile-content {
              padding: 1.25rem !important;
            }
            .mobile-input {
              height: 4rem !important;
              font-size: 1.125rem !important;
              padding: 1rem 1.25rem !important;
              border-radius: 1rem !important;
              border-width: 2px !important;
              width: 100% !important;
            }
            .mobile-input-number {
              height: 4rem !important;
              font-size: 1.125rem !important;
              padding: 1rem 1.25rem !important;
              border-radius: 1rem !important;
              border-width: 2px !important;
              width: 8rem !important;
              text-align: center !important;
            }
            .mobile-textarea {
              height: 8rem !important;
              font-size: 1.125rem !important;
              padding: 1rem 1.25rem !important;
              border-radius: 1rem !important;
              border-width: 2px !important;
              width: 100% !important;
            }
            .mobile-button {
              height: 4rem !important;
              font-size: 1.25rem !important;
              font-weight: 700 !important;
              border-radius: 1rem !important;
              width: 100% !important;
              display: block !important;
              margin-bottom: 1rem !important;
            }
            .mobile-button:last-child {
              margin-bottom: 0 !important;
            }
            .mobile-button-icon {
              width: 2rem !important;
              height: 2rem !important;
              margin-right: 0.75rem !important;
            }
            .mobile-search-icon {
              width: 1.75rem !important;
              height: 1.75rem !important;
              position: absolute !important;
              right: 1.25rem !important;
              top: 50% !important;
              transform: translateY(-50%) !important;
            }
            .mobile-date-icon {
              width: 1.75rem !important;
              height: 1.75rem !important;
              margin-right: 0.75rem !important;
            }
            .mobile-layout {
              display: block !important;
            }
            .desktop-layout {
              display: none !important;
            }
            /* Force date picker button to be same height */
            .mobile-layout button[data-slot="trigger"] {
              height: 4rem !important;
              font-size: 1.125rem !important;
              padding: 1rem 1.25rem !important;
              border-radius: 1rem !important;
              border-width: 2px !important;
              width: 100% !important;
            }
            /* Force proper button spacing */
            .mobile-buttons {
              padding-top: 2rem !important;
            }
            .mobile-buttons > button {
              display: block !important;
              width: 100% !important;
              margin-bottom: 1rem !important;
            }
            .mobile-buttons > button:last-child {
              margin-bottom: 0 !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-layout {
              display: none !important;
            }
            .desktop-layout {
              display: grid !important;
            }
          }
        `}</style>

        {/* Header */}
        <div className="mobile-header border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Add Manual Booking
              </DialogTitle>
              <DialogDescription className="text-base text-slate-600 mt-2">
                Create a new booking directly from the dashboard
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-12 w-12 p-0 hover:bg-slate-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div 
          ref={scrollContainerRef}
          className="mobile-content flex-1 overflow-y-auto px-6 py-6"
          style={{ scrollBehavior: 'smooth' }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* MOBILE LAYOUT */}
              <div className="mobile-layout space-y-8">
                {/* Customer Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Customer Info</h3>
                  </div>
                  
                  {/* Customer Name */}
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Customer Name *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Enter customer name..."
                              value={searchQuery}
                              onChange={(e) => handleSearchChange(e.target.value)}
                              onFocus={() => setActiveField('customerName')}
                              className="mobile-input border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                              autoComplete="off"
                            />
                            <Search className="mobile-search-icon text-slate-400" />
                            
                            {/* Customer Dropdown */}
                            {showCustomerDropdown && customers.length > 0 && (
                              <div className="absolute z-50 w-full mt-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                                {customers.map((customer) => {
                                  const segmentInfo = getCustomerSegmentInfo(customer.customer_segment)
                                  const stats = formatCustomerStats(customer)
                                  
                                  return (
                                    <button
                                      key={customer.id}
                                      type="button"
                                      className="w-full px-5 py-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors duration-200 active:bg-slate-100"
                                      onClick={() => handleCustomerSelect(customer)}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <div className="font-semibold text-slate-900 text-base truncate">{customer.name}</div>
                                            <Badge variant="outline" className={`text-xs ${segmentInfo.color}`}>
                                              {segmentInfo.label}
                                            </Badge>
                                          </div>
                                          <div className="text-sm text-slate-600 truncate mb-1">{customer.email}</div>
                                          {customer.phone && (
                                            <div className="text-sm text-slate-500 truncate mb-1">{customer.phone}</div>
                                          )}
                                          <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span>{stats.totalBookings} bookings</span>
                                            {stats.hasRecentActivity && <span>• Recent: {stats.recentBookings}</span>}
                                            <span>• Last: {stats.lastBooking}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="customer@example.com" 
                            onFocus={() => setActiveField('customerEmail')}
                            className="mobile-input border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              handleEmailChange(e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Optional phone number" 
                            onFocus={() => setActiveField('customerPhone')}
                            className="mobile-input border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-slate-200"></div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Booking Details</h3>
                  </div>
                  
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Booking Date *
                        </FormLabel>
                        <FormControl>
                          {isIOS ? (
                            <Input
                              type="date"
                              value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null
                                field.onChange(date)
                              }}
                              className="mobile-input border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                              min={format(new Date(), 'yyyy-MM-dd')}
                            />
                          ) : (
                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="mobile-input w-full justify-start text-left font-normal border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                                  type="button"
                                  data-slot="trigger"
                                >
                                  <CalendarIcon className="mobile-date-icon text-slate-400" />
                                  {field.value ? format(field.value, "PPP") : <span className="text-slate-400">Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date)
                                    setDatePickerOpen(false)
                                  }}
                                  disabled={isDateDisabled}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Booking Time *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="mobile-input border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white">
                              <Clock className="mr-3 h-6 w-6 text-slate-400" />
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currentAvailableTimes.length === 0 ? (
                              <SelectItem value="no-times" disabled className="py-4 px-5 text-lg text-red-600">
                                No time slots configured - Please set up service periods in Settings
                              </SelectItem>
                            ) : (
                              currentAvailableTimes.map((time) => (
                                <SelectItem key={time} value={time} className="py-4 px-5 text-lg">
                                  {time}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Party Size */}
                  <FormField
                    control={form.control}
                    name="partySize"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Party Size *
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Users className="h-6 w-6 text-slate-400" />
                              <Input
                                type="number"
                                min="1"
                                max={currentMaxPartySize}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className="mobile-input-number border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white"
                                onFocus={() => setActiveField('partySize')}
                              />
                            </div>
                            <span className="text-lg text-slate-500 font-medium">guests</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Special Requests */}
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium text-slate-700">
                          Special Requests
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special dietary requirements, celebrations, or seating preferences..."
                            className="mobile-textarea border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white resize-none"
                            onFocus={() => setActiveField('specialRequests')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mobile Buttons */}
                <div className="mobile-buttons pt-8">
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="mobile-button bg-green-600 hover:bg-green-700 text-white shadow-xl transition-all duration-300 active:scale-95"
                  >
                    {isPending ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Check className="mobile-button-icon" />
                        Create Booking
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                    className="mobile-button border-2 border-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300 active:scale-95"
                  >
                    <X className="mobile-button-icon" />
                    Cancel
                  </Button>
                </div>
              </div>

              {/* DESKTOP LAYOUT - Keep existing desktop code */}
              <div className="desktop-layout grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Customer Information
                      </h3>
                      {selectedCustomer && (
                        <Badge className="bg-green-50 text-green-700 border-green-200 mt-1 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Existing Customer
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Customer Name */}
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Customer Name *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Start typing customer name..."
                              value={searchQuery}
                              onChange={(e) => handleSearchChange(e.target.value)}
                              onFocus={() => setActiveField('customerName')}
                              className="h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 pr-12"
                              autoComplete="off"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            
                            {/* Customer Dropdown */}
                            {showCustomerDropdown && customers.length > 0 && (
                              <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                                {customers.map((customer) => {
                                  const segmentInfo = getCustomerSegmentInfo(customer.customer_segment)
                                  const stats = formatCustomerStats(customer)
                                  
                                  return (
                                    <button
                                      key={customer.id}
                                      type="button"
                                      className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-200 last:border-b-0 transition-colors duration-200"
                                      onClick={() => handleCustomerSelect(customer)}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <div className="font-semibold text-slate-900 text-sm truncate">{customer.name}</div>
                                            <Badge variant="outline" className={`text-xs ${segmentInfo.color}`}>
                                              {segmentInfo.label}
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-slate-600 truncate mb-1">{customer.email}</div>
                                          {customer.phone && (
                                            <div className="text-xs text-slate-500 truncate mb-1">{customer.phone}</div>
                                          )}
                                          <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span>{stats.totalBookings} bookings</span>
                                            {stats.hasRecentActivity && <span>• Recent: {stats.recentBookings}</span>}
                                            <span>• Last: {stats.lastBooking}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                            
                            {/* Loading state */}
                            {isSearching && (
                              <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-2xl p-3">
                                <div className="text-slate-600 text-center text-sm">Searching customers...</div>
                              </div>
                            )}
                            
                            {/* No results */}
                            {showCustomerDropdown && !isSearching && customers.length === 0 && searchQuery.length >= 2 && (
                              <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-2xl p-3">
                                <div className="text-slate-600 text-center text-sm">No customers found - will create new</div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="customer@example.com" 
                            onFocus={() => setActiveField('customerEmail')}
                            className="h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              handleEmailChange(e.target.value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Optional phone number" 
                            onFocus={() => setActiveField('customerPhone')}
                            className="h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Booking Details
                      </h3>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Booking Date *
                        </FormLabel>
                        <FormControl>
                          {isIOS ? (
                            <Input
                              type="date"
                              value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null
                                field.onChange(date)
                              }}
                              className="h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                              min={format(new Date(), 'yyyy-MM-dd')}
                            />
                          ) : (
                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                  type="button"
                                >
                                  <CalendarIcon className="mr-3 h-5 w-5 text-slate-400" />
                                  {field.value ? format(field.value, "PPP") : <span className="text-slate-400">Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date)
                                    setDatePickerOpen(false)
                                  }}
                                  disabled={isDateDisabled}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Booking Time *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200">
                              <Clock className="mr-3 h-5 w-5 text-slate-400" />
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currentAvailableTimes.length === 0 ? (
                              <SelectItem value="no-times" disabled className="py-3 text-base text-red-600">
                                No time slots configured - Please set up service periods in Settings
                              </SelectItem>
                            ) : (
                              currentAvailableTimes.map((time) => (
                                <SelectItem key={time} value={time} className="py-3 text-base">
                                  {time}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Party Size */}
                  <FormField
                    control={form.control}
                    name="partySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Party Size *
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-slate-400" />
                              <Input
                                type="number"
                                min="1"
                                max={currentMaxPartySize}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className="w-24 text-center h-10 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                onFocus={() => setActiveField('partySize')}
                              />
                            </div>
                            <span className="text-base text-slate-500">guests</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Special Requests */}
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-slate-800">
                          Special Requests
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or notes..."
                            className="resize-none h-20 text-sm px-3 py-2 rounded-lg border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                            rows={3}
                            onFocus={() => setActiveField('specialRequests')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Desktop Buttons */}
                <div className="col-span-2 flex flex-row gap-4 justify-end pt-6 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                    className="h-10 px-6 text-sm rounded-lg font-semibold transition-all duration-200 active:scale-95 min-w-[120px]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="h-10 px-6 text-sm rounded-lg font-semibold transition-all duration-200 active:scale-95 bg-green-600 hover:bg-green-700 text-white shadow-lg min-w-[140px]"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Booking"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 