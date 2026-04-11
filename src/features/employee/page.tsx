
import { ConfirmDialog } from "@/components/common/feedback/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { EmployeeDialog } from "@/features/employee/components/EmployeeDialog";
import { EmployeeTable } from "@/features/employee/components/EmployeeTable";
import {
  useCreateEmployee,
  useEmployees,
  useUpdateEmployee,
} from "@/features/employee/hooks/use-employees";
import {
  AddEmployeeValues,
  EditEmployeeValues,
} from "@/features/employee/schemas";
import { Employee } from "@/features/employee/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type RoleFilter = "all" | "admin" | "employee";
type StatusFilter = "all" | "active" | "inactive";

export default function EmployeeManagePage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [confirmToggleTarget, setConfirmToggleTarget] =
    useState<Employee | null>(null);

  // Queries & Mutations
  const { data, isLoading } = useEmployees({
    name: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    is_active:
      statusFilter === "all"
        ? undefined
        : statusFilter === "active"
          ? true
          : false,
  });

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const employees = data?.data || [];
  const totalEmployees = data?.meta?.total || 0;

  const stats = useMemo(
    () => ({
      total: totalEmployees,
      admins: employees.filter((e) => e.role === "admin").length, // This is a rough estimation based on current page
      active: employees.filter((e) => e.is_active).length,
      inactive: employees.filter((e) => !e.is_active).length,
    }),
    [employees, totalEmployees],
  );

  const hasFilter =
    search.length > 0 || roleFilter !== "all" || statusFilter !== "all";

  function resetFilters() {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  async function handleAdd(values: AddEmployeeValues) {
    try {
      await createMutation.mutateAsync({
        ...values,
        role: "employee", // Default to employee
      });
      toast.success("Thêm nhân viên thành công");
      setAddOpen(false);
    } catch (error) {
      toast.error("Không thể thêm nhân viên");
    }
  }

  async function handleEdit(id: number, values: EditEmployeeValues) {
    try {
      await updateMutation.mutateAsync({
        id,
        ...values,
      });
      toast.success("Cập nhật thông tin thành công");
      setEditTarget(null);
    } catch (error) {
      toast.error("Không thể cập nhật thông tin");
    }
  }

  async function handleToggleActive() {
    if (!confirmToggleTarget) return;
    try {
      await updateMutation.mutateAsync({
        id: confirmToggleTarget.id,
        is_active: !confirmToggleTarget.is_active,
      });
      toast.success(
        confirmToggleTarget.is_active
          ? "Đã vô hiệu hóa nhân viên"
          : "Đã kích hoạt nhân viên",
      );
      setConfirmToggleTarget(null);
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
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

          {hasFilter && !isLoading && (
            <div className="text-[11px] font-medium text-muted-foreground bg-gray-100/50 px-2 py-1 rounded-md">
              <span className="text-foreground">{employees.length}</span> /{" "}
              {totalEmployees}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <Typography variant="small" className="text-muted-foreground">
            Đang tải dữ liệu...
          </Typography>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={(emp) => setEditTarget(emp)}
          onToggleActive={(emp) => setConfirmToggleTarget(emp)}
        />
      )}

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
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
