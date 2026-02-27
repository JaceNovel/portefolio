import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { unstable_cache } from "next/cache";

export const revalidate = 60;

const getPublishedPostsCached = unstable_cache(
  async () => {
    return prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, createdAt: true },
    });
  },
  ["blog:publishedPosts"],
  { revalidate: 60 }
);

export const metadata: Metadata = {
  title: "Blog cybersécurité",
  description: "Articles cybersécurité (bonnes pratiques, durcissement, audits).",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage() {
  let dbOk = true;
  const posts = await getPublishedPostsCached()
    .catch(() => {
      dbOk = false;
      return [];
    });

  const featuredPosts = posts.slice(0, 3);
  const recentPosts = posts.slice(3);

  return (
    <main className="home-cyber-bg relative min-h-screen overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_8%_42%,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_92%_80%,rgba(34,211,238,0.12),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-cyan-200 sm:text-6xl">Blog</h1>
          <div className="mx-auto mt-4 h-[3px] w-36 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.45)]" />
          <p className="mt-5 text-sm leading-6 text-slate-300 sm:text-base">
            Insights cybersécurité, retours terrain et méthodes concrètes pour protéger vos plateformes web.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-700/70 bg-slate-900/50 p-5 text-sm text-slate-200">
            {dbOk ? "Aucun article publié pour le moment." : "Blog temporairement indisponible (base de données inaccessible)."}
          </div>
        ) : (
          <>
            <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-cyan-200/20 bg-slate-900/55 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-200/45"
                >
                  <div className="relative h-44 overflow-hidden border-b border-cyan-200/15 bg-gradient-to-br from-slate-900 via-blue-950/80 to-cyan-950/60">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.25),transparent_32%),radial-gradient(circle_at_80%_86%,rgba(59,130,246,0.25),transparent_35%)]" />
                    <span className="absolute left-4 top-4 rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-100">
                      Article {index + 1}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="line-clamp-2 text-2xl font-semibold leading-tight text-slate-50 transition group-hover:text-cyan-100">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">{formatDate(post.createdAt)}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </section>

            <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="flex items-center gap-4">
                  <span className="h-6 w-1 rounded-full bg-cyan-300" />
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-100">Recent Articles</h2>
                  <span className="h-px flex-1 bg-cyan-300/35" />
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  {(recentPosts.length > 0 ? recentPosts : posts).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 transition hover:border-cyan-300/40 hover:bg-slate-900/65"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="h-28 w-full shrink-0 rounded-xl border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-blue-950/80 to-cyan-950/65 sm:w-40" />
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-slate-100 transition group-hover:text-cyan-100">{post.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{formatDate(post.createdAt)}</p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{post.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <aside className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5">
                <label htmlFor="blog-search" className="sr-only">
                  Rechercher un article
                </label>
                <div className="relative">
                  <input
                    id="blog-search"
                    type="search"
                    placeholder="Search"
                    className="h-11 w-full rounded-xl border border-cyan-300/25 bg-slate-950/70 px-4 pr-12 text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300">⌕</span>
                </div>

                <p className="mt-8 text-sm leading-6 text-slate-300">Recevez les derniers articles et analyses publiés par l’équipe.</p>

                <div className="mt-5 flex items-center">
                  {[
                    "https://i.pravatar.cc/96?img=12",
                    "https://i.pravatar.cc/96?img=32",
                    "https://i.pravatar.cc/96?img=47",
                    "https://i.pravatar.cc/96?img=56",
                  ].map((src, index) => (
                    <div key={src} className="-ml-2 first:ml-0 overflow-hidden rounded-full border border-cyan-300/45">
                      <Image src={src} alt={`Profil ${index + 1}`} width={44} height={44} className="h-11 w-11 object-cover" />
                    </div>
                  ))}
                  <div className="ml-3 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-100">+290</div>
                </div>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex h-11 items-center rounded-xl border border-cyan-300/35 bg-cyan-500/10 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  Discuter de votre projet
                </Link>
              </aside>
            </section>
          </>
        )}

        <div className="mt-10">
          <Link href="/" className="inline-flex text-sm font-medium text-cyan-200 underline underline-offset-4">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
