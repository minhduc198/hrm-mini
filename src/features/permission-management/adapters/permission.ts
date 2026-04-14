import { ModuleAPIResponse, AllPermissionsResponseBE } from "../types/permission";
import { getInitials } from "../utils/employee";

export function mapPermissionModulesFromApi(dataObj: AllPermissionsResponseBE): ModuleAPIResponse[] {
  if (!dataObj) return [];

  return Object.keys(dataObj).map((key) => {
    const item = dataObj[key];
    
    return {
      id: item.module || key,
      name: item.module_name || key,
      permissions: (item.permissions || []).map((perm) => ({
        id: String(perm.id),
        name: perm.description, 
        code: perm.key,   
        users: (perm.users || []).map((user) => ({
          id: String(user.id),
          name: user.name,
          email: user.email,
          avatar: user.avatar_url || undefined,
          shortName: getInitials(user.name)
        }))
      }))
    };
  });
}
