import { ModuleAPIResponse } from "../types/permission";
import { MOCK_EMPLOYEES, getInitials } from "../utils/employee";

export const PERMISSIONS_MOCK: ModuleAPIResponse[] = [
  {
    id: "mod-1",
    name: "Quản lý nhân viên",
    permissions: [
      {
        id: "perm-1",
        name: "Xem danh sách nhân viên",
        code: "EMPLOYEE_VIEW",
        description: "Cho phép xem thông tin cơ bản của tất cả nhân viên",
        users: MOCK_EMPLOYEES.slice(0, 3).map(emp => ({
          ...emp,
          shortName: getInitials(emp.name)
        }))
      },
      {
        id: "perm-2",
        name: "Thêm nhân viên mới",
        code: "EMPLOYEE_CREATE",
        description: "Cho phép tạo hồ sơ nhân viên mới trong hệ thống",
        users: MOCK_EMPLOYEES.slice(2, 4).map(emp => ({
          ...emp,
          shortName: getInitials(emp.name)
        }))
      },
      {
        id: "perm-3",
        name: "Chỉnh sửa thông tin",
        code: "EMPLOYEE_EDIT",
        description: "Cho phép cập nhật thông tin cá nhân và hợp đồng",
        users: []
      }
    ]
  },
  {
    id: "mod-2",
    name: "Quản lý chấm công",
    permissions: [
      {
        id: "perm-4",
        name: "Xem chấm công toàn bộ",
        code: "ATTENDANCE_VIEW_ALL",
        description: "Cho phép xem bảng công của tất cả phòng ban",
        users: [MOCK_EMPLOYEES[5], MOCK_EMPLOYEES[8]].map(emp => ({
          ...emp,
          shortName: getInitials(emp.name)
        }))
      },
      {
        id: "perm-5",
        name: "Xuất báo cáo chấm công",
        code: "ATTENDANCE_EXPORT",
        description: "Cho phép xuất dữ liệu chấm công ra file Excel",
        users: [MOCK_EMPLOYEES[5]].map(emp => ({
          ...emp,
          shortName: getInitials(emp.name)
        }))
      }
    ]
  },
  {
    id: "mod-3",
    name: "Quản lý xin nghỉ",
    permissions: [
      {
        id: "perm-6",
        name: "Duyệt/Từ chối đơn nghỉ",
        code: "LEAVE_PROCESS",
        description: "Quyền phê duyệt các yêu cầu nghỉ phép của nhân viên",
        users: MOCK_EMPLOYEES.slice(10, 15).map(emp => ({
          ...emp,
          shortName: getInitials(emp.name)
        }))
      }
    ]
  }
];
