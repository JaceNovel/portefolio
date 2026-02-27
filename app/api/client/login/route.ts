import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { clientLoginSchema } from "../../../../lib/schemas";
import { checkRateLimit } from "../../../../lib/rateLimit";
import { createClientToken, getIpFromHeaders, setAuthCookie } from "../../../../lib/auth";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getIpFromHeaders(req.headers);
  const rate = await checkRateLimit(`client-login:${ip}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = clientLoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!client) return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });

  const ok = await bcrypt.compare(parsed.data.password, client.password);
  if (!ok) return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });

  const token = await createClientToken({ clientId: client.id });
  const res = NextResponse.json({ ok: true, mustResetPassword: client.mustResetPassword });
  setAuthCookie(res, "client_token", token, 60 * 60 * 24 * 30);
  return res;
}
