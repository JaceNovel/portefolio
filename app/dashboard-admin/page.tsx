import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { adminLogoutAction } from "../../app/admin/blog/actions";
import { FiBarChart2, FiBookOpen, FiClipboard, FiFileText, FiGlobe, FiMail, FiShield, FiUser } from "react-icons/fi";

export const dynamic = "force-dynamic";

type RecentClientRequestItem = {
  id: string;
  name: string;
  budget: string | null;
  estimateCents: number | null;
  source: string;
  requestType: string | null;
  siteType: string | null;
};

type OpenAuditItem = {
  id: string;
  websiteUrl: string;
  createdAt: Date;
  status: string;
};

type LatestProjectItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type LatestBlogPostItem = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Date;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatTimeAgo(value: Date) {
  const seconds = Math.max(1, Math.floor((Date.now() - value.getTime()) / 1000));
  const days = Math.floor(seconds / 86400);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const minutes = Math.floor(seconds / 60);
  return `${Math.max(1, minutes)} min ago`;
}

function formatBudgetLabel(params: { budget: string | null; estimateCents: number | null }) {
  if (params.budget) return params.budget;
  if (typeof params.estimateCents === "number") return `€${(params.estimateCents / 100).toFixed(0)}`;
  return "—";
}

function getScopeLabel(params: { requestType: string | null; siteType: string | null; source: string }) {
  if (params.requestType) return params.requestType;
  if (params.siteType) return `${params.siteType} Website`;
  if (params.source === "web-design") return "Web Design Project";
  if (params.source === "devis") return "Quote Request";
  return "Client Request";
}

