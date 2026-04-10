import { z } from "zod";
import { loginSchema } from "@/features/auth/schemas/auth";

export type UserRole = "admin" | "employee";

export type AuthUser = {
  id: number;
  empCode: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  role: UserRole;
  created_by: number;
};

export type LoginFormValues = z.infer<typeof loginSchema>;