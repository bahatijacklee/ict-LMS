/**
 * Next.js Middleware
 * 
 * The Bouncer: Intercepts requests to check JWT
 * Protects routes based on authentication and role
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/about', '/courses'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes require token
  const token = request.cookies.get('access_token')?.value;

  // If no token, redirect to login
  if (!token) {
    // Store the original URL to redirect back after login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Continue to protected route
  return NextResponse.next();
}

/**
 * Define which routes use middleware
 * Apply to all dashboard routes
 */
export const config = {
  matcher: ['/(dashboards)/:path*', '/admin/:path*', '/student/:path*', '/instructor/:path*', '/finance/:path*'],
};
