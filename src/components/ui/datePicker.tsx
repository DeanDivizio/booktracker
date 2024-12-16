"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePickerProps } from "@/lib/types"

export function DatePicker({ date, setDate, label }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => {
    // @ts-ignore
    return date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined
  })

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    setDate(newDate ? format(newDate, 'yyyy-MM-dd') : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

