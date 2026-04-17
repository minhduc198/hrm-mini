"use client"

import * as React from "react"
import { 
  format, 
  startOfMonth, 
  startOfWeek, 
  eachDayOfInterval, 
  isToday,
  addDays,
  parseISO,
  isSameMonth
} from "date-fns"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"

export type AttendanceDayType = 'workday' | 'weekend' | 'holiday';

export interface AttendanceDayData {
  work_date: string;
  day_type: AttendanceDayType;
  total_employees?: number;
  status?: {
    on_time: number;
    late: number;
    absent: number;
  };
  [key: string]: any;
}

interface AttendanceCalendarProps {
  data: AttendanceDayData[];
  onDateClick?: (date: string) => void;
  renderCellFooter?: (day: AttendanceDayData) => React.ReactNode;
  className?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function AttendanceCalendar({
  data,
  onDateClick,
  renderCellFooter,
  className
}: AttendanceCalendarProps) {
  const referenceDate = React.useMemo(() => {
    if (data && data.length > 0) {
      return parseISO(data[0].work_date);
    }
    return new Date();
  }, [data]);

  const monthStart = startOfMonth(referenceDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  
  const days = React.useMemo(() => {
    // Render 6 hàng cố định (42 ngày) để chiều cao lịch không bị thay đổi giữa các tháng
    const dayInterval = eachDayOfInterval({
      start: gridStart,
      end: addDays(gridStart, 41) 
    });

    return dayInterval.map(date => {
      const isoString = format(date, "yyyy-MM-dd");
      const apiDay = data.find(d => d.work_date === isoString);
      
      return {
        date,
        isoString,
        isCurrentMonth: isSameMonth(date, monthStart),
        apiData: apiDay 
      };
    });
  }, [gridStart, monthStart, data]);

  return (
    <div className={cn(
      "w-full h-full bg-surface rounded-2xl shadow-xl shadow-black/5 overflow-hidden ring-1 ring-line/10 flex flex-col", 
      className
    )}>
      {/* ─── Body: Lưới ngày (Scrollable) ─── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {/* Header: Thứ trong tuần (Sticky inside scrollable container to align with body grid) */}
        <div className="grid grid-cols-7 border-b border-line bg-[#2E66A5] sticky top-0 z-30">
          {WEEKDAYS.map((day, index) => (
            <div key={day} className="py-3 text-center border-r last:border-0 border-line/20">
              <Typography 
                variant="label-xs" 
                className={cn(
                  "uppercase font-extrabold tracking-widest text-white/90",
                  index >= 5 && "text-rose-200" 
                )}
              >
                {day}
              </Typography>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
        {days.map(({ date, isoString, isCurrentMonth, apiData }, index) => {
          // Chỉ định ngày cuối tuần dựa trên dữ liệu API/Mock trả về (day_type) 
          const isWeekend = apiData?.day_type === 'weekend' || index % 7 >= 5;
          const isUserToday = isToday(date);

          return (
            <div
              key={isoString}
              onClick={() => isCurrentMonth && onDateClick?.(isoString)}
              className={cn(
                // Base style: Kẻ line bottom và right để tạo lưới
                "min-h-[110px] p-2.5 flex flex-col relative transition-all duration-200 border-b border-r border-line",
                "last:border-r-0", // Ô cuối cột không kẻ phải
                
                // Trạng thái ngày ngoài tháng (Chỉ đổi màu nền, không đổi opacity ở đây để giữ border rõ)
                !isCurrentMonth && "bg-subtle/50 select-none pointer-events-none",
                
                // Trạng thái ngày trong tháng
                isCurrentMonth && "bg-surface hover:bg-primary-tint/30 cursor-pointer group hover:z-10",
                
                // Trạng thái ngày hôm nay (Highlight đặc biệt)
                isUserToday && isCurrentMonth && "bg-primary-tint/20 z-10 shadow-[inset_0_0_0_1px_rgba(27,79,138,0.2)]"
              )}
            >
              {/* Content Wrapper: Áp dụng opacity cho nội dung thay vì container để giữ border rõ nét */}
              <div className={cn("flex flex-col h-full flex-1", !isCurrentMonth && "opacity-30")}>
                {/* Top: Số ngày & Badge */}
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex flex-col gap-1">
                    <div className={cn(
                      "size-7 flex items-center justify-center rounded-lg text-xs font-bold tabular-nums transition-all",
                      isUserToday && isCurrentMonth 
                        ? "bg-primary text-primary-fg shadow-lg shadow-primary/30 scale-105" 
                        : !isCurrentMonth 
                          ? "text-subtle-text" 
                          : isWeekend 
                            ? "text-danger" 
                            : "text-base"
                    )}>
                      {format(date, "d")}
                    </div>
                    
                    {isUserToday && isCurrentMonth && (
                      <span className="text-[9px] text-primary font-bold uppercase tracking-tight leading-none">
                        Hôm nay
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Indicators (Chấm trạng thái) */}
                <div className="flex-1 mt-1">
                  {isCurrentMonth && apiData?.status && (
                      <div className="flex gap-1 flex-wrap">
                        {(['on_time', 'late', 'absent'] as const).map(statusKey => {
                          const count = apiData.status?.[statusKey] || 0;
                          const colorClass = 
                            statusKey === 'on_time' ? 'bg-success' : 
                            statusKey === 'late' ? 'bg-warning' : 'bg-danger';
                          
                          // Chỉ hiển thị chấm nếu có số lượng > 0
                          return count > 0 && (
                            <div 
                              key={statusKey}
                              className={cn("size-1.5 rounded-full ring-1 ring-surface shadow-sm", colorClass)} 
                            />
                          );
                        })}
                      </div>
                  )}
                </div>
                
                {/* Bottom: Footer Info (Số lượng nhân viên...) */}
                <div className="mt-auto pt-1.5 border-t border-line/10">
                  {isCurrentMonth && apiData && (
                    <div className="transition-all duration-200">
                      {renderCellFooter?.(apiData)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  )
}