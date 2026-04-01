import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const PUBLIC_ROUTES = ["/", "/login", "/signup","/verify","/verify-account"];

    const token = request.cookies.get("token")?.value;

    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const url = new URL("/login", request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
}