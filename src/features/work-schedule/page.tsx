"use client";

import { CalendarDays } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export function WorkSchedulePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <CalendarDays size={24} />
      </div>
      <Typography variant="h4" className="text-slate-600 font-bold mb-1">
        Lịch làm việc đang được phát triển
      </Typography>
      <Typography variant="small" className="text-slate-400 text-center max-w-[300px]">
        Tính năng cấu hình khung giờ làm việc và ca kíp sẽ sớm được cập nhật trong phiên bản tiếp theo.
      </Typography>
    </div>
  );
}
