import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session }
    } = await supabase.auth.getSession();

    // Protected routes - redirect to login if no session
    const protectedPaths = ['/hireprocess', '/joblists', '/profile', ];
    const isProtectedPath = protectedPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
    );

    // Auth routes - redirect to dashboard if already logged in
    const authPaths = ['/auth/login', '/auth/signup'];
    const isAuthPath = authPaths.some(path => 
        req.nextUrl.pathname === path
    );

    if (isProtectedPath && !session) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/apply/')) {
        return res;
    }

    if (isAuthPath && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}