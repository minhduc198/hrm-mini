export const leaveKeys = {
  all: ["leave-requests"] as const,
  lists: () => [...leaveKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...leaveKeys.lists(), params] as const,
  my: () => [...leaveKeys.all, "my"] as const,
  myPaginated: (params: Record<string, unknown>) => [...leaveKeys.my(), params] as const,
  admin: () => [...leaveKeys.all, "admin"] as const,
  adminPaginated: (params: Record<string, unknown>) => [...leaveKeys.admin(), params] as const,
};
