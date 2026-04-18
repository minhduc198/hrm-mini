"use client";

import React, { useState } from "react";
import { Play, Square, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function EmployeeActions() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckInOut = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      toast.success("Check-in thành công!", {
        description: "Bắt đầu ca làm việc của bạn lúc " + new Date().toLocaleTimeString(),
      });
    } else {
      setIsCheckedIn(false);
      toast.info("Check-out thành công!", {
        description: "Kết thúc ca làm việc của bạn lúc " + new Date().toLocaleTimeString(),
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
        variant={isCheckedIn ? "outline" : "default"}
        className={cn(
          "h-11 px-4 md:px-6 flex items-center gap-2.5 transition-all duration-300 rounded-xl shadow-sm",
          isCheckedIn 
            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary active:bg-primary/30" 
            : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg active:scale-95 shadow-primary/20"
        )}
      >
        {isCheckedIn ? (
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
