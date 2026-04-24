import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { leaveActionSchema, LeaveActionFormValues } from "../schemas/admin";
import { LeaveRequest } from "../types";
import { TextareaFieldInput } from "@/components/common/form/TextareaFieldInput";
import { Typography } from "@/components/ui/typography";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { AVATAR_COLORS } from "@/features/employee/constants";
import { Can } from "@/components/common/auth/Can";
import Image from "next/image";

import { useAuth } from "@/features/auth/hooks/use-auth";

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface LeaveActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  onSubmit: (
    values: LeaveActionFormValues & { status: "approved" | "rejected" },
  ) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const scopeMap: Record<string, string> = {
  full_day: "Cả ngày",
  half_day: "Nửa ngày",
  hourly: "Theo giờ",
};

const statusMap = {
  pending: { label: "Chờ duyệt", variant: "warning", icon: Clock },
  approved: { label: "Đã duyệt", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Từ chối", variant: "destructive", icon: XCircle },
  cancelled: { label: "Đã hủy", variant: "secondary", icon: AlertCircle },
};

export function LeaveActionDialog({
  open,
  onOpenChange,
  request,
  onSubmit,
  isLoading,
  title,
  description,
}: LeaveActionDialogProps) {
  const { hasPermission } = useAuth();
  const canDecide = hasPermission("leave_request.decide");

  const form = useForm<LeaveActionFormValues>({
    resolver: zodResolver(leaveActionSchema),
    defaultValues: {
      approver_note: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        approver_note: request?.approver_note || "",
      });
    }
  }, [open, request, form]);

  const handleSubmit = (status: "approved" | "rejected") => {
    const values = form.getValues();
    onSubmit({ ...values, status });
  };

  const isBulk = !request;
  const isPending = request?.status === "pending";
  const statusInfo = request
    ? statusMap[request.status] || statusMap.pending
    : null;
  const StatusIcon = statusInfo?.icon;

  const user = request?.user;
  const initials = getInitials(user?.name || "");
  const avatarColor = user
    ? AVATAR_COLORS[user.id % AVATAR_COLORS.length]
    : "bg-slate-100";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden rounded-xl border-none shadow-2xl",
          isBulk ? "sm:max-w-[425px]" : "sm:max-w-[480px]",
        )}
      >
        <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-white text-[11px] tracking-wide font-bold text-primary border-primary/20"
              >
                {isBulk ? "Thao tác hàng loạt" : "Chi tiết đơn"}
              </Badge>
              {!isBulk && statusInfo && (
                <Badge
                  className={cn(
                    "gap-1.5 font-bold shadow-sm px-2 py-0.5",
                    statusInfo.variant === "warning" &&
                      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
                    statusInfo.variant === "success" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
                    statusInfo.variant === "destructive" &&
                      "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
                    statusInfo.variant === "secondary" &&
                      "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
                  )}
                >
                  {StatusIcon && <StatusIcon size={12} strokeWidth={3} />}
                  {statusInfo.label}
                </Badge>
              )}
              {isBulk && (
                <Badge className="gap-1.5 font-bold shadow-sm bg-amber-50 text-amber-700 border-amber-200">
                  <Clock size={12} strokeWidth={3} />
                  Chờ duyệt
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 pt-1">
              {isBulk ? title : request.leave_type?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {isBulk
                ? description
                : "Xem chi tiết thông tin và phản hồi yêu cầu nghỉ phép của nhân viên."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
          {!isBulk && (
            <>
              <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100 shadow-sm">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 overflow-hidden shadow-sm ring-1 ring-white",
                    !user?.avatar && avatarColor,
                  )}
                >
                  {user?.avatar ? (
                    <Image
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `${process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/storage/"}${user.avatar}`
                      }
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || <User size={14} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Typography
                    variant="small"
                    className="font-bold text-slate-900 leading-tight truncate block text-[14px]"
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="label"
                    className="text-[10px] text-muted-foreground mt-0.5 block font-medium"
                  >
                    Mã NV:{" "}
                    <span className="text-slate-700">{user?.empCode}</span>
                  </Typography>
                </div>
                <div className="text-right border-l pl-4 border-slate-200">
                  <Typography
                    variant="label"
                    className="text-[10px] text-slate-500 font-semibold tracking-wider block"
                  >
                    Tổng cộng
                  </Typography>
                  <div className="text-sm font-bold text-slate-900">
                    {request.total_amount}{" "}
                    {request.amount_unit === "days" ? "ngày" : "giờ"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Typography
                    variant="label"
                    className="text-[11px] text-slate-500 font-bold tracking-tight"
                  >
                    Hình thức nghỉ
                  </Typography>
                  <div className="flex">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 font-semibold text-[11px] px-2 py-0"
                    >
                      {scopeMap[request.request_scope]}
                      {request.half_day_period === "morning" && " (Sáng)"}
                      {request.half_day_period === "afternoon" && " (Chiều)"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <Typography
                    variant="label"
                    className="text-[11px] text-slate-500 font-bold tracking-tight"
                  >
                    Thời gian
                  </Typography>
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar
                          size={12}
                          className="text-blue-500 shrink-0"
                        />
                        <span className="text-[11px] text-slate-500 font-medium truncate">
                          Từ:
                        </span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-800">
                        {format(new Date(request.start_time), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar
                          size={12}
                          className="text-slate-400 shrink-0"
                        />
                        <span className="text-[11px] text-slate-500 font-medium truncate">
                          Đến:
                        </span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-800">
                        {format(new Date(request.end_time), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Typography
                  variant="label"
                  className="text-[11px] text-slate-500 font-bold tracking-tight"
                >
                  Lý do nghỉ
                </Typography>
                <div className="text-[12px] text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic max-h-[120px] overflow-y-auto whitespace-pre-wrap">
                  &quot;{request.reason}&quot;
                </div>
              </div>
            </>
          )}

          {canDecide && (
            <Form {...form}>
              <form className="space-y-4">
                <TextareaFieldInput
                  name="approver_note"
                  label={
                    isBulk ? "Ghi chú phê duyệt hàng loạt" : "Ghi chú phản hồi"
                  }
                  placeholder={
                    isPending
                      ? "Nhập ghi chú phê duyệt hoặc lý do từ chối..."
                      : "Không có ghi chú"
                  }
                  className="bg-white"
                  readOnly={!isPending && !isBulk}
                />
              </form>
            </Form>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 border-slate-200"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Đóng
          </Button>
          {!isBulk ? (
            isPending && (
              <Can permission="leave_request.decide">
                <div className="flex-[2] flex gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1 rounded-xl h-11 gap-1.5"
                    onClick={() => handleSubmit("rejected")}
                    isLoading={isLoading}
                  >
                    Từ chối
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    className="flex-1 rounded-xl h-11 gap-1.5"
                    onClick={() => handleSubmit("approved")}
                    isLoading={isLoading}
                  >
                    Phê duyệt
                  </Button>
                </div>
              </Can>
            )
          ) : (
            <Can permission="leave_request.decide">
              <Button
                type="button"
                variant={title?.includes("Từ chối") ? "destructive" : "default"}
                className={cn("flex-1 rounded-xl h-11")}
                onClick={() =>
                  handleSubmit(
                    title?.includes("Từ chối") ? "rejected" : "approved",
                  )
                }
                isLoading={isLoading}
              >
                Xác nhận {title?.includes("Từ chối") ? "từ chối" : "phê duyệt"}
              </Button>
            </Can>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
