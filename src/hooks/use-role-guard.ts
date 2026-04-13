"use client";

import { useAuthStore } from "@/features/auth/stores/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const EMPLOYEE_ROUTES = [
  "/attendance/personal",
  "/leave/personal",
];

export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuthStore();

  useEffect(() => {
    if (!role) return;

    const isEmployeeRoute = EMPLOYEE_ROUTES.some(route => pathname?.startsWith(route));
    if (role === "admin" && isEmployeeRoute) {
      router.replace("/employee-management");
    }
  }, [role, pathname, router]);
}
