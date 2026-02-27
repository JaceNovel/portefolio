import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signJwt, verifyJwt } from "./jwt";

export const ADMIN_COOKIE = "admin_token";
export const CLIENT_COOKIE = "client_token";

export type AdminSession = { email: string };
export type ClientSession = { clientId: string };

function isProd() {
  return process.env.NODE_ENV === "production";
}

export function getIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}

export async function createAdminToken(payload: { email: string }) {
  const secret = process.env.ADMIN_JWT_SECRET?.trim();
  if (!secret) throw new Error("Missing ADMIN_JWT_SECRET");
  return signJwt({ role: "admin", email: payload.email }, secret, 60 * 60 * 24 * 7);
}

export async function createClientToken(payload: { clientId: string }) {
  const secret = process.env.CLIENT_JWT_SECRET?.trim();
  if (!secret) throw new Error("Missing CLIENT_JWT_SECRET");
  return signJwt({ role: "client", clientId: payload.clientId }, secret, 60 * 60 * 24 * 30);
}

export function setAuthCookie(res: NextResponse, name: string, token: string, maxAgeSeconds: number) {
  res.cookies.set({
    name,
    value: token,
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export function clearAuthCookie(res: NextResponse, name: string) {
  res.cookies.set({
    name,
    value: "",
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function requireAdmin() {
  const secret = process.env.ADMIN_JWT_SECRET?.trim();
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !secret) return null;

  try {
    const payload = await verifyJwt<{ role?: string; email?: string }>(token, secret);
    if (payload.role !== "admin" || !payload.email) return null;
    return { email: payload.email } satisfies AdminSession;
  } catch {
    return null;
  }
}

export async function requireClient() {
  const secret = process.env.CLIENT_JWT_SECRET?.trim();
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE)?.value;
  if (!token || !secret) return null;

  try {
    const payload = await verifyJwt<{ role?: string; clientId?: string }>(token, secret);
    if (payload.role !== "client" || !payload.clientId) return null;
    return { clientId: payload.clientId } satisfies ClientSession;
  } catch {
    return null;
  }
}
