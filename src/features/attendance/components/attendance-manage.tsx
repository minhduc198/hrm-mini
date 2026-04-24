"use client"

import * as React from "react"
import { AttendanceCalendar } from "./attendance-calendar"
import { Typography } from "@/components/ui/typography"
import { format } from "date-fns"

import { useAttendanceStore } from "@/features/attendance/stores/attendance"  
import { AttendanceEmptyState } from "./attendance-empty-state"
import { useGetAttendance } from "../hooks/use-get-attendance"
import { useGetAttendanceRecords } from "../hooks/use-get-attendance-records"
import { AttendanceDayData } from "../types/attendance"
import { AdminAttendanceDetailDialog } from "./admin-attendance-detail-dialog"

export function AttendanceManage() {
  const { viewDate } = useAttendanceStore();
  const { data: monthData, isLoading: isLoadingMonth } = useGetAttendance();
  const { data: attendanceResponse, isLoading: isLoadingRecords } = useGetAttendanceRecords();
  
  const [selectedDay, setSelectedDay] = React.useState<AttendanceDayData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleDateClick = (day: AttendanceDayData) => {
    setSelectedDay(day);
    setIsDetailOpen(true);
  };

  const isLoading = isLoadingMonth || isLoadingRecords;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <Typography variant="label" className="text-tx-muted">Đang tải lịch chấm công...</Typography>
        </div>
      </div>
    );
  }

  const viewMonthStr = format(viewDate, "yyyy-MM");
  const records = attendanceResponse?.data || [];

  // Group and aggregate records by date
  const dailySummary = records.reduce((acc, record) => {
    const date = record.work_date;
    if (!acc[date]) {
      acc[date] = { on_time: 0, late: 0, absent: 0, leave: 0 };
    }

    const status = record.status?.toLowerCase();
    if (status === 'on_time') acc[date].on_time++;
    else if (['late', 'early_leave', 'late_early_leave'].includes(status)) acc[date].late++;
    else if (status === 'leave') acc[date].leave++;
    else if (status === 'absent') acc[date].absent++;

    return acc;
  }, {} as Record<string, { on_time: number; late: number; absent: number; leave: number }>);

  // Merge summary into calendar data
  const calendarData = (monthData || []).map(day => {
    const summary = dailySummary[day.work_date];
    
    // Chỉ ghi đè status nếu summary có dữ liệu thực sự (khác 0)
    // Nếu summary rỗng (do pagination hoặc filter), giữ nguyên status từ Backend (day.status)
    const hasSummary = summary && Object.values(summary).some(val => val > 0);
    
    return {
      ...day,
      status: hasSummary ? summary : day.status,
      total_employees: hasSummary 
        ? Object.values(summary).reduce((a, b) => a + b, 0) 
        : (typeof day.status === 'object' ? Object.values(day.status).reduce((a, b) => (a as number) + (b as number), 0) : 0)
    };
  });

  const hasDataForCurrentMonth = calendarData.some(d => d.work_date?.startsWith(viewMonthStr));

  if (!hasDataForCurrentMonth) {
    return <AttendanceEmptyState />;
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in duration-500">
      <AttendanceCalendar 
        data={calendarData}
        currentDate={viewDate}
        className="h-full"
        onDateClick={handleDateClick}
      />
      <AdminAttendanceDetailDialog
        day={selectedDay}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
