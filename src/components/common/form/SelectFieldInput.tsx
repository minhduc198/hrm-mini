"use client";

import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectFieldInputProps } from "@/types/form";

export function SelectFieldInput({
  name,
  label,
  placeholder = "Chọn giá trị...",
  required,
  options,
  className,
}: SelectFieldInputProps) {
  const { control } = useFormContext<any>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("space-y-1.5", className)}>
          <Label 
            htmlFor={name}
            className={cn(
              "text-xs font-semibold tracking-wide text-muted-foreground",
              error && "text-red-500"
            )}
          >
            {label.toUpperCase()} {required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          
          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
            <SelectTrigger 
              id={name}
              className={cn(
                "h-10 rounded-lg border-border/80 bg-white px-3 py-2 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10",
                !field.value && "text-muted-foreground",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500/10"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {error && (
            <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={12} className="text-red-500" />
              <p className="text-[11px] font-medium text-red-500 leading-none">
                {error.message}
              </p>
            </div>
          )}
        </div>
      )}
    />
  );
}
