"use client";

import { useContext } from "react";
import { useSession } from "next-auth/react";
import { AuthContext } from "@/providers/auth-provider";

export function useAuth() {
  const { data: session, status } = useSession();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { permissions, isPermissionsLoading, hasPermission, hasAnyPermission } = context;

  // Global loading state: session is resolving OR permissions are fetching
  const isLoading = status === "loading" || isPermissionsLoading;

  return {
    user: session?.user,
    permissions,
    status,
    isLoading,
    isAuthenticated: status === "authenticated",
    hasPermission,
    hasAnyPermission,
  };
}
