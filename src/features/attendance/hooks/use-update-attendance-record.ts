import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttendanceRecord, UpdateAttendanceData } from "../api/update-attendance-record";
import { attendanceKeys } from "../queryKeys/attendance";
import { toast } from "sonner";

export function useUpdateAttendanceRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAttendanceData }) =>
      updateAttendanceRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.records() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.my() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      
      toast.success("Cập nhật chấm công thành công");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
      toast.error(message);
    },
  });
}
