import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, adminSessionToken } from "@/lib/auth";

// crypto (HMAC) needs the Node runtime, not Edge.
export const runtime = "nodejs";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get(ADMIN_SESSION_COOKIE)?.value === adminSessionToken();

  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
