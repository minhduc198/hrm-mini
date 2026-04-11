import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/';
  const isPublicPath = isAuthPage || pathname.startsWith('/api/') || pathname.startsWith('/_next/');

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/employee-management', request.url));
  }

  if (role === 'admin') {
    if (pathname.startsWith('/attendance/personal')) {
      return NextResponse.redirect(new URL('/attendance/manage', request.url));
    }
    if (pathname.startsWith('/leave/personal')) {
      return NextResponse.redirect(new URL('/leave/manage', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
