export const dashboardKeys = {
  all: ["dashboard"] as const,
  statistics: () => [...dashboardKeys.all, "statistics"] as const,
  personalStatistics: () => [...dashboardKeys.all, "personal-statistics"] as const,
  adminStatistics: () => [...dashboardKeys.all, "admin-statistics"] as const,
};
