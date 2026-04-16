import api from "@/lib/axios";
import { PermissionResponse } from "../types/permissions";

export const getPermissions = async (userId: string | number) => {
  const response = await api.get<PermissionResponse>(`/employees/${userId}/permissions`);
  return response.data.data.permissions;
};
