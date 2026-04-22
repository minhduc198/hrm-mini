"use client";

import * as React from "react";
import { format, setMonth, setYear, getYear, getMonth } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";

interface MonthPickerInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

export function MonthPickerInput({
  name,
  label,
  placeholder = "Chọn tháng",
  required,
  className,
  disabled,
}: MonthPickerInputProps) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const date = field.value ? new Date(field.value) : new Date();
        const currentYear = getYear(date);
        const currentMonth = getMonth(date);

        const handlePrevYear = () => {
          field.onChange(setYear(date, currentYear - 1).toISOString());
        };

        const handleNextYear = () => {
          field.onChange(setYear(date, currentYear + 1).toISOString());
        };

        const handleMonthSelect = (monthIndex: number) => {
          field.onChange(setMonth(date, monthIndex).toISOString());
          setOpen(false);
        };

        return (
          <div className={cn("space-y-1.5", className)}>
            {label && (
              <Label
                className={cn(
                  "text-[12px] font-semibold tracking-wide text-muted-foreground",
                  error && "text-red-500"
                )}
              >
                {label} {required && <span className="text-red-500 ml-0.5">*</span>}
              </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full h-10 justify-start text-left font-normal bg-white border-primary/20 rounded-xl hover:bg-slate-50 transition-all shadow-sm",
                    !field.value && "text-muted-foreground",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  )}
                >
                  <CalendarIcon size={14} className="mr-2 text-primary shrink-0" />
                  <span className="text-sm truncate">
                    {field.value
                      ? format(new Date(field.value), "MM/yyyy", { locale: vi })
                      : placeholder}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 border border-black/10 bg-white shadow-2xl rounded-2xl z-[100]" align="start">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg hover:bg-slate-100"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrevYear();
                      }}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Typography variant="p" className="font-bold text-slate-900">
                      {currentYear}
                    </Typography>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg hover:bg-slate-100"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNextYear();
                      }}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS.map((month, index) => {
                      const isSelected = field.value && getMonth(new Date(field.value)) === index && getYear(new Date(field.value)) === currentYear;
                      return (
                        <Button
                          key={month}
                          variant="ghost"
                          className={cn(
                            "h-9 text-xs font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all",
                            isSelected && "bg-primary text-white hover:bg-primary hover:text-white shadow-md shadow-primary/20"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            handleMonthSelect(index);
                          }}
                        >
                          {month.replace("Tháng ", "T")}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {error && (
              <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle size={12} className="text-red-500" />
                <p className="text-[11px] font-medium text-red-500 leading-none">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
