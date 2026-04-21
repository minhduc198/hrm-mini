export interface AttendanceSummary {
  total_hours: number;
  total_required_hours: number;
  late_minutes: number;
  early_leave_minutes: number;
  ot_hours: number;
  days_present: number;
  total_required_workdays: number;
}

export interface LeaveSummary {
  leave_type: string;
  balance: number;
  used_days: number;
  pending_days: number;
  remaining: number;
}

export interface RequestSummary {
  pending: number;
  approved: number;
}

export interface WorkingTrend {
  month: string;
  label: string;
  total_hours: number;
  total_required_hours: number;
  ot_hours: number;
  days_present: number;
  total_required_workdays: number;
}

export interface EmployeeStatistics {
  attendance_summary: AttendanceSummary;
  leave_summary: LeaveSummary[];
  request_summary: RequestSummary;
  working_trend: WorkingTrend[];
}
