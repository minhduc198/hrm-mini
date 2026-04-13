import { ColumnDef } from "@tanstack/react-table";
import { Pencil, ShieldCheck, User } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/common/table/DataTable";
import { ToggleButton } from "@/components/common/form/ToggleButton";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { Employee } from "../types";
import { AVATAR_COLORS } from "../constants";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onToggleActive: (emp: Employee) => void;
}

const renderValue = (value: string | null | undefined) => {
  return value && value.trim() !== "" ? value : "Chưa cập nhật";
};

export function EmployeeTable({
  employees,
  onEdit,
  onToggleActive,
}: EmployeeTableProps) {
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nhân viên",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-[11px] font-semibold shrink-0",
                  !emp.avatar_url &&
                    AVATAR_COLORS[emp.id % AVATAR_COLORS.length],
                )}
              >
                {emp.avatar_url ? (
                  <img
                    src={emp.avatar_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(emp.name)
                )}
              </div>
              <div className="min-w-0 py-1">
                <Typography
                  variant="p"
                  className="text-[13px] font-medium leading-tight mb-0.5 truncate"
                >
                  {renderValue(emp.name)}
                </Typography>
                <Typography
                  variant="small"
                  className="text-[11px] leading-tight truncate block text-muted-foreground"
                >
                  {renderValue(emp.email)}
                </Typography>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "empCode",
        header: "Mã NV",
        cell: ({ row }) => (
          <Typography
            variant="small"
            className="font-mono text-xs text-muted-foreground"
          >
            {renderValue(row.original.empCode)}
          </Typography>
        ),
      },
      {
        accessorKey: "phone",
        header: "Số điện thoại",
        cell: ({ row }) => (
          <Typography variant="small" className="text-xs tabular-nums">
            {renderValue(row.original.phone)}
          </Typography>
        ),
      },
      {
        accessorKey: "address",
        header: "Địa chỉ",
        cell: ({ row }) => (
          <Typography
            variant="small"
            className="text-xs text-muted-foreground truncate block max-w-[180px]"
          >
            {renderValue(row.original.address)}
          </Typography>
        ),
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium",
                emp.role === "admin"
                  ? "bg-violet-50 text-violet-700 border-violet-200"
                  : "bg-slate-50 text-slate-600 border-slate-200",
              )}
            >
              {emp.role === "admin" ? (
                <>
                  <ShieldCheck size={10} />
                  Admin
                </>
              ) : (
                <>
                  <User size={10} />
                  Nhân viên
                </>
              )}
            </span>
          );
        },
      },
      {
        accessorKey: "is_active",
        header: "Trạng thái",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium",
                emp.is_active
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-400 border-slate-200",
              )}
            >
              {emp.is_active ? "Hoạt động" : "Vô hiệu"}
            </span>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          const isValidDate = !isNaN(date.getTime());
          return (
            <Typography
              variant="small"
              className="text-xs tabular-nums text-muted-foreground"
            >
              {isValidDate ? date.toLocaleDateString("vi-VN") : "Chưa cập nhật"}
            </Typography>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div className="flex items-center justify-end gap-3 pr-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground border-none hover:text-primary shadow-none transition-all"
                onClick={() => onEdit(emp)}
              >
                <Pencil size={13} />
              </Button>

              <ToggleButton
                checked={emp.is_active}
                onCheckedChange={() => onToggleActive(emp)}
                title={emp.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
              />
            </div>
          );
        },
      },
    ],
    [onEdit, onToggleActive],
  );

  return (
    <DataTable
      columns={columns}
      data={employees}
      emptyStateText="Không tìm thấy nhân viên nào"
      showPagination={false}
    />
  );
}
