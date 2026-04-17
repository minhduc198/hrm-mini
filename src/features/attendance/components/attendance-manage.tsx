"use client"

import * as React from "react"
import { AttendanceCalendar, AttendanceDayData, AttendanceDayType } from "./attendance-calendar"
import { Typography } from "@/components/ui/typography"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { parseISO, format } from "date-fns"
import { cn } from "@/lib/utils"

const MOCK_DATA: AttendanceDayData[] = Array.from({ length: 42 }, (_, i) => {
  const dayNum = i + 1;
  const dateStr = `2026-04-${dayNum.toString().padStart(2, '0')}`;
  const date = parseISO(dateStr);
  const dayOfWeek = date.getDay();
  
  const dayType: AttendanceDayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : 'workday';
  
  const hasStatus = dayType === 'workday' && dayNum > 13 && dayNum < 18;
  
  return {
    id: 100 + i,
    work_date: dateStr,
    day_type: dayType,
    holiday_name: null,
    note: null,
    total_employees: hasStatus ? 4 : 0,
    status: hasStatus ? {
      on_time: Math.floor(Math.random() * 3) + 1,
      late: Math.floor(Math.random() * 2),
      absent: Math.floor(Math.random() * 2),
    } : undefined
  };
});

const EMPLOYEES_MOCK = [
  { id: 1, name: "Nguyễn Văn A", code: "NV001", status: "Đúng giờ" },
  { id: 2, name: "Trần Thị B", code: "NV002", status: "Muộn" },
  { id: 3, name: "Lê Văn C", code: "NV003", status: "Vắng" },
  { id: 4, name: "Phạm Thị D", code: "NV004", status: "Đúng giờ" },
];

export function AttendanceManage() {
  const handleDateClick = (date: string) => {
    // Future detail loading logic
  };

  return (
    <div className="flex-1 min-h-0">
      <AttendanceCalendar 
        data={MOCK_DATA}
        className="h-full"
        onDateClick={handleDateClick}
        renderCellFooter={(day) => {
          if (!day.total_employees || day.total_employees === 0) return null;
          
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div 
                  className="flex items-center gap-1 text-[11px] font-semibold text-tx-muted hover:text-primary transition-colors cursor-pointer group/btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-primary/70 group-hover/btn:text-primary">{day.total_employees}</span>
                  <span>nhân viên</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 shadow-2xl border-line-subtle" align="start">
                <div className="space-y-2.5">
                  <Typography variant="p" className="text-xs font-bold text-tx-base border-b border-line-subtle pb-2">
                    Danh sách chi tiết ({format(parseISO(day.work_date), "dd/MM")})
                  </Typography>
                  <div className="space-y-2 overflow-y-auto max-h-48 pr-1 custom-scrollbar">
                    {EMPLOYEES_MOCK.slice(0, day.total_employees).map(emp => (
                      <div key={emp.id} className="flex items-center justify-between gap-2 p-2 hover:bg-page rounded-lg transition-colors border border-transparent hover:border-line-subtle/50">
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-tx-base truncate">{emp.name}</p>
                          <p className="text-[10px] text-tx-muted font-mono">{emp.code}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[10px] h-5 px-1.5",
                            emp.status === "Đúng giờ" && "bg-success/10 text-success border-success/20",
                            emp.status === "Muộn" && "bg-warning/10 text-warning border-warning/20",
                            emp.status === "Vắng" && "bg-danger/10 text-danger border-danger/20",
                          )}
                        >
                          {emp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
}
