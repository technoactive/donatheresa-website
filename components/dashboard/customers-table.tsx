"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import type { Customer } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditCustomerDialog } from "./edit-customer-dialog"
import { DeleteCustomerDialog } from "./delete-customer-dialog"
import { getCustomerSegmentInfo, formatCustomerStats, getCustomerEngagementLevel } from "@/lib/utils"

// Inline SVGs to avoid hydration issues with Lucide icons
const PencilIcon = () => (
  <svg 
    className="w-4 h-4" 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </svg>
)

const Trash2Icon = () => (
  <svg 
    className="w-4 h-4" 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

// UK phone number formatting function
function formatUKPhoneNumber(phone: string | undefined): string {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')
  
  // Handle different phone number formats
  if (digitsOnly.startsWith('44')) {
    // Already has UK country code (+44)
    const withoutCountryCode = digitsOnly.substring(2)
    if (withoutCountryCode.startsWith('7')) {
      // Mobile number: +44 7XXX XXXXXX
      return `+44 ${withoutCountryCode.substring(0, 4)} ${withoutCountryCode.substring(4)}`
    } else if (withoutCountryCode.startsWith('20')) {
      // London landline: +44 20 XXXX XXXX
      return `+44 20 ${withoutCountryCode.substring(2, 6)} ${withoutCountryCode.substring(6)}`
    } else {
      // Other UK numbers: +44 XXXX XXXXXX
      return `+44 ${withoutCountryCode.substring(0, 4)} ${withoutCountryCode.substring(4)}`
    }
  } else if (digitsOnly.startsWith('07')) {
    // UK mobile without country code: 07XXX XXXXXX
    return `${digitsOnly.substring(0, 5)} ${digitsOnly.substring(5)}`
  } else if (digitsOnly.startsWith('020')) {
    // London landline: 020 XXXX XXXX
    return `020 ${digitsOnly.substring(3, 7)} ${digitsOnly.substring(7)}`
  } else if (digitsOnly.startsWith('0')) {
    // Other UK landline: 0XXX XXX XXXX
    if (digitsOnly.length === 11) {
      return `${digitsOnly.substring(0, 4)} ${digitsOnly.substring(4, 7)} ${digitsOnly.substring(7)}`
    }
    return phone // Return original if format unclear
  } else if (digitsOnly.startsWith('1')) {
    // Likely US/Canada number - convert to UK mobile format for display
    return `+44 7${digitsOnly.substring(1, 4)} ${digitsOnly.substring(4)}`
  }
  
  // For any other format, return as-is
  return phone
}

// Mobile card component for individual customers
const MobileCustomerCard = React.memo(({ 
  customer, 
  onEdit, 
  onDelete 
}: {
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}) => {
  const segmentInfo = getCustomerSegmentInfo(customer.customer_segment)
  const stats = formatCustomerStats(customer)
  const engagement = getCustomerEngagementLevel(customer)

  return (
    <Card className="w-full mobile-card-touch card-touch swipe-indicator bg-white border-slate-200 shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Header with name and segment */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base leading-tight text-slate-900">{customer.name}</h3>
              <span className={`text-sm ${engagement.color}`}>{engagement.icon}</span>
            </div>
            <p className="text-sm text-slate-600 truncate">{customer.email}</p>
            <Badge variant="outline" className={`text-xs ${segmentInfo.color} border`}>
              {segmentInfo.label}
            </Badge>
          </div>
        </div>
        
        {/* Customer details with booking stats */}
        <div className="grid grid-cols-2 gap-3 text-sm touch-spacing">
          <div>
            <p className="text-slate-600">Phone</p>
            <p className="font-medium text-slate-900">{formatUKPhoneNumber(customer.phone) || "No phone"}</p>
          </div>
          <div>
            <p className="text-slate-600">Total Bookings</p>
            <p className="font-medium text-slate-900">{stats.totalBookings}</p>
          </div>
          <div>
            <p className="text-slate-600">Recent Activity</p>
            <p className="font-medium text-slate-900">{stats.recentBookings} last 90 days</p>
          </div>
          <div>
            <p className="text-slate-600">Last Visit</p>
            <p className="font-medium text-slate-900">{stats.lastBooking}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2 touch-spacing">
          <Button variant="ghost" size="icon" onClick={() => onEdit(customer)} className="h-8 w-8 touch-target card-action-touch text-slate-700 hover:text-slate-900 hover:bg-slate-50">
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(customer)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 touch-target card-action-touch">
            <Trash2Icon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)
  const [deletingCustomer, setDeletingCustomer] = React.useState<Customer | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  console.log('[CLIENT] Rendering customers in UI:', customers.length)

  const handleEditClick = (customer: Customer) => {
    console.log('[CLIENT] Edit button clicked for customer:', customer.id)
    setEditingCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (customer: Customer) => {
    console.log('[CLIENT] Delete button clicked for customer:', customer.id)
    setDeletingCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    console.log('[CLIENT] Edit dialog closing')
    setIsEditDialogOpen(false)
    setEditingCustomer(null)
  }

  const handleDeleteDialogClose = () => {
    console.log('[CLIENT] Delete dialog closing')
    setIsDeleteDialogOpen(false)
    setDeletingCustomer(null)
  }

  return (
    <div className="w-full space-y-4 touch-spacing">
      {/* Mobile view - Card layout for screens smaller than md */}
      <div className="block md:hidden space-y-3 touch-spacing">
        {customers.length ? (
          customers.map((customer) => (
            <MobileCustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <Card className="card-touch bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-slate-600">No customers found.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop view - Table layout for md screens and larger */}
      <div className="hidden md:block">
        <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-x-auto scroll-area-touch">
          <Table className="table-touch">
            <TableHeader>
              <TableRow className="table-row border-slate-200 hover:bg-slate-50">
                <TableHead className="min-w-[180px] table-cell text-slate-700">Customer</TableHead>
                <TableHead className="min-w-[200px] table-cell text-slate-700">Contact</TableHead>
                <TableHead className="min-w-[120px] table-cell text-slate-700 text-center">Bookings</TableHead>
                <TableHead className="min-w-[140px] table-cell text-slate-700 text-center">Activity</TableHead>
                <TableHead className="min-w-[120px] table-cell text-slate-700">Status</TableHead>
                <TableHead className="text-right min-w-[120px] table-cell text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length ? (
                customers.map((customer) => {
                  const segmentInfo = getCustomerSegmentInfo(customer.customer_segment)
                  const stats = formatCustomerStats(customer)
                  const engagement = getCustomerEngagementLevel(customer)
                  
                  return (
                    <TableRow key={customer.id} className="table-row border-slate-200 hover:bg-slate-50">
                      <TableCell className="table-cell">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{customer.name}</span>
                              <span className={`text-sm ${engagement.color}`}>{engagement.icon}</span>
                            </div>
                            <Badge variant="outline" className={`text-xs mt-1 ${segmentInfo.color} border`}>
                              {segmentInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="space-y-1">
                          <div className="text-slate-900">{customer.email}</div>
                          <div className="text-sm text-slate-600">{formatUKPhoneNumber(customer.phone) || "No phone"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell text-center">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">{stats.totalBookings}</div>
                          <div className="text-xs text-slate-600">total</div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell text-center">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">{stats.recentBookings}</div>
                          <div className="text-xs text-slate-600">last 90d</div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-slate-900">Avg: {stats.avgPartySize}</div>
                          <div className="text-xs text-slate-600">Last: {stats.lastBooking}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right table-cell">
                        <div className="flex justify-end gap-1 touch-spacing">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(customer)} className="h-8 w-8 touch-target card-action-touch text-slate-700 hover:text-slate-900 hover:bg-slate-50">
                            <PencilIcon />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(customer)} className="h-8 w-8 touch-target card-action-touch text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2Icon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow className="table-row border-slate-200 hover:bg-slate-50">
                  <TableCell colSpan={6} className="h-24 text-center table-cell text-slate-600">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Always render dialogs but control their open state */}
      {editingCustomer && (
        <EditCustomerDialog
          customer={editingCustomer}
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
        />
      )}
      
      {deletingCustomer && (
        <DeleteCustomerDialog
          customer={deletingCustomer}
          open={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
        />
      )}
    </div>
  )
}
