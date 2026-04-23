"use client"

import { AttendanceLegend } from "./attendance-legend";

export function AttendanceControls() {
  return (
    <div className="flex items-center gap-3">
      <AttendanceLegend />
    </div>
  );
}
