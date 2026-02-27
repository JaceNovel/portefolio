import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";

const ADMIN_COOKIE = "admin_token";
const CLIENT_COOKIE = "client_token";

function redirectTo(req: NextRequest, path: string) {
  const url = req.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  return NextResponse.redirect(url);
}

async function hasValidToken(token: string | undefined, secret: string | undefined, role: "admin" | "client") {
  if (!token || !secret) return false;
  try {
    const payload = await verifyJwt<{ role?: string }>(token, secret);
    return payload.role === role;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard-admin")) {
    if (pathname === "/admin/login" || pathname === "/dashboard-admin/login") return NextResponse.next();
    const ok = await hasValidToken(req.cookies.get(ADMIN_COOKIE)?.value, process.env.ADMIN_JWT_SECRET, "admin");
    if (!ok) return redirectTo(req, "/dashboard-admin/login");
  }

  if (pathname.startsWith("/client") || pathname.startsWith("/client-area")) {
    if (pathname === "/client/login" || pathname === "/client-area/login") return NextResponse.next();
    const ok = await hasValidToken(req.cookies.get(CLIENT_COOKIE)?.value, process.env.CLIENT_JWT_SECRET, "client");
    if (!ok) return redirectTo(req, "/client-area/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard-admin/:path*", "/client/:path*", "/client-area/:path*"],
};
