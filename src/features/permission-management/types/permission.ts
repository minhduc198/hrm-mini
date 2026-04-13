export type PermissionModule = "employee" | "attendance" | "leave";

export type Permission =
  // Employee Management
  | "EMPLOYEE_VIEW"
  | "EMPLOYEE_CREATE"
  | "EMPLOYEE_EDIT"
  | "EMPLOYEE_TOGGLE_STATUS"
  | "EMPLOYEE_EXPORT"
  // Attendance
  | "ATTENDANCE_VIEW_SELF" // always granted
  | "ATTENDANCE_VIEW_ALL"
  | "ATTENDANCE_EXPORT"
  // Leave
  | "LEAVE_VIEW_SELF" // always granted
  | "LEAVE_VIEW_ALL"
  | "LEAVE_PROCESS";

export interface PermissionDefinition {
  key: Permission;
  label: string;
  description?: string;
  alwaysGranted?: boolean;
}

export interface ModuleDefinition {
  key: PermissionModule;
  label: string;
  permissions: PermissionDefinition[];
}

export interface EmployeePermission {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  permissions: Permission[];
}

export interface SelectedEmployee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// --- API-ready Types ---

export interface UserAPIResponse {
  id: string;
  name: string;
  shortName: string;
  avatar?: string;
  email: string;
}

export interface PermissionAPIResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  users: UserAPIResponse[];
}

export interface ModuleAPIResponse {
  id: string;
  name: string;
  permissions: PermissionAPIResponse[];
}

export interface EmployeeSearchResult {
  id: string;
  name: string;
  email: string;
}
