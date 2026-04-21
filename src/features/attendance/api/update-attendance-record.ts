import api from "@/lib/axios";
import { AttendanceRecordDetail, UpdateAttendanceData } from "../types/attendance";

export const updateAttendanceRecord = async (
  id: number,
  data: UpdateAttendanceData
): Promise<AttendanceRecordDetail> => {
  const response = await api.patch<AttendanceRecordDetail>(`/attendances/${id}`, data);
  return response.data;
};
