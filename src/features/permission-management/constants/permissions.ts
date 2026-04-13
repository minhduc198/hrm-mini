import { ModuleDefinition } from "../types/permission";

export const PERMISSION_MODULES: ModuleDefinition[] = [
  {
    key: "employee",
    label: "Quản lý nhân viên",
    permissions: [
      { key: "EMPLOYEE_VIEW", label: "Xem danh sách nhân viên" },
      { key: "EMPLOYEE_CREATE", label: "Thêm nhân viên mới" },
      { key: "EMPLOYEE_EDIT", label: "Chỉnh sửa thông tin nhân viên" },
      { key: "EMPLOYEE_TOGGLE_STATUS", label: "Kích hoạt/Vô hiệu hóa nhân viên" },
      { key: "EMPLOYEE_EXPORT", label: "Xuất danh sách nhân viên" },
    ],
  },
  {
    key: "attendance",
    label: "Quản lý chấm công",
    permissions: [
      { key: "ATTENDANCE_VIEW_ALL", label: "Xem chấm công toàn bộ" },
      { key: "ATTENDANCE_EXPORT", label: "Xuất báo cáo chấm công" },
    ],
  },
  {
    key: "leave",
    label: "Quản lý xin nghỉ",
    permissions: [
      { key: "LEAVE_VIEW_ALL", label: "Xem đơn nghỉ toàn bộ" },
      { key: "LEAVE_PROCESS", label: "Duyệt/Từ chối đơn nghỉ" },
    ],
  },
];
