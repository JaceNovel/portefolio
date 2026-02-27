import { Metadata } from "next";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { CreateWebsiteCta } from "./CreateWebsiteCta";

export const metadata: Metadata = {
  title: "Web Design",
  description: "Modern, fast, and secure websites tailored to your business needs.",
};

type ServiceCardProps = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  bullets: string[];
};

function ServiceCard({ title, imageUrl, imageAlt, bullets }: ServiceCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-950/45 shadow-[0_0_26px_rgba(14,165,233,0.10)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img src={imageUrl} alt={imageAlt} className="block h-full w-full object-cover" loading="lazy" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/20 to-slate-950/75" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-200/85">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <FiCheck className="mt-0.5 shrink-0 text-emerald-300" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function WebDesignPage() {
  const services: ServiceCardProps[] = [
    {
      title: "Business Website",
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "Business website preview",
      bullets: ["Professional Design", "Mobile Responsive", "SSL Security"],
    },
    {
      title: "E-Commerce Platform",
      imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "E-commerce storefront",
      bullets: ["Online Payments", "Product Catalog", "Secure Transactions"],
    },
    {
      title: "Custom Dashboard",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "Admin dashboard",
      bullets: ["Data Management", "Admin Tools", "Secure Login"],
    },
    {
      title: "Secure Web Applications",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "Code editor",
      bullets: ["Security Focused", "Custom Solutions", "API Protection"],
    },
  ];

  return (
    <main className="web-design-no-bg relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.20),transparent_42%),radial-gradient(circle_at_60%_90%,rgba(16,185,129,0.12),transparent_46%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="relative text-xs text-slate-300 sm:text-sm">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2 text-slate-500">›</span>
          <span>Web Design</span>
        </div>

        <section className="relative mt-6 text-center">
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-white/10" />
            <h1 className="relative z-10 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Web Design & <span className="text-cyan-300">Secure Development</span>
            </h1>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200/90 sm:text-lg">
            Modern, fast, and secure websites tailored to your business needs
          </p>
          <div className="mx-auto mt-5 h-1 w-52 rounded-full bg-cyan-400/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        </section>

        <section className="relative mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.title} title={s.title} imageUrl={s.imageUrl} imageAlt={s.imageAlt} bullets={s.bullets} />
          ))}
        </section>

        <CreateWebsiteCta />
      </div>
    </main>
  );
}

