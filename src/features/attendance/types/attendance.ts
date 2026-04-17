export type AttendanceDayType = 'workday' | 'weekend' | 'holiday';

export interface AttendanceDayData {
  id?: number | string;
  work_date: string;
  day_type: AttendanceDayType;
  holiday_name?: string | null;
  note?: string | null;
  total_employees?: number;
  status?: {
    on_time: number;
    late: number;
    absent: number;
  };
  [key: string]: any;
}

export interface WorkMonthBE {
  id: number | string;
  year: number;
  month: number;
  total_workdays: number;
  note: string | null;
  days: AttendanceDayData[];
}

export interface GenerateAttendanceResponse {
  status: "success";
  message: string;
  data: WorkMonthBE[];
}
