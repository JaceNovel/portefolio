"use client";

import { useRef, useState } from "react";
import { EstimateYourProject } from "./EstimateYourProject";

export function CreateWebsiteCta() {
  const [open, setOpen] = useState(false);
  const estimateWrapRef = useRef<HTMLDivElement | null>(null);

  function scrollToEstimate() {
    const el = estimateWrapRef.current;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Try to focus a meaningful control for keyboard users.
    const focusable = el.querySelector<HTMLElement>(
      "select, input, textarea, button, a[href], [tabindex]:not([tabindex='-1'])",
    );
    focusable?.focus();
  }

  function onClick() {
    if (open) {
      scrollToEstimate();
      return;
    }

    setOpen(true);
    // Wait for the section to render.
    setTimeout(scrollToEstimate, 0);
  }

  return (
    <section className="relative mt-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-white sm:text-2xl">Prêt à créer votre site ?</h2>
        <p className="mt-2 text-sm text-slate-200/85 sm:text-base">
          Lancez une estimation instantanée, puis demandez un devis gratuit.
        </p>

        <button
          type="button"
          onClick={onClick}
          className="mt-6 inline-flex h-14 w-full max-w-md items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-500/15 px-8 text-base font-semibold text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 sm:h-16 sm:text-lg"
          aria-controls="creer-site-estimate"
          aria-expanded={open}
        >
          CRÉEZ VOTRE SITE WEB
        </button>
      </div>

      <div
        id="creer-site-estimate"
        ref={estimateWrapRef}
        className={open ? "mt-10" : "hidden"}
      >
        <EstimateYourProject />
      </div>
    </section>
  );
}
