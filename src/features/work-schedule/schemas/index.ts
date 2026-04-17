import { z } from "zod";

export const workShiftSchema = z
  .object({
    name: z.string().min(1, "Tên ca làm việc là bắt buộc"),
    work_start: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
    work_end: z.string().min(1, "Giờ kết thúc là bắt buộc"),
    break_start: z.string().min(1, "Giờ bắt đầu nghỉ là bắt buộc"),
    break_end: z.string().min(1, "Giờ kết thúc nghỉ là bắt buộc"),
    half_day_split: z.string().min(1, "Điểm chia ca là bắt buộc"),
  })
  .refine((data: any) => data.work_start < data.work_end, {
    message: "Giờ bắt đầu phải nhỏ hơn giờ kết thúc",
    path: ["work_start"],
  })
  .refine((data: any) => data.break_start < data.break_end, {
    message: "Giờ nghỉ trưa bắt đầu phải nhỏ hơn kết thúc",
    path: ["break_start"],
  });

export const saturdayConfigSchema = z
  .object({
    type: z.enum(["none", "bi_weekly", "every_week"]),
    reference_date: z.string().optional().nullable(),
    reference_type: z.enum(["on", "off"]).optional().nullable(),
  })
  .refine(
    (data: any) => {
      if (data.type === "bi_weekly") {
        return !!data.reference_date && !!data.reference_type;
      }
      return true;
    },
    {
      message: "Ngày mốc và trạng thái là bắt buộc khi chọn làm việc cách tuần",
      path: ["reference_date"],
    },
  );

export const workScheduleSchema = z
  .object({
    name: z.string().min(1, "Tên cấu hình là bắt buộc"),
    apply_from: z.string().optional().nullable(),
    apply_to: z.string().optional().nullable(),
    setting: z.object({
      shifts: z.object({
        office_hours: workShiftSchema,
      }),
      saturday_config: saturdayConfigSchema,
    }),
  })
  .refine(
    (data: any) => {
      if (data.apply_from && data.apply_to) {
        return new Date(data.apply_from) <= new Date(data.apply_to);
      }
      return true;
    },
    {
      message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
      path: ["apply_from"],
    },
  );

export type WorkScheduleFormValues = z.infer<typeof workScheduleSchema>;
