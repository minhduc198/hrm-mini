import { ALL_PERMISSIONS } from "../constants/permissions";
import { PermissionItem } from "../types/permissions";


export const normalizePermissions = (
  rawPermissions: PermissionItem[] | undefined,
  role?: string
): string[] => {
  if (role === "admin" && (!rawPermissions || rawPermissions.length === 0)) {
    return [ALL_PERMISSIONS];
  }

  if (!rawPermissions) return [];

  return rawPermissions.map((p) => `${p.module}.${p.action}`);
};
