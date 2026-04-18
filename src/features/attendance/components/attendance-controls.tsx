"use client"

import { useAttendanceStore } from "../stores/attendance";
import { useGetAttendance } from "../hooks/use-get-attendance";
import { AttendanceLegend } from "./attendance-legend";
import { MonthNavigator } from "./month-navigator";
import { format } from "date-fns";


export function AttendanceControls() {
  const { viewDate } = useAttendanceStore();
  const { data: attendanceData } = useGetAttendance();
  
  const viewMonthStr = format(viewDate, "yyyy-MM");
  const hasDataInCurrentMonth = attendanceData?.some(d => d.work_date?.startsWith(viewMonthStr));

  return (
    <div className="flex items-center gap-3">
      <MonthNavigator />
      {hasDataInCurrentMonth && <AttendanceLegend />}
    </div>
  );
}
