import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Jonadab AMAH pour un projet web sécurisé.",
};

export default function ContactPage() {
  return (
    <main className="home-cyber-bg relative min-h-screen overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_12%_35%,rgba(34,211,238,0.13),transparent_32%),radial-gradient(circle_at_88%_78%,rgba(34,211,238,0.14),transparent_38%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-200">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-300">Contact</span>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-cyan-200 sm:text-6xl">Contact</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg">
            Let&apos;s discuss how I can help secure your business and build your web presence
          </p>
          <div className="mx-auto mt-4 h-[3px] w-40 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.45)]" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <aside className="space-y-5 lg:col-span-4">
            <section className="rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-cyan-200">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/35 bg-cyan-500/10">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    <path
                      d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v11c0 .276.224.5.5.5h11a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-11Zm1.2 3.6a1 1 0 1 1 1.4-1.4L12 11l2.9-2.8a1 1 0 1 1 1.4 1.4L13.4 12l2.9 2.8a1 1 0 1 1-1.4 1.4L12 13.4l-2.9 2.8a1 1 0 1 1-1.4-1.4l2.9-2.8-2.9-2.8Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <h2 className="text-3xl font-semibold text-slate-100">Contact Information</h2>
              </div>

              <div className="mt-6 space-y-4 text-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4 text-base">
                  <span className="text-cyan-300">✉</span>
                  <span>contact@kernelxnotrace.com</span>
                </div>
                <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4 text-base">
                  <span className="text-cyan-300">☎</span>
                  <span>+33 6 88 63 92 94</span>
                </div>
                <div className="flex items-center gap-3 text-base">
                  <span className="text-cyan-300">⌖</span>
                  <span>YNOV Campus Lyon, France</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 text-cyan-300">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-2xl transition hover:text-cyan-100" aria-label="LinkedIn">
                  in
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-2xl transition hover:text-cyan-100" aria-label="GitHub">
                  ⌘
                </a>
              </div>
            </section>

            <section className="rounded-2xl border border-cyan-300/20 bg-slate-900/55 p-6 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/35 bg-cyan-500/10 text-cyan-200">✦</span>
                <p className="text-base leading-7 text-slate-200">Feel free to reach out for any inquiries or project discussions.</p>
              </div>

              <div className="mt-6 flex items-center">
                {[
                  "https://i.pravatar.cc/96?img=12",
                  "https://i.pravatar.cc/96?img=32",
                  "https://i.pravatar.cc/96?img=47",
                  "https://i.pravatar.cc/96?img=56",
                ].map((src, index) => (
                  <div key={src} className="-ml-2 first:ml-0 overflow-hidden rounded-full border border-cyan-300/45">
                    <Image src={src} alt={`Profil ${index + 1}`} width={48} height={48} className="h-12 w-12 object-cover" />
                  </div>
                ))}
                <div className="ml-3 rounded-md border border-cyan-300/40 bg-cyan-500/10 px-3 py-1.5 text-lg font-semibold text-cyan-100">+50</div>
              </div>
            </section>
          </aside>

          <section className="rounded-2xl border border-cyan-300/25 bg-slate-900/55 p-6 backdrop-blur lg:col-span-8 sm:p-7">
            <h2 className="text-3xl font-semibold text-slate-100">Contact Form</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
