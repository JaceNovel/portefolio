"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/dashboard-admin", label: "Dashboard" },
  { href: "/dashboard-admin/blog/new", label: "Nouvel article" },
] as const;

export function DashboardAdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard-admin") {
      return pathname === href || pathname.startsWith("/dashboard-admin/blog/");
    }
    return pathname === href;
  };

  return (
    <nav className="mt-4 flex items-center gap-8">
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`group relative py-2 text-sm font-medium transition ${
            isActive(link.href) ? "text-cyan-200" : "text-slate-100/95 hover:text-white"
          }`}
        >
          <span>{link.label}</span>
          <span
            className={`pointer-events-none absolute -bottom-[3px] left-0 h-0.5 w-full origin-left rounded-full bg-cyan-300 transition-transform duration-300 ${
              isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        </Link>
      ))}
    </nav>
  );
}
