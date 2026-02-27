import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireClient } from "../../../../lib/auth";

export async function GET() {
  const session = await requireClient();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return NextResponse.json({ ok: true, client });
}
