import api from "@/lib/axios";
import { EmployeeStatistics } from "../types";

export const getPersonalStatistics = async (): Promise<EmployeeStatistics> => {
  const res = await api.get("/personal/statistics");
  return res.data;
};
