// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // If the user is logged in and tries to access a public path, redirect to the dashboard
    if (token && ['/login', '/register', '/forgot-password'].includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }


    // Check authentication for protected routes
    if (!token) {
        // Store the original URL to redirect back after login
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Define which paths the middleware should run on
    matcher: [
        /*
         * Match all paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /static (static files)
         * 4. favicon.ico, etc.
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
