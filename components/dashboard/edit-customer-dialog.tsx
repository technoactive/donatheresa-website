"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Customer } from "@/lib/types"
import { updateCustomerById } from "@/app/dashboard/customers/actions"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface EditCustomerDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCustomerDialog({ customer, open, onOpenChange }: EditCustomerDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const updatedCustomer = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      }
      
      console.log('[CLIENT] Updating customer:', customer.id, updatedCustomer)
      await updateCustomerById(customer.id, updatedCustomer)
      toast({
        title: "Customer updated",
        description: "The customer has been successfully updated.",
      })
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-slate-900">Edit Customer</DialogTitle>
            <DialogDescription className="text-slate-600">Make changes to the customer's profile.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-slate-900">
                Name
              </Label>
              <Input id="name" name="name" defaultValue={customer.name} required className="col-span-3 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-slate-900">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email}
                required
                className="col-span-3 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-slate-900">
                Phone
              </Label>
              <Input 
                id="phone" 
                name="phone" 
                type="tel" 
                defaultValue={customer.phone} 
                placeholder="07XXX XXXXXX or +44 7XXX XXXXXX"
                className="col-span-3 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
