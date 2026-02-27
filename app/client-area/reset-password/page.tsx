import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireClient } from "../../../lib/auth";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const session = await requireClient();
  if (!session) redirect("/client-area/login");

  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    select: { name: true, email: true, mustResetPassword: true },
  });

  if (!client) redirect("/client-area/login");
  if (!client.mustResetPassword) redirect("/client-area");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Changer le mot de passe</h1>
      <p className="mt-2 text-sm text-slate-300">{client.name} • {client.email}</p>

      <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/40 p-5">
        <ResetPasswordForm />
      </div>
    </main>
  );
}
