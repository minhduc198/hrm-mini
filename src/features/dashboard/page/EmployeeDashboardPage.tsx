"use client";

import { PageHeader } from "@/components/common/layout/page-header";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { usePersonalStatistics } from "../hooks/use-dashboard";

// Sub-components
import { StatisticsCards } from "../components/StatisticsCards";
import { WorkingTrendChart } from "../components/WorkingTrendChart";
import { LeaveBalanceList } from "../components/LeaveBalanceList";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = usePersonalStatistics();

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Chào ${user?.name || "bạn"},`}
        description="Chào mừng bạn quay trở lại. Hãy cùng xem qua tình hình làm việc của bạn nhé."
        icon={LayoutDashboard}
      />

      {/* Overview Statistics Cards */}
      <StatisticsCards 
        attendance={stats?.attendance_summary} 
        requests={stats?.request_summary} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Working Trend Chart Section */}
        <WorkingTrendChart trends={stats?.working_trend || []} />

        {/* Leave Balances Section */}
        <LeaveBalanceList leaveSummary={stats?.leave_summary || []} />
      </div>
    </div>
  );
}
