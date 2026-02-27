import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { blogPostInputSchema } from "../../../../../lib/schemas";
import { requireAdmin } from "../../../../../lib/auth";
import { enforceSameOrigin } from "../../../../../lib/csrf";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = blogPostInputSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }

  const post = await prisma.blogPost.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    enforceSameOrigin(_req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
