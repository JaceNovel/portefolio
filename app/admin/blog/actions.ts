"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export async function deleteBlogPostAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/dashboard-admin");
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  redirect("/dashboard-admin/login");
}
