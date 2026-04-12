import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
  const role = token?.role;
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const isAuthPage = pathname === '/';
  const isAuthApiRoute = pathname.startsWith('/api/auth/');
  const isStaticAsset = pathname.startsWith('/_next/static/') || 
                        pathname.startsWith('/_next/image/');
  const isPublicFile = pathname === '/favicon.ico' || 
                       pathname === '/sitemap.xml' || 
                       pathname === '/robots.txt';

  const isPublicPath = isAuthPage || isAuthApiRoute || isStaticAsset || isPublicFile;

  // Redirect unauthenticated users to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect authenticated users away from login page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/employee-management', request.url));
  }

  // Role-based routing: prevent admin from accessing employee-only routes
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
    // Match all routes except static assets and images
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
