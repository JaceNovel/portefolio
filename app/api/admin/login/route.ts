import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminLoginSchema } from "../../../../lib/schemas";
import { createAdminToken, getIpFromHeaders, setAuthCookie } from "../../../../lib/auth";
import { checkRateLimit } from "../../../../lib/rateLimit";
import { getServerEnv } from "../../../../lib/env";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getIpFromHeaders(req.headers);
  const rate = await checkRateLimit(`admin-login:${ip}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const env = getServerEnv();
  if (!env.ADMIN_EMAIL || (!env.ADMIN_PASSWORD_HASH && !env.ADMIN_PASSWORD)) {
    return NextResponse.json(
      { error: "Admin non configuré (ADMIN_EMAIL + ADMIN_PASSWORD_HASH ou ADMIN_PASSWORD requis)" },
      { status: 500 },
    );
  }

  const okEmail = parsed.data.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
  const configuredHash = env.ADMIN_PASSWORD_HASH?.trim();
  const configuredPlain = env.ADMIN_PASSWORD?.trim();

  let okPassword = false;
  if (configuredHash && /^\$2[aby]\$\d{2}\$/.test(configuredHash)) {
    okPassword = await bcrypt.compare(parsed.data.password, configuredHash);
  } else if (configuredPlain) {
    okPassword = parsed.data.password === configuredPlain;
  } else if (configuredHash) {
    okPassword = parsed.data.password === configuredHash;
  }

  if (!okEmail || !okPassword) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const token = await createAdminToken({ email: env.ADMIN_EMAIL });
  const res = NextResponse.json({ ok: true });
  setAuthCookie(res, "admin_token", token, 60 * 60 * 24 * 7);
  return res;
}
