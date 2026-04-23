import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { routes } from "@/constants/routes";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
  const role = token?.role;
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const isAuthPage = pathname === routes.auth.login;
  const isAuthApiRoute = pathname.startsWith("/api/auth/");
  const isStaticAsset =
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image/");
  const isPublicFile =
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt";

  const isPublicPath =
    isAuthPage || isAuthApiRoute || isStaticAsset || isPublicFile;

  // Redirect unauthenticated users to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL(routes.auth.login, request.url));
  }

  // Redirect authenticated users away from login page
  if (isAuthPage && token) {
    const destination =
      role === "admin" ? routes.dashboard.admin : routes.dashboard.employee;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Role-based routing: prevent unauthorized access to specific dashboards and settings
  if (role === "admin") {
    // Admin cannot access employee dashboard
    if (pathname === routes.dashboard.employee) {
      return NextResponse.redirect(new URL(routes.dashboard.admin, request.url));
    }

    // Prevent admin from accessing employee-only routes
    if (pathname.startsWith(routes.attendance.personal)) {
      return NextResponse.redirect(
        new URL(routes.attendance.manage, request.url),
      );
    }
    if (pathname.startsWith(routes.leave.personal)) {
      return NextResponse.redirect(new URL(routes.leave.manage, request.url));
    }
  } else {
    // Non-admin (Employee) cannot access admin dashboard
    if (pathname === routes.dashboard.admin) {
      return NextResponse.redirect(
        new URL(routes.dashboard.employee, request.url),
      );
    }

    // Non-admin (Employee) cannot access work settings
    if (pathname.startsWith(routes.workSettings)) {
      return NextResponse.redirect(
        new URL(routes.dashboard.employee, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static assets and images
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
