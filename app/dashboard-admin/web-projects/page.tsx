import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

type WebProjectRow = {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  siteUrl: string;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

export default async function AdminWebProjectsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const projects: WebProjectRow[] = await prisma.webProject.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      siteUrl: true,
    },
  });

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Web Projects</h1>
          </div>
          <Link href="/dashboard-admin" className="text-sm font-medium text-cyan-200 underline">
            Retour au dashboard
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/70">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Site URL</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-slate-800/70 text-slate-100">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-200">{p.slug}</td>
                  <td className="px-4 py-3">
                    <a href={p.siteUrl} target="_blank" rel="noreferrer" className="text-cyan-200 underline">
                      Open
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{formatDateLabel(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard-admin/web-projects/${p.id}`}
                      className="inline-flex h-9 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}
              {projects.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-300" colSpan={5}>
                    Aucun projet.
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
