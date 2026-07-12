import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};