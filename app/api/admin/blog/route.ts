import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { blogPostInputSchema } from "../../../../lib/schemas";
import { requireAdmin } from "../../../../lib/auth";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, posts });
}

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
  const parsed = blogPostInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const post = await prisma.blogPost.create({ data: parsed.data });
  return NextResponse.json({ ok: true, post }, { status: 201 });
}
