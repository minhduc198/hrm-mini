import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../query-key";
import { getPersonalStatistics } from "../services";

export function usePersonalStatistics() {
  return useQuery({
    queryKey: dashboardKeys.personalStatistics(),
    queryFn: getPersonalStatistics,
  });
}
