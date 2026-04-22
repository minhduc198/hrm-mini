export interface AttendanceSummary {
  total_hours: number;
  total_required_hours: number;
  late_minutes: number;
  early_leave_minutes: number;
  ot_hours: number;
  days_present: number;
  total_required_workdays: number;
  unexcused_absent_days: number;
}

export interface LeaveSummary {
  leave_type: string;
  balance: number;
  used_days: number;
  is_paid: number;
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

export interface TodayOverview {
  total_employees: number;
  present: number;
  absent: number;
  on_leave: number;
  late: number;
  early_leave: number;
}

export interface AdminPendingActions {
  leave_requests: number;
}

export interface MonthlyOverview {
  total_working_hours: number;
  total_ot_hours: number;
  total_late_minutes: number;
}

export interface LateEmployee {
  user_id: number;
  total_late_minutes: number;
  occurrences: number;
  user: {
    id: number;
    name: string;
    empCode: string;
    avatar: string | null;
  };
}

export interface AdminStatistics {
  today: TodayOverview;
  pending_actions: AdminPendingActions;
  monthly_overview: MonthlyOverview;
  top_late_employees: LateEmployee[];
  timestamp: string;
}
