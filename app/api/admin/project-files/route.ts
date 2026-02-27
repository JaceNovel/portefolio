import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { adminAddProjectFileSchema } from "../../../../lib/schemas";
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
  const parsed = adminAddProjectFileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const file = await prisma.clientProjectFile.create({
    data: {
      projectId: parsed.data.projectId,
      name: parsed.data.name,
      url: parsed.data.url,
    },
  });

  return NextResponse.json({ ok: true, file }, { status: 201 });
}
