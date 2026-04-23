import { PageHeader } from "@/components/common/layout/page-header";
import { AttendanceManage } from "@/features/attendance/components/attendance-manage";
import { AttendanceControls } from "@/features/attendance/components/attendance-controls";
import { CalendarClock } from "lucide-react";

import { MonthNavigator } from "@/features/attendance/components/month-navigator";
import { AttendanceExportButton } from "@/features/attendance/components/export/attendance-export-button";
import { Can } from "@/components/common/auth/Can";
import { Typography } from "@/components/ui/typography";

export default function AttendanceManagePage() {
  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader 
        title="Quản lý chấm công"
        description="Theo dõi và quản lý lịch trình làm việc của toàn bộ hệ thống"
        icon={CalendarClock}
        actions={<AttendanceControls />}
      />
      
      <Can 
        permission="attendance.view"
        fallback={
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-primary/20">
            <Typography variant="h4" className="text-muted-foreground mb-2">
              Không có quyền truy cập
            </Typography>
            <Typography variant="small" className="text-muted-foreground/60">
              Bạn không có quyền xem danh sách chấm công toàn nhân viên.
            </Typography>
          </div>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <MonthNavigator />
          <Can permission="attendance.export">
            <AttendanceExportButton />
          </Can>
        </div>

        <AttendanceManage />
      </Can>
    </div>
  );
}
