"use client";

import { usePermissionMatrix } from "../hooks/use-permission-matrix";
import { ModuleSection } from "./module-section";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Shield, Save, Loader2 } from "lucide-react";

export function PermissionMatrix() {
  const { 
    modules, 
    handleAddEmployee, 
    handleRemoveEmployee, 
    handleSave, 
    isSaving 
  } = usePermissionMatrix();

  return (
    <div className="flex flex-col gap-6 h-full text-base">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-line">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-tint">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Typography variant="h4" className="text-lg font-bold">
              Quản lý phân quyền
            </Typography>
            <Typography variant="small" className="text-muted leading-none text-xs">
              Cấu hình quyền truy cập cho nhân viên một cách trực quan
            </Typography>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gap-2 bg-primary hover:bg-primary-hover text-primary-fg transition-colors min-w-[140px]"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Đang lưu..." : "Lưu phân quyền"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar pb-10">
        {modules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            onAddEmployee={handleAddEmployee}
            onRemoveEmployee={handleRemoveEmployee}
          />
        ))}
      </div>
    </div>
  );
}
