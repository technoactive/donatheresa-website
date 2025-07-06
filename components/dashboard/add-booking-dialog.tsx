"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Check, User, Search } from "lucide-react"
import { format } from "date-fns"
import { cn, getCustomerSegmentInfo, formatCustomerStats } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { createManualBookingAction, searchCustomersAction, getBookingSettingsAction } from "@/app/dashboard/bookings/actions"
import { useTransition } from "react"

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  date: z.date({
    required_error: "Booking date is required",
  }),
  time: z.string().min(1, "Booking time is required"),
  partySize: z.coerce.number().min(1, "Party size must be at least 1").max(20, "Party size cannot exceed 20"),
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
}

export function AddBookingDialog({ 
  availableTimes = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ],
  maxPartySize = 8
}: AddBookingDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [showCustomerDropdown, setShowCustomerDropdown] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [isSearching, setIsSearching] = React.useState(false)
  const [bookingSettings, setBookingSettings] = React.useState<BookingSettings | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = React.useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      time: "",
      partySize: 2,
      specialRequests: "",
    },
  })

  // Load booking settings when dialog opens
  React.useEffect(() => {
    if (open && !bookingSettings) {
      const loadSettings = async () => {
        setIsLoadingSettings(true)
        try {
          const settings = await getBookingSettingsAction()
          setBookingSettings(settings)
        } catch (error) {
          console.error('Error loading booking settings:', error)
          // Use fallback settings
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

  // Debounced customer search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const searchCustomers = React.useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
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
    }, 300) // 300ms debounce
  }, [])

  // Handle search input change
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value)
    form.setValue("customerName", value)
    
    if (selectedCustomer && value !== selectedCustomer.name) {
      setSelectedCustomer(null)
    }
    
    searchCustomers(value)
  }, [form, searchCustomers, selectedCustomer])

  // Handle customer selection
  const handleCustomerSelect = React.useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setSearchQuery(customer.name)
    form.setValue("customerName", customer.name)
    form.setValue("customerEmail", customer.email)
    form.setValue("customerPhone", customer.phone || "")
    setShowCustomerDropdown(false)
    setCustomers([])
  }, [form])

  // Clear customer selection when email changes manually
  const handleEmailChange = React.useCallback((value: string) => {
    if (selectedCustomer && value !== selectedCustomer.email) {
      setSelectedCustomer(null)
    }
  }, [selectedCustomer])

  // Check if a date should be disabled
  const isDateDisabled = React.useCallback((date: Date) => {
    if (!bookingSettings) return false

    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + bookingSettings.max_advance_days)

    // Disable past dates
    if (date < today) return true

    // Disable dates beyond max advance days
    if (date > maxDate) return true

    // Check if the day of week is closed (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay()
    if (bookingSettings.closed_days_of_week.includes(dayOfWeek)) return true

    // Check if the specific date is closed
    const dateString = format(date, 'yyyy-MM-dd')
    if (bookingSettings.closed_dates.includes(dateString)) return true

    return false
  }, [bookingSettings])

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

  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + (bookingSettings?.max_advance_days || 30))

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedCustomer(null)
      setSearchQuery("")
      setCustomers([])
      setShowCustomerDropdown(false)
    }
  }, [open, form])

  // Get available times from settings or fallback
  const currentAvailableTimes = bookingSettings?.available_times || availableTimes
  const currentMaxPartySize = bookingSettings?.max_party_size || maxPartySize

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors duration-200 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-white">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-xl font-semibold text-slate-900">Add Manual Booking</DialogTitle>
          <DialogDescription className="text-slate-600">
            Create a new booking directly from the dashboard. This booking will be marked as manually created.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-medium text-slate-900">Customer Information</h4>
                {selectedCustomer && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Existing Customer
                  </Badge>
                )}
              </div>
              
              {/* Customer Name with Autocomplete */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-sm font-medium text-slate-700">Customer Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Start typing customer name..."
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="pr-8"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        
                        {/* Customer Dropdown */}
                        {showCustomerDropdown && customers.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {customers.map((customer) => {
                              const segmentInfo = getCustomerSegmentInfo(customer.customer_segment)
                              const stats = formatCustomerStats(customer)
                              
                              return (
                                <button
                                  key={customer.id}
                                  type="button"
                                  className="w-full px-3 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors duration-150"
                                  onClick={() => handleCustomerSelect(customer)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="font-medium text-slate-900 text-sm truncate">{customer.name}</div>
                                        <Badge variant="outline" className={`text-xs ${segmentInfo.color} border flex-shrink-0`}>
                                          {segmentInfo.label}
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-slate-500 truncate mb-1">{customer.email}</div>
                                      {customer.phone && (
                                        <div className="text-xs text-slate-400 truncate mb-1">{customer.phone}</div>
                                      )}
                                      <div className="flex items-center gap-3 text-xs text-slate-600">
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
                          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg p-3">
                            <div className="text-sm text-slate-500 text-center">Searching customers...</div>
                          </div>
                        )}
                        
                        {/* No results */}
                        {showCustomerDropdown && !isSearching && customers.length === 0 && searchQuery.length >= 2 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg p-3">
                            <div className="text-sm text-slate-500 text-center">No existing customers found - will create new customer</div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="customer@example.com" 
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

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Information Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-600" />
                Booking Details
              </h4>
              
              {/* Date and Time Row - Properly Aligned */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700">Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-10 pl-3 text-left font-normal justify-start",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          {isLoadingSettings ? (
                            <div className="p-4 text-center text-sm text-slate-500">
                              Loading calendar settings...
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

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700">Time *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentAvailableTimes.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="partySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Party Size *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={currentMaxPartySize}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        className="w-full sm:w-32 h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Special Requests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests or notes..."
                        rows={3}
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white order-1 sm:order-2"
              >
                {isPending ? "Creating..." : "Create Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 