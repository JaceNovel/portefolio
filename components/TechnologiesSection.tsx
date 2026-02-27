"use client";

import { motion } from "framer-motion";
import { SiNextdotjs, SiTypescript, SiPrisma, SiPostgresql, SiTailwindcss, SiJsonwebtokens } from "react-icons/si";

const technologies = [
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "Prisma", Icon: SiPrisma, color: "#5A67D8" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "JWT", Icon: SiJsonwebtokens, color: "#F97316" },
] as const;

export function TechnologiesSection() {
  return (
    <section className="w-full py-7 sm:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-cyan-400/30" />
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Technologies I Use</h2>
          <div className="h-px flex-1 bg-cyan-400/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6"
        >
          {technologies.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex h-16 items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-slate-950/60 px-4 shadow-[0_0_18px_rgba(14,165,233,0.18)]"
            >
              <t.Icon aria-hidden size={26} color={t.color} />
              <div className="text-sm font-semibold text-slate-100">{t.name}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
