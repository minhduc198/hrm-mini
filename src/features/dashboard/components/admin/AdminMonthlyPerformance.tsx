"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TrendingUp, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { formatDuration } from "../../utils/format";
import { MonthlyOverview } from "../../types";
import { cn } from "@/lib/utils";

interface AdminMonthlyPerformanceProps {
  monthly?: MonthlyOverview;
}

export function AdminMonthlyPerformance({ monthly }: AdminMonthlyPerformanceProps) {
  return (
    <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden rounded-2xl">
      <CardHeader className="border-b border-slate-50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-bold">Hiệu suất trong tháng</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {monthly && (
            <MonthlyMetric
              label="Tổng giờ làm"
              value={monthly.total_working_hours >= 1 
                ? Number(monthly.total_working_hours.toFixed(1))
                : Math.round(monthly.total_working_hours * 60)}
              unit={monthly.total_working_hours >= 1 ? "h" : "phút"}
              description="Toàn bộ công ty"
            />
          )}
          {!monthly && (
            <MonthlyMetric
              label="Tổng giờ làm"
              value={0}
              unit="h"
              description="Toàn bộ công ty"
            />
          )}

          <MonthlyMetric
            label="Tổng giờ OT"
            value={monthly?.total_ot_hours || 0}
            unit="h"
            color="text-emerald-600"
            description="Vượt định mức"
          />
          {monthly && (
            <MonthlyMetric
              label="Tổng đi muộn"
              value={Number(formatDuration(monthly.total_late_minutes).value)}
              unit={formatDuration(monthly.total_late_minutes).unit}
              color={monthly.total_late_minutes > 60 ? "text-rose-600" : "text-amber-600"}
              description="Cần cải thiện"
            />
          )}
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Typography variant="label-sm" className="font-bold">
                Quản lý chấm công
              </Typography>
              <Typography variant="tiny" className="text-slate-500 ml-4">
                Xem chi tiết bảng công của toàn bộ nhân viên
              </Typography>
            </div>
          </div>
          <Link href={routes.attendance.manage}>
            <Button size="sm" className="gap-2 text-white shadow-sm rounded-xl">
              <span>Xem chi tiết</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyMetric({
  label,
  value,
  unit,
  description,
  color = "text-primary",
}: {
  label: string;
  value: number;
  unit: string;
  description: string;
  color?: string;
}) {
  return (
    <div className="space-y-1">
      <Typography variant="tiny" className="text-slate-500 font-medium">
        {label}
      </Typography>
      <div className="flex items-baseline gap-1">
        <Typography variant="h3" className={cn("text-3xl font-black", color)}>
          {value}
        </Typography>
        <Typography variant="label-sm" className="text-slate-400 font-bold">
          {unit}
        </Typography>
      </div>
      <Typography
        variant="tiny"
        className="text-slate-400 text-[10px] uppercase tracking-wider"
      >
        {description}
      </Typography>
    </div>
  );
}
