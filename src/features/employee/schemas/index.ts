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

export const profileSchema = z.object({
  empCode: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "Số điện thoại phải đúng 10 chữ số",
    }),
  address: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val.length >= 5, {
      message: "Địa chỉ quá ngắn",
    })
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
  new_password: z.string().min(6, "Tối thiểu 6 ký tự"),
  new_password_confirmation: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine(
  (data) => data.new_password === data.new_password_confirmation,
  {
    message: "Mật khẩu xác nhận không khớp",
    path: ["new_password_confirmation"],
  }
);

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
