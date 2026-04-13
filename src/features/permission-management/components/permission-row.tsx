"use client";

import { PermissionAPIResponse, UserAPIResponse } from "../types/permission";
import { cn } from "@/lib/utils";
import { EmployeeSelector } from "./employee-selector";

interface PermissionRowProps {
  permission: PermissionAPIResponse;
  onAddEmployee: (employee: UserAPIResponse) => void;
  onRemoveEmployee: (employeeId: string) => void;
  depth?: number;
  className?: string;
}

export function PermissionRow({
  permission,
  onAddEmployee,
  onRemoveEmployee,
  depth = 0,
  className,
}: PermissionRowProps) {
  return (
    <div
      className={cn(
        "group/row flex items-stretch border-b border-line-subtle last:border-0 hover:bg-page/40 transition-colors duration-150",
        depth > 0 && "bg-page/10",
        className
      )}
    >
      {/* Left Column - Permission info */}
      <div className={cn(
        "w-1/2 py-4 px-6 border-r border-line flex flex-col justify-center",
        depth > 0 && "pl-12"
      )}>
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold tracking-tight text-base">{permission.name}</p>
        </div>
        {permission.description && (
          <p className="text-[11.5px] text-muted mt-1 leading-relaxed opacity-80">{permission.description}</p>
        )}
      </div>

      {/* Right Column - Employee selector */}
      <div className="w-1/2 relative px-6 py-2 flex items-center">
        <EmployeeSelector
          selectedEmployees={permission.users}
          onAddEmployee={onAddEmployee}
          onRemoveEmployee={onRemoveEmployee}
        />
      </div>
    </div>
  );
}
