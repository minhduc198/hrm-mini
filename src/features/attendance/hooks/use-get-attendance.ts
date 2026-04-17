import { useQuery } from "@tanstack/react-query";
import { getAttendanceData } from "../api/attendance-api";
import { attendanceKeys } from "../queryKeys/attendance";
import { AttendanceDayData } from "../types/attendance";

/**
 * Hook để lấy dữ liệu chấm công và thực hiện mapping/flattening
 */
export function useGetAttendance() {
  return useQuery({
    queryKey: attendanceKeys.lists(),
    queryFn: async () => {
      const response = await getAttendanceData();
      
      // Flatten dữ liệu từ nested Month -> Day thành flat array of Day
      // Giả sử backend trả về structure WorkMonthBE[] trong response.data
      const flatDays: AttendanceDayData[] = response.data.flatMap(month => month.days);
      
      return flatDays;
    },
    // Tránh re-fetch liên tục khi navigate qua lại
    staleTime: 1000 * 60 * 5, 
  });
}
