import { z } from "zod";

export const leaveBalanceInitSchema = z.object({
  user_ids: z.array(z.number()),
  leave_type_id: z.number(),
  year: z.coerce.number().default(() => new Date().getFullYear()),
  should_reset: z.boolean().default(false),
});

export type LeaveBalanceInitValues = z.infer<typeof leaveBalanceInitSchema>;
