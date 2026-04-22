"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import { LateEmployee } from "../../types";
import { formatDuration } from "../../utils/format";

interface AdminLateEmployeesProps {
  employees?: LateEmployee[];
}

export function AdminLateEmployees({ employees }: AdminLateEmployeesProps) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50">
        <CardTitle className="text-lg font-bold">Vi phạm chuyên cần</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {employees && employees.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {employees.map((emp) => {
              const duration = formatDuration(emp.total_late_minutes);
              return (
                <div
                  key={emp.user_id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase overflow-hidden">
                      {emp.user.avatar ? (
                        <img
                          src={emp.user.avatar}
                          alt={emp.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        emp.user.name?.charAt(0) || "?"
                      )}
                    </div>
                    <div>
                      <Typography variant="label-sm" className="font-bold block">
                        {emp.user.name}
                      </Typography>
                      <Typography variant="tiny" className="text-slate-500">
                        {emp.occurrences} lần vi phạm
                      </Typography>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-rose-600 bg-rose-50 border-rose-100 font-bold"
                  >
                    {duration.value}
                    {duration.unit}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <Typography variant="label-sm" className="font-medium text-slate-600">
              Tuyệt vời!
            </Typography>
            <Typography variant="tiny" className="text-slate-400">
              Không có nhân viên nào đi muộn định kỳ.
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
