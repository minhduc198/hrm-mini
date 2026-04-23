"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { DatePickerInput } from "@/components/common/form/DatePickerInput";
import { MonthPickerInput } from "@/components/common/form/month-picker-input";
import { attendanceExportSchema, AttendanceExportFormValues } from "../../schemas/export";
import { Typography } from "@/components/ui/typography";
import { FileDown, Calendar, Filter, Settings2, Loader2 } from "lucide-react";
import { exportAttendanceStatuses } from "../../constants";
import { cn } from "@/lib/utils";


interface AttendanceExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AttendanceExportFormValues) => void;
  isLoading?: boolean;
}

export function AttendanceExportDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AttendanceExportDialogProps) {
  const form = useForm<AttendanceExportFormValues>({
    resolver: zodResolver(attendanceExportSchema),
    mode: "onChange",
    defaultValues: {
      type: "month",
      status: [],
      is_edited: false,
      month: new Date(),
    },
  });

  const exportType = form.watch("type");
  const fromDate = form.watch("from_date");
  const toDate = form.watch("to_date");

  // Reset form khi mở modal
  React.useEffect(() => {
    if (open) {
      form.reset({
        type: "month",
        status: [],
        is_edited: false,
        month: new Date(),
      });
    }
  }, [open, form]);

  // Tự động trigger validate lại to_date khi fromDate thay đổi (chỉ khi toDate đã có giá trị)
  React.useEffect(() => {
    if (exportType === "range" && fromDate && toDate) {
      form.trigger("to_date");
    }
  }, [fromDate, exportType, form, toDate]);

  const onFormSubmit = (values: AttendanceExportFormValues) => {
    console.log('values: ', values);
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden border border-black/10 shadow-2xl rounded-2xl">
        <DialogHeader className="p-5 pb-3 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <FileDown size={20} />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 leading-tight">Xuất dữ liệu chấm công</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs font-medium">Tùy chỉnh thông tin và xuất báo cáo Excel</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Range Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Calendar size={14} />
                <Typography variant="label" className="font-bold uppercase tracking-wider text-[10px]">Thời gian báo cáo</Typography>
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-2"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="month" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-2.5 hover:bg-slate-50 hover:text-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer">
                            <Typography variant="tiny" className="font-bold">Tháng</Typography>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="date" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-2.5 hover:bg-slate-50 hover:text-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer">
                            <Typography variant="tiny" className="font-bold">Ngày</Typography>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="range" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-2.5 hover:bg-slate-50 hover:text-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer">
                            <Typography variant="tiny" className="font-bold">Khoảng ngày</Typography>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {exportType === "month" && (
                  <MonthPickerInput
                    name="month"
                    label="Chọn tháng"
                    placeholder="Chọn tháng xuất báo cáo"
                    required
                  />
                )}
                {exportType === "date" && (
                  <DatePickerInput
                    name="date"
                    label="Chọn ngày"
                    placeholder="Chọn ngày xuất báo cáo"
                    required
                  />
                )}
                {exportType === "range" && (
                  <div className="grid grid-cols-2 gap-3">
                    <DatePickerInput
                      name="from_date"
                      label="Từ ngày"
                      required
                    />
                    <DatePickerInput
                      name="to_date"
                      label="Đến ngày"
                      required
                      disabled={(date) => {
                        if (!fromDate) return false;
                        const from = new Date(fromDate);
                        from.setHours(0, 0, 0, 0);
                        return date < from;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Filter size={14} />
                <Typography variant="label" className="font-bold uppercase tracking-wider text-[10px]">Trạng thái chấm công</Typography>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                {exportAttendanceStatuses.map((status) => (
                  <FormField
                    key={status.id}
                    control={form.control}
                    name="status"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={status.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(status.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), status.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== status.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-[13px] font-medium leading-none cursor-pointer text-slate-700">
                            {status.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <Typography variant="tiny" className="text-tx-muted italic ml-1">* Để trống nếu muốn xuất tất cả trạng thái</Typography>
            </div>

            {/* Advanced Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Settings2 size={14} />
                <Typography variant="label" className="font-bold uppercase tracking-wider text-[10px]">Tùy chọn nâng cao</Typography>
              </div>

              <FormField
                control={form.control}
                name="is_edited"
                render={({ field }) => (
                  <FormItem className={cn(
                    "flex flex-row items-center justify-between rounded-xl border transition-all relative cursor-pointer p-3 shadow-sm",
                    field.value 
                      ? "border-primary bg-primary/5 shadow-primary/5" 
                      : "border-slate-100 bg-white hover:bg-slate-50"
                  )}>
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-bold leading-none cursor-pointer">
                        <Typography 
                          variant="label" 
                          className={cn("font-bold transition-colors", field.value ? "text-primary" : "text-slate-900")}
                        >
                          Dữ liệu đã chỉnh sửa
                        </Typography>
                        <Typography 
                          variant="tiny" 
                          className={cn("block font-normal mt-0.5 transition-colors", field.value ? "text-primary/70" : "text-slate-500")}
                        >
                          Chỉ xuất các bản ghi đã được sửa thủ công
                        </Typography>
                        {/* Overlay để click toàn bộ vùng box thông qua association của label */}
                        <span className="absolute inset-0 z-0" aria-hidden="true" />
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        size="sm"
                        className="relative z-10"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-5 h-10 font-bold border-slate-200 hover:bg-white hover:text-slate-900"
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={form.handleSubmit(onFormSubmit)}
            disabled={isLoading}
            className="rounded-xl px-6 h-10 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl active:scale-95"
          >
            {isLoading ? (
               <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
               <FileDown size={18} className="mr-2" />
            )}
            Xuất báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
