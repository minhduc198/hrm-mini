import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logoutBackend } from "@/features/auth/api/logout";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    try {
      await logoutBackend(token);
    } catch (error) {
      console.error("Backend logout failed:", error);
    }
  }

  const res = NextResponse.json({ success: true });

  res.cookies.delete("accessToken");
  res.cookies.delete("role");

  return res;
}
