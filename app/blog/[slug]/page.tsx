import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Markdown } from "../../../components/Markdown";
import { getServerEnv } from "../../../lib/env";
import { unstable_cache } from "next/cache";

export const revalidate = 60;

function getPostCached(slug: string) {
  return unstable_cache(
    async () => prisma.blogPost.findUnique({ where: { slug } }),
    ["blog:post", slug],
    { revalidate: 60 }
  )();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostCached(slug)
    .then((p) => (p ? { title: p.title, excerpt: p.excerpt, slug: p.slug, published: p.published } : null))
    .catch(() => null);
  if (!post || !post.published) return { title: "Article introuvable" };

  const env = getServerEnv();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const postResult = await getPostCached(slug)
    .then((post) => ({ dbOk: true as const, post }))
    .catch(() => ({ dbOk: false as const, post: null }));

  const { dbOk, post } = postResult;

  if (!post) {
    if (!dbOk) {
      return (
        <main className="min-h-screen bg-zinc-50">
          <div className="mx-auto w-full max-w-3xl px-4 py-10">
            <Link href="/blog" className="text-sm font-medium text-zinc-700 underline">
              Retour au blog
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Blog indisponible</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">La base de données est momentanément inaccessible. Réessayez plus tard.</p>
          </div>
        </main>
      );
    }
    return notFound();
  }
  if (!post.published) return notFound();

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Link href="/blog" className="text-sm font-medium text-zinc-700 underline">
          Retour au blog
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{post.title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{post.excerpt}</p>

        <article className="prose prose-zinc mt-6 max-w-none rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
          <Markdown content={post.content} />
        </article>
      </div>
    </main>
  );
}
