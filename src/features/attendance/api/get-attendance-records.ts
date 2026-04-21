import api from "@/lib/axios";
import { AttendanceRecordDetailResponse } from "../types/attendance";

export const getAttendanceRecords = async (
  calendar_day_id?: number,
  page: number = 1,
  search: string = "",
  per_page: number = 15,
  status?: string,
  is_edited?: boolean,
  is_completed?: boolean
): Promise<AttendanceRecordDetailResponse> => {
  const response = await api.get<AttendanceRecordDetailResponse>("/attendances", { 
    params: { 
      calendar_day_id, 
      page, 
      search, 
      per_page,
      status,
      is_edited: is_edited === true ? 1 : is_edited === false ? 0 : undefined,
      is_completed: is_completed === true ? 1 : is_completed === false ? 0 : undefined
    } 
  });
  return response.data;
};
