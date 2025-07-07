import { CustomersTable } from "@/components/dashboard/customers-table"
import { CustomerAnalytics } from "@/components/dashboard/customer-analytics"
import { AddCustomerDialog } from "@/components/dashboard/add-customer-dialog"
import { getAllCustomers } from "./actions"
import { TrendingUp } from "lucide-react"
import type { Customer } from "@/lib/types"

// Force dynamic rendering since this page uses cookies for authentication
export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  console.log('[SERVER] Loading customers page...')
  
  let customers: Customer[]
  let error = null
  
  try {
    customers = await getAllCustomers()
    console.log('[SERVER] Customers loaded from Supabase:', customers)
    console.log('[SERVER] Number of customers:', customers.length)
  } catch (err) {
    console.error('[SERVER] Error loading customers:', err)
    error = err instanceof Error ? err.message : 'Unknown error'
    customers = []
  }

  if (error) {
    return (
      <div className="w-full max-w-full space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Customers</h1>
            <p className="text-red-500 text-sm sm:text-base">Error: {error}</p>
            <p className="text-slate-600 text-sm">Please try navigating to another page and back, or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2 pb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">Customers</h1>
          <p className="text-slate-600 text-sm sm:text-base">View and manage your customer list.</p>
        </div>
        
        <div className="w-full sm:w-auto">
          <AddCustomerDialog />
        </div>
      </div>
      
      {/* Customer Analytics Dashboard */}
      {customers.length > 0 && (
        <div className="w-full max-w-full">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-900">Customer Analytics</h2>
          </div>
          <CustomerAnalytics customers={customers} />
        </div>
      )}
      
      {/* Customer Table */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-slate-900">All Customers</h2>
        </div>
        <CustomersTable customers={customers} />
      </div>
    </div>
  )
}
