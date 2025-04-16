import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect all routes except auth routes
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to home if logged in user tries to access auth pages
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};