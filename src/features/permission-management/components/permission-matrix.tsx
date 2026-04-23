"use client";

import { usePermissionMatrix } from "../hooks/use-permission-matrix";
import { ModuleSection } from "./module-section";
import { Button } from "@/components/ui/button";
import { Shield, Save, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/common/feedback/ConfirmDialog";
import { PageHeader } from "@/components/common/layout/page-header";
import { cn } from "@/lib/utils";

export function PermissionMatrix() {
  const { 
    modules, 
    handleAddEmployee, 
    handleRemoveEmployee, 
    handleSave, 
    isSaving,
    isLoading,
    isDirty,
    showConfirm,
    confirmNavigation,
    cancelNavigation,
    error
  } = usePermissionMatrix();

  return (
    <div className="flex flex-col h-full">
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={(open) => !open && cancelNavigation()}
        title="Thay đổi chưa lưu"
        description="Bạn có các thay đổi phân quyền chưa được lưu. Bạn có chắc chắn muốn rời đi mà không lưu không?"
        confirmText="Rời đi"
        cancelText="Ở lại"
        onConfirm={confirmNavigation}
        variant="danger"
      />
      <PageHeader
        title="Quản lý phân quyền"
        description="Cấu hình quyền truy cập cho nhân viên một cách trực quan"
        icon={Shield}
        actions={
          <Button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={cn(
              "gap-2 transition-all min-w-[140px]",
              isDirty 
                ? "bg-primary hover:bg-primary-hover text-primary-fg shadow-md" 
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Đang lưu..." : isDirty ? "Lưu thay đổi" : "Đã lưu"}
          </Button>
        }
      />

      {/* Main Content - scrollable wrapper */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar pb-10">
        {isLoading && modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Đang tải dữ liệu phân quyền...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-destructive">
            <p className="text-sm font-medium">Có lỗi xảy ra khi tải dữ liệu</p>
            <p className="text-xs opacity-80">{error.message}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {modules.map((module) => (
              <ModuleSection
                key={module.id}
                module={module}
                onAddEmployee={handleAddEmployee}
                onRemoveEmployee={handleRemoveEmployee}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
