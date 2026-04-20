import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";
import { leaveKeys } from "../query-key";
import {
  createLeaveRequest,
  getMyLeaveRequests,
  cancelLeaveRequest,
} from "../services";
import { CreateLeaveRequestPayload } from "../types";

export function useLeaveHistory(params: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: leaveKeys.myPaginated(params),
    queryFn: () => getMyLeaveRequests(params),
  });
}

export function useCreateLeaveRequest() {
  return useMutation({
    mutationFn: (payload: CreateLeaveRequestPayload) => createLeaveRequest(payload),
    onSuccess: () => {
      toast.success("Tạo đơn xin nghỉ thành công");
      queryClient.invalidateQueries({ queryKey: leaveKeys.my() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể tạo đơn xin nghỉ");
    },
  });
}

export function useCancelLeaveRequest() {
  return useMutation({
    mutationFn: (id: number) => cancelLeaveRequest(id),
    onSuccess: () => {
      toast.success("Đã hủy đơn xin nghỉ");
      queryClient.invalidateQueries({ queryKey: leaveKeys.my() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể hủy đơn xin nghỉ");
    },
  });
}
