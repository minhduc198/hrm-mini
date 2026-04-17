import { create } from 'zustand';
import { AttendanceDayData, AttendanceDayType } from '../types/attendance';
import { addMonths, startOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { generateMockAttendanceData } from '../utils/attendance';
import { ATTENDANCE_CONFIG } from '../constants';

interface AttendanceState {
  attendanceData: AttendanceDayData[];
  viewDate: Date;
  isGenerating: boolean;
  
  setViewDate: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  generateSchedule: () => Promise<void>;
  resetData: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendanceData: [],
  viewDate: new Date(),
  isGenerating: false,

  setViewDate: (date) => set({ viewDate: date }),

  nextMonth: () => set((state) => ({ viewDate: addMonths(state.viewDate, 1) })),
  
  prevMonth: () => set((state) => ({ viewDate: addMonths(state.viewDate, -1) })),

  resetData: () => set({ attendanceData: [] }),

  generateSchedule: async () => {
    set({ isGenerating: true });
    
    await new Promise((resolve) => setTimeout(resolve, ATTENDANCE_CONFIG.MOCK_DELAY));

    const startDate = startOfMonth(new Date());
    const generatedData = generateMockAttendanceData(startDate, ATTENDANCE_CONFIG.DEFAULT_GENERATE_MONTHS);

    set({ 
      attendanceData: generatedData, 
      isGenerating: false,
      viewDate: startDate // Reset về tháng bắt đầu sau khi gen
    });

    toast.success("Đã tự động sinh lịch cho 3 tháng tới.", {
        description: "Lịch làm việc đã được cập nhật thành công.",
    });
  },
}));
