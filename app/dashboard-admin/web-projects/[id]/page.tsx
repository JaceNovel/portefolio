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

export default async function AdminWebProjectDetailPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const { id } = await params;

  const project = await prisma.webProject.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      siteUrl: true,
      stack: true,
      result: true,
      createdAt: true,
    },
  });

  if (!project) notFound();

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Web Project</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">{project.title}</h1>
            <p className="mt-1 text-sm text-slate-200">Slug: {project.slug}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{formatDateLabel(project.createdAt)}</span>
            <Link href="/dashboard-admin/web-projects" className="text-sm font-medium text-cyan-200 underline">
              Retour
            </Link>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <section className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Description</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200 whitespace-pre-wrap">{project.description}</p>
          </section>

          <section className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Stack</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200 whitespace-pre-wrap">{project.stack}</p>
          </section>

          <section className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Result</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200 whitespace-pre-wrap">{project.result}</p>
          </section>

          <section className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Links</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href={project.siteUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-xl border border-emerald-500/25 bg-emerald-500/20 px-4 text-sm font-semibold text-emerald-200">
                Open site
              </a>
              {project.imageUrl ? (
                <a href={project.imageUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 text-sm font-semibold text-cyan-100">
                  Open image
                </a>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
