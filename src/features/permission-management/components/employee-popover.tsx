"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search01Icon, UserGroupIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { UserAPIResponse } from "../types/permission";
import { MOCK_EMPLOYEES, getInitials, getAvatarColor } from "../utils/employee";

interface EmployeePopoverProps {
  selectedEmployees: UserAPIResponse[];
  onSelect: (employee: UserAPIResponse) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeePopover({
  selectedEmployees,
  onSelect,
  isOpen,
  onClose,
}: EmployeePopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out employees who are already selected and match search query
  const availableEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.map(emp => ({
      ...emp,
      shortName: getInitials(emp.name)
    })).filter((emp) => {
      const isAlreadySelected = selectedEmployees.some((s) => s.id === emp.id);
      if (isAlreadySelected) return false;

      const searchLower = searchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.id.toLowerCase().includes(searchLower)
      );
    });
  }, [selectedEmployees, searchQuery]);

  const handleSelect = (employee: UserAPIResponse) => {
    onSelect(employee);
    setSearchQuery("");
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-full mt-1.5 w-[280px] bg-surface rounded-xl shadow-2xl border border-line z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      ref={containerRef}
    >
      <div className="flex flex-col bg-surface">
        {/* Header */}
        <div className="px-3 pb-1.5 pt-3">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={UserGroupIcon} className="w-4 h-4 text-primary" strokeWidth={2.5} />
            <Typography variant="label-sm" className="text-sm leading-none">
              Thêm nhân viên phân quyền
            </Typography>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-2.5 py-1.5">
          <div className="relative group">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-subtle-text group-focus-within:text-primary transition-colors"
              strokeWidth={2}
            />
            <Input
              placeholder="Tìm nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 bg-page border-line focus-visible:ring-primary/10 focus-visible:border-primary rounded-lg text-xs transition-all placeholder:text-subtle-text/70 shadow-none"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="px-1 py-0.5 max-h-[180px] overflow-y-auto no-scrollbar">
          {availableEmployees.length === 0 ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <HugeiconsIcon icon={UserGroupIcon} className="w-7 h-7 text-subtle-text/20 mb-1.5" strokeWidth={1} />
              <Typography variant="label-xs" className="font-medium text-muted">
                Không tìm thấy nhân viên
              </Typography>
            </div>
          ) : (
            <div className="space-y-0.5">
              {availableEmployees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-page transition-all text-left group border border-transparent active:scale-[0.98] origin-left"
                >
                  <Avatar className="w-7 h-7 shadow-sm border border-line/10 flex-shrink-0">
                    {employee.avatar ? (
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                    ) : (
                      <AvatarFallback className={cn("text-[9px] font-bold text-white", getAvatarColor(employee.id))}>
                        {employee.shortName || getInitials(employee.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography variant="label-xs" className="text-sm group-hover:text-primary transition-colors truncate leading-tight block">
                      {employee.name}
                    </Typography>
                    <Typography variant="tiny" className="text-muted truncate leading-tight block font-normal">
                      {employee.id} · {employee.email}
                    </Typography>
                  </div>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-subtle-text group-hover:text-primary group-hover:bg-primary-tint opacity-0 group-hover:opacity-100 transition-all">
                    <HugeiconsIcon icon={Add01Icon} className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-2.5 py-1.5 bg-page border-t border-line flex items-center justify-between">
          <Typography variant="tiny" className="font-medium text-muted">
            {selectedEmployees.length} nhân viên
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 text-[10px] font-bold text-primary hover:bg-primary-tint px-1.5"
            onClick={onClose}
          >
            Hoàn tất
          </Button>
        </div>
      </div>
      {/* Arrow pointing up */}
      <div className="absolute right-[10px] top-[-6px] w-3 h-3 bg-surface border-l border-t border-line rotate-45" />
    </div>
  );
}