export default async function DashboardAdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard-admin/login");

  const [
    clientRequestsCount,
    pendingAuditsCount,
    webProjectsCount,
    publishedBlogPostsCount,
    recentClientRequests,
    openAudits,
    latestProjects,
    latestBlogPosts,
  ]: [number, number, number, number, RecentClientRequestItem[], OpenAuditItem[], LatestProjectItem[], LatestBlogPostItem[]] =
    await Promise.all([
    prisma.projectRequest.count(),
    prisma.securityAuditRequest.count({ where: { status: { not: "Terminé" } } }),
    prisma.webProject.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.projectRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        budget: true,
        estimateCents: true,
        source: true,
        requestType: true,
        siteType: true,
      },
    }),
    prisma.securityAuditRequest.findMany({
      where: { status: { not: "Terminé" } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, websiteUrl: true, createdAt: true, status: true },
    }),
    prisma.webProject.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, imageUrl: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, title: true, excerpt: true, createdAt: true },
    }),
  ]);

  return (
    <main className="home-cyber-bg relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(6,182,212,0.18),transparent_42%),radial-gradient(circle_at_85%_18%,rgba(59,130,246,0.2),transparent_44%),radial-gradient(circle_at_78%_86%,rgba(16,185,129,0.14),transparent_38%)]" />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-cyan-400/20 bg-slate-950/55 shadow-[0_0_35px_rgba(14,165,233,0.12)] backdrop-blur-lg">
          <div className="border-b border-cyan-500/20 px-5 py-5">
            <h2 className="text-2xl font-semibold text-white">
              <span className="text-cyan-300">Jonadab</span> AMAH
            </h2>
          </div>

          <nav className="space-y-1 px-3 py-4">
            <a href="#" className="flex items-center gap-3 rounded-xl bg-cyan-500/10 px-3 py-2.5 text-sm font-semibold text-cyan-100 ring-1 ring-inset ring-cyan-500/35">
              <FiBarChart2 className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </a>
            <a href="#requests" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900/60">
              <FiClipboard className="h-4 w-4" aria-hidden="true" />
              Client Requests
            </a>
            <a href="#audits" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900/60">
              <FiShield className="h-4 w-4" aria-hidden="true" />
              Security Audits
            </a>
            <a href="#projects" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900/60">
              <FiGlobe className="h-4 w-4" aria-hidden="true" />
              Web Projects
            </a>
            <a href="#blog" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900/60">
              <FiBookOpen className="h-4 w-4" aria-hidden="true" />
              Blog Posts
            </a>
            <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900/60">
              <FiUser className="h-4 w-4" aria-hidden="true" />
              Clients
            </a>
          </nav>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/50 px-5 py-4 shadow-[0_0_28px_rgba(14,165,233,0.1)] sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-semibold text-white">Dashboard</h1>

            <div className="flex items-center gap-3">
              <div className="hidden h-10 min-w-60 items-center rounded-xl border border-cyan-500/20 bg-slate-900/70 px-3 text-sm text-slate-300 md:flex">
                Search...
              </div>
              <form action={adminLogoutAction}>
                <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20">
                  <FiMail className="h-4 w-4" aria-hidden="true" />
                  Logout
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-cyan-400/25 bg-slate-950/55 p-4 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
              <div className="flex items-center justify-between text-cyan-200">
                <FiClipboard className="h-6 w-6" aria-hidden="true" />
                <span className="text-3xl font-semibold text-white">{clientRequestsCount}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Client Requests</p>
            </article>

            <article className="rounded-2xl border border-emerald-400/25 bg-slate-950/55 p-4 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
              <div className="flex items-center justify-between text-emerald-200">
                <FiShield className="h-6 w-6" aria-hidden="true" />
                <span className="text-3xl font-semibold text-white">{pendingAuditsCount}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Pending Audits</p>
            </article>

            <article className="rounded-2xl border border-cyan-400/25 bg-slate-950/55 p-4 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
              <div className="flex items-center justify-between text-cyan-200">
                <FiGlobe className="h-6 w-6" aria-hidden="true" />
                <span className="text-3xl font-semibold text-white">{webProjectsCount}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Web Projects</p>
            </article>

            <article className="rounded-2xl border border-cyan-400/25 bg-slate-950/55 p-4 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
              <div className="flex items-center justify-between text-cyan-200">
                <FiFileText className="h-6 w-6" aria-hidden="true" />
                <span className="text-3xl font-semibold text-white">{publishedBlogPostsCount}</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">Published Blog Posts</p>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article id="requests" className="rounded-2xl border border-cyan-400/20 bg-slate-950/55 p-4">
              <h2 className="text-2xl font-semibold text-white">Recent Client Requests</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/70 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 font-medium">Scope</th>
                      <th className="px-3 py-2 font-medium">Client</th>
                      <th className="px-3 py-2 font-medium">Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClientRequests.map((item: RecentClientRequestItem) => (
                      <tr key={item.id} className="border-t border-slate-800/70 text-slate-100">
                        <td className="px-3 py-2">{getScopeLabel(item)}</td>
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2">
                          <span className="rounded-md bg-cyan-500/15 px-2 py-1 text-cyan-200">{formatBudgetLabel(item)}</span>
                        </td>
                      </tr>
                    ))}
                    {recentClientRequests.length === 0 ? (
                      <tr>
                        <td className="px-3 py-3 text-slate-300" colSpan={3}>
                          No client requests yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </article>

            <article id="audits" className="rounded-2xl border border-cyan-400/20 bg-slate-950/55 p-4">
              <h2 className="text-2xl font-semibold text-white">Open Security Audits</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/80">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/70 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 font-medium">Domain</th>
                      <th className="px-3 py-2 font-medium">Requested at</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openAudits.map((audit: OpenAuditItem) => (
                      <tr key={audit.id} className="border-t border-slate-800/70 text-slate-100">
                        <td className="px-3 py-2">{audit.websiteUrl}</td>
                        <td className="px-3 py-2">{formatDateLabel(audit.createdAt)}</td>
                        <td className="px-3 py-2">
                          <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-200">{audit.status}</span>
                        </td>
                      </tr>
                    ))}
                    {openAudits.length === 0 ? (
                      <tr>
                        <td className="px-3 py-3 text-slate-300" colSpan={3}>
                          No open audits.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
            <article id="projects" className="rounded-2xl border border-cyan-400/20 bg-slate-950/55 p-4">
              <h2 className="text-2xl font-semibold text-white">Latest Web Projects</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {latestProjects.map((project: LatestProjectItem) => (
                  <div key={project.id} className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/70">
                    <img src={project.imageUrl} alt={project.title} className="h-24 w-full object-cover" loading="lazy" />
                    <p className="px-3 py-2 text-sm text-slate-100">{project.title}</p>
                  </div>
                ))}
                {latestProjects.length === 0 ? (
                  <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-4 text-sm text-slate-300 sm:col-span-3">
                    No web projects yet.
                  </div>
                ) : null}
              </div>
            </article>

            <article id="blog" className="rounded-2xl border border-cyan-400/20 bg-slate-950/55 p-4">
              <h2 className="text-2xl font-semibold text-white">Blog Activity</h2>
              <div className="mt-4 space-y-4">
                {latestBlogPosts.map((post: LatestBlogPostItem) => (
                  <div key={post.id} className="border-b border-slate-800/70 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-100">{post.title}</h3>
                      <span className="whitespace-nowrap text-xs text-slate-400">{formatTimeAgo(post.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{post.excerpt}</p>
                  </div>
                ))}
                {latestBlogPosts.length === 0 ? <p className="text-sm text-slate-300">No blog activity yet.</p> : null}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
