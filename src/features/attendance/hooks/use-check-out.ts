import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler";
import { queryClient } from "@/lib/query-client";
import { attendanceKeys } from "../queryKeys/attendance";
import { checkOut } from "../api/check-out";

export function useCheckOut() {
  return useMutation({
    mutationFn: checkOut,
    onSuccess: async (res) => {
      toast.success(res.message || "Check-out thành công");

      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
    onError: (error) => {
      handleError(error, "Lỗi khi thực hiện check-out");
    },
  });
}
