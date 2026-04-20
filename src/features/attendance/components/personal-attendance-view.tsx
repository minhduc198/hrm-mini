"use client";

import { User } from "lucide-react";
import { PageHeader } from "@/components/common/layout/page-header";
import { EmployeeActions } from "@/features/attendance/components/employee-actions";
import { AttendanceManage } from "@/features/attendance/components/attendance-manage";

export function PersonalAttendanceView() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden animate-in fade-in duration-500">
      <PageHeader
        icon={User}
        title="Chấm công cá nhân"
        description="Theo dõi dữ liệu chấm công và thời gian làm việc của bạn hàng ngày"
        actions={<EmployeeActions />}
      />

      <div className="flex-1 min-h-0 bg-surface rounded-2xl border border-line shadow-sm overflow-hidden flex flex-col">
        <AttendanceManage />
      </div>
    </div>
  );
}
