import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leavePolicyKeys } from "../query-key/leave-policy.query-key";
import {
  createLeaveType,
  deleteLeaveType,
  getLeaveTypes,
  initLeaveBalance,
  updateLeaveType,
} from "../services";
import {
  CreateLeaveTypePayload,
  LeaveBalanceInitPayload,
  UpdateLeaveTypePayload,
} from "../types";

export function useLeavePolicy() {
  const queryClient = useQueryClient();

  const leaveTypesQuery = useQuery({
    queryKey: leavePolicyKeys.list(),
    queryFn: getLeaveTypes,
  });

  const createLeaveTypeMutation = useMutation({
    mutationFn: (payload: CreateLeaveTypePayload) => createLeaveType(payload),
    onSuccess: () => {
      toast.success("Thêm loại nghỉ phép thành công");
      queryClient.invalidateQueries({ queryKey: leavePolicyKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể thêm loại nghỉ phép",
      );
    },
  });

  const updateLeaveTypeMutation = useMutation({
    mutationFn: (payload: UpdateLeaveTypePayload) => updateLeaveType(payload),
    onSuccess: () => {
      toast.success("Cập nhật loại nghỉ phép thành công");
      queryClient.invalidateQueries({ queryKey: leavePolicyKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật loại nghỉ phép",
      );
    },
  });

  const deleteLeaveTypeMutation = useMutation({
    mutationFn: (id: number) => deleteLeaveType(id),
    onSuccess: () => {
      toast.success("Xóa loại nghỉ phép thành công");
      queryClient.invalidateQueries({ queryKey: leavePolicyKeys.all });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể xóa loại nghỉ phép",
      );
    },
  });

  const initLeaveBalanceMutation = useMutation({
    mutationFn: (payload: LeaveBalanceInitPayload) => initLeaveBalance(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Khởi tạo ngày phép thành công");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể khởi tạo ngày phép",
      );
    },
  });

  return {
    leaveTypes: leaveTypesQuery.data ?? [],
    isLoading: leaveTypesQuery.isLoading,
    isFetching: leaveTypesQuery.isFetching,
    createLeaveType: createLeaveTypeMutation.mutate,
    updateLeaveType: updateLeaveTypeMutation.mutate,
    deleteLeaveType: deleteLeaveTypeMutation.mutate,
    initLeaveBalance: initLeaveBalanceMutation.mutate,
    isCreating: createLeaveTypeMutation.isPending,
    isUpdating: updateLeaveTypeMutation.isPending,
    isDeleting: deleteLeaveTypeMutation.isPending,
    isInitializing: initLeaveBalanceMutation.isPending,
  };
}
