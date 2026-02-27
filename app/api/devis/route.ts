import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { quoteRequestSchema } from "../../../lib/schemas";
import { isHoneypotTripped } from "../../../lib/sanitize";
import { checkRateLimit } from "../../../lib/rateLimit";
import { getIpFromHeaders } from "../../../lib/auth";
import { computeEstimateCents, formatEurosFromCents } from "../../../lib/quote";
import { sendQuoteReceiptEmail } from "../../../lib/email";
import { enforceSameOrigin } from "../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getIpFromHeaders(req.headers);
  const rate = await checkRateLimit(`quote:${ip}`);
  if (!rate.success) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(json);
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

  const estimateCents = computeEstimateCents({
    siteType: data.siteType,
    pageCount: data.pageCount,
    options: data.options,
  });

  await prisma.projectRequest.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      siteType: data.siteType,
      pageCount: data.pageCount,
      options: data.options,
      estimateCents,
      source: "quote",
    },
  });

  const estimateEuros = formatEurosFromCents(estimateCents);
  await sendQuoteReceiptEmail({ to: data.email.toLowerCase(), name: data.name, estimateEuros });

  return NextResponse.json({ ok: true, estimateCents, estimateEuros }, { status: 201 });
}
