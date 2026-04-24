import { useMutation } from "@tanstack/react-query";
import { updateAttendanceRecord } from "../api/update-attendance-record";
import { attendanceKeys } from "../queryKeys/attendance";
import { toast } from "sonner";
import { UpdateAttendanceData } from "@/features/attendance/types/attendance";
import { queryClient } from "@/lib/query-client";
import { handleError } from "@/utils/error-handler";

export function useUpdateAttendanceRecord() {

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAttendanceData }) =>
      updateAttendanceRecord(id, data),
    onSuccess: (updatedRecord) => {
      queryClient.setQueriesData(
        { queryKey: attendanceKeys.records() },
        (oldData: { data: { id: number }[] } | undefined) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) => 
              item.id === updatedRecord.id ? updatedRecord : item
            )
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      
      toast.success("Cập nhật chấm công thành công");
    },
    onError: (error: unknown) => {
      handleError(error, "Có lỗi xảy ra khi cập nhật");
    },
  });
}
