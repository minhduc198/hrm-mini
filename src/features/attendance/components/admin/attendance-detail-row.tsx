import { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendanceRecordDetail } from "../../types/attendance";
import { statusMap } from "@/features/attendance/constants";
import { formatTime, formatDurationFromHours } from "@/utils/date-format";
import { useUpdateAttendanceRecord } from "../../hooks/use-update-attendance-record";
import { toast } from "sonner";

interface AttendanceDetailRowProps {
  record: AttendanceRecordDetail;
}

export function AttendanceDetailRow({ record }: AttendanceDetailRowProps) {
  const { mutate: updateRecord, isPending: isUpdating } = useUpdateAttendanceRecord();
  const [editingCell, setEditingCell] = useState<"check_in" | "check_out" | "note" | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (field: "check_in" | "check_out" | "note", value: string | null) => {
    setEditingCell(field);
    
    if ((field === "check_in" || field === "check_out") && value) {
      const time = value.includes(" ") ? value.split(" ")[1] : value;
      setEditValue(time.substring(0, 5)); // Get HH:mm
    } else {
      setEditValue(value || "");
    }
  };

  const handleTimeChange = (val: string) => {
    let clean = val.replace(/\D/g, "");
    if (clean.length > 4) clean = clean.substring(0, 4);
    
    if (clean.length > 2) {
      clean = clean.substring(0, 2) + ":" + clean.substring(2);
    }
    setEditValue(clean);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    let finalValue = editValue;
    
    // Validate 24h format
    if (editingCell === "check_in" || editingCell === "check_out") {
      if (editValue && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(editValue)) {
        toast.error("Định dạng giờ không hợp lệ (00:00 - 23:59)");
        return;
      }
      if (editValue) {
        const time = editValue.length === 5 ? `${editValue}:00` : editValue;
        // Ghép ngày với giờ theo định dạng YYYY-MM-DD HH:mm:ss
        finalValue = `${record.work_date} ${time}`;
      }
    }

    updateRecord({
      id: record.id,
      data: { [editingCell]: finalValue || null }
    }, {
      onSuccess: () => setEditingCell(null)
    });
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const normalizedStatus = typeof record.status === "string" ? record.status.toLowerCase() : "";
  const mappedStatus = normalizedStatus ? statusMap[normalizedStatus as keyof typeof statusMap] : null;

  return (
    <tr className="group hover:bg-primary-tint/10 transition-colors border-b border-line-subtle last:border-0 h-16">
      <td className="py-2 px-3 sticky left-0 z-20 bg-white group-hover:bg-[#f8fafd] transition-colors after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-line/30 text-center">
        <Typography variant="label-sm" className="font-bold text-primary tabular-nums whitespace-nowrap">
          {record.user.empCode}
        </Typography>
      </td>
      <td className="py-2 px-4 bg-white group-hover:bg-[#f8fafd] transition-colors border-l border-line-subtle">
        <Typography variant="label" className="font-bold text-tx-base whitespace-nowrap">
          {record.user.name}
        </Typography>
      </td>

      {/* --- Giờ vào --- */}
      <td 
        className={cn(
          "py-2 px-4 text-center border-l border-line-subtle cursor-pointer transition-all w-[160px] min-w-[160px]",
          editingCell === "check_in" ? "bg-primary-tint/30" : "hover:bg-primary-tint/20"
        )}
        onClick={() => handleStartEdit("check_in", record.check_in)}
      >
        {editingCell === "check_in" ? (
          <div className="flex items-center gap-1 p-0.5 bg-white border border-primary-border rounded-lg shadow-sm animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <Input 
              type="text" 
              value={editValue}
              onChange={e => handleTimeChange(e.target.value)}
              placeholder="00:00"
              className="h-6 w-16 border-none bg-transparent focus-visible:ring-0 text-[13px] p-0 text-center font-bold text-primary"
              autoFocus
              disabled={isUpdating}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
            />
            <div className="flex items-center gap-0.5 border-l border-primary-border/50 pl-1">
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
              ) : (
                <>
                  <Button size="icon" variant="ghost" className="h-5 w-5 text-success hover:bg-success/10 rounded-md" onClick={handleSaveEdit}>
                    <Check size={12} strokeWidth={3} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-5 w-5 text-danger hover:bg-danger/10 rounded-md" onClick={handleCancelEdit}>
                    <X size={12} strokeWidth={3} />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            {record.check_in ? (
              <Typography variant="label-sm" className="font-extrabold text-primary tabular-nums">
                {formatTime(record.check_in, false)}
              </Typography>
            ) : (
              <Typography variant="tiny" className="text-muted/40 font-medium italic">Trống</Typography>
            )}
          </div>
        )}
      </td>

      {/* --- Giờ ra --- */}
      <td 
        className={cn(
          "py-2 px-4 text-center border-l border-line-subtle cursor-pointer transition-all w-[160px] min-w-[160px]",
          editingCell === "check_out" ? "bg-primary-tint/30" : "hover:bg-primary-tint/20"
        )}
         onClick={() => handleStartEdit("check_out", record.check_out)}
      >
        {editingCell === "check_out" ? (
          <div className="flex items-center gap-1 p-0.5 bg-white border border-primary-border rounded-lg shadow-sm animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <Input 
              type="text" 
              value={editValue}
              onChange={e => handleTimeChange(e.target.value)}
              placeholder="00:00"
              className="h-6 w-16 border-none bg-transparent focus-visible:ring-0 text-[13px] p-0 text-center font-bold text-primary"
              autoFocus
              disabled={isUpdating}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
            />
            <div className="flex items-center gap-0.5 border-l border-primary-border/50 pl-1">
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
              ) : (
                <>
                  <Button size="icon" variant="ghost" className="h-5 w-5 text-success hover:bg-success/10 rounded-md" onClick={handleSaveEdit}>
                    <Check size={12} strokeWidth={3} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-5 w-5 text-danger hover:bg-danger/10 rounded-md" onClick={handleCancelEdit}>
                    <X size={12} strokeWidth={3} />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            {record.check_out ? (
              <Typography variant="label-sm" className="font-extrabold text-primary tabular-nums">
                {formatTime(record.check_out, false)}
              </Typography>
            ) : (
              <Typography variant="tiny" className="text-muted/40 font-medium italic">
                {record.check_in ? "Chờ ra" : "Trống"}
              </Typography>
            )}
          </div>
        )}
      </td>

      <td className="py-2 px-4 text-center border-l border-line-subtle bg-subtle/5">
        <Typography variant="label-sm" className="font-bold text-tx-base tabular-nums">
          {formatDurationFromHours(record.total_hours)}
        </Typography>
      </td>

      <td className="py-2 px-4 text-center border-l border-line-subtle">
        {mappedStatus ? (
          <div className={cn(
            "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm w-[140px] bg-white mx-auto",
            mappedStatus.color
          )}>
            <mappedStatus.icon size={13} strokeWidth={2.5} className="shrink-0" />
            <Typography variant="label-xs" className="font-bold tracking-tight text-inherit">
              {mappedStatus.label}
            </Typography>
          </div>
        ) : (
          <Typography variant="tiny" className="opacity-40">—</Typography>
        )}
      </td>

      <td 
        className={cn(
          "py-2 px-4 border-l border-line-subtle cursor-pointer transition-all",
          editingCell === "note" ? "bg-primary-tint/30" : "hover:bg-primary-tint/20"
        )}
        onClick={() => handleStartEdit("note", record.note)}
      >
        {editingCell === "note" ? (
          <div className="flex items-center gap-2 p-1.5 bg-white border border-primary-border rounded-xl shadow-sm animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <Input 
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              placeholder="Nhập ghi chú..."
              className="h-7 border-none bg-transparent focus-visible:ring-0 text-[13px] flex-1 p-0 px-1 font-medium"
              autoFocus
              disabled={isUpdating}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
            />
            <div className="flex items-center gap-0.5 border-l border-primary-border/50 pl-1.5">
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-success hover:bg-success/10 rounded-lg" onClick={handleSaveEdit}>
                    <Check size={16} strokeWidth={3} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-danger hover:bg-danger/10 rounded-lg" onClick={handleCancelEdit}>
                    <X size={16} strokeWidth={3} />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <Typography variant="label-sm" className={cn(
            "font-medium truncate max-w-[200px]",
            record.note ? "text-tx-base" : "text-muted/40 italic"
          )} title={record.note || ""}>
            {record.note || "Thêm ghi chú..."}
          </Typography>
        )}
      </td>
    </tr>
  );
}
