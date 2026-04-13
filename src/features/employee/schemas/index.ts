import { z } from "zod";

export const addEmployeeSchema = z
  .object({
    name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9]{10}$/.test(val), {
        message: "Số điện thoại phải đúng 10 chữ số",
      }),
    address: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 5, {
        message: "Địa chỉ quá ngắn",
      })
      .refine((val) => !val || val.length <= 255, {
        message: "Địa chỉ quá dài",
      }),
    password: z.string().min(6, "Tối thiểu 6 ký tự"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

export type AddEmployeeValues = z.infer<typeof addEmployeeSchema>;

export const editEmployeeSchema = z.object({
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "Số điện thoại phải đúng 10 chữ số",
    }),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "Địa chỉ quá ngắn",
    })
    .refine((val) => !val || val.length <= 255, {
      message: "Địa chỉ quá dài",
    }),
  is_active: z.boolean(),
});

export type EditEmployeeValues = z.infer<typeof editEmployeeSchema>;
