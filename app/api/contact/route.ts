import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { contactRequestSchema } from "../../../lib/schemas";
import { isHoneypotTripped } from "../../../lib/sanitize";
import { checkRateLimit } from "../../../lib/rateLimit";
import { getIpFromHeaders } from "../../../lib/auth";
import { enforceSameOrigin } from "../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getIpFromHeaders(req.headers);
  const rate = await checkRateLimit(`contact:${ip}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  if (isHoneypotTripped(data.hp)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  if (!data.rgpd) {
    return NextResponse.json({ error: "Consentement requis", issues: [{ path: ["rgpd"], message: "Consentement requis" }] }, { status: 400 });
  }

  await prisma.projectRequest.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      requestType: data.requestType,
      budget: data.budget,
      description: data.description,
      source: "contact",
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
