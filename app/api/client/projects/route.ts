import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireClient } from "../../../../lib/auth";

export async function GET() {
  const session = await requireClient();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const projects = await prisma.clientProject.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    include: { files: true },
  });

  return NextResponse.json({ ok: true, projects });
}
