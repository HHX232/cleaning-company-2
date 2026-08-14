import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Credentials provider + Prisma/bcrypt need the Node runtime, not Edge.
export const runtime = "nodejs";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user.role === "ADMIN";
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    if (isLoggedIn && isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn || !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
