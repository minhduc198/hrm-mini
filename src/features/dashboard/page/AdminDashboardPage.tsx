"use client";

import { PageHeader } from "@/components/common/layout/page-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { AlertCircle, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { AdminLateEmployees } from "../components/admin/AdminLateEmployees";
import { AdminMonthlyPerformance } from "../components/admin/AdminMonthlyPerformance";
import { AdminStatCards } from "../components/admin/AdminStatCards";
import { useAdminStatistics } from "../hooks/use-dashboard";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStatistics();

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const pendingRequests = stats?.pending_actions.leave_requests || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        className="mb-6"
        icon={LayoutDashboard}
        title="Tổng quan quản trị"
        description={
          stats?.timestamp
            ? `Cập nhật lần cuối: ${stats.timestamp}`
            : "Đang tải dữ liệu..."
        }
        actions={
          pendingRequests > 0 && (
            <Link href={routes.leave.manage}>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                <span>Duyệt {pendingRequests} đơn mới</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )
        }
      />

      <AdminStatCards today={stats?.today} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AdminMonthlyPerformance monthly={stats?.monthly_overview} />
        <AdminLateEmployees employees={stats?.top_late_employees} />
      </div>
    </div>
  );
}
