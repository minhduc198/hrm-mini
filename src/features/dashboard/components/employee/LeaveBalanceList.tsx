import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Palmtree, Calendar, Hourglass } from "lucide-react";
import { LeaveSummary } from "../../types";
import { cn } from "@/lib/utils";

interface LeaveBalanceListProps {
  leaveSummary: LeaveSummary[];
}

export function LeaveBalanceList({ leaveSummary }: LeaveBalanceListProps) {
  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palmtree className="w-4 h-4 text-emerald-600" />
          <CardTitle className="text-md">Số dư nghỉ phép</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaveSummary.length > 0 ? (
          leaveSummary.map((item, index) => {
            const isUnpaid = item.is_paid === 0;

            return (
              <div key={`${item.leave_type}-${index}`} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography
                    variant="label-sm"
                    className="font-semibold text-slate-700"
                  >
                    {item.leave_type}
                  </Typography>
                  {isUnpaid ? (
                    <Typography
                      variant="label-sm"
                      className="text-muted-foreground"
                    >
                      Đã nghỉ{" "}
                      <span className="text-rose-600 font-bold">
                        {item.used_days}
                      </span>{" "}
                      ngày
                    </Typography>
                  ) : (
                    <Typography
                      variant="label-sm"
                      className="text-muted-foreground"
                    >
                      Còn{" "}
                      <span className="text-emerald-600 font-bold">
                        {item.remaining}
                      </span>{" "}
                      / {item.balance} ngày
                    </Typography>
                  )}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isUnpaid ? "bg-rose-500" : "bg-emerald-500",
                    )}
                    style={{
                      width: isUnpaid
                        ? `${Math.min((item.used_days / 10) * 100, 100)}%`
                        : `${item.balance > 0 ? Math.round((item.remaining / item.balance) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground border border-dashed rounded-xl border-slate-200">
            <Calendar size={32} className="opacity-10" />
            <Typography variant="label-sm" className="text-[10px]">
              Chưa khởi tạo hạn mức nghỉ phép
            </Typography>
          </div>
        )}

        <div className="mt-8 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-lg bg-white shrink-0 shadow-sm">
              <Hourglass size={14} className="text-primary" />
            </div>
            <div>
              <Typography
                variant="small"
                className="text-[11px] font-bold text-slate-800 leading-tight block"
              >
                Lời nhắc:
              </Typography>
              <Typography
                variant="label-xs"
                className="text-[10px] text-slate-600 mt-1 leading-normal block"
              >
                Đừng nghỉ nhiều quá nhá không có bị đuổi việc các em nhé!
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
