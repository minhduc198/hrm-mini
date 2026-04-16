export interface LeaveType {
  id: number;
  name: string;
  is_paid: boolean;
  default_days: number;
  allow_half_day: boolean;
  allow_hourly: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalanceInitPayload {
  user_ids: number[];
  leave_type_id: number;
  year: number;
  should_reset: boolean;
}
