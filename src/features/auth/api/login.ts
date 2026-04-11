import api from "@/lib/axios";
import { LoginFormValues } from "../types/auth";

/**
 * Client-side: Calls our internal Next.js API Route (BFF)
 */
export const loginApi = async (data: LoginFormValues) => {
  const res = await api.post("/api", data);
  return res.data;
};

/**
 * Server-side: Calls the actual Laravel backend.
 * Used by the Next.js API Route Handler.
 */
export const loginBackend = async (data: LoginFormValues) => {
  const res = await api.post("/login", data);
  return res.data;
};
