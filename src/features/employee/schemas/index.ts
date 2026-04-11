import { z } from "zod";

export const addEmployeeSchema = z
  .object({
    empCode: z
      .string()
      .min(3, "Mã nhân viên phải có ít nhất 3 ký tự")
      .max(20, "Không quá 20 ký tự")
      .regex(/^[A-Z0-9]+$/, "Chỉ dùng chữ hoa và số"),
    name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .length(10, "Phải đúng 10 số")
      .regex(/^[0-9]+$/, "Chỉ được nhập số"),
    address: z.string().min(5, "Địa chỉ quá ngắn").max(255),
    role: z.enum(["admin", "employee"]),
    password: z
      .string()
      .min(8, "Tối thiểu 8 ký tự")
      .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Phải có ít nhất 1 chữ số"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type AddEmployeeValues = z.infer<typeof addEmployeeSchema>;

export const editEmployeeSchema = z.object({
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .length(10, "Phải đúng 10 số")
    .regex(/^[0-9]+$/, "Chỉ được nhập số"),
  address: z.string().min(5, "Địa chỉ quá ngắn").max(255),
  role: z.enum(["admin", "employee"]),
  is_active: z.boolean(),
});

export type EditEmployeeValues = z.infer<typeof editEmployeeSchema>;
