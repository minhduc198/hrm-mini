import { useQuery } from "@tanstack/react-query";
import { getAttendanceRecords } from "../api/get-attendance-records";
import { attendanceKeys } from "../queryKeys/attendance";

export function useGetAttendanceRecords(
  calendar_day_id?: number, 
  page: number = 1, 
  search: string = "",
  per_page: number = 15,
  status?: string,
  is_edited?: boolean,
  is_completed?: boolean
) {
  return useQuery({
    queryKey: attendanceKeys.recordList({ calendar_day_id, page, search, per_page, status, is_edited, is_completed }),
    queryFn: async () => {
      const response = await getAttendanceRecords(calendar_day_id, page, search, per_page, status, is_edited, is_completed);
      return response;
    },
    placeholderData: (previousData, previousQuery) => {
      const previousFilters = previousQuery?.queryKey[2] as Record<string, unknown> | undefined;
      const currentFilters = { calendar_day_id, status, is_edited, is_completed };
      
      // Chỉ giữ lại dữ liệu cũ nếu đang ở cùng một ngày VÀ cùng bộ lọc (chỉ search hoặc chuyển trang)
      const isSameContext = 
        previousFilters?.calendar_day_id === currentFilters.calendar_day_id &&
        previousFilters?.status === currentFilters.status &&
        previousFilters?.is_edited === currentFilters.is_edited &&
        previousFilters?.is_completed === currentFilters.is_completed;

      if (isSameContext) {
        return previousData;
      }
      return undefined;
    },
  });
}
