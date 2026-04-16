import { routes } from "@/constants/routes";
import { Users, CalendarDays, Clock, Shield } from "lucide-react";

export type Audience = "employee-only" | "admin-only";

export interface NavItem {
  key: string;
  label: string;
  url: string;
  icon: any;
  permission?: string;
  isEmployeeDefault?: boolean;
  audience?: Audience;
}

export const navItemsConfig: NavItem[] = [
  {
    key: "employees",
    label: "Quản lý nhân viên",
    url: routes.employeeManagement,
    icon: Users,
    permission: "employee.view",
  },
  {
    key: "leave_manage",
    label: "Quản lý đơn xin nghỉ",
    url: routes.leave.manage,
    icon: CalendarDays,
    permission: "leave.manage",
  },
  {
    key: "attendance_manage",
    label: "Quản lý chấm công",
    url: routes.attendance.manage,
    icon: Clock,
    permission: "attendance.manage",
  },
  {
    key: "roles",
    label: "Quản lý phân quyền",
    url: routes.permissionManagement,
    icon: Shield,
    permission: "permission.manage",
  },
  // Employee specific personal views
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
