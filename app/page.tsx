import Link from "next/link";
import { prisma } from "../lib/prisma";
import { TechnologiesSection } from "../components/TechnologiesSection";
import { AutoScrollRow } from "../components/AutoScrollRow";
import { ProjectCardLink } from "../components/ProjectCardLink";

export const revalidate = 60;

type ProjectCard = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
};

export default async function HomePage() {
  const projects: ProjectCard[] = await prisma.webProject
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, slug: true, description: true, imageUrl: true },
    })
    .catch(() => []);

  const projectCards: ProjectCard[] =
    projects.length > 0
      ? projects
      : [
          {
            id: "demo-1",
            title: "Modern Business Site",
            slug: "web-design",
            description: "Architecture moderne et SEO-ready.",
            imageUrl: "/modern-business-site.png",
          },
          {
            id: "demo-2",
            title: "E-Commerce Platform",
            slug: "web-design",
            description: "Parcours utilisateur sécurisé et rapide.",
            imageUrl: "/ecommerce-platform.png",
          },
          {
            id: "demo-3",
            title: "Custom Dashboard",
            slug: "web-design",
            description: "Espace admin sécurisé avec API durcies.",
            imageUrl: "/custom-dashboard.png",
          },
        ];

  return (
    <main className="home-cyber-bg relative">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <section className="relative py-10 sm:py-12">
          <div className="p-6 text-center sm:p-10">
            <h1 className="text-4xl font-bold uppercase tracking-wide text-white drop-shadow-lg sm:text-7xl">Jonadab AMAH</h1>
            <p className="mt-4 text-xl font-semibold text-slate-50 drop-shadow sm:text-4xl">Cybersecurity Student & Secure Web Architect</p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-50 drop-shadow sm:text-xl">
              I build secure, scalable, and performance-driven digital platforms
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/cybersecurity"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-blue-400/60 bg-blue-500/65 px-6 text-base font-semibold text-slate-100 shadow-[0_0_18px_rgba(37,99,235,0.35)] hover:bg-blue-500/75 sm:w-auto sm:min-w-[270px]"
              >
                View My Cybersecurity Work
              </Link>
              <Link
                href="/web-design"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-emerald-300/80 bg-emerald-500/80 px-6 text-base font-semibold text-white shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:bg-emerald-500/90 sm:w-auto sm:min-w-[270px]"
              >
                Create Your Secure Website
              </Link>
            </div>
          </div>
        </section>

        <TechnologiesSection />

        <section className="pb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold text-white">Latest Projects</h2>
            <div className="h-px flex-1 bg-cyan-400/30" />
          </div>

          <AutoScrollRow className="hide-scrollbar mt-5 grid grid-cols-1 gap-4 md:flex md:gap-6 md:overflow-x-auto md:pb-3">
            {projectCards.map((p: ProjectCard, index) => {
              const href =
                p.title === "Modern Business Site"
                  ? "https://primegaming.space"
                  : p.title === "E-Commerce Platform" || p.title === "Custom Dashboard"
                    ? "https://futurind.space"
                    : p.slug === "web-design"
                      ? "/web-design"
                      : `/web-design/${p.slug}`;

              return <ProjectCardLink key={p.id} href={href} title={p.title} imageUrl={p.imageUrl || undefined} index={index} />;
            })}
          </AutoScrollRow>
        </section>

        <section className="pb-12 pt-4 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Interested in a Security Audit?</h2>
          <p className="mt-3 text-lg text-slate-50">Get a free audit of your website’s vulnerabilities</p>
          <Link
            href="/audit-security"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-xl border border-emerald-400/45 bg-emerald-500/35 px-6 text-base font-semibold text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:bg-emerald-500/45"
          >
            Request Free Audit
          </Link>
        </section>
      </div>
    </main>
  );
}

