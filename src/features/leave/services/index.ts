import api from "@/lib/axios";
import { CreateLeaveRequestPayload, LeaveRequestResponse } from "../types";

export const createLeaveRequest = async (
  payload: CreateLeaveRequestPayload,
): Promise<any> => {
  const res = await api.post("/leave-request", payload);
  return res.data;
};

export const getMyLeaveRequests = async (params: {
  page?: number;
  per_page?: number;
}): Promise<LeaveRequestResponse> => {
  const res = await api.get("/leave-request/my", { params });
  return res.data;
};

export const cancelLeaveRequest = async (id: number): Promise<any> => {
  const res = await api.post(`/leave-request/${id}/cancel`);
  return res.data;
};
