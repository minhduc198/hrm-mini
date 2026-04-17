import { PageHeader } from "@/components/common/layout/page-header";
import { AttendanceManage } from "@/features/attendance/components/attendance-manage";
import { AttendanceLegend } from "@/features/attendance/components/attendance-legend";
import { CalendarClock } from "lucide-react";

export default function AttendanceManagePage() {
  return (
    <div className="flex flex-col h-full gap-4">
      <PageHeader 
        title="Quản lý chấm công"
        description="Theo dõi và quản lý lịch trình làm việc của toàn bộ hệ thống"
        icon={CalendarClock}
        actions={<AttendanceLegend />}
      />
      <AttendanceManage />
    </div>
  );
}
