import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: string;
  name: string;
  email: string;
  websiteUrl: string;
  status: string;
  createdAt: Date;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

export default async function AdminAuditsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const audits: AuditRow[] = await prisma.securityAuditRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      websiteUrl: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Security Audits</h1>
          </div>
          <Link href="/dashboard-admin" className="text-sm font-medium text-cyan-200 underline">
            Retour au dashboard
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/70">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a) => (
                <tr key={a.id} className="border-t border-slate-800/70 text-slate-100">
                  <td className="px-4 py-3 break-all">{a.websiteUrl}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-slate-300">{a.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-200">{a.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{formatDateLabel(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard-admin/audits/${a.id}`}
                      className="inline-flex h-9 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}
              {audits.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-300" colSpan={5}>
                    Aucun audit.
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
