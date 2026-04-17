import api from "@/lib/axios";
import { GenerateAttendanceResponse } from "../types/attendance";

/**
 * Sinh lịch làm việc cho 3 tháng tiếp theo
 */
export const generateNext3MonthsAttendance = async (): Promise<GenerateAttendanceResponse> => {
  const response = await api.post<GenerateAttendanceResponse>("/work-months/generate-next-3");
  return response.data;
};

/**
 * Lấy dữ liệu lịch chấm công (Giả định endpoint)
 * Nếu chưa có endpoint thật, đây là nơi sẽ thay khớp sau này
 */
export const getAttendanceData = async (): Promise<GenerateAttendanceResponse> => {
  const response = await api.get<GenerateAttendanceResponse>("/work-months");
  return response.data;
};
