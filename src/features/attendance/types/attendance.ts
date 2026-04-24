export type AttendanceDayType = 'workday' | 'weekend' | 'holiday';

export interface AttendanceDayData {
  id?: number | string;
  work_date: string;
  day_type: AttendanceDayType;
  check_in?: string | null;
  check_out?: string | null;
  holiday_name?: string | null;
  note?: string | null;
  total_employees?: number;
  total_hours?: string;
  late_minutes?: number;
  early_leave_minutes?: number;
  ot_hours?: string;
  is_completed?: boolean;
  is_edited?: boolean;
  status?: {
    on_time: number;
    late: number;
    absent: number;
    leave: number;
  } | string;
  leave_requests?: LeaveRequestBasic[];
  missing_hours?: number;
  is_sufficient?: boolean;
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

export interface CheckInData {
  user_id: number;
  work_date: string;
  calendar_day_id: number;
  rule_id: number;
  check_in: string;
  late_minutes: number;
  status: string;
  updated_at: string;
  created_at: string;
  id: number;
}

export interface CheckInResponse {
  message: string;
  data: CheckInData;
}

export interface MyAttendanceRecord {
  id: number;
  work_date: string;
  check_in: string | null;
  check_out: string | null;
  total_hours: string;
  late_minutes: number;
  early_leave_minutes: number;
  ot_hours: string;
  status: string;
  is_completed: boolean;
  is_edited: boolean;
  note: string | null;
  leave_requests?: LeaveRequestBasic[];
  missing_hours?: number;
  is_sufficient?: boolean;
}

export interface MyAttendanceResponse {
  data: MyAttendanceRecord[];
}

export interface CheckOutResponse {
  message: string;
  data: MyAttendanceRecord
}

export interface LeaveRequestBasic {
  id: number;
  leave_type: {
    id: number;
    name: string;
    is_paid: number;
  };
  request_scope: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  reason?: string;
  total_amount?: string;
  amount_unit?: string;
}

export interface AttendanceRecordDetail {
  id: number;
  work_date: string;
  check_in: string | null;
  check_out: string | null;
  total_hours: string;
  late_minutes: number;
  early_leave_minutes: number;
  ot_hours: string;
  status: string;
  is_completed: boolean;
  is_edited: boolean;
  note: string | null;
  user: {
    id: number;
    name: string;
    empCode: string;
  };
  leave_requests?: LeaveRequestBasic[];
}

export interface AttendanceRecordDetailResponse {
  data: AttendanceRecordDetail[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UpdateAttendanceData {
  check_in?: string | null;
  check_out?: string | null;
  note?: string | null;
}
