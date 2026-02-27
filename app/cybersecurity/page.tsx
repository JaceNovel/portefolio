import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cybersecurity",
  description: "Securing digital systems from vulnerabilities and cyber threats.",
};

type FeatureCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

function FeatureCard({ title, description, imageUrl, imageAlt }: FeatureCardProps) {
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-950/45 shadow-[0_0_28px_rgba(14,165,233,0.10)] md:min-h-[210px]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 md:items-stretch">
        <div className="relative overflow-hidden min-h-44 md:min-h-[210px] md:h-full">
          {/* Using <img> avoids Next/Image remote configuration for now */}
          <img src={imageUrl} alt={imageAlt} className="block h-full w-full object-cover" loading="lazy" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/35 via-slate-950/25 to-slate-950/55" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        <div className="relative flex flex-col justify-center p-5 sm:p-6">
          <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent md:block" />
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-200/85 sm:text-base">{description}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent" />
      </div>
    </section>
  );
}

export default function CybersecurityPage() {
  return (
    <main className="home-cyber-bg relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.20),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.20),transparent_42%),radial-gradient(circle_at_60%_90%,rgba(168,85,247,0.14),transparent_46%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="relative text-xs text-slate-300 sm:text-sm">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2 text-slate-500">›</span>
          <span>Cybersecurity</span>
        </div>

        <section className="relative mt-6 text-center">
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-white/10" />
            <h1 className="relative z-10 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">Cybersecurity</h1>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200/90 sm:text-lg">
            Securing digital systems from vulnerabilities and cyber threats
          </p>
          <div className="mx-auto mt-5 h-1 w-40 rounded-full bg-cyan-400/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        </section>

        <section className="relative mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <FeatureCard
            title="Systems & Networking"
            description="Linux systems, network configuration, and analysis with Wireshark and Nmap"
            imageUrl="https://www.rcb-informatique.fr/wp-content/uploads/2024/04/CyberSecur.jpeg"
            imageAlt="Laptop with code and networking tools"
          />

          <FeatureCard
            title="Web Application Security"
            description="OWASP principles, protection against XSS and SQL injection"
            imageUrl="https://tse1.mm.bing.net/th/id/OIP.E2o4yfOyu-WHTTw0gyA9TQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
            imageAlt="Cybersecurity lock illustration"
          />

          <FeatureCard
            title="Secure Architecture"
            description="Design and implement secure and reliable web and application architectures"
            imageUrl="https://mssolutions.ca/wp-content/uploads/2023/02/strategie-cybersecurite-1536x1024.png"
            imageAlt="Secure system architecture visual"
          />

          <FeatureCard
            title="Academic Projects"
            description="Security audits, pentesting exercises, and vulnerability assessments"
            imageUrl="https://mssolutions.ca/wp-content/uploads/2023/02/strategie-cybersecurite-1536x1024.png"
            imageAlt="Team working on security monitoring"
          />
        </section>

        <section className="relative mt-12 text-center">
          <h2 className="text-lg font-semibold text-white sm:text-2xl">Get a Free Security Audit for Your Site</h2>
          <div className="mt-5">
            <Link
              href="/audit-security"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)] backdrop-blur hover:bg-cyan-500/20"
            >
              Request an Audit
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
