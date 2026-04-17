import { cn } from "@/lib/utils";

interface LegendItemProps {
  color: string;
  label: string;
  border?: boolean;
}

export function LegendItem({ color, label, border }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("size-2.5 rounded-full", color, border && "border border-line-subtle")} />
      <span className="text-[11px] font-medium text-tx-muted whitespace-nowrap">{label}</span>
    </div>
  );
}

export function AttendanceLegend() {
  return (
    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-line-subtle shadow-sm flex-wrap">
      <LegendItem color="bg-success" label="Đúng giờ" />
      <LegendItem color="bg-warning" label="Trễ" />
      <LegendItem color="bg-danger" label="Vắng" />
      <div className="w-px h-4 bg-line-subtle mx-1" />
      <LegendItem color="bg-subtle" label="Cuối tuần" border />
    </div>
  );
}
