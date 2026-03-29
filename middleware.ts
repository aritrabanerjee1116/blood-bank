import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth protection is handled client-side by the dashboard layouts
// (admin/layout.tsx, donor/layout.tsx, hospital/layout.tsx).
// Supabase JS v2 stores sessions in localStorage, which is not accessible
// in server-side middleware, so we simply pass all requests through.
// The layouts show a loading spinner while checking auth, then redirect
// to /login if the user is not authenticated.

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/donor/:path*', '/hospital/:path*'],
};
