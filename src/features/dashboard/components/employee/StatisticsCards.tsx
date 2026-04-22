import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, UserCheck, AlertTriangle, MessageSquare } from "lucide-react";
import { AttendanceSummary, RequestSummary } from "../../types";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface StatisticsCardsProps {
  attendance?: AttendanceSummary;
  requests?: RequestSummary;
}

const formatDuration = (minutes: number) => {
  if (minutes >= 60) {
    return { value: (minutes / 60).toFixed(1), label: "Giờ" };
  }
  return { value: minutes, label: "Phút" };
};

export function StatisticsCards({
  attendance,
  requests,
}: StatisticsCardsProps) {
  const lateFmt = formatDuration(attendance?.late_minutes || 0);
  const earlyFmt = formatDuration(attendance?.early_leave_minutes || 0);

  const hourPercentage = attendance
    ? Math.min(
        Math.round(
          (attendance.total_hours / attendance.total_required_hours) * 100,
        ),
        100,
      )
    : 0;

  console.log(requests);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border border-primary/10 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Giờ làm việc</CardTitle>
          <Clock className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <Typography
              variant="h3"
              className="text-2xl font-bold text-primary"
            >
              {attendance?.total_hours || 0}h
            </Typography>
            <Typography
              variant="tiny"
              className="text-xs text-muted-foreground"
            >
              / {attendance?.total_required_hours}h mục tiêu
            </Typography>
          </div>
          <div className="mt-3 h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${hourPercentage}%` }}
            />
          </div>
          <Typography
            variant="tiny"
            className="mt-2 text-xs text-muted-foreground"
          >
            {hourPercentage}% chỉ tiêu tháng này
          </Typography>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "shadow-sm hover:shadow-md transition-all border",
          attendance &&
            attendance.days_present > attendance.total_required_workdays / 2
            ? "border-emerald-100"
            : "border-slate-100",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-700">
            Ngày công
          </CardTitle>
          <UserCheck
            className={cn(
              "w-4 h-4",
              attendance &&
                attendance.days_present > attendance.total_required_workdays / 2
                ? "text-emerald-600"
                : "text-slate-400",
            )}
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <Typography
              variant="h3"
              className={cn(
                "text-2xl font-bold",
                attendance &&
                  attendance.days_present >
                    attendance.total_required_workdays / 2
                  ? "text-emerald-600"
                  : "text-slate-700",
              )}
            >
              {attendance?.days_present || 0}
            </Typography>
            <Typography
              variant="tiny"
              className="text-xs text-muted-foreground"
            >
              / {attendance?.total_required_workdays} ngày cần thiết
            </Typography>
          </div>
          {attendance &&
            attendance.days_present >
              attendance.total_required_workdays / 2 && (
              <div className="flex items-center gap-2 mt-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]"
                >
                  Đúng hạn
                </Badge>
                <Typography
                  variant="tiny"
                  className="text-[10px] text-muted-foreground"
                >
                  Đang duy trì tốt
                </Typography>
              </div>
            )}

          {attendance && attendance.unexcused_absent_days > 0 && (
            <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-100 flex justify-between items-center">
              <Typography variant="tiny" className="text-rose-600 font-bold">
                Vắng không phép:
              </Typography>
              <Typography
                variant="label-sm"
                className="text-rose-700 font-bold"
              >
                {attendance.unexcused_absent_days} ngày
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>

      <Card
        className={cn(
          "shadow-sm hover:shadow-md transition-all border",
          attendance &&
            ((attendance.late_minutes || 0) > 60 ||
              (attendance.early_leave_minutes || 0) > 60)
            ? "border-amber-100"
            : "border-slate-100",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-700">
            Đi muộn / Về sớm
          </CardTitle>
          <AlertTriangle
            className={cn(
              "w-4 h-4",
              attendance &&
                ((attendance.late_minutes || 0) > 60 ||
                  (attendance.early_leave_minutes || 0) > 60)
                ? "text-amber-500"
                : "text-slate-400",
            )}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography
                variant="h4"
                className={cn(
                  "text-xl font-bold block",
                  (attendance?.late_minutes || 0) > 60
                    ? "text-amber-600"
                    : "text-slate-700",
                )}
              >
                {lateFmt.value}
              </Typography>
              <Typography
                variant="tiny"
                className="text-[10px] text-muted-foreground"
              >
                {lateFmt.label} đi muộn
              </Typography>
            </div>
            <div>
              <Typography
                variant="h4"
                className={cn(
                  "text-xl font-bold block",
                  (attendance?.early_leave_minutes || 0) > 60
                    ? "text-amber-600"
                    : "text-slate-700",
                )}
              >
                {earlyFmt.value}
              </Typography>
              <Typography
                variant="tiny"
                className="text-[10px] text-muted-foreground"
              >
                {earlyFmt.label} về sớm
              </Typography>
            </div>
          </div>
          {attendance &&
            ((attendance.late_minutes || 0) > 60 ||
              (attendance.early_leave_minutes || 0) > 60) && (
              <div className="mt-3 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-500">
                <Typography
                  variant="tiny"
                  className="text-[10px] text-amber-600 font-medium"
                >
                  Cần chú ý hơn tháng này
                </Typography>
              </div>
            )}
        </CardContent>
      </Card>

      <Card className="border border-violet-100 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-violet-700">
            Đơn xin nghỉ
          </CardTitle>
          <MessageSquare className="w-4 h-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-violet-50 rounded-lg p-2 px-3">
              <Typography
                variant="label-sm"
                className="text-xs font-medium text-violet-700"
              >
                Đang chờ
              </Typography>
              <Badge className="bg-violet-500 hover:bg-violet-600 h-5 px-1.5">
                {requests?.pending || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 rounded-lg p-2 px-3">
              <Typography
                variant="label-sm"
                className="text-xs font-medium text-emerald-700"
              >
                Đã duyệt
              </Typography>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 h-5 px-1.5">
                {requests?.approved || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
