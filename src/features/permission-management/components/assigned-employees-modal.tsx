"use client";

import { UserGroupIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { UserAPIResponse } from "../types/permission";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserAvatar } from "@/components/common/avatar/user-avatar";

interface AssignedEmployeesModalProps {
  selectedEmployees: UserAPIResponse[];
  onRemoveEmployee: (employeeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignedEmployeesModal({
  selectedEmployees,
  onRemoveEmployee,
  isOpen,
  onClose,
}: AssignedEmployeesModalProps) {
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed z-50 bg-surface rounded-xl shadow-2xl border border-line overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col",
          isMobile
            ? "inset-x-4 top-1/2 -translate-y-1/2 max-h-[80vh]"
            : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-h-[70vh]"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-line flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={UserGroupIcon}
                className="w-5 h-5 text-primary"
                strokeWidth={2}
              />
              <Typography variant="label-sm" className="font-semibold">
                Nhân viên được phân quyền
              </Typography>
            </div>
            <Typography variant="tiny" className="text-muted">
              {selectedEmployees.length} nhân viên
            </Typography>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {selectedEmployees.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <HugeiconsIcon
                icon={UserGroupIcon}
                className="w-10 h-10 text-subtle-text/20 mb-2"
                strokeWidth={1}
              />
              <Typography
                variant="label-sm"
                className="font-medium text-muted"
              >
                Chưa có nhân viên nào được phân quyền
              </Typography>
            </div>
          ) : (
            <div className="space-y-1">
              {selectedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-page transition-all group"
                >
                  <UserAvatar
                    name={employee.name}
                    avatar={employee.avatar}
                    id={employee.id}
                    shortName={employee.shortName}
                  />

                  <div className="flex-1 min-w-0 space-x-2">
                    <Typography
                      variant="label-sm"
                      className="font-medium truncate"
                    >
                      {employee.name}
                    </Typography>
                    <Typography
                      variant="tiny"
                      className="text-muted truncate"
                    >
                      {employee.empCode || employee.id} ·{" "}
                      {employee.email}
                    </Typography>
                  </div>

                  <button
                    onClick={() => onRemoveEmployee(employee.id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-destructive hover:bg-destructive-tint opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    title="Xóa nhân viên"
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      className="w-4 h-4"
                      strokeWidth={2}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-page border-t border-line flex justify-end flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </>
  );
}