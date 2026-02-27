import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { adminCreateClientSchema } from "../../../../lib/schemas";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = adminCreateClientSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const password = await bcrypt.hash(parsed.data.password, 12);
  const client = await prisma.client.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      password,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, client }, { status: 201 });
}
