"use client"

import * as React from "react"
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
import { createCustomer } from "@/app/dashboard/customers/actions"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export function AddCustomerDialog() {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      await createCustomer(formData)
      
      toast({
        title: "Customer created",
        description: "The customer has been successfully created.",
      })
      
      setOpen(false)
      formRef.current?.reset()
      router.refresh()
    } catch (error) {
      console.error('Error creating customer:', error)
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white">
          + Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-slate-900">Add New Customer</DialogTitle>
            <DialogDescription className="text-slate-600">Enter the details for the new customer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-slate-900">
                Name
              </Label>
              <Input id="name" name="name" required className="col-span-3 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-slate-900">
                Email
              </Label>
              <Input id="email" name="email" type="email" required className="col-span-3 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-slate-900">
                Phone
              </Label>
              <Input 
                id="phone" 
                name="phone" 
                type="tel" 
                placeholder="07XXX XXXXXX or +44 7XXX XXXXXX"
                className="col-span-3 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white">
              {isSubmitting ? "Creating..." : "Save Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
