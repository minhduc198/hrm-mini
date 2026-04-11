"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import {
  Users,
  UserPlus,
  Search,
  X,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Employee,
  EmployeeTable,
  MOCK_EMPLOYEES,
} from "@/features/employee/components/EmployeeTable";
import {
  AddEmployeeValues,
  EditEmployeeValues,
} from "@/features/employee/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeDialog } from "@/features/employee/components/EmployeeDialog";
import { ConfirmDialog } from "@/components/common/feedback/ConfirmDialog";
import { SelectFieldInput } from "@/components/common/form/SelectFieldInput";

type RoleFilter = "all" | "admin" | "employee";
type StatusFilter = "all" | "active" | "inactive";

export default function EmployeeManagePage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [confirmToggleTarget, setConfirmToggleTarget] =
    useState<Employee | null>(null);

  const stats = useMemo(
    () => ({
      total: employees.length,
      admins: employees.filter((e) => e.role === "admin").length,
      active: employees.filter((e) => e.is_active).length,
      inactive: employees.filter((e) => !e.is_active).length,
    }),
    [employees],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return employees.filter((emp) => {
      if (
        q &&
        !emp.name.toLowerCase().includes(q) &&
        !emp.empCode.toLowerCase().includes(q)
      )
        return false;
      if (roleFilter !== "all" && emp.role !== roleFilter) return false;
      if (statusFilter === "active" && !emp.is_active) return false;
      if (statusFilter === "inactive" && emp.is_active) return false;
      return true;
    });
  }, [employees, search, roleFilter, statusFilter]);

  const hasFilter =
    search.length > 0 || roleFilter !== "all" || statusFilter !== "all";

  function resetFilters() {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  function handleAdd(values: AddEmployeeValues) {
    const newEmp: Employee = {
      id: Date.now(),
      empCode: values.empCode,
      name: values.name,
      email: values.email,
      role: values.role,
      address: values.address,
      phone: values.phone,
      is_active: true,
      created_by: 1,
      created_at: new Date().toISOString(),
    };
    setEmployees((prev) => [newEmp, ...prev]);
  }

  function handleEdit(id: number, values: EditEmployeeValues) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...values } : e)),
    );
  }

  function handleToggleActive() {
    if (!confirmToggleTarget) return;
    const emp = confirmToggleTarget;
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === emp.id ? { ...e, is_active: !e.is_active } : e,
      ),
    );
    setConfirmToggleTarget(null);
  }

  const statCards = [
    {
      label: "Tổng nhân viên",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/8",
      border: "border-primary/15",
    },
    {
      label: "Quản trị viên",
      value: stats.admins,
      icon: ShieldCheck,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      label: "Đang hoạt động",
      value: stats.active,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Vô hiệu hóa",
      value: stats.inactive,
      icon: UserX,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 md:p-6 min-h-full bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users size={15} className="text-primary" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-lg font-semibold leading-none"
            >
              Quản lý nhân viên
            </Typography>
            <Typography variant="small" className="text-xs mt-0.5 leading-none">
              Quản lý tài khoản và thông tin toàn bộ nhân viên
            </Typography>
          </div>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs self-start sm:self-auto"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus size={13} />
          Thêm nhân viên
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-xl border px-4 py-3.5 flex items-center gap-3 bg-white",
              s.border,
            )}
          >
            <div className={cn("rounded-lg p-2 shrink-0", s.bg)}>
              <s.icon size={15} className={s.color} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <Typography
                variant="h4"
                className={cn("text-xl font-bold leading-none mb-0.5", s.color)}
              >
                {s.value}
              </Typography>
              <Typography
                variant="small"
                className="text-[11px] leading-none truncate"
              >
                {s.label}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Tìm theo tên hoặc mã nhân viên..."
            className="pl-9 h-10 text-sm bg-white border-primary/20 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as RoleFilter)}
          >
            <SelectTrigger className="h-10 w-fit min-w-[145px] whitespace-nowrap text-sm bg-white border-primary/20 rounded-xl transition-all px-4">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="employee">Nhân viên</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="h-10 w-fit min-w-[155px] whitespace-nowrap text-sm bg-white border-primary/20 rounded-xl transition-all px-4">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
            </SelectContent>
          </Select>

          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 px-3 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors gap-1.5 rounded-xl border border-dashed border-border/60 hover:border-rose-200"
            >
              <X size={14} />
              Xóa lọc
            </Button>
          )}

          {hasFilter && (
            <div className="hidden lg:block h-4 w-px bg-border/60 mx-1" />
          )}

          {hasFilter && (
            <div className="text-[11px] font-medium text-muted-foreground bg-gray-100/50 px-2 py-1 rounded-md">
              <span className="text-foreground">{filtered.length}</span> /{" "}
              {employees.length}
            </div>
          )}
        </div>
      </div>

      <EmployeeTable
        employees={filtered}
        onEdit={(emp) => setEditTarget(emp)}
        onToggleActive={(emp) => setConfirmToggleTarget(emp)}
      />

      <EmployeeDialog
        mode="add"
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />
      <EmployeeDialog
        mode="edit"
        employee={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSubmit={(values) => {
          if (editTarget) {
            handleEdit(editTarget.id, values);
          }
        }}
      />

      <ConfirmDialog
        open={!!confirmToggleTarget}
        onOpenChange={(open) => !open && setConfirmToggleTarget(null)}
        title={
          confirmToggleTarget?.is_active
            ? "Vô hiệu hóa nhân viên?"
            : "Kích hoạt nhân viên?"
        }
        description={
          confirmToggleTarget?.is_active
            ? `Bạn có chắc chắn muốn vô hiệu hóa nhân viên "${confirmToggleTarget?.name}"? Nhân viên này sẽ không thể đăng nhập vào hệ thống.`
            : `Hành động này sẽ kích hoạt lại tài khoản cho nhân viên "${confirmToggleTarget?.name}".`
        }
        variant={confirmToggleTarget?.is_active ? "danger" : "primary"}
        confirmText={
          confirmToggleTarget?.is_active ? "Vô hiệu hóa" : "Kích hoạt"
        }
        onConfirm={handleToggleActive}
      />
    </div>
  );
}
