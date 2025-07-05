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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Booking } from "@/lib/types"
import { toast } from "sonner"
import { updateBookingAction } from "@/app/dashboard/bookings/actions"
import { useRouter } from "next/navigation"

interface EditBookingDialogProps {
  booking: Booking
  onSave: (updatedBooking: Booking) => void
  onOpenChange: (open: boolean) => void
}

export function EditBookingDialog({ booking, onSave, onOpenChange }: EditBookingDialogProps) {
  const [isPending, setIsPending] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)

    try {
      const formData = new FormData(event.currentTarget)
      
      // Add the booking ID to the form data
      formData.append("id", booking.id)
      
      const updatedData = {
        customerName: formData.get("customerName") as string,
        partySize: parseInt(formData.get("partySize") as string),
        status: formData.get("status") as "pending" | "confirmed" | "cancelled",
      }

      // Validate required fields
      if (!updatedData.customerName || !updatedData.partySize || !updatedData.status) {
        toast.error("Please fill in all required fields.")
        return
      }

      if (updatedData.partySize < 1) {
        toast.error("Party size must be at least 1.")
        return
      }

      console.log('[CLIENT] Updating booking:', booking.id, updatedData)
      
      // Call the server action to update the booking in Supabase
      const result = await updateBookingAction(formData)
      
      if (result.error) {
        console.error('Error updating booking:', result.error)
        toast.error("Failed to update booking. Please try again.")
        return
      }

      console.log('[CLIENT] Booking updated successfully:', result.data)
      
      // Create updated booking object
      const updatedBooking: Booking = {
        ...booking,
        customerName: updatedData.customerName,
        partySize: updatedData.partySize,
        status: updatedData.status,
      }

      toast.success("Booking updated successfully!")
      onSave(updatedBooking)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating booking:", error)
      toast.error("Failed to update booking. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dialog-touch">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Make changes to the reservation for {booking.customerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 dialog-content touch-spacing-lg">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Name *
                </Label>
                <Input 
                  id="customerName" 
                  name="customerName" 
                  defaultValue={booking.customerName} 
                  className="input-touch"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partySize">
                  Party Size *
                </Label>
                <Input
                  id="partySize"
                  name="partySize"
                  type="number"
                  min="1"
                  max="12"
                  defaultValue={booking.partySize}
                  className="input-touch"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status *
                </Label>
                <Select defaultValue={booking.status} name="status" required>
                  <SelectTrigger className="dropdown-trigger-touch">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="touch-spacing">
                    <SelectItem value="pending" className="touch-target">Pending</SelectItem>
                    <SelectItem value="confirmed" className="touch-target">Confirmed</SelectItem>
                    <SelectItem value="cancelled" className="touch-target">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="dialog-footer touch-spacing">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="btn-touch touch-target"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="flex items-center gap-2 btn-touch touch-target"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
