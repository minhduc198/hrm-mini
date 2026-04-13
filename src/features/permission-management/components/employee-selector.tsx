"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search01Icon, UserGroupIcon, Cancel01Icon, PlusSignIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SelectedEmployee } from "../types/permission";
import { MOCK_EMPLOYEES, getInitials, getAvatarColor } from "../utils/employee";

interface EmployeeSelectorProps {
  selectedEmployees: SelectedEmployee[];
  onAddEmployee: (employee: SelectedEmployee) => void;
  onRemoveEmployee: (employeeId: string) => void;
}

const MAX_VISIBLE_AVATARS = 10;

export function EmployeeSelector({
  selectedEmployees,
  onAddEmployee,
  onRemoveEmployee,
}: EmployeeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out employees who are already selected and match search query
  const availableEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter((emp) => {
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

  const visibleSelected = selectedEmployees.slice(0, MAX_VISIBLE_AVATARS);
  const hiddenCount = selectedEmployees.length - MAX_VISIBLE_AVATARS;

  const handleSelect = (employee: SelectedEmployee) => {
    onAddEmployee(employee);
    setSearchQuery("");
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 py-1 relative" ref={containerRef}>
        {/* Selected Employees List */}
        <div className="flex items-center gap-1.5 mr-1">
          {visibleSelected.map((employee) => (
            <Tooltip key={employee.id}>
              <TooltipTrigger asChild>
                <div className="group/avatar relative">
                  <button
                    onClick={() => onRemoveEmployee(employee.id)}
                    className="relative block transition-transform active:scale-95"
                  >
                    <Avatar className="w-8 h-8 border-2 border-surface shadow-sm ring-1 ring-line/50 cursor-pointer">
                      {employee.avatar ? (
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                      ) : (
                        <AvatarFallback className={cn("text-[10px] font-bold text-white", getAvatarColor(employee.id))}>
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {/* Remove overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-danger/70 opacity-0 group-hover/avatar:opacity-100 transition-all duration-200">
                      <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </div>
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={2}
                className="bg-base text-white text-[11px] font-medium border-none px-3 pt-1.5 shadow-2xl z-[100]"
              >
                {employee.name}
                <TooltipArrow className="bg-base fill-base" />
              </TooltipContent>
            </Tooltip>
          ))}

        {hiddenCount > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full bg-subtle text-[10px] font-bold text-muted border border-line hover:bg-subtle/80 transition-colors flex items-center justify-center"
          >
            +{hiddenCount}
          </button>
        )}
      </div>

      {/* Add Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-8 w-8 p-0 rounded-full border-line transition-all group shadow-sm",
          isOpen ? "bg-primary-tint border-primary-border text-primary" : "hover:bg-primary-tint hover:border-primary-border hover:text-primary"
        )}
      >
        <HugeiconsIcon 
          icon={PlusSignIcon} 
          className={cn("w-4 h-4 transition-transform duration-300", isOpen ? "rotate-45" : "group-hover:rotate-90")} 
          strokeWidth={2.5} 
        />
      </Button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[310px] bg-surface rounded-2xl shadow-2xl border border-line z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col bg-surface">
            {/* Header */}
            <div className="p-4 pb-2">
              <p className="text-[13px] font-bold flex items-center gap-2 text-base">
                <HugeiconsIcon icon={UserGroupIcon} className="w-4.5 h-4.5 text-primary" strokeWidth={2.5} />
                Thêm nhân viên phân quyền
              </p>
            </div>

            {/* Search Input */}
            <div className="px-3 py-2">
              <div className="relative group">
                <HugeiconsIcon 
                  icon={Search01Icon} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle-text group-focus-within:text-primary transition-colors" 
                  strokeWidth={2}
                />
                <Input
                  placeholder="Tìm nhân viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-page border-line focus-visible:ring-primary/10 focus-visible:border-primary rounded-xl text-[12px] transition-all placeholder:text-subtle-text/70 shadow-none"
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="p-1 max-h-[200px] overflow-y-auto no-scrollbar">
              {availableEmployees.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <HugeiconsIcon icon={UserGroupIcon} className="w-8 h-8 text-subtle-text/20 mb-2" strokeWidth={1} />
                  <p className="text-[12px] font-medium text-muted">Không tìm thấy nhân viên</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {availableEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => handleSelect(employee)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-page transition-all text-left group border border-transparent active:scale-[0.98] origin-left"
                    >
                      <Avatar className="w-8 h-8 shadow-sm border border-line/10 flex-shrink-0">
                        {employee.avatar ? (
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                        ) : (
                          <AvatarFallback className={cn("text-[9px] font-bold text-white", getAvatarColor(employee.id))}>
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-base group-hover:text-primary transition-colors truncate leading-tight">
                          {employee.name}
                        </p>
                        <p className="text-[10px] text-muted truncate leading-tight">
                          {employee.id} · {employee.email}
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-subtle-text group-hover:text-primary group-hover:bg-primary-tint opacity-0 group-hover:opacity-100 transition-all">
                        <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                    </button>
                  ))}
                </div>
              ) }
            </div>
            
            {/* Footer */}
            <div className="px-3 py-2 bg-page border-t border-line flex items-center justify-between">
              <span className="text-[10px] text-muted font-medium">
                {selectedEmployees.length} nhân viên
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] font-bold text-primary hover:bg-primary-tint px-1.5"
                onClick={() => setIsOpen(false)}
              >
                Hoàn tất
              </Button>
            </div>
          </div>
          {/* Arrow pointing up */}
          <div className="absolute right-[10px] top-[-6px] w-3 h-3 bg-surface border-l border-t border-line rotate-45" />
        </div>
      )}
      </div>
    </TooltipProvider>
  );
}
