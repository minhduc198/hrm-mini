import { create } from 'zustand';
import { addMonths } from 'date-fns';

interface AttendanceState {
  viewDate: Date;
  setViewDate: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  viewDate: new Date(),

  setViewDate: (date) => set({ viewDate: date }),

  nextMonth: () => set((state) => ({ viewDate: addMonths(state.viewDate, 1) })),
  
  prevMonth: () => set((state) => ({ viewDate: addMonths(state.viewDate, -1) })),
}));

