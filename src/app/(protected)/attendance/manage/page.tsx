import { PageHeader } from "@/components/common/layout/page-header";
import { AttendanceManage } from "@/features/attendance/components/attendance-manage";
import { AttendanceControls } from "@/features/attendance/components/attendance-controls";
import { CalendarClock } from "lucide-react";

import { MonthNavigator } from "@/features/attendance/components/month-navigator";
import { AttendanceExportButton } from "@/features/attendance/components/export/attendance-export-button";

export default function AttendanceManagePage() {
  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader 
        title="Quản lý chấm công"
        description="Theo dõi và quản lý lịch trình làm việc của toàn bộ hệ thống"
        icon={CalendarClock}
        actions={<AttendanceControls />}
      />
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <MonthNavigator />
        <AttendanceExportButton />
      </div>

      <AttendanceManage />
    </div>
  );
}
