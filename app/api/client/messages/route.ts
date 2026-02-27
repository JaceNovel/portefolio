import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireClient } from "../../../../lib/auth";
import { clientMessageSchema } from "../../../../lib/schemas";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function GET() {
  const session = await requireClient();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const messages = await prisma.clientMessage.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, messages });
}

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
  const parsed = clientMessageSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const msg = await prisma.clientMessage.create({
    data: {
      clientId: session.clientId,
      content: parsed.data.content,
    },
  });

  return NextResponse.json({ ok: true, message: msg }, { status: 201 });
}
