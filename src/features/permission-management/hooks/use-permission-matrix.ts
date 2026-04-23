import { useCallback, useEffect } from "react";
import { UserAPIResponse } from "../types/permission";
import { useSavePermissions } from "./use-save-permissions";
import { useGetPermissions } from "./use-get-permissions";
import { usePermissionMatrixStore } from "../stores/permission";
import { mapPermissionsToAssignPayload } from "../adapters/permission";

import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export function usePermissionMatrix() {
  const { data: permissionList, isLoading, error } = useGetPermissions();

  const modules = usePermissionMatrixStore((state) => state.modules);
  const isDirty = usePermissionMatrixStore((state) => state.isDirty);
  const setModules = usePermissionMatrixStore((state) => state.setModules);
  const addEmployeeToPermission = usePermissionMatrixStore(
    (state) => state.addEmployeeToPermission
  );
  const removeEmployeeFromPermission = usePermissionMatrixStore(
    (state) => state.removeEmployeeFromPermission
  );

  const saveMutation = useSavePermissions();

  const { showConfirm, confirmNavigation, cancelNavigation } = useUnsavedChanges(isDirty);

  useEffect(() => {
    if (permissionList) {
      setModules(permissionList);
    }
  }, [permissionList, setModules]);

  const handleAddEmployee = useCallback(
    (permissionId: string, employee: UserAPIResponse) => {
      addEmployeeToPermission(permissionId, employee);
    },
    [addEmployeeToPermission]
  );

  const handleRemoveEmployee = useCallback(
    (permissionId: string, employeeId: string) => {
      removeEmployeeFromPermission(permissionId, employeeId);
    },
    [removeEmployeeFromPermission]
  );

  const handleSave = useCallback(async () => {
    const payload = mapPermissionsToAssignPayload(modules);

    try {
      await saveMutation.mutateAsync(payload);
    } catch {
      // Error already handled in useSavePermissions
    }
  }, [modules, saveMutation]);

  return {
    modules,
    handleAddEmployee,
    handleRemoveEmployee,
    handleSave,
    isSaving: saveMutation.isPending,
    isLoading,
    isDirty,
    showConfirm,
    confirmNavigation,
    cancelNavigation,
    error: error as Error | null,
  };
}
