import { CustomersTable } from "@/components/dashboard/customers-table"
import { AddCustomerDialog } from "@/components/dashboard/add-customer-dialog"
import { getAllCustomers, refreshCustomersPage } from "./actions"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { Customer } from "@/lib/types"

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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Customers</h1>
            <p className="text-red-500 text-sm sm:text-base">Error: {error}</p>
          </div>
          <form action={refreshCustomersPage}>
            <Button type="submit" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Customers</h1>
          <p className="text-muted-foreground text-sm sm:text-base">View and manage your customer list.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <form action={refreshCustomersPage} className="w-full sm:w-auto">
            <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </form>
          <div className="w-full sm:w-auto">
            <AddCustomerDialog />
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-full overflow-hidden">
        <CustomersTable customers={customers} />
      </div>
    </div>
  )
}
