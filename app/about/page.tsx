import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiTarget } from "react-icons/fi";
import { SiLinkedin, SiGithub, SiMinutemailer, SiHackthebox, SiSplunk, SiGithubactions } from "react-icons/si";

export const metadata: Metadata = {
  title: "About",
  description: "Parcours académique et objectifs en cybersécurité.",
};

export default function AboutPage() {
  const journey = [
    { year: "2023", text: "Started Cybersecurity at YNOV" },
    { year: "2024", text: "Web Development & Secure Systems" },
    { year: "2025", text: "Focus on Pentest • SOC • DevSecOps" },
    { year: "2026", text: "Goal: Cybersecurity Engineer" },
  ] as const;

  const values = [
    { label: "Security First", score: 100 },
    { label: "Excellence", score: 90 },
    { label: "Integrity", score: 95 },
    { label: "Innovation", score: 85 },
  ] as const;

  return (
    <main className="home-cyber-bg relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="text-xs text-slate-300 sm:text-sm">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2 text-slate-500">›</span>
          <span>About Me</span>
        </div>

        <section className="mt-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-6xl">
            About <span className="text-cyan-400">Me</span>
          </h1>
          <p className="mt-2 text-lg text-slate-200 sm:text-2xl">Cybersecurity Student & Future Security Expert</p>
          <div className="mx-auto mt-3 h-1 w-36 rounded-full bg-cyan-400/80 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <article className="rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-4 shadow-[0_0_20px_rgba(14,165,233,0.13)]">
              <div className="flex items-center gap-2 text-xl font-semibold text-white">
                <FiUser className="text-cyan-300" />
                <span>My Journey</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {journey.map((item) => (
                  <div key={item.year} className="flex items-center gap-3 border-b border-slate-800/70 pb-2.5">
                    <span className="rounded-md border border-emerald-400/35 bg-emerald-500/25 px-2.5 py-1 text-xs font-semibold text-emerald-300 sm:text-sm">{item.year}</span>
                    <span className="text-base text-slate-100 sm:text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </article>

            <article>
              <div className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
                <FiTarget className="text-cyan-300" />
                <span>My Objectives</span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-400/25 bg-slate-950/80 p-4 text-center shadow-[0_0_18px_rgba(16,185,129,0.14)]">
                  <div className="mx-auto w-fit rounded-xl border border-emerald-400/35 bg-emerald-500/25 p-2.5 text-xl text-emerald-300">
                    <SiHackthebox />
                  </div>
                  <h3 className="mt-2.5 text-lg font-semibold text-white">Pentest & Red Team</h3>
                  <p className="mt-1.5 text-sm text-slate-300 sm:text-base">Master ethical hacking & penetration testing</p>
                </div>

                <div className="rounded-2xl border border-cyan-400/25 bg-slate-950/80 p-4 text-center shadow-[0_0_18px_rgba(34,211,238,0.14)]">
                  <div className="mx-auto w-fit rounded-xl border border-cyan-400/35 bg-cyan-500/25 p-2.5 text-xl text-cyan-300">
                    <SiSplunk />
                  </div>
                  <h3 className="mt-2.5 text-lg font-semibold text-white">SOC Analyst</h3>
                  <p className="mt-1.5 text-sm text-slate-300 sm:text-base">Monitor & protect systems 24/7</p>
                </div>

                <div className="rounded-2xl border border-fuchsia-400/25 bg-slate-950/80 p-4 text-center shadow-[0_0_18px_rgba(168,85,247,0.14)]">
                  <div className="mx-auto w-fit rounded-xl border border-fuchsia-400/35 bg-fuchsia-500/25 p-2.5 text-xl text-fuchsia-300">
                    <SiGithubactions />
                  </div>
                  <h3 className="mt-2.5 text-lg font-semibold text-white">DevSecOps</h3>
                  <p className="mt-1.5 text-sm text-slate-300 sm:text-base">Build secure & scalable apps</p>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-cyan-400/25 bg-slate-950/85 p-3.5 shadow-[0_0_20px_rgba(14,165,233,0.16)]">
              <div className="overflow-hidden rounded-xl border border-cyan-400/20">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/WhatsApp%20Image%202026-02-26%20at%2013.26.05.jpeg"
                    alt="Photo de profil de Jonadab AMAH"
                    fill
                    className="object-cover object-[50%_0px]"
                    sizes="(min-width: 1024px) 320px, 100vw"
                    priority
                  />
                </div>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-white">Jonadab AMAH</h3>
              <p className="mt-1 text-lg text-cyan-300">Cybersecurity Student @ YNOV</p>

              <div className="mt-3 flex gap-2">
                <span className="rounded-md border border-slate-700 bg-slate-900/80 p-1.5 text-slate-100" aria-label="LinkedIn (coming soon)">
                  <SiLinkedin />
                </span>
                <a
                  href="https://github.com/JaceNovel"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-700 bg-slate-900/80 p-1.5 text-slate-100"
                  aria-label="GitHub"
                >
                  <SiGithub />
                </a>
                <a
                  href="mailto:jacenovel@gmail.com"
                  className="rounded-md border border-slate-700 bg-slate-900/80 p-1.5 text-slate-100"
                  aria-label="Email"
                >
                  <SiMinutemailer />
                </a>
              </div>
            </article>

            <article className="rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-4 shadow-[0_0_20px_rgba(14,165,233,0.14)]">
              <h3 className="text-xl font-semibold text-white">My Values</h3>
              <div className="mt-3 space-y-3.5">
                {values.map((v) => (
                  <div key={v.label}>
                    <div className="mb-1 flex items-center justify-between text-sm sm:text-base">
                      <span className="text-slate-100">{v.label}</span>
                      <span className="text-slate-300">{v.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${v.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
