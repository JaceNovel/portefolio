import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

type ClientRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  mustResetPassword: boolean;
  _count: { projects: number; messages: number };
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

export default async function AdminClientsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const clients: ClientRow[] = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      mustResetPassword: true,
      _count: { select: { projects: true, messages: true } },
    },
  });

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Clients</h1>
          </div>
          <Link href="/dashboard-admin" className="text-sm font-medium text-cyan-200 underline">
            Retour au dashboard
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/70">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Projects</th>
                <th className="px-4 py-3 font-medium">Messages</th>
                <th className="px-4 py-3 font-medium">Reset</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-slate-800/70 text-slate-100">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-200">{c.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{formatDateLabel(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-cyan-500/15 px-2 py-1 text-cyan-200">{c._count.projects}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-800/70 px-2 py-1 text-slate-200">{c._count.messages}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.mustResetPassword ? (
                      <span className="rounded-md bg-amber-500/15 px-2 py-1 text-amber-200">Required</span>
                    ) : (
                      <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-200">OK</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard-admin/clients/${c.id}`}
                      className="inline-flex h-9 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}
              {clients.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-300" colSpan={7}>
                    Aucun client.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
