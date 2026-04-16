import api from "@/lib/axios";
import { LeaveType, LeaveBalanceInitPayload } from "../types";

export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  const res = await api.get("/leave-type");
  return res.data.data;
};

export const initLeaveBalance = async (
  data: LeaveBalanceInitPayload,
): Promise<{ message: string }> => {
  const res = await api.post("/leave-balance/init", data);
  return res.data;
};
