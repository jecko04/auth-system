

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/actions/auth';
import { updateAuthCookies } from '@/app/actions/cookies';


export const config = {
  matcher: ['/', '/auth/dashboard', '/auth/admin-dashboard', '/dashboard/:path*', '/admin-dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const url = request.nextUrl;

  const path = url.pathname;

  const isAdminRoute = path.startsWith('/auth/admin-dashboard') || path.startsWith('/admin-dashboard');
  const isUserRoute = path.startsWith('/auth/dashboard') || path.startsWith('/dashboard');

  if (!session && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (session) {
    try {
      const payload = await verifyToken(session); // contains role
      const response = (await updateAuthCookies(request)) || NextResponse.next();

      // 1. Root page → redirect based on role
      if (path === '/') {
        const redirectTo = payload?.role === 'system_admin' ? '/auth/admin-dashboard' : '/auth/dashboard';
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }

      // 2. Prevent normal users from accessing admin routes
      if (payload?.role !== 'system_admin' && isAdminRoute) {
        return NextResponse.redirect(new URL('/auth/dashboard', request.url));
      }

      // 3. Prevent admin from accessing user routes (optional)
      if (payload?.role === 'system_admin' && isUserRoute) {
        return NextResponse.redirect(new URL('/auth/admin-dashboard', request.url));
      }

      return response;
    } catch (err) {
      console.warn('Invalid session token:', err);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}