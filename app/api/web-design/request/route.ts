import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { webDesignRequestSchema } from "../../../../lib/schemas";
import { checkRateLimit } from "../../../../lib/rateLimit";
import { getIpFromHeaders } from "../../../../lib/auth";
import { isHoneypotTripped } from "../../../../lib/sanitize";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getIpFromHeaders(req.headers);
  const rate = await checkRateLimit(`web-design-request:${ip}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = webDesignRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  if (isHoneypotTripped(data.hp)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!data.rgpd) {
    return NextResponse.json({ error: "Consentement RGPD requis" }, { status: 400 });
  }

  const estimateMaxCents = Math.max(0, Math.round(data.estimate.max * 100));

  await prisma.projectRequest.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      description: data.message || null,
      siteType: data.websiteType,
      pageCount: data.pageCount,
      options: {
        options: data.options,
        branding: data.branding,
        stack: data.stack,
        estimate: data.estimate,
      },
      estimateCents: estimateMaxCents,
      source: "web-design",
      status: "Nouveau",
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
