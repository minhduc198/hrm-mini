export const attendanceKeys = {
  all: ['attendance'] as const,
  
  // Admin Records
  records: () => [...attendanceKeys.all, 'records'] as const,
  recordList: (filters: Record<string, unknown>) => [...attendanceKeys.records(), filters] as const,
  
  // Personal (My)
  my: () => [...attendanceKeys.all, 'my'] as const,
  myList: (filters: Record<string, unknown>) => [...attendanceKeys.my(), filters] as const,
  
  // Data hiển thị data trên lịch
  lists: () => [...attendanceKeys.all, 'list'] as const,
  
  // gen lịch
  generate: () => [...attendanceKeys.all, 'generate'] as const,
};

