import { SelectedEmployee } from "../types/permission";

/**
 * Mock employee data for demo purposes
 */
export const MOCK_EMPLOYEES: SelectedEmployee[] = [
  { id: "EMP001", name: "Nguyễn Văn An", email: "an.nguyen@company.com" },
  { id: "EMP002", name: "Trần Thị Bình", email: "binh.tran@company.com" },
  { id: "EMP003", name: "Lê Hoàng Cường", email: "cuong.le@company.com" },
  { id: "EMP004", name: "Phạm Minh Đức", email: "duc.pham@company.com" },
  { id: "EMP005", name: "Hoàng Thị Em", email: "em.hoang@company.com" },
  { id: "EMP006", name: "Võ Văn Phúc", email: "phuc.vo@company.com" },
  { id: "EMP007", name: "Đặng Thị Giang", email: "giang.dang@company.com" },
  { id: "EMP008", name: "Bùi Thanh Hải", email: "hai.bui@company.com" },
  { id: "EMP009", name: "Ngô Thị Kim", email: "kim.ngo@company.com" },
  { id: "EMP010", name: "Dương Văn Long", email: "long.duong@company.com" },
  { id: "EMP011", name: "Lý Thị Mai", email: "mai.ly@company.com" },
  { id: "EMP012", name: "Trịnh Văn Nam", email: "nam.trinh@company.com" },
  { id: "EMP013", name: "Đỗ Minh Quân", email: "quan.do@company.com" },
  { id: "EMP014", name: "Phan Thanh Sơn", email: "son.phan@company.com" },
  { id: "EMP015", name: "Lương Thu Thảo", email: "thao.luong@company.com" },
  { id: "EMP016", name: "Vũ Tuấn Tú", email: "tu.vu@company.com" },
  { id: "EMP017", name: "Hoàng Gia Huy", email: "huy.hoang@company.com" },
  { id: "EMP018", name: "Nguyễn Thùy Linh", email: "linh.nguyen@company.com" },
];

/**
 * Avatar colors for fallback (when no avatar image is available)
 */
export const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-emerald-500",
];

/**
 * Extract initials from a name (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(-2)
    .toUpperCase();
}

/**
 * Deterministically get an avatar color based on the employee ID
 */
export function getAvatarColor(id: string): string {
  if (!id) return AVATAR_COLORS[0];
  const index = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}
