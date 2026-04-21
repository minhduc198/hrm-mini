import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
    placeholderData: keepPreviousData,
  });
}
