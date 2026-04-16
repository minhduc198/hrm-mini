"use client";

import React, { createContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/features/auth/api/get-permissions";
import { normalizePermissions } from "@/features/auth/utils/permission-utils";
import { authKeys } from "@/features/auth/queryKeys/auth";
import { ALL_PERMISSIONS } from "@/features/auth/constants/permissions";

interface AuthContextType {
  permissions: string[];
  isPermissionsLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  // Permissions Query
  const { data: rawPermissions, isLoading: isPermissionsLoading } = useQuery({
    queryKey: authKeys.permissions(userId as string),
    queryFn: () => getPermissions(userId as string),
    enabled: status === "authenticated" && !!userId,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Normalize permissions
  const permissions = useMemo(
    () => normalizePermissions(rawPermissions, role),
    [rawPermissions, role]
  );

  // Permission checks
  const hasPermission = useMemo(
    () => (permission: string) => {
      if (permissions.includes(ALL_PERMISSIONS)) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useMemo(
    () => (requiredPermissions: string[]) => {
      if (permissions.includes(ALL_PERMISSIONS)) return true;
      return requiredPermissions.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const value = useMemo(
    () => ({
      permissions,
      isPermissionsLoading,
      hasPermission,
      hasAnyPermission,
    }),
    [permissions, isPermissionsLoading, hasPermission, hasAnyPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
