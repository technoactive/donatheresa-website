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

// Simple device detection hook
function useDeviceDetection() {
  const [isMounted, setIsMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isTablet, setIsTablet] = React.useState(false)
  const [isIOS, setIsIOS] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    
    const checkDevice = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase()
      const iosDevice = /ipad|iphone|ipod/.test(userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      
      const mobile = width < 768
      const tablet = width >= 768 && width < 1024
      
      setIsMobile(mobile)
      setIsTablet(tablet)
      setIsIOS(iosDevice)
      
      console.log('🔥 DEVICE DETECTION:', { 
        width, 
        mobile, 
        tablet, 
        desktop: width >= 1024,
        ios: iosDevice,
        userAgent: userAgent.substring(0, 30)
      })
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMounted, isMobile, isTablet, isDesktop: !isMobile && !isTablet, isIOS }
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
  
  // Use the custom hook
  const { isMounted, isMobile, isTablet, isDesktop, isIOS } = useDeviceDetection()
  
  // Form refs
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Enhanced keyboard handling for mobile/tablet
  React.useEffect(() => {
    if (!isMobile && !isTablet) return

    let initialViewportHeight = window.innerHeight
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const heightDifference = initialViewportHeight - currentHeight
      
      if (heightDifference > 150 && activeField) {
        setTimeout(() => {
          const activeElement = document.querySelector(`[name="${activeField}"]`) as HTMLElement
          if (activeElement && scrollContainerRef.current) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
          }
        }, 100)
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange)
      return () => window.visualViewport?.removeEventListener('resize', handleViewportChange)
    }
  }, [activeField, isMobile, isTablet])

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
          const settings = await getBookingSettingsAction()
          setBookingSettings(settings)
        } catch (error) {
          console.error('Error loading booking settings:', error)
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

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
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
        <DialogContent className="w-[90vw] max-w-2xl max-h-[85vh] rounded-xl border-0 bg-white shadow-xl">
          <div className="p-6">Loading...</div>
        </DialogContent>
      </Dialog>
    )
  }

  // Enhanced date picker with iOS/iPad specific handling
  const renderDatePicker = (field: any) => {
    if (isIOS) {
      // For iOS devices, use native date input for better UX
      return (
        <Input
          type="date"
          value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null
            field.onChange(date)
          }}
          className={cn(
            "border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
            isMobile 
              ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
              : isTablet 
                ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                : "h-10 text-sm px-3 py-2 rounded-lg"
          )}
          min={format(new Date(), 'yyyy-MM-dd')}
          max={format(new Date(Date.now() + (bookingSettings?.max_advance_days || 30) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
        />
      )
    }

    // For non-iOS devices, use the Popover calendar
    return (
      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
              !field.value && "text-muted-foreground",
              isMobile 
                ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                : isTablet 
                  ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                  : "h-10 text-sm px-3 py-2 rounded-lg"
            )}
            onClick={() => setDatePickerOpen(true)}
          >
            <CalendarIcon className={`mr-3 ${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          side="bottom"
          sideOffset={8}
        >
          {isLoadingSettings ? (
            <div className="p-4 text-center text-slate-600">
              Loading calendar...
            </div>
          ) : (
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
          )}
        </PopoverContent>
      </Popover>
    )
  }

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
      <DialogContent 
        className={cn(
          isMobile
            ? "!fixed !inset-0 !w-full !h-full !max-w-none !max-h-none !rounded-none !border-0 !bg-white !p-0 !transform-none"
            : isTablet
              ? "!w-[95vw] !max-w-4xl !h-[85vh] !max-h-[750px] !rounded-2xl !border-0 !bg-white !shadow-2xl"
              : "w-[90vw] max-w-2xl max-h-[85vh] rounded-xl border-0 bg-white shadow-xl"
        )}
        style={isMobile ? { 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100%', 
          height: '100%',
          maxWidth: 'none',
          maxHeight: 'none',
          margin: 0,
          padding: 0,
          transform: 'none'
        } : {}}
      >
        {/* Header */}
        <div className={cn(
          "border-b border-slate-200 bg-white",
          isMobile ? "px-4 py-4" : "px-6 py-4"
        )}>
          <DialogTitle className={cn(
            "font-bold text-slate-900",
            isMobile ? "text-xl" : "text-2xl"
          )}>
            Add Manual Booking
          </DialogTitle>
          <DialogDescription className={cn(
            "text-slate-600 mt-1",
            isMobile ? "text-base" : "text-base"
          )}>
            Create a new booking directly from the dashboard
          </DialogDescription>
        </div>

        {/* Form Content */}
        <div 
          ref={scrollContainerRef}
          className={cn(
            "flex-1 overflow-y-auto",
            isMobile ? "px-4 py-4" : "px-6 py-6"
          )}
          style={{ scrollBehavior: 'smooth' }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Form Fields */}
              <div className={cn(isMobile ? "space-y-8" : "grid grid-cols-1 lg:grid-cols-2 gap-8")}>
                
                {/* Customer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                    <div className={cn(
                      "bg-green-100 rounded-full flex items-center justify-center",
                      isMobile ? "w-10 h-10" : "w-10 h-10"
                    )}>
                      <User className={cn(
                        "text-green-600",
                        isMobile ? "w-5 h-5" : "w-5 h-5"
                      )} />
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-semibold text-slate-900",
                        isMobile ? "text-lg" : "text-lg"
                      )}>
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Customer Name *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Start typing customer name..."
                              value={searchQuery}
                              onChange={(e) => handleSearchChange(e.target.value)}
                              onFocus={() => setActiveField('customerName')}
                              className={cn(
                                "border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 pr-12",
                                isMobile 
                                  ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                                  : isTablet 
                                    ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                                    : "h-10 text-sm px-3 py-2 rounded-lg"
                              )}
                              autoComplete="off"
                            />
                            <Search className={cn(
                              "absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400",
                              isMobile ? "w-5 h-5" : "w-5 h-5"
                            )} />
                            
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="customer@example.com" 
                            onFocus={() => setActiveField('customerEmail')}
                            className={cn(
                              "border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
                              isMobile 
                                ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                                : isTablet 
                                  ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                                  : "h-10 text-sm px-3 py-2 rounded-lg"
                            )}
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Optional phone number" 
                            onFocus={() => setActiveField('customerPhone')}
                            className={cn(
                              "border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
                              isMobile 
                                ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                                : isTablet 
                                  ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                                  : "h-10 text-sm px-3 py-2 rounded-lg"
                            )}
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
                    <div className={cn(
                      "bg-orange-100 rounded-full flex items-center justify-center",
                      isMobile ? "w-10 h-10" : "w-10 h-10"
                    )}>
                      <CalendarIcon className={cn(
                        "text-orange-600",
                        isMobile ? "w-5 h-5" : "w-5 h-5"
                      )} />
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-semibold text-slate-900",
                        isMobile ? "text-lg" : "text-lg"
                      )}>
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Booking Date *
                        </FormLabel>
                        <FormControl>
                          {renderDatePicker(field)}
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Booking Time *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={cn(
                              "border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
                              isMobile 
                                ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                                : isTablet 
                                  ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                                  : "h-10 text-sm px-3 py-2 rounded-lg"
                            )}>
                              <Clock className={cn(
                                "mr-3",
                                isMobile ? "h-5 w-5" : "h-5 w-5"
                              )} />
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currentAvailableTimes.map((time) => (
                              <SelectItem 
                                key={time} 
                                value={time}
                                className={cn(
                                  "text-base",
                                  isMobile ? "py-4 px-4" : "py-3"
                                )}
                              >
                                {time}
                              </SelectItem>
                            ))}
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Party Size *
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Users className={cn(
                                "text-slate-400",
                                isMobile ? "h-5 w-5" : "h-5 w-5"
                              )} />
                              <Input
                                type="number"
                                min="1"
                                max={currentMaxPartySize}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className={cn(
                                  "w-24 text-center border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
                                  isMobile 
                                    ? "h-14 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                                    : isTablet 
                                      ? "h-16 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                                      : "h-10 text-sm px-3 py-2 rounded-lg"
                                )}
                                onFocus={() => setActiveField('partySize')}
                              />
                            </div>
                            <span className={cn(
                              "text-slate-500",
                              isMobile ? "text-base" : "text-base"
                            )}>guests</span>
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
                        <FormLabel className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-base" : "text-base"
                        )}>
                          Special Requests
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or notes..."
                            className={cn(
                              "resize-none border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
                              isMobile 
                                ? "h-24 text-lg px-4 py-3 rounded-lg touch-manipulation" 
                                : isTablet 
                                  ? "h-28 text-lg px-4 py-3 rounded-xl font-medium touch-manipulation"
                                  : "h-20 text-sm px-3 py-2 rounded-lg"
                            )}
                            rows={isMobile ? 4 : 3}
                            onFocus={() => setActiveField('specialRequests')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* FORCED MOBILE BUTTONS - Different approach */}
              <div className={cn(
                "pt-6 border-t-2 border-slate-200",
                isMobile 
                  ? "space-y-4" 
                  : isTablet
                    ? "flex flex-row gap-6 justify-center"
                    : "flex flex-row gap-4 justify-end"
              )}>
                {isDesktop ? (
                  // Desktop: Text buttons
                  <>
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
                  </>
                ) : isMobile ? (
                  // Mobile: Full-width buttons with text + icons
                  <>
                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="!w-full !h-16 !text-xl !font-bold !bg-green-600 hover:!bg-green-700 !text-white !shadow-lg !rounded-xl !transition-all !duration-200 active:!scale-95 !touch-manipulation !order-1"
                    >
                      {isPending ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Check className="w-6 h-6 mr-3" />
                          Create Booking
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={isPending}
                      className="!w-full !h-16 !text-xl !font-bold !border-2 !border-slate-300 hover:!border-red-300 hover:!bg-red-50 hover:!text-red-600 !rounded-xl !transition-all !duration-200 active:!scale-95 !touch-manipulation !order-2"
                    >
                      <X className="w-6 h-6 mr-3" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  // Tablet: Large square icon-only buttons
                  <>
                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="!w-20 !h-20 !bg-green-600 hover:!bg-green-700 !text-white !shadow-lg !rounded-2xl !transition-all !duration-200 active:!scale-95 !touch-manipulation !p-0 !flex !items-center !justify-center"
                    >
                      {isPending ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      ) : (
                        <Check className="w-10 h-10" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={isPending}
                      className="!w-20 !h-20 !border-2 !border-slate-300 hover:!border-red-300 hover:!bg-red-50 hover:!text-red-600 !rounded-2xl !transition-all !duration-200 active:!scale-95 !touch-manipulation !p-0 !flex !items-center !justify-center"
                    >
                      <X className="w-10 h-10" />
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 