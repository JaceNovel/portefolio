import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { unstable_cache } from "next/cache";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWebProjectCached(slug).catch(() => null);

  if (!project) {
    return {
      title: "Projet introuvable",
    };
  }

  return {
    title: `${project.title} | Web project`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.imageUrl }],
    },
  };
}

export const revalidate = 60;

function getWebProjectCached(slug: string) {
  return unstable_cache(
    async () => prisma.webProject.findUnique({ where: { slug } }),
    ["webProject", slug],
    { revalidate: 60 }
  )();
}

export default async function WebProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getWebProjectCached(slug).catch(() => null);
  if (!project) notFound();

  return (
    <main className="web-design-no-bg mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <Link href="/web-design" className="text-sm font-medium text-slate-300 underline">
        Retour
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">{project.title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-white">Stack</h2>
          <p className="mt-2 text-sm text-slate-300">{project.stack}</p>
        </section>
        <section className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-white">Résultat</h2>
          <p className="mt-2 text-sm text-slate-300">{project.result}</p>
        </section>
      </div>

      <div className="mt-6">
        <a
          href={project.siteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center rounded-xl border border-emerald-500/25 bg-emerald-500/20 px-4 text-sm font-medium text-emerald-300"
        >
          Visiter le site
        </a>
      </div>
    </main>
  );
}
