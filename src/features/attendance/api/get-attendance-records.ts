import api from "@/lib/axios";
import { AttendanceRecordDetailResponse } from "../types/attendance";

export const getAttendanceRecords = async (
  calendar_day_id?: number,
  page: number = 1,
  search: string = "",
  per_page: number = 15
): Promise<AttendanceRecordDetailResponse> => {
  const response = await api.get<AttendanceRecordDetailResponse>("/attendances", { 
    params: { calendar_day_id, page, search, per_page } 
  });
  return response.data;
};
