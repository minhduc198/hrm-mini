"use client";

import React from "react";
import { Play, Square, PlusCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCheckIn } from "../hooks/use-check-in";
import { useAttendanceTodayStatus } from "../hooks/use-attendance-today-status";

export function EmployeeActions() {
  const { isCheckedIn, isCompleted, isLoading: isStatusLoading } = useAttendanceTodayStatus();
  const { mutate: performCheckIn, isPending: isCheckingIn } = useCheckIn();

  const handleCheckInOut = () => {
    if (isCompleted) {
      toast.success("Bạn đã hoàn thành chấm công hôm nay!", {
        description: "Hẹn gặp lại bạn vào ngày mai."
      });
      return;
    }

    if (!isCheckedIn) {
      performCheckIn();
    } else {
      toast.info("Bạn đã check-in hôm nay", {
        description: "Tính năng check-out sẽ sớm được cập nhật.",
      });
    }
  };

  const handleCreateRequest = () => {
    toast("Tính năng tạo đơn đang được phát triển", {
      description: "Hệ thống sẽ cập nhật tính năng này trong thời gian sớm nhất.",
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Check-in/out Toggle Button */}
      <Button
        onClick={handleCheckInOut}
        isLoading={isCheckingIn || isStatusLoading}
        disabled={isCompleted}
        variant={isCompleted ? "outline" : isCheckedIn ? "outline" : "default"}
        className={cn(
          "h-11 px-4 md:px-6 flex items-center gap-2.5 transition-all duration-300 rounded-xl shadow-sm",
          isCompleted
            ? "bg-green-50 text-green-600 border-green-200 opacity-80 cursor-not-allowed"
            : isCheckedIn 
              ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary active:bg-primary/30" 
              : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg active:scale-95 shadow-primary/20"
        )}
      >
        {isCompleted ? (
          <>
            <CheckCircle size={18} className="animate-in fade-in zoom-in duration-300" />
            <span className="font-bold text-[11px] md:text-sm tracking-wide">HOÀN THÀNH</span>
          </>
        ) : isCheckedIn ? (
          <>
            <Square size={18} fill="currentColor" strokeWidth={0} className="animate-in fade-in zoom-in duration-300" />
            <span className="font-bold text-[11px] md:text-sm tracking-wide">CHECK OUT</span>
          </>
        ) : (
          <>
            <Play size={18} fill="currentColor" strokeWidth={0} className="animate-in fade-in zoom-in duration-300" />
            <span className="font-bold text-[11px] md:text-sm tracking-wide">CHECK IN</span>
          </>
        )}
      </Button>


      {/* Create Request Button */}
      <Button
        variant="outline"
        onClick={handleCreateRequest}
        className="h-11 px-3 md:px-6 flex items-center gap-2 md:gap-2.5 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <PlusCircle size={18} />
        <span className="font-bold text-[11px] md:text-sm tracking-wide">TẠO ĐƠN</span>
      </Button>
    </div>
  );
}
