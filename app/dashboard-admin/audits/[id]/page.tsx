import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

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

export default async function AdminAuditDetailPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const { id } = await params;

  const audit = await prisma.securityAuditRequest.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      websiteUrl: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  if (!audit) notFound();

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Security Audit</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{audit.websiteUrl}</h1>
            <p className="mt-1 text-sm text-slate-200">{audit.name} — {audit.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-200">{audit.status}</span>
            <Link href="/dashboard-admin/audits" className="text-sm font-medium text-cyan-200 underline">
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
                <dd className="mt-1 text-slate-100">{formatDateLabel(audit.createdAt)}</dd>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                <dt className="text-xs font-semibold text-slate-300">Status</dt>
                <dd className="mt-1 text-slate-100">{audit.status}</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold text-slate-300">Description</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-100">{audit.description}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
