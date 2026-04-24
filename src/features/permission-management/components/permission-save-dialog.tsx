"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { ModuleAPIResponse, UserAPIResponse } from "../types/permission";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface PermissionDiff {
  id: string;
  name: string;
  addedUsers: UserAPIResponse[];
  removedUsers: UserAPIResponse[];
}

interface ModuleDiff {
  id: string;
  name: string;
  permissions: PermissionDiff[];
  addedCount: number;
  removedCount: number;
}

interface PermissionSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: ModuleAPIResponse[];
  initialModules: ModuleAPIResponse[];
  onConfirm: () => void;
  isLoading: boolean;
}

export function PermissionSaveDialog({
  open,
  onOpenChange,
  modules,
  initialModules,
  onConfirm,
  isLoading,
}: PermissionSaveDialogProps) {
  const [showDetails, setShowDetails] = React.useState(true);
  const [expandedModuleIds, setExpandedModuleIds] = React.useState<string[]>([]);

  const diffs = useMemo(() => {
    const result: ModuleDiff[] = [];
    let totalAdded = 0;
    let totalRemoved = 0;

    modules.forEach((module) => {
      const initialModule = initialModules.find((m) => m.id === module.id);
      if (!initialModule) return;

      const moduleDiff: ModuleDiff = {
        id: module.id,
        name: module.name,
        permissions: [],
        addedCount: 0,
        removedCount: 0,
      };

      module.permissions.forEach((perm) => {
        const initialPerm = initialModule.permissions.find(
          (p) => p.id === perm.id,
        );
        if (!initialPerm) return;

        const addedUsers = perm.users.filter(
          (u) => !initialPerm.users.some((iu) => iu.id === u.id),
        );
        const removedUsers = initialPerm.users.filter(
          (iu) => !perm.users.some((u) => u.id === iu.id),
        );

        if (addedUsers.length > 0 || removedUsers.length > 0) {
          moduleDiff.permissions.push({
            id: perm.id,
            name: perm.name,
            addedUsers,
            removedUsers,
          });
          moduleDiff.addedCount += addedUsers.length;
          moduleDiff.removedCount += removedUsers.length;
          totalAdded += addedUsers.length;
          totalRemoved += removedUsers.length;
        }
      });

      if (moduleDiff.permissions.length > 0) {
        result.push(moduleDiff);
      }
    });

    return { modules: result, totalAdded, totalRemoved };
  }, [modules, initialModules]);

  const totalChanges = diffs.totalAdded + diffs.totalRemoved;
  const changedModulesCount = diffs.modules.length;

  // Initialize/Update expanded modules when global toggle or data changes
  React.useEffect(() => {
    if (showDetails) {
      setExpandedModuleIds(diffs.modules.map((m) => m.id));
    } else {
      setExpandedModuleIds([]);
    }
  }, [showDetails, diffs.modules]);

  const toggleModule = (id: string) => {
    setExpandedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-5xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 border-b border-slate-100/60">
          <DialogTitle className="text-center text-lg font-bold text-slate-800">
            Xác nhận cập nhật quyền
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 space-y-6 no-scrollbar">
          {/* Summary Text */}
          <div className="text-center space-y-4 mb-2">
            <Typography variant="p" className="text-slate-500 font-medium">
              Bạn có <Typography as="span" variant="p" className="text-slate-800 font-bold">{totalChanges} thay đổi nhân viên</Typography> sẽ được áp dụng trên <Typography as="span" variant="p" className="text-slate-800 font-bold">{changedModulesCount} nhóm quyền</Typography>.
            </Typography>

            {/* Split Summary Bar */}
            <div className="flex w-full rounded-md overflow-hidden h-9 shadow-sm border border-slate-100">
               <div className="flex-1 bg-emerald-50 text-emerald-700 px-4 flex items-center justify-center gap-2 border-r border-white">
                  <Plus className="w-3.5 h-3.5" />
                  <Typography variant="label" className="text-emerald-700">
                    {diffs.totalAdded} nhân viên được gán
                  </Typography>
               </div>
               <div className="flex-1 bg-rose-50 text-rose-700 px-4 flex items-center justify-center gap-2">
                  <Minus className="w-3.5 h-3.5" />
                  <Typography variant="label" className="text-rose-700">
                    {diffs.totalRemoved} nhân viên bị gỡ
                  </Typography>
               </div>
            </div>

            {/* Details Toggle */}
            <div className="flex items-center space-x-2 pt-2 ml-1">
              <Checkbox 
                id="show-details" 
                checked={showDetails} 
                onCheckedChange={(checked) => setShowDetails(checked as boolean)}
                className="rounded-sm border-slate-300"
              />
              <Label 
                htmlFor="show-details" 
                className="cursor-pointer select-none"
              >
                <Typography variant="label" className="text-slate-600 font-medium">
                  Hiển thị chi tiết thay đổi
                </Typography>
              </Label>
            </div>
          </div>

          {/* Detailed List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <AlertCircle className="w-4 h-4" />
              <Typography variant="label-xs" className="uppercase tracking-wider font-bold">
                Chi tiết thay đổi
              </Typography>
            </div>

            {diffs.modules.map((module) => (
              <div
                key={module.id}
                className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div
                  onClick={() => toggleModule(module.id)}
                  className="bg-slate-50/50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Typography variant="p" className="font-semibold text-slate-700">
                      {module.name}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Typography variant="small" className="text-slate-400 font-medium">
                        {module.addedCount + module.removedCount} thay đổi
                      </Typography>
                      <div className="flex items-center gap-1.5 ml-1">
                        {module.addedCount > 0 && (
                          <Typography variant="small" className="text-emerald-600 font-bold">
                            +{module.addedCount} gán mới
                          </Typography>
                        )}
                        {module.removedCount > 0 && (
                          <Typography variant="small" className="text-rose-600 font-bold">
                            -{module.removedCount} gỡ bỏ
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all duration-200",
                      expandedModuleIds.includes(module.id) && "rotate-180",
                    )}
                  />
                </div>

                {expandedModuleIds.includes(module.id) && (
                  <div className="divide-y divide-slate-100">
                    {module.permissions.map((perm: PermissionDiff) => (
                      <div key={perm.id} className="grid grid-cols-2 min-h-[40px]">
                        {/* Added Side */}
                        <div className="p-3 pl-6 border-r border-slate-100 space-y-1.5">
                          {perm.addedUsers.length > 0 && (
                            <div className="space-y-1">
                               <Typography variant="label" className="text-slate-500 font-bold mb-1 block">
                                  — {perm.name}
                                </Typography>
                               {perm.addedUsers.map((user: UserAPIResponse) => (
                                <div key={user.id} className="flex items-center gap-2 text-emerald-600 py-1">
                                  <Plus className="w-3 h-3 shrink-0" />
                                  <Typography variant="label-sm" className="font-medium text-emerald-600">
                                    {user.name}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Removed Side */}
                        <div className="p-3 pl-6 space-y-1.5">
                          {perm.removedUsers.length > 0 && (
                            <div className="space-y-1">
                               <Typography variant="label" className="text-slate-500 font-bold mb-1 block">
                                  — {perm.name}
                                </Typography>
                               {perm.removedUsers.map((user: UserAPIResponse) => (
                                <div key={user.id} className="flex items-center gap-2 text-rose-600 py-1">
                                  <Minus className="w-3 h-3 shrink-0" />
                                  <Typography variant="label-sm" className="font-medium text-rose-600">
                                    {user.name}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-slate-100/60 bg-slate-50/30 gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm min-w-[100px]"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 min-w-[160px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác Nhận Cập Nhật"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
