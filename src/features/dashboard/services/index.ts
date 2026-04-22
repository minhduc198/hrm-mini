import api from "@/lib/axios";
import { EmployeeStatistics, AdminStatistics } from "../types";

export const getPersonalStatistics = async (): Promise<EmployeeStatistics> => {
  const res = await api.get("/personal/statistics");
  return res.data;
};

export const getAdminStatistics = async (): Promise<AdminStatistics> => {
  const res = await api.get("/admin/statistics");
  return res.data;
};
