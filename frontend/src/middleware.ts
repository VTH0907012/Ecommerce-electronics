

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAdmin = request.cookies.get("isAdmin")?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/checkout", "/profile"];
  const authRoutes = ["/login", "/register"];
  const adminRoutes = ["/admin"];

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (adminRoutes.some(route => pathname.startsWith(route)) )
    
    {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin !== "true") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout",
    "/profile",
    "/login",
    "/register",
    "/admin/:path*"
  ],
};