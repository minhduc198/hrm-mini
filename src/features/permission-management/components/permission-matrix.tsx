"use client";

import { useState, useCallback } from "react";
import { Permission, SelectedEmployee } from "../types/permission";
import { PERMISSION_MODULES } from "../constants/permissions";
import { ModuleSection } from "./module-section";
import { Button } from "@/components/ui/button";
import { Shield, Save } from "lucide-react";
import { toast } from "sonner";

export function PermissionMatrix() {
  const [employeesByPermission, setEmployeesByPermission] = useState<Map<Permission, SelectedEmployee[]>>(
    new Map()
  );

  const handleAddEmployee = useCallback((permission: Permission, employee: SelectedEmployee) => {
    setEmployeesByPermission((prev) => {
      const next = new Map(prev);
      const employees = next.get(permission) || [];
      if (!employees.find((e) => e.id === employee.id)) {
        next.set(permission, [...employees, employee]);
      }
      return next;
    });
  }, []);

  const handleRemoveEmployee = useCallback((permission: Permission, employeeId: string) => {
    setEmployeesByPermission((prev) => {
      const next = new Map(prev);
      const employees = next.get(permission) || [];
      next.set(permission, employees.filter((e) => e.id !== employeeId));
      return next;
    });
  }, []);

  const handleSavePermissions = () => {
    const totalEmployees = Array.from(employeesByPermission.values()).reduce(
      (sum, employees) => sum + employees.length,
      0
    );
    if (totalEmployees === 0) {
      toast.error("Vui lòng thêm ít nhất một nhân viên");
      return;
    }

    // TODO: Replace with actual API call
    toast.success(`Đã lưu phân quyền cho ${totalEmployees} nhân viên`);
    console.log("Saving permissions:", Object.fromEntries(employeesByPermission));
  };

  return (
    <div className="flex flex-col gap-6 h-full text-base">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-line">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-tint">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Quản lý phân quyền
            </h1>
            <p className="text-[13px] text-muted">
              Cấu hình quyền truy cập cho nhân viên một cách trực quan
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSavePermissions} 
          className="gap-2 bg-primary hover:bg-primary-hover text-primary-fg transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu phân quyền
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-5 flex-1 min-h-0">
        {PERMISSION_MODULES.map((module) => (
          <ModuleSection
            key={module.key}
            module={module}
            employeesByPermission={employeesByPermission}
            onAddEmployee={handleAddEmployee}
            onRemoveEmployee={handleRemoveEmployee}
          />
        ))}
      </div>
    </div>
  );
}
