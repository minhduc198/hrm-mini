import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { SearchInput } from "@/components/common/form/search-input";
import { AttendanceDayData } from "../../types/attendance";
import { dayTypeMap } from "@/features/attendance/constants";
import { formatFullDate } from "@/utils/date-format";
import { Calendar, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceDetailHeaderProps {
  day: AttendanceDayData;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
}

export function AttendanceDetailHeader({ day, search, onSearchChange, isLoading }: AttendanceDetailHeaderProps) {
  const dayType = dayTypeMap[day.day_type] || dayTypeMap.workday;

  return (
    <div className="bg-gradient-to-b from-primary-tint/50 to-surface p-4 md:p-8 pb-4 text-primary relative">
      <DialogHeader className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <BadgeTag icon={Calendar} label={dayType.label} className="bg-white/80 backdrop-blur-md border-primary/10 text-primary shadow-sm" />
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <DialogTitle asChild>
              <Typography variant="h3" className="text-tx-base font-extrabold tracking-tight leading-tight">
                Chi tiết chấm công toàn nhân viên
              </Typography>
            </DialogTitle>
            <Typography variant="small" className="text-muted font-medium capitalize">
              {formatFullDate(day.work_date)}
            </Typography>
          </div>
          <div className="w-full md:w-[340px] shrink-0">
            <SearchInput
              placeholder="Tìm kiếm nhân viên"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange("")}
              isLoading={isLoading}
              className="bg-white border-primary/10 shadow-sm focus:shadow-md focus:border-primary transition-all duration-300 rounded-xl h-10"
            />
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
    <span className="font-semibold">{label}</span>
  </div>
);
