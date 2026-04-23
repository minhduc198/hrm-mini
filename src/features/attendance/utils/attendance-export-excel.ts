import ExcelJS from "exceljs";
import { format } from "date-fns";
import { AttendanceRecordDetail } from "../types/attendance";
import { statusMap } from "../constants";

export const generateAttendanceExcel = async (data: AttendanceRecordDetail[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Báo cáo chấm công");

  // Định nghĩa các cột
  worksheet.columns = [
    { header: "Ngày", key: "work_date", width: 15 },
    { header: "Mã NV", key: "emp_code", width: 15 },
    { header: "Họ và tên", key: "user_name", width: 25 },
    { header: "Giờ vào", key: "check_in", width: 12 },
    { header: "Giờ ra", key: "check_out", width: 12 },
    { header: "Tổng giờ", key: "total_hours", width: 12 },
    { header: "Muộn (phút)", key: "late_minutes", width: 15 },
    { header: "Về sớm (phút)", key: "early_leave_minutes", width: 15 },
    { header: "Tăng ca (giờ)", key: "ot_hours", width: 15 },
    { header: "Trạng thái", key: "status_label", width: 20 },
    { header: "Ghi chú", key: "note", width: 30 },
  ];

  // Định dạng Header
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3B82F6" }, // Blue-500
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 25;

  // Thêm dữ liệu
  data.forEach((item, index) => {
    const row = worksheet.addRow({
      work_date: format(new Date(item.work_date), "dd/MM/yyyy"),
      emp_code: item.user.empCode.replace(/-/g, ""),
      user_name: item.user.name,
      check_in: item.check_in || "-",
      check_out: item.check_out || "-",
      total_hours: item.total_hours,
      late_minutes: item.late_minutes,
      early_leave_minutes: item.early_leave_minutes,
      ot_hours: item.ot_hours,
      status_label: statusMap[item.status as keyof typeof statusMap]?.label || item.status,
      note: item.note || "",
    });

    // Stripe rows
    if (index % 2 === 1) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8FAFC" },
      };
    }

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
      cell.alignment = { vertical: "middle" };
    });
  });

  // Tải file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
