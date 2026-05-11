import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "goudoukh-luxury-cars-secret-key-2024"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to the login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
