"use client"

import { useAttendanceStore } from "../store/attendance-store";
import { AttendanceLegend } from "./attendance-legend";
import { MonthNavigator } from "./month-navigator";
import { format } from "date-fns";


export function AttendanceControls() {
  const { attendanceData, viewDate } = useAttendanceStore();
  
  const viewMonthStr = format(viewDate, "yyyy-MM");
  const hasDataInCurrentMonth = attendanceData.some(d => d.work_date.startsWith(viewMonthStr));

  return (
    <div className="flex items-center gap-3">
      <MonthNavigator />
      {hasDataInCurrentMonth && <AttendanceLegend />}
    </div>
  );
}
