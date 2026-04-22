import { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendanceRecordDetail } from "../../types/attendance";
import { formatTime, formatDurationFromHours, formatDurationFromMinutes } from "@/utils/date-format";
import { useUpdateAttendanceRecord } from "../../hooks/use-update-attendance-record";
import { toast } from "sonner";

import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AttendanceDetailRowProps {
  record: AttendanceRecordDetail;
}

export function AttendanceDetailRow({ record }: AttendanceDetailRowProps) {
  const { mutate: updateRecord, isPending: isUpdating } = useUpdateAttendanceRecord();
  const [editingCell, setEditingCell] = useState<"check_in" | "check_out" | "note" | null>(null);
  const [editValue, setEditValue] = useState("");
  const normalizedStatus = typeof record.status === "string" ? record.status.toLowerCase() : "";
  const isLeaveRestricted = normalizedStatus === "leave" || record.leave_requests?.some(lr => lr.status === "approved");

  const handleStartEdit = (field: "check_in" | "check_out" | "note", value: string | null) => {
    if (isLeaveRestricted && (field === "check_in" || field === "check_out")) {
      toast.info("Không thể chỉnh sửa giờ cho nhân viên đã có đơn nghỉ phép được duyệt");
      return;
    }
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

      // Kiểm tra Logic: Giờ ra phải sau giờ vào
      if (editValue) {
        const otherField = editingCell === "check_in" ? "check_out" : "check_in";
        const otherValueFull = record[otherField];
        
        if (otherValueFull) {
          const otherTime = otherValueFull.includes(" ") ? otherValueFull.split(" ")[1].substring(0, 5) : otherValueFull.substring(0, 5);
          
          if (editingCell === "check_in" && editValue >= otherTime) {
            toast.error("Giờ vào phải trước giờ ra (" + otherTime + ")");
            return;
          }
          if (editingCell === "check_out" && editValue <= otherTime) {
            toast.error("Giờ ra phải sau giờ vào (" + otherTime + ")");
            return;
          }
        }
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

  return (
    <TableRow className="hover:bg-transparent transition-colors h-auto min-h-[64px]">
      <TableCell className="py-3 px-3 sticky left-0 z-20 bg-white transition-colors after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-line/30 text-center border-b border-line-subtle">
        <Typography variant="label-sm" className="font-bold text-primary tabular-nums whitespace-nowrap">
          {record.user.empCode}
        </Typography>
      </TableCell>
      <TableCell className="py-3 px-4 bg-white transition-colors border-l border-b border-line-subtle">
        <Typography variant="label" className="font-bold text-tx-base whitespace-nowrap">
          {record.user.name}
        </Typography>
      </TableCell>

      {/* --- Giờ vào --- */}
      <TableCell 
        className={cn(
          "py-0 px-2 text-center border-l border-b border-line-subtle transition-all w-[110px] min-w-[110px] max-w-[110px] h-[64px] bg-white",
          isLeaveRestricted ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:bg-transparent",
          editingCell === "check_in" ? "bg-primary-tint/30" : ""
        )}
        onClick={() => handleStartEdit("check_in", record.check_in)}
      >
        {editingCell === "check_in" ? (
          <div className="flex items-center gap-0.5 p-1 bg-white border border-primary-border rounded-lg shadow-sm h-9" onClick={e => e.stopPropagation()}>
            <Input 
              type="text" 
              value={editValue}
              onChange={e => handleTimeChange(e.target.value)}
              placeholder="00:00"
              className="h-full w-full border-none bg-transparent focus-visible:ring-0 text-[12px] p-0 text-center font-bold text-primary"
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
                  <button onClick={handleSaveEdit} className="p-1 text-success hover:bg-success/10 rounded-md transition-colors" title="Lưu">
                    <Check size={12} strokeWidth={3} />
                  </button>
                  <button onClick={handleCancelEdit} className="p-1 text-danger hover:bg-danger/10 rounded-md transition-colors" title="Hủy">
                    <X size={12} strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            {record.check_in ? (
              <Typography variant="label-sm" className="font-extrabold text-primary tabular-nums">
                {formatTime(record.check_in, false)}
              </Typography>
            ) : (
              <Typography variant="tiny" className="text-muted/40 font-medium italic">Trống</Typography>
            )}
          </div>
        )}
      </TableCell>

      {/* --- Giờ ra --- */}
      <TableCell 
        className={cn(
          "py-0 px-2 text-center border-l border-b border-line-subtle transition-all w-[110px] min-w-[110px] max-w-[110px] h-[64px] bg-white",
          isLeaveRestricted ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:bg-transparent",
          editingCell === "check_out" ? "bg-primary-tint/30" : ""
        )}
         onClick={() => handleStartEdit("check_out", record.check_out)}
      >
        {editingCell === "check_out" ? (
          <div className="flex items-center gap-0.5 p-1 bg-white border border-primary-border rounded-lg shadow-sm h-9" onClick={e => e.stopPropagation()}>
            <Input 
              type="text" 
              value={editValue}
              onChange={e => handleTimeChange(e.target.value)}
              placeholder="00:00"
              className="h-full w-full border-none bg-transparent focus-visible:ring-0 text-[12px] p-0 text-center font-bold text-primary"
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
                  <button onClick={handleSaveEdit} className="p-1 text-success hover:bg-success/10 rounded-md transition-colors" title="Lưu">
                    <Check size={12} strokeWidth={3} />
                  </button>
                  <button onClick={handleCancelEdit} className="p-1 text-danger hover:bg-danger/10 rounded-md transition-colors" title="Hủy">
                    <X size={12} strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
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
      </TableCell>

      <TableCell className="py-3 px-4 text-center border-l border-b border-line-subtle bg-white">
        <Typography variant="label-sm" className="font-bold text-tx-base tabular-nums">
          {formatDurationFromHours(record.total_hours)}
        </Typography>
      </TableCell>

      <TableCell className="py-3 px-3 border-l border-b border-line-subtle align-middle bg-white">
        <div className="flex flex-row flex-wrap gap-1.5 items-center justify-center min-w-[160px]">
          {/* --- Group 1: Công & Thiếu --- */}
          {Number(record.total_hours) >= 8 && (
             <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-100 bg-emerald-50/50 text-emerald-600 transition-colors hover:bg-emerald-50">
                <div className="size-1 rounded-full bg-emerald-500" />
                <Typography variant="label-xs" className="font-bold tracking-tight text-emerald-600">Đủ công</Typography>
             </div>
          )}

          {/* --- Group 2: Đơn nghỉ phép --- */}
          {record.leave_requests?.map((lr) => {
            const timeRange = `${formatTime(lr.start_time, false)} - ${formatTime(lr.end_time, false)}`;
            
            if (lr.status === 'approved') {
              return (
                <div key={lr.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-purple-100 bg-purple-50/50 text-purple-600 transition-colors hover:bg-purple-50">
                  <Check size={10} strokeWidth={3} className="shrink-0" />
                  <Typography variant="label-xs" className="font-bold tracking-tight text-purple-600">Phép {timeRange}</Typography>
                </div>
              );
            }
            if (lr.status === 'pending') {
              return (
                <div key={lr.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-100 bg-amber-50/50 text-amber-600 transition-colors hover:bg-amber-50">
                  <Clock size={10} strokeWidth={3} className="shrink-0" />
                  <Typography variant="label-xs" className="font-bold tracking-tight text-amber-600">Đơn {timeRange} (Chờ)</Typography>
                </div>
              );
            }
            if (lr.status === 'rejected') {
              return (
                <div key={lr.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-rose-100 bg-rose-50/50 text-rose-600 transition-colors hover:bg-rose-50">
                  <X size={10} strokeWidth={3} className="shrink-0" />
                  <Typography variant="label-xs" className="font-bold tracking-tight text-rose-600">Đơn {timeRange} bị từ chối</Typography>
                </div>
              );
            }
            return null;
          })}

          {/* --- Group 3: Sub-text Details (Pills) --- */}
          {record.late_minutes > 0 && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-full border border-amber-100 bg-amber-50/50 text-amber-600 transition-colors hover:bg-amber-50">
              <Clock size={10} strokeWidth={3} className="shrink-0 mr-0.5" />
              <Typography variant="label-xs" className="font-bold tracking-tight text-amber-600">Vào muộn {formatDurationFromMinutes(record.late_minutes, true)}</Typography>
            </div>
          )}
          {record.early_leave_minutes > 0 && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-full border border-orange-100 bg-orange-50/50 text-orange-600 transition-colors hover:bg-orange-50">
              <Clock size={10} strokeWidth={3} className="shrink-0 mr-0.5" />
              <Typography variant="label-xs" className="font-bold tracking-tight text-orange-600">Về sớm {formatDurationFromMinutes(record.early_leave_minutes, true)}</Typography>
            </div>
          )}
        </div>
      </TableCell>

      <TableCell 
        className={cn(
          "py-3 px-4 border-l border-b border-line-subtle cursor-pointer transition-all bg-white w-[250px] min-w-[250px] max-w-[250px]",
          editingCell === "note" ? "bg-primary-tint/30" : "hover:bg-transparent"
        )}
        onClick={() => handleStartEdit("note", record.note)}
      >
        {editingCell === "note" ? (
          <div className="flex items-center gap-2 p-1.5 bg-white border border-primary-border rounded-xl shadow-sm h-9 w-full" onClick={e => e.stopPropagation()}>
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
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Typography variant="label-sm" className={cn(
                    "font-medium truncate block w-full",
                    record.note ? "text-tx-base" : "text-muted/40 italic"
                  )}>
                    {record.note || "Thêm ghi chú..."}
                  </Typography>
                </div>
              </TooltipTrigger>
              {record.note && (
                <TooltipContent side="top" align="start" className="max-w-[300px] break-words">
                  <Typography variant="label-xs" className="text-white">
                    {record.note}
                  </Typography>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
    </TableRow>
  );
}
