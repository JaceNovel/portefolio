"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { getServerEnv } from "../../lib/env";
import { sendClientAccessEmail } from "../../lib/email";

function makeTempPassword() {
  // 12–16 chars, URL-safe.
  return crypto.randomBytes(12).toString("base64url").slice(0, 14);
}

export async function approveWebDesignRequestAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return;

  const req = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!req || req.source !== "web-design") return;

  // Avoid double-approving.
  if (req.status === "Approuvé") return;

  const tempPassword = makeTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const email = req.email.toLowerCase();
  const name = req.name;

  const client = await prisma.client.upsert({
    where: { email },
    create: {
      name,
      email,
      password: passwordHash,
      mustResetPassword: true,
    },
    update: {
      name,
      password: passwordHash,
      mustResetPassword: true,
    },
    select: { id: true, email: true, name: true },
  });

  const title = req.siteType ? `Site web — ${req.siteType}` : "Site web";
  const description = req.description ?? "Demande envoyée depuis le simulateur Web Design.";

  await prisma.$transaction([
    prisma.clientProject.create({
      data: {
        clientId: client.id,
        title,
        description,
        progress: 0,
      },
      select: { id: true },
    }),
    prisma.projectRequest.update({
      where: { id: req.id },
      data: { status: "Approuvé" },
      select: { id: true },
    }),
  ]);

  const env = getServerEnv();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const loginUrl = `${baseUrl.replace(/\/$/, "")}/client-area/login`;

  await sendClientAccessEmail({
    to: client.email,
    name: client.name,
    tempPassword,
    loginUrl,
  });

  revalidatePath("/dashboard-admin");
}
