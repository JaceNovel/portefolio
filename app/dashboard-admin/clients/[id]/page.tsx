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

export default async function AdminClientDetailPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      mustResetPassword: true,
      projects: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          progress: true,
          createdAt: true,
          files: { select: { id: true, name: true, url: true, createdAt: true }, orderBy: { createdAt: "desc" } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, content: true, createdAt: true },
      },
    },
  });

  if (!client) notFound();

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Client</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{client.name}</h1>
            <p className="mt-1 text-sm text-slate-200">{client.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Créé: {formatDateLabel(client.createdAt)}</span>
            {client.mustResetPassword ? (
              <span className="rounded-md bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-200">Reset required</span>
            ) : (
              <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-200">Reset OK</span>
            )}
            <Link href="/dashboard-admin/clients" className="text-sm font-medium text-cyan-200 underline">
              Retour
            </Link>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Projets</h2>
            <div className="mt-4 space-y-3">
              {client.projects.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-100">{p.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{p.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex rounded-md bg-cyan-500/15 px-2 py-1 text-xs font-semibold text-cyan-200">
                        {p.progress}%
                      </span>
                      <p className="mt-2 whitespace-nowrap text-xs text-slate-400">{formatDateLabel(p.createdAt)}</p>
                    </div>
                  </div>

                  {p.files.length > 0 ? (
                    <div className="mt-3 border-t border-slate-800/70 pt-3">
                      <p className="text-xs font-semibold text-slate-200">Files</p>
                      <ul className="mt-2 space-y-1">
                        {p.files.map((f) => (
                          <li key={f.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate text-slate-200">{f.name}</span>
                            <a className="shrink-0 text-cyan-200 underline" href={f.url} target="_blank" rel="noreferrer">
                              Ouvrir
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}

              {client.projects.length === 0 ? <p className="text-sm text-slate-300">Aucun projet.</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Derniers messages</h2>
            <div className="mt-4 space-y-3">
              {client.messages.map((m) => (
                <div key={m.id} className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
                  <p className="text-xs text-slate-400">{formatDateLabel(m.createdAt)}</p>
                  <p className="mt-2 text-sm text-slate-100 whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
              {client.messages.length === 0 ? <p className="text-sm text-slate-300">Aucun message.</p> : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
