import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("firebaseAuthToken");
  const { pathname } = request.nextUrl;

  if (!token?.value && (pathname === "/profile" || pathname === "/practice")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token?.value && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/practice", "/login", "/signup"],
};
