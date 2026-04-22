import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../query-key";
import { getPersonalStatistics, getAdminStatistics } from "../services";

export function usePersonalStatistics() {
  return useQuery({
    queryKey: dashboardKeys.personalStatistics(),
    queryFn: getPersonalStatistics,
  });
}

export function useAdminStatistics() {
  return useQuery({
    queryKey: dashboardKeys.adminStatistics(),
    queryFn: getAdminStatistics,
  });
}
