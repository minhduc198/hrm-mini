import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateNext3MonthsAttendance } from "../api/attendance-api";
import { attendanceKeys } from "../queryKeys/attendance";
import { toast } from "sonner";

export function useGenerateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateNext3MonthsAttendance,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      
      toast.success(response.message || "Đã tự động sinh lịch cho 3 tháng tới.", {
        description: "Lịch làm việc đã được cập nhật thành công.",
      });
    },
    onError: (error: any) => {
      toast.error("Không thể sinh lịch làm việc", {
        description: error?.response?.data?.message || "Vui lòng thử lại sau.",
      });
    }
  });
}
