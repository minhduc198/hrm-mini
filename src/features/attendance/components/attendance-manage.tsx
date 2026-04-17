"use client"

import * as React from "react"
import { AttendanceCalendar } from "./attendance-calendar"
import { Typography } from "@/components/ui/typography"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { parseISO, format } from "date-fns"
import { cn } from "@/lib/utils"

import { useAttendanceStore } from "@/features/attendance/stores/attendance"  
import { AttendanceEmptyState } from "./attendance-empty-state"

const EMPLOYEES_MOCK = [
  { id: 1, name: "Nguyễn Văn A", code: "NV001", status: "Đúng giờ" },
  { id: 2, name: "Trần Thị B", code: "NV002", status: "Muộn" },
  { id: 3, name: "Lê Văn C", code: "NV003", status: "Vắng" },
  { id: 4, name: "Phạm Thị D", code: "NV004", status: "Đúng giờ" },
];

export function AttendanceManage() {
  const { attendanceData, viewDate } = useAttendanceStore();
  
  const handleDateClick = (date: string) => {
    // Future detail loading logic
  };

  // Kiểm tra xem tháng hiện tại đang xem đã có dữ liệu hay chưa
  const viewMonthStr = format(viewDate, "yyyy-MM");
  const hasDataForCurrentMonth = attendanceData?.some(d => d.work_date?.startsWith(viewMonthStr));

  // Nếu tháng đang xem chưa có dữ liệu lịch, hiển thị Empty State
  if (!hasDataForCurrentMonth) {
    return <AttendanceEmptyState />;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in duration-500">
      <AttendanceCalendar 
        data={attendanceData}
        currentDate={viewDate}
        className="h-full"
        onDateClick={handleDateClick}
        renderCellFooter={(day) => {
          if (!day?.total_employees || day.total_employees === 0) return null;
          
          return (
            <Popover>
              <PopoverTrigger asChild>
                <div 
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group/btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Typography variant="label-sm" className="text-primary/70 group-hover/btn:text-primary">
                    {day.total_employees}
                  </Typography>
                  <Typography variant="label-sm" className="text-tx-muted">
                    nhân viên
                  </Typography>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 shadow-2xl border-line-subtle" align="start">
                <div className="space-y-2.5">
                  <Typography variant="p" className="text-xs font-bold text-tx-base border-b border-line-subtle pb-2">
                    Danh sách chi tiết ({day.work_date ? format(parseISO(day.work_date), "dd/MM") : ""})
                  </Typography>
                  <div className="space-y-2 overflow-y-auto max-h-48 pr-1 custom-scrollbar">
                    {EMPLOYEES_MOCK.slice(0, day.total_employees).map(emp => (
                      <div key={emp.id} className="flex items-center justify-between gap-2 p-2 hover:bg-page rounded-lg transition-colors border border-transparent hover:border-line-subtle/50">
                        <div className="min-w-0">
                          <Typography variant="p" className="text-[12px] font-bold text-tx-base truncate">
                            {emp.name}
                          </Typography>
                          <Typography variant="tiny" className="text-tx-muted font-mono">
                            {emp.code}
                          </Typography>
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
