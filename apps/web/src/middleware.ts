import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/dashboard/leadership',
  '/dashboard/projects',
  '/data',
  '/finance',
  '/reports',
  '/admin',
];

const roleRoutes: Record<string, string[]> = {
  '/admin': ['super_admin', 'admin'],
  '/finance': ['super_admin', 'admin', 'finance_officer', 'project_manager'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    for (const [route, roles] of Object.entries(roleRoutes)) {
      if (path.startsWith(route)) {
        const userRoles = (token.roles as string[]) ?? [];
        if (!roles.some((r) => userRoles.includes(r))) {
          return NextResponse.redirect(new URL('/dashboard/leadership', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const isProtected = protectedRoutes.some((r) => path.startsWith(r));
        if (!isProtected) return true;
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    '/dashboard/leadership/:path*',
    '/dashboard/projects/:path*',
    '/data/:path*',
    '/finance/:path*',
    '/reports/:path*',
    '/admin/:path*',
  ],
};
