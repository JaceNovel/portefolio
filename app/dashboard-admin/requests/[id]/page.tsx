import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { approveWebDesignRequestAction } from "../../actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
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

export default async function AdminRequestDetailPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const { id } = await params;

  const req = await prisma.projectRequest.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      requestType: true,
      budget: true,
      description: true,
      siteType: true,
      pageCount: true,
      options: true,
      estimateCents: true,
      source: true,
      status: true,
      createdAt: true,
    },
  });

  if (!req) notFound();

  const canApprove = req.source === "web-design" && req.status !== "Approuvé";

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Client Request</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{req.name}</h1>
            <p className="mt-1 text-sm text-slate-200">{req.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-md bg-slate-800/70 px-2 py-1 text-xs font-semibold text-slate-200">{req.source}</span>
            <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-200">{req.status}</span>
            <Link href="/dashboard-admin/requests" className="text-sm font-medium text-cyan-200 underline">
              Retour
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4">
          <section className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Created</dt>
                <dd className="mt-1 text-slate-100">{formatDateLabel(req.createdAt)}</dd>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Budget</dt>
                <dd className="mt-1 text-slate-100">{formatBudgetLabel(req)}</dd>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Phone</dt>
                <dd className="mt-1 text-slate-100">{req.phone ?? "—"}</dd>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Request type</dt>
                <dd className="mt-1 text-slate-100">{req.requestType ?? "—"}</dd>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Site type</dt>
                <dd className="mt-1 text-slate-100">{req.siteType ?? "—"}</dd>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Page count</dt>
                <dd className="mt-1 text-slate-100">{typeof req.pageCount === "number" ? req.pageCount : "—"}</dd>
              </div>
            </dl>

            {req.description ? (
              <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-300">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-100">{req.description}</p>
              </div>
            ) : null}

            {req.options ? (
              <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold text-slate-300">Options (raw)</p>
                <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-slate-950/60 p-3 text-xs text-slate-200">{JSON.stringify(req.options, null, 2)}</pre>
              </div>
            ) : null}
          </section>

          {canApprove ? (
            <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
              <h2 className="text-xl font-semibold text-emerald-100">Approve (Web Design)</h2>
              <p className="mt-2 text-sm text-emerald-100/90">
                This creates (or updates) the client account, creates a client project, marks the request as approved, and emails the access.
              </p>
              <form action={approveWebDesignRequestAction} className="mt-4">
                <input type="hidden" name="requestId" value={req.id} />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
                >
                  Approve request
                </button>
              </form>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
