import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { SearchInput } from "@/components/common/form/search-input";
import { AttendanceDayData } from "../../types/attendance";
import { dayTypeMap } from "@/features/attendance/constants";
import { formatFullDate } from "@/utils/date-format";
import { Calendar, LucideIcon, AlertCircle, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface AttendanceDetailHeaderProps {
  day: AttendanceDayData;
  search: string;
  onSearchChange: (value: string) => void;
  status: string | undefined;
  onStatusChange: (value: string | undefined) => void;
  isEdited: boolean | undefined;
  onIsEditedChange: (value: boolean | undefined) => void;
  isCompleted: boolean | undefined;
  onIsCompletedChange: (value: boolean | undefined) => void;
  isLoading: boolean;
}

export function AttendanceDetailHeader({ 
  day, 
  search, 
  onSearchChange, 
  status, 
  onStatusChange,
  isEdited,
  onIsEditedChange,
  isCompleted,
  onIsCompletedChange,
  isLoading 
}: AttendanceDetailHeaderProps) {
  const dayType = dayTypeMap[day.day_type] || dayTypeMap.workday;

  return (
    <div className="bg-gradient-to-b from-primary-tint/50 to-white p-4 md:p-6 pb-4 md:pb-8 text-primary relative">
      <DialogHeader className="space-y-4 text-left">
        {/* Row 1: Badge Tag & Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BadgeTag icon={Calendar} label={dayType.label} className="bg-white/80 backdrop-blur-md border-primary/10 text-primary shadow-sm" />
            <Typography variant="small" className="text-muted font-bold capitalize tabular-nums">
              {formatFullDate(day.work_date)}
            </Typography>
          </div>
        </div>

        {/* Row 2: Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <DialogTitle asChild>
            <Typography variant="h3" className="text-tx-base font-extrabold tracking-tight leading-tight">
              Chi tiết chấm công nhân viên
            </Typography>
          </DialogTitle>
          <div className="w-full md:w-[320px] shrink-0">
            <SearchInput
              placeholder="Tìm kiếm nhân viên"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange("")}
              isLoading={isLoading}
              className="bg-white border-primary-border shadow-sm focus:shadow-md focus:border-primary transition-all duration-300 rounded-xl h-10"
            />
          </div>
        </div>

        {/* Row 3: Filters Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 pt-1">
          {/* Status Tabs - Performance Metric */}
          <div className="flex-1 w-full overflow-x-auto no-scrollbar scroll-smooth">
            <Tabs 
              value={status && ["on_time", "late", "early_leave", "late_early_leave", "leave", "absent"].includes(status) ? status : (status === "auto_checkout" ? "" : "all")} 
              onValueChange={(val) => onStatusChange(val === "all" ? undefined : val)}
              className="w-full"
            >
              <TabsList className="bg-white/50 border border-line-subtle p-1 h-9 rounded-xl shadow-inner-sm overflow-hidden">
                <TabsTrigger value="all" className="text-[11px] font-bold px-3 py-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="on_time" className="text-[11px] font-bold px-3 py-1 rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                  Đúng giờ
                </TabsTrigger>
                <TabsTrigger value="late" className="text-[11px] font-bold px-3 py-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm whitespace-nowrap">
                  Đi muộn/Về sớm
                </TabsTrigger>
                <TabsTrigger value="leave" className="text-[11px] font-bold px-3 py-1 rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm">
                  Nghỉ phép
                </TabsTrigger>
                <TabsTrigger value="absent" className="text-[11px] font-bold px-3 py-1 rounded-lg data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 data-[state=active]:shadow-sm">
                  Vắng mặt
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Exception Toggles */}
          <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
             <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-lg text-[11px] font-bold border-line-subtle transition-all whitespace-nowrap",
                  status === "auto_checkout" ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm ring-1 ring-blue-100" : "bg-white hover:bg-subtle text-muted"
                )}
                onClick={() => onStatusChange(status === "auto_checkout" ? undefined : "auto_checkout")}
             >
                <div className={cn("size-1.5 rounded-full mr-2", status === "auto_checkout" ? "bg-blue-500 animate-pulse" : "bg-muted-foreground/30")} />
                Quên checkout
             </Button>

             <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-lg text-[11px] font-bold border-line-subtle transition-all whitespace-nowrap",
                  isCompleted === false ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm ring-1 ring-amber-100" : "bg-white hover:bg-subtle text-muted"
                )}
                onClick={() => onIsCompletedChange(isCompleted === false ? undefined : false)}
             >
                <AlertCircle size={12} className={cn("mr-1.5", isCompleted === false ? "text-amber-600" : "text-muted-foreground")} />
                Đang chờ checkout
             </Button>

             <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-lg text-[11px] font-bold border-line-subtle transition-all whitespace-nowrap",
                  isEdited ? "bg-primary-tint text-primary border-primary/20 shadow-sm ring-1 ring-primary/10" : "bg-white hover:bg-subtle text-muted"
                )}
                onClick={() => onIsEditedChange(isEdited ? undefined : true)}
             >
                <Edit3 size={12} className={cn("mr-1.5", isEdited ? "text-primary" : "text-muted-foreground")} />
                Đã sửa thủ công
             </Button>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
}

const BadgeTag = ({ icon: Icon, label, className }: { icon: LucideIcon, label: string, className?: string }) => (
  <div className={cn(
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium shadow-sm",
    className
  )}>
    <Icon size={11} strokeWidth={2} />
    <span className="font-semibold tabular-nums">{label}</span>
  </div>
);
