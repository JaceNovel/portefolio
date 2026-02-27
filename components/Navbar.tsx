"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about", label: "About" },
  { href: "/cybersecurity", label: "Cybersecurity" },
  { href: "/web-design", label: "Web Design" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard-admin") || pathname.startsWith("/admin")) {
    return null;
  }

  const isActiveLink = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <nav className="flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="inline-flex items-center justify-center">
              <Image
                src="https://img.icons8.com/?size=188&id=28kzIB2E5Rat&format=png"
                alt="Hub logo"
                width={40}
                height={40}
                className="h-10 w-10"
                priority
              />
            </span>
            <span className="truncate text-base font-bold tracking-tight text-white sm:text-xl">
              Jonadab <span className="text-fuchsia-400">AMAH</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative py-2 text-sm font-medium transition ${
                  isActiveLink(l.href) ? "text-cyan-200" : "text-slate-100/95 hover:text-white"
                }`}
              >
                <span>{l.label}</span>
                <span
                  className={`pointer-events-none absolute -bottom-[3px] left-0 h-0.5 w-full origin-left rounded-full bg-cyan-300 transition-transform duration-300 ${
                    isActiveLink(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <Link
              href="/client-area/login"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-3.5 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)] backdrop-blur hover:bg-cyan-500/20"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-cyan-100">
                <path
                  d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V6Z"
                  fill="currentColor"
                />
              </svg>
              Client Login
            </Link>
          </div>

          <div className="flex items-center xl:hidden">
            <Link
              href="/client-area/login"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-3.5 py-2 text-sm font-semibold text-cyan-100"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-cyan-100">
                <path
                  d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V6Z"
                  fill="currentColor"
                />
              </svg>
              Client Login
            </Link>
          </div>
        </nav>

        <div className="lg:hidden">
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2 pt-1 sm:-mx-6 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isActiveLink(l.href)
                    ? "border-cyan-300/45 bg-cyan-500/10 text-cyan-100"
                    : "border-slate-700/60 bg-slate-900/20 text-slate-200 hover:border-cyan-300/35 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="pb-3">
          <Link
            href="/audit-security"
            className="mx-auto flex min-h-12 w-full max-w-4xl items-center justify-center rounded-md border border-fuchsia-300/30 bg-gradient-to-r from-fuchsia-500/35 via-blue-500/35 to-violet-500/35 px-3 py-2 text-center text-sm font-semibold leading-snug text-cyan-100 shadow-[0_0_28px_rgba(139,92,246,0.35)]"
          >
            ⚡ Request your free security audit
          </Link>
        </div>
      </div>
    </header>
  );
}
