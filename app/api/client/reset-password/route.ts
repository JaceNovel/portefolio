import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { requireClient } from "../../../../lib/auth";
import { clientResetPasswordSchema } from "../../../../lib/schemas";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await requireClient();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = clientResetPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const password = await bcrypt.hash(parsed.data.password, 12);
  await prisma.client.update({
    where: { id: session.clientId },
    data: { password, mustResetPassword: false },
    select: { id: true },
  });

  return NextResponse.json({ ok: true });
}
