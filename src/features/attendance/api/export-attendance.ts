import api from "@/lib/axios";
import { AttendanceExportFormValues } from "../schemas/export";
import { format } from "date-fns";
import { AttendanceRecordDetail } from "../types/attendance";

export const exportAttendanceData = async (filters: AttendanceExportFormValues): Promise<AttendanceRecordDetail[]> => {
  const params = new URLSearchParams();

  if (filters.type === "month" && filters.month) {
    params.append("month", format(new Date(filters.month), "yyyy-MM"));
  } else if (filters.type === "date" && filters.date) {
    params.append("date", format(new Date(filters.date), "yyyy-MM-dd"));
  } else if (filters.type === "range" && filters.from_date && filters.to_date) {
    params.append("from_date", format(new Date(filters.from_date), "yyyy-MM-dd"));
    params.append("to_date", format(new Date(filters.to_date), "yyyy-MM-dd"));
  }

  if (filters.status && filters.status.length > 0) {
    filters.status.forEach(s => params.append("status[]", s));
  }

  if (filters.is_edited) {
    params.append("is_edited", "1");
  }

  // We use the normal index route but with filters and no pagination (or large per_page)
  // to get the raw data for excel generation.
  const response = await api.get<{ data: AttendanceRecordDetail[] }>("/attendances", {
    params: {
      ...Object.fromEntries(params.entries()),
      per_page: 9999, // Get all records matching filters
    }
  });

  return response.data.data;
};
