import { useQuery } from "@tanstack/react-query";
import { getMyAttendanceHistory } from "../api/get-my-attendance";
import { attendanceKeys } from "../queryKeys/attendance";

export function useGetMyAttendance() {
  return useQuery({
    queryKey: attendanceKeys.myList({}),
    queryFn: getMyAttendanceHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
