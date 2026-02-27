import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

export default async function AdminBlogPostsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const posts: BlogRow[] = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
    },
  });

  return (
    <main className="admin-page-bg relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/75 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Blog Posts</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard-admin/blog/new"
              className="inline-flex h-10 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
            >
              New post
            </Link>
            <Link href="/dashboard-admin" className="text-sm font-medium text-cyan-200 underline">
              Retour
            </Link>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/70">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-slate-800/70 text-slate-100">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-200">{p.slug}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-200">Yes</span>
                    ) : (
                      <span className="rounded-md bg-amber-500/15 px-2 py-1 text-amber-200">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{formatDateLabel(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard-admin/blog/${p.id}/edit`}
                      className="inline-flex h-9 items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {posts.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-300" colSpan={5}>
                    Aucun post.
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
