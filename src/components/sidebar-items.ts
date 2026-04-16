import { routes } from "@/constants/routes";
import { Users, CalendarDays, Clock, Shield } from "lucide-react";

export type Audience = "employee-only" | "admin-only";

export interface NavItem {
  key: string;
  label: string;
  url: string;
  icon: any;
  /** Module name used for module-level access check ("employee", "leave") */
  module?: string;
  /** Specific permission used for exact action-level access check */
  permission?: string;
  isEmployeeDefault?: boolean;
  audience?: Audience;
}

export const navItemsConfig: NavItem[] = [
  // --- Management tabs: shown when user has ANY permission in that module ---
  {
    key: "employees",
    label: "Quản lý nhân viên",
    url: routes.employeeManagement,
    icon: Users,
    module: "employee",
  },
  {
    key: "leave_manage",
    label: "Quản lý đơn xin nghỉ",
    url: routes.leave.manage,
    icon: CalendarDays,
    module: "leave",
  },
  {
    key: "attendance_manage",
    label: "Quản lý chấm công",
    url: routes.attendance.manage,
    icon: Clock,
    module: "attendance",
  },
  {
    key: "roles",
    label: "Quản lý phân quyền",
    url: routes.permissionManagement,
    icon: Shield,
    module: "permission",
  },
  // --- Employee default personal tabs: shown to all employees by default ---
  {
    key: "attendance_personal",
    label: "Chấm công",
    url: routes.attendance.personal,
    icon: Clock,
    isEmployeeDefault: true,
    audience: "employee-only",
  },
  {
    key: "leave_personal",
    label: "Xin nghỉ",
    url: routes.leave.personal,
    icon: CalendarDays,
    isEmployeeDefault: true,
    audience: "employee-only",
  },
];
