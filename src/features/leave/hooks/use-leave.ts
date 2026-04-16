import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getLeaveTypes, initLeaveBalance } from "../services";
import { LeaveBalanceInitPayload } from "../types";

export const leaveKeys = {
  all: ["leave"] as const,
  types: () => [...leaveKeys.all, "types"] as const,
};

export const useLeaveTypes = () => {
  return useQuery({
    queryKey: leaveKeys.types(),
    queryKeyHashFn: () => "leave-types", // Optional: force a specific hash if needed
    queryFn: getLeaveTypes,
  });
};

export const useInitLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LeaveBalanceInitPayload) => initLeaveBalance(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Khởi tạo ngày phép thành công");
      // Invalidate employee lists to show updated balances
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể khởi tạo ngày phép");
    },
  });
};
