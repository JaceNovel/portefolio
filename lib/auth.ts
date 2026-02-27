import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerEnv } from "./env";
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
  const env = getServerEnv();
  if (!env.ADMIN_JWT_SECRET) throw new Error("Missing ADMIN_JWT_SECRET");
  return signJwt({ role: "admin", email: payload.email }, env.ADMIN_JWT_SECRET, 60 * 60 * 24 * 7);
}

export async function createClientToken(payload: { clientId: string }) {
  const env = getServerEnv();
  if (!env.CLIENT_JWT_SECRET) throw new Error("Missing CLIENT_JWT_SECRET");
  return signJwt({ role: "client", clientId: payload.clientId }, env.CLIENT_JWT_SECRET, 60 * 60 * 24 * 30);
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
  const env = getServerEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token || !env.ADMIN_JWT_SECRET) return null;

  try {
    const payload = await verifyJwt<{ role?: string; email?: string }>(token, env.ADMIN_JWT_SECRET);
    if (payload.role !== "admin" || !payload.email) return null;
    return { email: payload.email } satisfies AdminSession;
  } catch {
    return null;
  }
}

export async function requireClient() {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_COOKIE)?.value;
  if (!token || !env.CLIENT_JWT_SECRET) return null;

  try {
    const payload = await verifyJwt<{ role?: string; clientId?: string }>(token, env.CLIENT_JWT_SECRET);
    if (payload.role !== "client" || !payload.clientId) return null;
    return { clientId: payload.clientId } satisfies ClientSession;
  } catch {
    return null;
  }
}
