import { z } from "zod";
import { isBefore, startOfDay } from "date-fns";

export const attendanceExportSchema = z.object({
  type: z.enum(["month", "date", "range"]),
  month: z.union([z.date(), z.string()]).optional(),
  date: z.union([z.date(), z.string()]).optional(),
  from_date: z.union([z.date(), z.string()]).optional(),
  to_date: z.union([z.date(), z.string()]).optional(),
  status: z.array(z.string()).optional(),
  is_edited: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "range") {
    if (!data.from_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Từ ngày là bắt buộc",
        path: ["from_date"],
      });
    }
    if (!data.to_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Đến ngày là bắt buộc",
        path: ["to_date"],
      });
    }
    if (data.from_date && data.to_date) {
      const from = startOfDay(new Date(data.from_date));
      const to = startOfDay(new Date(data.to_date));
      if (isBefore(to, from)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Khoảng thời gian không hợp lệ",
          path: ["to_date"],
        });
      }
    }
  }
  
  if (data.type === "month" && !data.month) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Tháng là bắt buộc",
      path: ["month"],
    });
  }
  
  if (data.type === "date" && !data.date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày là bắt buộc",
      path: ["date"],
    });
  }
});

export type AttendanceExportFormValues = z.infer<typeof attendanceExportSchema>;
