// date-range-picker.tsx
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon} from "lucide-react"
import { DateRange } from "react-day-picker"
import { vi } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1 relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-range"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal rounded-full",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                  )
                ) : (
                  <span>Chọn bộ lọc ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                locale={vi}
              />
            </PopoverContent>
          </Popover>
          
          {dateRange && (
            <Button 
              variant="ghost" 
              onClick={() => onDateRangeChange(undefined)}
              size="icon"
              className="h-8 w-8 rounded-full absolute right-1"
              aria-label="Xóa bộ lọc ngày"
            >
              {/* <X className="h-4 w-4"/> */}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}