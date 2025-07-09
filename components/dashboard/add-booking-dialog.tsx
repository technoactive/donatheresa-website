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
import { CalendarIcon, Plus, Search, User, Check, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createManualBookingAction, getBookingSettingsAction, searchCustomersAction } from "@/app/dashboard/bookings/actions"
import { useIPadDetection } from "@/hooks/use-ipad-detection"

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
  
  // Enhanced device detection
  const iPadDetection = useIPadDetection()
  const [isMobile, setIsMobile] = React.useState(false)
  const [isTablet, setIsTablet] = React.useState(false)
  
  // Form refs
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  
  // Device detection with proper breakpoints
  React.useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      setIsMobile(width < 768) // Mobile: less than 768px
      setIsTablet(width >= 768 && width <= 1024) // Tablet: 768px to 1024px
    }
    
    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])

  // Enhanced keyboard handling for mobile/iPad
  React.useEffect(() => {
    if (!isMobile && !iPadDetection.isIPad) return

    let initialViewportHeight = window.innerHeight
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const heightDifference = initialViewportHeight - currentHeight
      
      if (heightDifference > 150 && activeField) {
        // Keyboard is visible - scroll active field into view
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
  }, [activeField, isMobile, iPadDetection.isIPad])

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
      setActiveField(null)
    }
  }, [open, form])

  // Get current settings
  const currentAvailableTimes = bookingSettings?.available_times || availableTimes
  const currentMaxPartySize = bookingSettings?.max_party_size || maxPartySize

  // Responsive classes
  const getDialogClasses = () => {
    if (isMobile) {
      return "fixed inset-0 w-full h-full max-w-none max-h-none rounded-none border-0 bg-white p-0"
    }
    if (isTablet || iPadDetection.isIPad) {
      return "w-[90vw] max-w-4xl h-[85vh] max-h-[750px] rounded-2xl border-0 bg-white shadow-2xl"
    }
    return "w-[90vw] max-w-2xl max-h-[85vh] rounded-xl border-0 bg-white shadow-xl"
  }

  const getInputClasses = () => {
    const baseClasses = "border-2 border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
    
    if (isMobile) {
      return `${baseClasses} h-12 text-base px-4 py-3 rounded-lg`
    }
    if (isTablet || iPadDetection.isIPad) {
      return `${baseClasses} h-14 text-base px-4 py-3 rounded-xl font-medium`
    }
    
    return `${baseClasses} h-10 text-sm px-3 py-2 rounded-lg`
  }

  const getButtonClasses = () => {
    const baseClasses = "font-semibold transition-all duration-200 active:scale-95"
    
    if (isMobile) {
      return `${baseClasses} h-12 px-6 text-base rounded-lg`
    }
    if (isTablet || iPadDetection.isIPad) {
      return `${baseClasses} h-14 px-8 text-base rounded-xl`
    }
    
    return `${baseClasses} h-10 px-4 text-sm rounded-lg`
  }

  const getHeaderClasses = () => {
    if (isMobile) {
      return "px-4 py-3 border-b border-slate-200"
    }
    return "px-6 py-4 border-b border-slate-200"
  }

  const getContentClasses = () => {
    if (isMobile) {
      return "flex-1 overflow-y-auto px-4 py-4"
    }
    return "flex-1 overflow-y-auto px-6 py-6"
  }

  const getGridClasses = () => {
    if (isMobile) {
      return "space-y-8"
    }
    return "grid grid-cols-1 lg:grid-cols-2 gap-8"
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
      <DialogContent className={getDialogClasses()}>
        {/* Header */}
        <div className={getHeaderClasses()}>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-slate-900`}>
            Add Manual Booking
          </DialogTitle>
          <DialogDescription className={`${isMobile ? 'text-sm' : 'text-base'} text-slate-600 mt-1`}>
            Create a new booking directly from the dashboard
          </DialogDescription>
        </div>

        {/* Form Content */}
        <div 
          ref={scrollContainerRef}
          className={getContentClasses()}
          style={{ scrollBehavior: 'smooth' }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Form Fields */}
              <div className={getGridClasses()}>
                
                {/* Customer Information */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-green-100 rounded-full flex items-center justify-center`}>
                      <User className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-900`}>
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
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Customer Name *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Start typing customer name..."
                              value={searchQuery}
                              onChange={(e) => handleSearchChange(e.target.value)}
                              onFocus={() => setActiveField('customerName')}
                              className={`pr-12 ${getInputClasses()}`}
                              autoComplete="off"
                            />
                            <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400`} />
                            
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
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="customer@example.com" 
                            onFocus={() => setActiveField('customerEmail')}
                            className={getInputClasses()}
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
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Optional phone number" 
                            onFocus={() => setActiveField('customerPhone')}
                            className={getInputClasses()}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Booking Details */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-orange-100 rounded-full flex items-center justify-center`}>
                      <CalendarIcon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-600`} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-slate-900`}>
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
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Booking Date *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  getInputClasses()
                                )}
                              >
                                <CalendarIcon className={`mr-3 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            {isLoadingSettings ? (
                              <div className="p-4 text-center text-slate-600">
                                Loading calendar...
                              </div>
                            ) : (
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={isDateDisabled}
                                initialFocus
                              />
                            )}
                          </PopoverContent>
                        </Popover>
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
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Booking Time *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={getInputClasses()}>
                              <Clock className={`mr-3 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currentAvailableTimes.map((time) => (
                              <SelectItem 
                                key={time} 
                                value={time}
                                className={`${isMobile ? 'py-2' : 'py-3'} text-base`}
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

                  {/* Party Size - Fixed icon positioning */}
                  <FormField
                    control={form.control}
                    name="partySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Party Size *
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Users className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-slate-400`} />
                              <Input
                                type="number"
                                min="1"
                                max={currentMaxPartySize}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                className={`w-24 text-center ${getInputClasses()}`}
                                onFocus={() => setActiveField('partySize')}
                              />
                            </div>
                            <span className="text-sm text-slate-500">guests</span>
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
                        <FormLabel className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-slate-800`}>
                          Special Requests
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or notes..."
                            className={`resize-none ${getInputClasses()}`}
                            rows={isMobile ? 3 : 4}
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

              {/* Action Buttons */}
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 pt-4 border-t border-slate-200`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className={`${isMobile ? 'w-full order-2' : 'flex-1'} ${getButtonClasses()}`}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className={`${isMobile ? 'w-full order-1' : 'flex-1'} bg-green-600 hover:bg-green-700 text-white shadow-lg ${getButtonClasses()}`}
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
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 