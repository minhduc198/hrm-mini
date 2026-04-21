import { useQuery } from "@tanstack/react-query";
import { getAttendanceRecords } from "../api/get-attendance-records";
import { attendanceKeys } from "../queryKeys/attendance";

export function useGetAttendanceRecords(
  calendar_day_id?: number, 
  page: number = 1, 
  search: string = "",
  per_page: number = 15
) {
  return useQuery({
    queryKey: attendanceKeys.recordList({ calendar_day_id, page, search, per_page }),
    queryFn: async () => {
      const response = await getAttendanceRecords(calendar_day_id, page, search, per_page);
      return response;
    },
    placeholderData: (previousData, previousQuery) => {
      // Chỉ giữ lại dữ liệu cũ nếu vẫn đang ở cùng một ngày (đang search hoặc chuyển trang)
      const previousFilters = previousQuery?.queryKey[2] as any;
      if (previousFilters?.calendar_day_id === calendar_day_id) {
        return previousData;
      }
      // Nếu sang ngày mới, trả về undefined để hiện loading
      return undefined;
    },
  });
}
