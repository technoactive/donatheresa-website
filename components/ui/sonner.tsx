"use client"

import { Toaster as Sonner, toast } from "sonner"
import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      gap={12}
      visibleToasts={4}
      duration={5000}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast",
            "bg-white text-slate-900",
            "border border-slate-200",
            "shadow-lg shadow-slate-200/50",
            "rounded-xl",
            "p-4"
          ),
          title: "font-semibold text-slate-900",
          description: "text-slate-600 text-sm",
          actionButton: cn(
            "bg-slate-900 text-white",
            "hover:bg-slate-800",
            "px-3 py-1.5 rounded-md text-sm font-medium"
          ),
          cancelButton: cn(
            "bg-slate-100 text-slate-700",
            "hover:bg-slate-200",
            "px-3 py-1.5 rounded-md text-sm font-medium"
          ),
          closeButton: cn(
            "bg-white border-slate-200",
            "hover:bg-slate-100",
            "text-slate-500 hover:text-slate-700"
          ),
          success: "border-emerald-200 bg-emerald-50",
          error: "border-red-200 bg-red-50",
          warning: "border-amber-200 bg-amber-50",
          info: "border-blue-200 bg-blue-50",
        },
        style: {
          // Smooth rounded corners
          borderRadius: '12px',
        },
      }}
      offset="24px"
      {...props}
    />
  )
}

export { Toaster, toast }
