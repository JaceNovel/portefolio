import { Metadata } from "next";
import Link from "next/link";
import { AuditForm } from "./AuditForm";

export const metadata: Metadata = {
  title: "Audit security",
  description: "Request a free security audit for your website.",
};

export default function AuditSecurityPage() {
  return (
    <main className="home-cyber-bg relative min-h-screen overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_12%_38%,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_90%_76%,rgba(34,211,238,0.13),transparent_35%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-200">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-300">Security Audit</span>
        </div>

        <section className="mt-6 grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-6xl">
              Request a Free <span className="text-cyan-300">Security Audit</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Check your website for vulnerabilities, weaknesses, and security gaps.
            </p>
            <div className="mt-4 h-[3px] w-40 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.45)]" />
          </div>

          <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-cyan-300/20 bg-slate-900/45 p-5 backdrop-blur lg:mx-0">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.16),transparent_42%)]" />
            <div className="relative flex items-center justify-center">
              <div className="grid h-24 w-24 place-items-center rounded-2xl border border-cyan-300/35 bg-cyan-500/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12">
                  <path
                    d="M12 3 4 6v6c0 5.4 3.6 8.9 8 10 4.4-1.1 8-4.6 8-10V6l-8-3Zm-1.2 12.7-3-3a1 1 0 0 1 1.4-1.4l1.6 1.6 3.9-3.9a1 1 0 1 1 1.4 1.4l-5.3 5.3Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-cyan-300/25 bg-slate-900/55 p-6 backdrop-blur">
              <h2 className="text-2xl font-semibold text-slate-100">Request Form</h2>
              <div className="mt-5">
                <AuditForm />
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-8">
            <article className="rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-6 backdrop-blur">
              <h3 className="text-2xl font-semibold text-slate-100">Our Security Audit Process</h3>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {[
                  { title: "Automated Scan", text: "Identify vulnerabilities and risks.", icon: "⎔" },
                  { title: "Manual Testing", text: "Exploit vulnerabilities for validation.", icon: "⌁" },
                  { title: "Detailed Report", text: "Actionable insights and recommendations.", icon: "☰" },
                ].map((step) => (
                  <div key={step.title}>
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/35 bg-cyan-500/10 text-cyan-200">
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-100">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{step.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 text-cyan-200">✓</div>
                <div className="h-px flex-1 bg-slate-700" />
                <div className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 text-cyan-200">✓</div>
                <div className="h-px flex-1 bg-slate-700" />
                <div className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 text-cyan-200">✓</div>
              </div>
            </article>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-6 backdrop-blur">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "CSRF\nProtection",
                    "SQL\nInjection",
                    "Secure\nAuthentication",
                    "SSL/TLS",
                  ].map((item) => (
                    <div key={item} className="rounded-xl border border-cyan-300/25 bg-slate-950/50 p-3 text-center">
                      <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/35 bg-cyan-500/10 text-cyan-200">⬚</div>
                      <p className="whitespace-pre-line text-sm font-medium text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-300">A secure foundation that is tailored for your site.</p>
              </article>

              <article className="rounded-2xl border border-cyan-300/25 bg-slate-900/55 p-6 backdrop-blur">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/35 bg-cyan-500/10 text-cyan-200">🔒</div>
                  <p className="text-lg font-semibold leading-7 text-slate-100">Your information is kept confidential and secure.</p>
                </div>

                <ul className="mt-6 space-y-4 text-base text-slate-200">
                  {[
                    "Site Protection",
                    "Detailed Analysis",
                    "Expert Recommendations",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <span className="text-cyan-300">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
