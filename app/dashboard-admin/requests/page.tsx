import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  name: string;
  email: string;
  source: string;
  status: string;
  requestType: string | null;
  siteType: string | null;
  budget: string | null;
  estimateCents: number | null;
  createdAt: Date;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatBudgetLabel(params: { budget: string | null; estimateCents: number | null }) {
  if (params.budget) return params.budget;
  if (typeof params.estimateCents === "number") return `€${(params.estimateCents / 100).toFixed(0)}`;
  return "—";
}

function scopeLabel(params: { requestType: string | null; siteType: string | null; source: string }) {
  if (params.requestType) return params.requestType;
  if (params.siteType) return `${params.siteType} Website`;
  if (params.source === "web-design") return "Web Design Project";
  if (params.source === "devis") return "Quote Request";
  if (params.source === "contact") return "Contact";
  return params.source;
}

export default async function AdminRequestsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const requests: RequestRow[] = await prisma.projectRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      source: true,
      status: true,
      requestType: true,
      siteType: true,
      budget: true,
      estimateCents: true,
      createdAt: true,
    },
  });

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Client Requests</h1>
          </div>
          <Link href="/dashboard-admin" className="text-sm font-medium text-cyan-200 underline">
            Retour au dashboard
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/70">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Scope</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-800/70 text-slate-100">
                  <td className="px-4 py-3">{scopeLabel(r)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-300">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-800/70 px-2 py-1 text-slate-200">{r.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-cyan-500/15 px-2 py-1 text-cyan-200">{formatBudgetLabel(r)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-200">{r.status}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{formatDateLabel(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard-admin/requests/${r.id}`}
                      className="inline-flex h-9 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}
              {requests.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-300" colSpan={7}>
                    Aucune demande.
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
