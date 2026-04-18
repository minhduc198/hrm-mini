import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { ATTENDANCE_STATUS_LABELS } from "../constants";

interface LegendItemProps {
  color: string;
  label: string;
  border?: boolean;
}

export function LegendItem({ color, label, border }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("size-2.5 rounded-full", color, border && "border border-line-subtle")} />
      <Typography variant="label-xs" className="whitespace-nowrap">
        {label}
      </Typography>
    </div>
  );
}

export function AttendanceLegend() {
  return (
    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-line-subtle shadow-sm flex-wrap">
      <LegendItem color="bg-success" label={ATTENDANCE_STATUS_LABELS.ON_TIME} />
      <LegendItem color="bg-warning" label={ATTENDANCE_STATUS_LABELS.LATE} />
      <LegendItem color="bg-danger" label={ATTENDANCE_STATUS_LABELS.ABSENT} />
      <div className="w-px h-4 bg-line-subtle mx-1" />
      <LegendItem color="bg-subtle" label={ATTENDANCE_STATUS_LABELS.WEEKEND} border />
    </div>
  );
}
