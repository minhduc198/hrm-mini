import { useState, useCallback } from "react";
import { UserAPIResponse, ModuleAPIResponse } from "../types/permission";
import { PERMISSIONS_MOCK } from "../mocks/permissions";
import { useSavePermissions } from "./use-save-permissions";
import { toast } from "sonner";

export function usePermissionMatrix() {
  // We store the data as it comes from API (grouped by module)
  // But we use a state for the entire structure to allow local updates
  const [data, setData] = useState<ModuleAPIResponse[]>(PERMISSIONS_MOCK);

  const saveMutation = useSavePermissions();

  // Helper to update a specific permission in the nested structure
  const updatePermissionUsers = useCallback((permissionId: string, updater: (users: UserAPIResponse[]) => UserAPIResponse[]) => {
    setData((prev) => 
      prev.map(module => ({
        ...module,
        permissions: module.permissions.map(perm => 
          perm.id === permissionId 
            ? { ...perm, users: updater(perm.users) } 
            : perm
        )
      }))
    );
  }, []);

  const handleAddEmployee = useCallback((permissionId: string, employee: UserAPIResponse) => {
    updatePermissionUsers(permissionId, (users) => {
      if (users.find(u => u.id === employee.id)) return users;
      return [...users, employee];
    });
  }, [updatePermissionUsers]);

  const handleRemoveEmployee = useCallback((permissionId: string, employeeId: string) => {
    updatePermissionUsers(permissionId, (users) => 
      users.filter(u => u.id !== employeeId)
    );
  }, [updatePermissionUsers]);

  const handleSave = useCallback(async () => {
    // Transform data for the batch API
    // Group permissions by their user sets
    const userGroups = new Map<string, { userIds: string[], permissionIds: string[] }>();

    data.forEach(module => {
      module.permissions.forEach(perm => {
        if (perm.users.length === 0) return;

        // Create a unique key for the set of users
        const userIds = perm.users.map(u => u.id).sort();
        const groupKey = userIds.join(",");

        if (userGroups.has(groupKey)) {
          userGroups.get(groupKey)!.permissionIds.push(perm.id);
        } else {
          userGroups.set(groupKey, {
            userIds,
            permissionIds: [perm.id]
          });
        }
      });
    });

    if (userGroups.size === 0) {
      toast.error("Vui lòng thêm ít nhất một nhân viên");
      return;
    }

    // In a real app, we might send multiple requests or one batch request
    // For now, let's just log and call the mutation for each group
    console.log("Saving groups:", Array.from(userGroups.values()));

    try {
      for (const [_, group] of userGroups) {
        await saveMutation.mutateAsync({
          user_ids: group.userIds,
          permission_ids: group.permissionIds
        });
      }
    } catch (error) {
      console.error("Save failed", error);
    }
  }, [data, saveMutation]);

  return {
    modules: data,
    handleAddEmployee,
    handleRemoveEmployee,
    handleSave,
    isSaving: saveMutation.isPending
  };
}
