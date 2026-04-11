import { NextResponse } from "next/server";
import { loginBackend } from "@/features/auth/api/login";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = await loginBackend(body);
    
    const accessToken = data?.access_token;
    const user = data?.user;
    const expiresIn = data?.expires_in || 3600;

    if (!accessToken || !user) {
      throw new Error("Phản hồi từ Server không đúng định dạng");
    }

    const res = NextResponse.json(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: expiresIn,
    };

    res.cookies.set({ name: "accessToken", value: accessToken, ...cookieOptions });
    res.cookies.set({ name: "role", value: user.role, ...cookieOptions });

    return res;
  } catch (error: any) {
    // If the error comes from our axios interceptor, it has { message, status }
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    
    return NextResponse.json({ message }, { status });
  }
}