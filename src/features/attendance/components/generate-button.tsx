"use client"

import { Button } from "@/components/ui/button";
import { useAttendanceStore } from "../store/attendance-store";
import { Loader2, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  showIcon?: boolean;
}

export function GenerateButton({ 
  variant = "default", 
  className,
  showIcon = true 
}: GenerateButtonProps) {
  const { generateSchedule, isGenerating } = useAttendanceStore();

  return (
    <Button
      variant={variant}
      disabled={isGenerating}
      onClick={() => generateSchedule()}
      className={cn("gap-2 shadow-sm font-bold", className)}
    >
      {isGenerating ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        showIcon && <CalendarPlus className="size-4" />
      )}
      {isGenerating ? "Đang xử lý..." : "Sinh lịch làm việc"}
    </Button>
  );
}
