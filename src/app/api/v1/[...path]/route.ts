import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/axios";

// Target Laravel backend base URL
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function proxyHandler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const pathString = path.join("/");
    const searchParams = request.nextUrl.search;

    // 1. Get token from secure cookies
    const accessToken = request.cookies.get("accessToken")?.value;

    // 2. Prepare headers
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // 3. Prepare request options
    const method = request.method;
    const body = ["POST", "PUT", "PATCH"].includes(method)
      ? await request.text()
      : undefined;

    // 4. Forward the request to Laravel
    const url = `${BACKEND_URL}/${pathString}${searchParams}`;

    const response = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const data = await response.json();

    // 5. Return the response from Laravel
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi kết nối đến Server" },
      { status: error.status || 500 },
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
