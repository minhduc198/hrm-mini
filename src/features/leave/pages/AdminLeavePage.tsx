"use client";

import { DatePickerInput } from "@/components/common/form/DatePickerInput";
import { SearchInput } from "@/components/common/form/search-input";
import { SelectFieldInput } from "@/components/common/form/SelectFieldInput";
import { PageHeader } from "@/components/common/layout/page-header";
import { TablePagination } from "@/components/common/table/Pagination";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNumberParam, useParam } from "@/hooks/use-param";
import { AdminLeaveTable } from "../components/AdminLeaveTable";
import { LeaveActionDialog } from "../components/LeaveActionDialog";
import { useAdminLeave } from "../hooks/use-admin-leave";
import { LeaveActionFormValues } from "../schemas/admin";
import { LeaveRequest } from "../types";
import { Can } from "@/components/common/auth/Can";

export default function AdminLeavePage() {
  const [search, setSearch] = useParam("search", "");
  const debouncedSearch = useDebounce(search, 200);

  const [page, setPage] = useNumberParam("page", 1);
  const [perPage, setPerPage] = useNumberParam("per_page", 10);
  const [statusFilter, setStatusFilter] = useParam("status", "all");
  const [startTime, setStartTime] = useParam("start_time", "");
  const [endTime, setEndTime] = useParam("end_time", "");

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [actionTarget, setActionTarget] = useState<{
    type: "detail" | "bulk-approve" | "bulk-reject";
    request?: LeaveRequest;
  } | null>(null);

  const currentFilters = {
    page: page,
    per_page: perPage,
    status: statusFilter === "all" ? undefined : statusFilter,
    name: debouncedSearch,
    start_date: startTime
      ? format(new Date(startTime), "yyyy-MM-dd")
      : undefined,
    end_date: endTime
      ? format(new Date(endTime), "yyyy-MM-dd")
      : undefined,
  };

  const {
    adminListQuery,
    approveLeave,
    rejectLeave,
    bulkUpdateStatus,
    isApproving,
    isRejecting,
    isBulkUpdating,
  } = useAdminLeave(currentFilters);

  const data = adminListQuery.data;
  const isLoading = adminListQuery.isLoading;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, startTime, endTime, setPage]);

  const selectedCount = Object.keys(rowSelection).length;
  const selectedIds = Object.keys(rowSelection)
    .filter((id) => rowSelection[id])
    .map((index) => {
      const idx = parseInt(index);
      return data?.data[idx]?.id;
    })
    .filter((id): id is number => id !== undefined);

  const handleAction = (
    values: LeaveActionFormValues & { status?: "approved" | "rejected" },
  ) => {
    if (!actionTarget) return;

    const { type, request } = actionTarget;
    const finalStatus =
      values.status || (type === "bulk-approve" ? "approved" : "rejected");

    if (type === "detail" && request) {
      if (finalStatus === "approved") {
        approveLeave(
          {
            id: request.id,
            payload: {
              status: "approved",
              approver_note: values.approver_note,
            },
          },
          {
            onSuccess: () => setActionTarget(null),
          },
        );
      } else {
        rejectLeave(
          {
            id: request.id,
            payload: {
              status: "rejected",
              approver_note: values.approver_note,
            },
          },
          {
            onSuccess: () => setActionTarget(null),
          },
        );
      }
    } else if (type === "bulk-approve") {
      bulkUpdateStatus(
        {
          ids: selectedIds,
          status: "approved",
          approver_note: values.approver_note,
        },
        {
          onSuccess: () => {
            setActionTarget(null);
            setRowSelection({});
          },
        },
      );
    } else if (type === "bulk-reject") {
      bulkUpdateStatus(
        {
          ids: selectedIds,
          status: "rejected",
          approver_note: values.approver_note,
        },
        {
          onSuccess: () => {
            setActionTarget(null);
            setRowSelection({});
          },
        },
      );
    }
  };

  const handleReset = () => {
    setSearch("");
    setPage(1);
    setPerPage(10);
    setStatusFilter("all");
    setStartTime("");
    setEndTime("");
  };

  const dialogConfig = (() => {
    if (!actionTarget)
      return { title: "", description: "", variant: "success" as const };

    switch (actionTarget.type) {
      case "detail":
        return {
          title: "Chi tiết đơn nghỉ phép",
          description: `Bạn đang xem đơn của ${actionTarget.request?.user?.name}.`,
          variant: "success" as const,
        };
      case "bulk-approve":
        return {
          title: "Duyệt hàng loạt đơn",
          description: `Bạn đang duyệt ${selectedIds.length} đơn đã chọn.`,
          variant: "success" as const,
        };
      case "bulk-reject":
        return {
          title: "Từ chối hàng loạt đơn",
          description: `Bạn đang từ chối ${selectedIds.length} đơn đã chọn.`,
          variant: "destructive" as const,
        };
    }
  })();

  const hasFilter =
    search !== "" ||
    statusFilter !== "all" ||
    startTime !== "" ||
    endTime !== "";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Calendar}
        title="Quản lý nghỉ phép"
        description="Phê duyệt hoặc từ chối các yêu cầu nghỉ phép của nhân viên toàn hệ thống."
        actions={
          <div className="flex items-center gap-2">
            <Can permission="leave_request.decide">
              {selectedCount > 0 && (
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-right-4">
                  <Typography
                    variant="small"
                    className="text-slate-600 font-medium"
                  >
                    Đã chọn{" "}
                    <span className="font-bold text-primary">
                      {selectedCount}
                    </span>{" "}
                    đơn
                  </Typography>
                  <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1.5 px-3"
                    onClick={() => setActionTarget({ type: "bulk-approve" })}
                  >
                    <CheckCircle2 size={14} /> Duyệt
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 px-3"
                    onClick={() => setActionTarget({ type: "bulk-reject" })}
                  >
                    <XCircle size={14} /> Từ chối
                  </Button>
                </div>
              )}
            </Can>
          </div>
        }
      />

      <Can
        permission="leave_request.view"
        fallback={
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-primary/20">
            <Typography variant="h4" className="text-muted-foreground mb-2">
              Không có quyền truy cập
            </Typography>
            <Typography variant="small" className="text-muted-foreground/60 text-center max-w-md">
              Bạn không có quyền xem danh sách đơn xin nghỉ của toàn bộ nhân viên. Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </Typography>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:max-w-md">
              <SearchInput
                placeholder="Tìm theo tên hoặc mã nhân viên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                isLoading={isLoading}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <SelectFieldInput
                className="w-[180px]"
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v)}
                options={[
                  { label: "Tất cả trạng thái", value: "all" },
                  { label: "Đang chờ duyệt", value: "pending" },
                  { label: "Đã phê duyệt", value: "approved" },
                  { label: "Từ chối", value: "rejected" },
                ]}
                placeholder="Trạng thái"
              />

              <div className="flex items-center gap-2">
                <DatePickerInput
                  className="h-10 w-[140px]"
                  placeholder="Từ ngày"
                  value={startTime || undefined}
                  onChange={(date) => setStartTime(date || "")}
                />
                <DatePickerInput
                  className="h-10 w-[140px]"
                  placeholder="Đến ngày"
                  value={endTime || undefined}
                  onChange={(date) => setEndTime(date || "")}
                />
              </div>

              {hasFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-10 px-3 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors gap-1.5 rounded-xl border border-dashed border-border/60 hover:border-rose-200"
                >
                  <RotateCcw size={14} />
                  Xóa lọc
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "transition-opacity duration-200",
            isLoading ? "opacity-60 pointer-events-none" : "opacity-100",
          )}
        >
          <AdminLeaveTable
            data={data?.data || []}
            onAction={(request) => setActionTarget({ type: "detail", request })}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />

          {data && data.total > 0 && (
            <TablePagination
              currentPage={page}
              totalPage={data.last_page}
              totalItems={data.total}
              perPage={perPage}
              onPageChange={(p) => setPage(p)}
              onPerPageChange={(size) => {
                setPerPage(size);
                setPage(1);
              }}
            />
          )}
        </div>
      </Can>

      <LeaveActionDialog
        open={!!actionTarget}
        onOpenChange={(open) => !open && setActionTarget(null)}
        request={actionTarget?.request || null}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onSubmit={handleAction}
        isLoading={isApproving || isRejecting || isBulkUpdating}
      />
    </div>
  );
}
