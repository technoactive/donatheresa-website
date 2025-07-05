"use client"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormattedDate } from "@/components/locale/formatted-date"

interface DatePickerWithClearProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DatePickerWithClear({ date, setDate, className = "" }: DatePickerWithClearProps) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? <FormattedDate date={date} fallback={format(date, "PPP")} /> : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="ghost" size="icon" onClick={() => setDate(undefined)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Clear date</span>
        </Button>
      )}
    </div>
  )
}
