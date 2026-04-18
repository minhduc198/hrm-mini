export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  generate: () => [...attendanceKeys.all, 'generate'] as const,
};
