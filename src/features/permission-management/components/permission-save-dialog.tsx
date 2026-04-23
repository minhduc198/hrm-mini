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
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  UserPlus, 
  UserMinus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleAPIResponse, UserAPIResponse } from "../types/permission";
import { Typography } from "@/components/ui/typography";

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
  const diffs = useMemo(() => {
    const result: any[] = [];
    let totalAdded = 0;
    let totalRemoved = 0;

    modules.forEach((module) => {
      const initialModule = initialModules.find((m) => m.id === module.id);
      if (!initialModule) return;

      const moduleDiff: any = {
        id: module.id,
        name: module.name,
        permissions: [],
        addedCount: 0,
        removedCount: 0,
      };

      module.permissions.forEach((perm) => {
        const initialPerm = initialModule.permissions.find((p) => p.id === perm.id);
        if (!initialPerm) return;

        const addedUsers = perm.users.filter(
          (u) => !initialPerm.users.some((iu) => iu.id === u.id)
        );
        const removedUsers = initialPerm.users.filter(
          (iu) => !perm.users.some((u) => u.id === iu.id)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 border-b border-slate-100/60">
          <DialogTitle className="text-center text-lg font-bold text-slate-800">
            Xác nhận cập nhật quyền
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Summary Text */}
          <div className="text-center space-y-1">
             <Typography variant="p" className="text-sm text-slate-600">
                Bạn có <span className="font-bold text-primary">{totalChanges} thay đổi</span> quyền sẽ được áp dụng trên <span className="font-bold text-primary">{changedModulesCount} nhóm quyền</span>.
             </Typography>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-4">
            <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex flex-col items-center justify-center">
               <Typography className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
                  Thêm mới
               </Typography>
               <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span className="text-xl font-bold text-emerald-700">{diffs.totalAdded}</span>
               </div>
            </div>
            <div className="flex-1 bg-rose-50 border border-rose-100 rounded-lg p-3 flex flex-col items-center justify-center">
               <Typography className="text-xs font-medium text-rose-600 uppercase tracking-wider mb-1">
                  Gỡ bỏ
               </Typography>
               <div className="flex items-center gap-2">
                  <UserMinus className="w-4 h-4 text-rose-600" />
                  <span className="text-xl font-bold text-rose-700">{diffs.totalRemoved}</span>
               </div>
            </div>
          </div>

          {/* Detailed List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <AlertCircle className="w-4 h-4" />
              <Typography className="text-xs font-medium uppercase tracking-wider">Chi tiết thay đổi</Typography>
            </div>
            
            {diffs.modules.map((module) => (
              <div key={module.id} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                <div className="bg-white px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Typography className="text-sm font-bold text-slate-800">{module.name}</Typography>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                         {module.addedCount + module.removedCount} thay đổi
                      </span>
                   </div>
                   <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                
                <div className="p-4 space-y-4">
                  {module.permissions.map((perm: any) => (
                    <div key={perm.id} className="space-y-2">
                       <Typography as="div" className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          {perm.name}
                       </Typography>
                       
                       <div className="grid grid-cols-1 gap-2 ml-4">
                          {perm.addedUsers.map((user: UserAPIResponse) => (
                            <div key={user.id} className="flex items-center gap-2 text-[12px] text-emerald-600 bg-emerald-50/50 py-1.5 px-3 rounded-lg border border-emerald-100/50">
                               <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                               <span className="font-medium">{user.name}</span>
                               <span className="opacity-60">({user.email})</span>
                            </div>
                          ))}
                          
                          {perm.removedUsers.map((user: UserAPIResponse) => (
                            <div key={user.id} className="flex items-center gap-2 text-[12px] text-rose-600 bg-rose-50/50 py-1.5 px-3 rounded-lg border border-rose-100/50">
                               <XCircle className="w-3.5 h-3.5 shrink-0" />
                               <span className="font-medium">{user.name}</span>
                               <span className="opacity-60">({user.email})</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-slate-100/60 bg-slate-50/30 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-[2] bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20"
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
