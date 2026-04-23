import { create } from "zustand";
import { UserAPIResponse, ModuleAPIResponse } from "../types/permission";

type PermissionMatrixState = {
  modules: ModuleAPIResponse[];
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
};

type PermissionMatrixActions = {
  setModules: (modules: ModuleAPIResponse[]) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  addEmployeeToPermission: (permissionId: string, employee: UserAPIResponse) => void;
  removeEmployeeFromPermission: (permissionId: string, employeeId: string) => void;
  setDirty: (isDirty: boolean) => void;
  reset: () => void;
};

export type PermissionMatrixStore = PermissionMatrixState & PermissionMatrixActions;

const initialState: PermissionMatrixState = {
  modules: [],
  isLoading: false,
  isSaving: false,
  isDirty: false,
};

export const usePermissionMatrixStore = create<PermissionMatrixStore>((set) => ({
  ...initialState,

  setModules: (modules) => set({ modules, isDirty: false }),

  setLoading: (isLoading) => set({ isLoading }),

  setSaving: (isSaving) => set({ isSaving }),

  setDirty: (isDirty) => set({ isDirty }),

  addEmployeeToPermission: (permissionId, employee) =>
    set((state) => ({
      isDirty: true,
      modules: state.modules.map((module) => ({
        ...module,
        permissions: module.permissions.map((perm) =>
          perm.id === permissionId
            ? {
                ...perm,
                users: perm.users.some((u) => u.id === employee.id)
                  ? perm.users
                  : [...perm.users, employee],
              }
            : perm,
        ),
      })),
    })),

  removeEmployeeFromPermission: (permissionId, employeeId) =>
    set((state) => ({
      isDirty: true,
      modules: state.modules.map((module) => ({
        ...module,
        permissions: module.permissions.map((perm) =>
          perm.id === permissionId
            ? { ...perm, users: perm.users.filter((u) => u.id !== employeeId) }
            : perm,
        ),
      })),
    })),

  reset: () => set(initialState),
}));
