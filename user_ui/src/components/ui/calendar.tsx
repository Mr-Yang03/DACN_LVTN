"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { vi } from "date-fns/locale"
import 'react-day-picker/dist/style.css';
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentPropsWithoutRef<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.defaultMonth || new Date());

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);
    setCurrentMonth(newDate);
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
  };

  // Tạo mảng năm từ 2020 đến năm hiện tại + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 10 + 1 }, (_, i) => 2020 + i);

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center gap-2 p-1">
        <Select
          value={String(currentMonth.getMonth())}
          onValueChange={(value: string) => handleMonthChange(parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {Array.from({ length: 12 }, (_, i) => {
              const monthDate = new Date();
              monthDate.setMonth(i);
              return (
                <SelectItem key={i} value={i.toString()}>
                  {format(monthDate, 'MMMM', { locale: vi })}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        <Select
          value={String(currentMonth.getFullYear())}
          onValueChange={(value: string) => handleYearChange(parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        locale={vi}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-0",
          caption: "hidden", // Ẩn caption mặc định
          nav: "hidden", // Ẩn nút điều hướng
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

