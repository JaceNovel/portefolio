"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { Input } from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";

type WebsiteType = "business" | "ecommerce" | "custom";

type StackChoice = "Next.js" | "React" | "WordPress" | "Laravel" | "Django" | "Symfony" | "Other";

type PagePack = {
  id: "1-3" | "4-6" | "7-10" | "10+";
  label: string;
  min: number;
  max: number;
};

type OptionsState = {
  blog: boolean;
  paymentGateway: boolean;
  adminPanel: boolean;
  seoOptimization: boolean;
};

type BrandingState = {
  primaryColor: string;
  secondaryColor: string;
  logoFile: File | null;
};

type Issues = Array<{ path: Array<string | number>; message: string }>;

function euros(amount: number) {
  return `${amount} €`;
}

function formatRangeEuros(min: number, max: number) {
  return `${euros(min)} – ${euros(max)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function computeAiAdjustment(params: {
  websiteType: WebsiteType;
  pageCount: number;
  options: OptionsState;
  stack: StackChoice;
  message: string;
}) {
  const msg = params.message.trim().toLowerCase();

  const keywords = [
    "api",
    "auth",
    "login",
    "dashboard",
    "admin",
    "booking",
    "reservation",
    "chat",
    "multilang",
    "multi-language",
    "seo",
    "stripe",
    "paypal",
    "paiement",
    "payment",
    "cms",
    "blog",
    "upload",
    "integration",
  ] as const;

  const keywordHits = keywords.reduce((acc, k) => (msg.includes(k) ? acc + 1 : acc), 0);
  const length = msg.length;

  let score = 0;
  score += params.websiteType === "custom" ? 10 : 0;
  score += Math.max(0, params.pageCount - 3) >= 6 ? 10 : 0;
  score += params.options.adminPanel ? 12 : 0;
  score += params.options.paymentGateway ? 10 : 0;

  if (length >= 120) score += 6;
  if (length >= 260) score += 10;
  if (length >= 520) score += 14;

  score += Math.min(8, keywordHits) * 6;

  const stackDelta: Record<StackChoice, number> = {
    "Next.js": 10,
    React: 8,
    WordPress: -6,
    Laravel: 6,
    Django: 6,
    Symfony: 8,
    Other: 12,
  };

  score += stackDelta[params.stack];

  // Convert score to a small euros adjustment range.
  const min = Math.max(-10, Math.round(score * 0.35));
  const max = Math.max(0, Math.round(score * 0.6));
  return { min, max, score };
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      className={
        checked
          ? "relative inline-flex h-7 w-12 items-center rounded-full bg-emerald-500/25 ring-1 ring-inset ring-emerald-400/40 transition"
          : "relative inline-flex h-7 w-12 items-center rounded-full bg-slate-950/40 ring-1 ring-inset ring-white/10 transition"
      }
      aria-pressed={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span
        className={
          checked
            ? "ml-6 inline-block h-5 w-5 rounded-full bg-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.30)] transition"
            : "ml-1 inline-block h-5 w-5 rounded-full bg-slate-200/80 transition"
        }
      />
    </button>
  );
}

export function EstimateYourProject() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [websiteType, setWebsiteType] = useState<WebsiteType>("business");
  const packs: PagePack[] = useMemo(
    () => [
      { id: "1-3", label: "1–3 Pages", min: 1, max: 3 },
      { id: "4-6", label: "4–6 Pages", min: 4, max: 6 },
      { id: "7-10", label: "7–10 Pages", min: 7, max: 10 },
      { id: "10+", label: "10+ Pages", min: 10, max: 20 },
    ],
    [],
  );

  const [selectedPackId, setSelectedPackId] = useState<PagePack["id"]>("4-6");
  const selectedPack = useMemo(() => packs.find((p) => p.id === selectedPackId) ?? packs[1], [packs, selectedPackId]);

  const [pageCount, setPageCount] = useState(() => 5);
  const normalizedPageCount = useMemo(
    () => clamp(pageCount, selectedPack.min, selectedPack.max),
    [pageCount, selectedPack.min, selectedPack.max],
  );

  const [options, setOptions] = useState<OptionsState>({
    blog: true,
    paymentGateway: false,
    adminPanel: false,
    seoOptimization: true,
  });

  const [branding, setBranding] = useState<BrandingState>({
    primaryColor: "#22d3ee",
    secondaryColor: "#a855f7",
    logoFile: null,
  });

  const [stack, setStack] = useState<StackChoice>("Next.js");
  const [projectMessage, setProjectMessage] = useState("");

  const [sendOpen, setSendOpen] = useState(false);
  const [sendPending, setSendPending] = useState(false);
  const [sendOk, setSendOk] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendIssues, setSendIssues] = useState<Issues>([]);

  const fieldError = (name: string) => sendIssues.find((i) => i.path?.[0] === name)?.message;

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("File read failed"));
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.readAsDataURL(file);
    });
  }

  async function submitProject(formData: FormData) {
    setSendPending(true);
    setSendError(null);
    setSendIssues([]);
    setSendOk(false);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const rgpd = formData.get("rgpd") === "on";
    const hp = String(formData.get("company") ?? "");

    let logoDataUrl: string | undefined;
    if (branding.logoFile) {
      // Keep it small to avoid oversized payloads.
      const maxBytes = 250 * 1024;
      if (branding.logoFile.size > maxBytes) {
        setSendError("Logo trop lourd (max 250KB). Utilisez une image plus légère.");
        setSendPending(false);
        return;
      }
      logoDataUrl = await readFileAsDataUrl(branding.logoFile);
    }

    const payload = {
      name,
      email,
      phone,
      websiteType,
      pageCount: normalizedPageCount,
      options,
      branding: {
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        logoFileName: branding.logoFile?.name ?? "",
        logoDataUrl,
      },
      stack,
      message: projectMessage,
      estimate: { min: estimate.min, max: estimate.max },
      rgpd,
      hp,
    };

    const res = await fetch("/api/web-design/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSendError(data?.error ?? "Erreur lors de l’envoi.");
      setSendIssues(data?.issues ?? []);
      setSendPending(false);
      return;
    }

    setSendOk(true);
    setSendPending(false);
  }

  const stepPillClass = (n: 1 | 2 | 3 | 4) =>
    n === step
      ? "inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-cyan-100"
      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/30 px-3 py-1 text-slate-200/85 hover:border-white/15";

  const stepNumberClass = (n: 1 | 2 | 3 | 4) =>
    n === step
      ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/15 ring-1 ring-inset ring-cyan-300/25"
      : "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-inset ring-white/10";

  const websiteTypeLabel: Record<WebsiteType, string> = {
    business: "Business Website",
    ecommerce: "E-Commerce",
    custom: "Custom Web App",
  };

  const estimate = useMemo(() => {
    const baseRangesByType: Record<WebsiteType, { min: number; max: number; title: string; subtitle: string }> = {
      business: {
        min: 120,
        max: 190,
        title: "Business Website",
        subtitle: "Professional • Fast • SEO Ready",
      },
      ecommerce: {
        min: 160,
        max: 280,
        title: "E-Commerce",
        subtitle: "Payments • Products • Admin",
      },
      custom: {
        min: 210,
        max: 315,
        title: "Custom Web App",
        subtitle: "Tailor-made • Dashboard • API",
      },
    };

    const perPageByType: Record<WebsiteType, number> = {
      business: 12,
      ecommerce: 16,
      custom: 18,
    };

    const optionsPrice: Record<keyof OptionsState, number> = {
      blog: 20,
      paymentGateway: 35,
      adminPanel: 45,
      seoOptimization: 15,
    };

    const base = baseRangesByType[websiteType];
    const pagesExtra = Math.max(0, normalizedPageCount - 3) * perPageByType[websiteType];
    const optionsExtra = (Object.entries(options) as Array<[keyof OptionsState, boolean]>)
      .filter(([, enabled]) => enabled)
      .reduce((sum, [key]) => sum + optionsPrice[key], 0);

    const ai = computeAiAdjustment({
      websiteType,
      pageCount: normalizedPageCount,
      options,
      stack,
      message: projectMessage,
    });

    const rawMin = base.min + pagesExtra + optionsExtra + ai.min;
    const rawMax = base.max + pagesExtra + optionsExtra + ai.max;

    const cappedMin = clamp(rawMin, 100, 500);
    const cappedMax = clamp(rawMax, 100, 500);
    const min = Math.min(cappedMin, cappedMax);
    const max = Math.max(cappedMin, cappedMax);

    return {
      ...base,
      pagesExtra,
      optionsExtra,
      aiMin: ai.min,
      aiMax: ai.max,
      aiScore: ai.score,
      min,
      max,
    };
  }, [normalizedPageCount, options, projectMessage, stack, websiteType]);

  return (
    <section className="mt-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Estimate Your <span className="text-cyan-300">Website</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-200/90 sm:text-base">
            Get an <span className="text-emerald-200">Instant Price Quote</span> for Your Project
          </p>
          <div className="mx-auto mt-5 h-1 w-64 rounded-full bg-cyan-400/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-950/45 shadow-[0_0_30px_rgba(14,165,233,0.12)]">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div className="relative p-4 lg:col-span-8 lg:p-6">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
              </div>

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
                  <button type="button" onClick={() => setStep(1)} className={stepPillClass(1)} aria-current={step === 1 ? "step" : undefined}>
                    <span className={stepNumberClass(1)}>1</span>
                    Website Type
                  </button>
                  <span className="text-slate-500">→</span>
                  <button type="button" onClick={() => setStep(2)} className={stepPillClass(2)} aria-current={step === 2 ? "step" : undefined}>
                    <span className={stepNumberClass(2)}>2</span>
                    Pages & Options
                  </button>
                  <span className="text-slate-500">→</span>
                  <button type="button" onClick={() => setStep(3)} className={stepPillClass(3)} aria-current={step === 3 ? "step" : undefined}>
                    <span className={stepNumberClass(3)}>3</span>
                    Additional Services
                  </button>
                  <span className="text-slate-500">→</span>
                  <button type="button" onClick={() => setStep(4)} className={stepPillClass(4)} aria-current={step === 4 ? "step" : undefined}>
                    <span className={stepNumberClass(4)}>4</span>
                    Get Estimate
                  </button>
                </div>

                {step === 1 ? (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-100">Website Type</div>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setWebsiteType("business")}
                      className={
                        websiteType === "business"
                          ? "relative overflow-hidden rounded-2xl border border-emerald-400/40 bg-slate-950/40 p-4 text-left shadow-[0_0_22px_rgba(16,185,129,0.18)]"
                          : "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/25 p-4 text-left hover:border-white/15"
                      }
                      aria-pressed={websiteType === "business"}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Business Website</div>
                        {websiteType === "business" ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-inset ring-emerald-300/25">
                            <FiCheck className="text-emerald-200" />
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-emerald-200">{formatRangeEuros(120, 190)}</div>
                      <div className="mt-1 text-xs text-slate-300/85">Professional • Fast • SEO Ready</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWebsiteType("ecommerce")}
                      className={
                        websiteType === "ecommerce"
                          ? "relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950/40 p-4 text-left shadow-[0_0_22px_rgba(34,211,238,0.16)]"
                          : "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/25 p-4 text-left hover:border-white/15"
                      }
                      aria-pressed={websiteType === "ecommerce"}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">E-Commerce</div>
                        {websiteType === "ecommerce" ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 ring-1 ring-inset ring-cyan-300/25">
                            <FiCheck className="text-cyan-100" />
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-cyan-100">{formatRangeEuros(160, 280)}</div>
                      <div className="mt-1 text-xs text-slate-300/85">Payments • Products • Admin</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWebsiteType("custom")}
                      className={
                        websiteType === "custom"
                          ? "relative overflow-hidden rounded-2xl border border-blue-400/35 bg-slate-950/40 p-4 text-left shadow-[0_0_22px_rgba(59,130,246,0.14)]"
                          : "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/25 p-4 text-left hover:border-white/15"
                      }
                      aria-pressed={websiteType === "custom"}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Custom Web App</div>
                        {websiteType === "custom" ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 ring-1 ring-inset ring-blue-300/25">
                            <FiCheck className="text-blue-100" />
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-blue-100">{formatRangeEuros(210, 315)}</div>
                      <div className="mt-1 text-xs text-slate-300/85">Tailor-made • Dashboard • API</div>
                    </button>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="text-sm font-semibold text-white">Tip</div>
                      <div className="mt-1 text-xs text-slate-300/85">Next, pick pages & options, then describe your needs.</div>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-100">Number of Pages</div>
                      <div className="text-xs font-semibold text-slate-200/85">{normalizedPageCount} pages</div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {packs.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPackId(p.id);
                            setPageCount((current) => clamp(current, p.min, p.max));
                          }}
                          className={
                            selectedPackId === p.id
                              ? "h-11 rounded-xl border border-cyan-300/35 bg-cyan-500/10 text-sm font-semibold text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                              : "h-11 rounded-xl border border-white/10 bg-slate-950/20 text-sm font-semibold text-slate-100 hover:border-white/15"
                          }
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <input
                        type="range"
                        min={selectedPack.min}
                        max={selectedPack.max}
                        step={1}
                        value={normalizedPageCount}
                        onChange={(e) => setPageCount(Number(e.target.value))}
                        className="w-full accent-cyan-300"
                        aria-label="Number of pages"
                      />
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-300/85">
                        <span>{selectedPack.min} pages</span>
                        <span>{selectedPack.max} pages</span>
                      </div>
                    </div>

                    <div className="mt-7">
                      <div className="text-sm font-semibold text-slate-100">Add Options</div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">Blog</div>
                          <div className="mt-1 text-xs text-slate-300/85">Articles + basic categories</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-xs font-semibold text-slate-100">+{euros(20)}</span>
                          <Toggle
                            checked={options.blog}
                            onChange={(next) => setOptions((o) => ({ ...o, blog: next }))}
                            label="Toggle blog"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">Payment Gateway</div>
                          <div className="mt-1 text-xs text-slate-300/85">Stripe / Paypal integration</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-xs font-semibold text-slate-100">+{euros(35)}</span>
                          <Toggle
                            checked={options.paymentGateway}
                            onChange={(next) => setOptions((o) => ({ ...o, paymentGateway: next }))}
                            label="Toggle payment gateway"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">Admin Panel</div>
                          <div className="mt-1 text-xs text-slate-300/85">Content & users management</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-xs font-semibold text-slate-100">+{euros(45)}</span>
                          <Toggle
                            checked={options.adminPanel}
                            onChange={(next) => setOptions((o) => ({ ...o, adminPanel: next }))}
                            label="Toggle admin panel"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">SEO Optimization</div>
                          <div className="mt-1 text-xs text-slate-300/85">Metadata + basics for ranking</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-xs font-semibold text-slate-100">+{euros(15)}</span>
                          <Toggle
                            checked={options.seoOptimization}
                            onChange={(next) => setOptions((o) => ({ ...o, seoOptimization: next }))}
                            label="Toggle SEO optimization"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                    <div className="mt-7">
                      <div className="text-sm font-semibold text-slate-100">Branding (Colors & Logo)</div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="text-sm font-semibold text-white">Primary color</div>
                      <div className="mt-1 text-xs text-slate-300/85">Used for buttons / accents</div>
                      <input
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))}
                        className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 p-1"
                        aria-label="Primary color"
                      />
                    </label>

                    <label className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                      <div className="text-sm font-semibold text-white">Secondary color</div>
                      <div className="mt-1 text-xs text-slate-300/85">Used for gradients / highlights</div>
                      <input
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding((b) => ({ ...b, secondaryColor: e.target.value }))}
                        className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 p-1"
                        aria-label="Secondary color"
                      />
                    </label>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">Upload your logo</div>
                        <div className="mt-1 text-xs text-slate-300/85">PNG / JPG / SVG (optional)</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-200/85">
                        {branding.logoFile ? branding.logoFile.name : "No file"}
                      </div>
                    </div>

                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setBranding((b) => ({ ...b, logoFile: file }));
                      }}
                      className="mt-3 block w-full text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900/70 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-100 hover:file:bg-slate-900"
                      aria-label="Upload logo"
                    />
                  </div>
                </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-100">Additional Services</div>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                    <label className="block">
                      <div className="text-sm font-semibold text-white">What do you really need?</div>
                      <div className="mt-1 text-xs text-slate-300/85">
                        Describe your goal, features, and what you want to do with the website.
                      </div>
                      <textarea
                        value={projectMessage}
                        onChange={(e) => setProjectMessage(e.target.value)}
                        rows={5}
                        className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-cyan-300/50"
                        placeholder="Example: I need a website to present my business, with a booking form, client area, and an admin dashboard…"
                      />
                    </label>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block">
                        <div className="text-sm font-semibold text-white">Preferred language / stack</div>
                        <div className="mt-1 text-xs text-slate-300/85">Used by the AI estimator</div>
                        <select
                          value={stack}
                          onChange={(e) => setStack(e.target.value as StackChoice)}
                          className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm font-semibold text-slate-100 outline-none focus:border-cyan-300/50 [color-scheme:dark]"
                          aria-label="Preferred language or stack"
                        >
                          <option value="Next.js" className="bg-slate-950 text-slate-100">Next.js</option>
                          <option value="React" className="bg-slate-950 text-slate-100">React</option>
                          <option value="WordPress" className="bg-slate-950 text-slate-100">WordPress</option>
                          <option value="Laravel" className="bg-slate-950 text-slate-100">Laravel</option>
                          <option value="Django" className="bg-slate-950 text-slate-100">Django</option>
                          <option value="Symfony" className="bg-slate-950 text-slate-100">Symfony</option>
                          <option value="Other" className="bg-slate-950 text-slate-100">Other</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                ) : null}

                {step === 4 ? (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-100">Get Estimate</div>

                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                        <div className="text-sm font-semibold text-white">Summary</div>
                        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-200/85">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Type</span>
                            <span className="font-semibold text-slate-100">{websiteTypeLabel[websiteType]}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Pages</span>
                            <span className="font-semibold text-slate-100">{normalizedPageCount}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Stack</span>
                            <span className="font-semibold text-slate-100">{stack}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Logo</span>
                            <span className="font-semibold text-slate-100">{branding.logoFile ? branding.logoFile.name : "None"}</span>
                          </div>
                        </div>

                        {projectMessage.trim() ? (
                          <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/20 p-3 text-xs text-slate-200/85">
                            {projectMessage.trim()}
                          </div>
                        ) : null}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                        <div className="text-sm font-semibold text-white">AI Estimator (Real-time)</div>
                        <div className="mt-1 text-xs text-slate-300/85">
                          Adjustment based on pages, options, chosen stack and your message. Final quote is capped at {euros(500)}.
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-slate-200/85">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Base range</span>
                            <span className="font-semibold text-slate-100">{formatRangeEuros(estimate.min - estimate.pagesExtra - estimate.optionsExtra - estimate.aiMin, estimate.max - estimate.pagesExtra - estimate.optionsExtra - estimate.aiMax)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Pages extra</span>
                            <span className="font-semibold text-slate-100">+{euros(estimate.pagesExtra)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">Options extra</span>
                            <span className="font-semibold text-slate-100">+{euros(estimate.optionsExtra)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-300/90">AI adjustment</span>
                            <span className="font-semibold text-slate-100">{formatRangeEuros(estimate.aiMin, estimate.aiMax)}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/20 p-3">
                          <span className="text-sm font-semibold text-slate-100">Final estimate</span>
                          <span className="text-sm font-extrabold text-emerald-200">{formatRangeEuros(estimate.min, estimate.max)}</span>
                        </div>

                        <div className="mt-2 text-xs text-slate-400">AI score: {estimate.aiScore}</div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-7 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3 | 4)))}
                    disabled={step === 1}
                    className={
                      step === 1
                        ? "h-11 w-28 rounded-xl border border-white/10 bg-slate-950/15 text-sm font-semibold text-slate-400"
                        : "h-11 w-28 rounded-xl border border-white/10 bg-slate-950/20 text-sm font-semibold text-slate-100 hover:border-white/15"
                    }
                  >
                    Back
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => (s === 4 ? 4 : ((s + 1) as 1 | 2 | 3 | 4)))}
                      className="h-11 w-32 rounded-xl border border-cyan-300/35 bg-cyan-500/10 text-sm font-semibold text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.16)] hover:bg-cyan-500/15"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSendOpen(true);
                        setSendOk(false);
                        setSendError(null);
                        setSendIssues([]);
                      }}
                      className="h-11 w-40 rounded-xl border border-emerald-400/35 bg-emerald-500/15 text-sm font-semibold text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.20)] hover:bg-emerald-500/20"
                    >
                      Envoyer le projet
                    </button>
                  )}
                </div>

                {sendOpen ? (
                  <div className="fixed inset-0 z-[60]">
                    <button
                      type="button"
                      className="absolute inset-0 bg-black/60"
                      aria-label="Fermer"
                      onClick={() => {
                        if (sendPending) return;
                        setSendOpen(false);
                      }}
                    />

                    <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold text-white">Envoyer le projet</div>
                          <div className="mt-1 text-sm text-slate-300">
                            Vous recevrez un email après validation. Ensuite, accès à l’espace client.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (sendPending) return;
                            setSendOpen(false);
                          }}
                          className="h-10 w-10 rounded-xl border border-white/10 bg-slate-950/30 text-sm font-semibold text-slate-200 hover:border-white/15"
                          aria-label="Close"
                        >
                          ✕
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          void submitProject(new FormData(e.currentTarget));
                        }}
                        className="mt-4 flex flex-col gap-4"
                      >
                        <div className="hidden">
                          <Input label="Company" name="company" autoComplete="off" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Input label="Nom" name="name" placeholder="Votre nom" error={fieldError("name")} required />
                          <Input label="Email" name="email" type="email" placeholder="vous@exemple.com" error={fieldError("email")} required />
                        </div>
                        <Input label="Téléphone" name="phone" placeholder="+33 …" error={fieldError("phone")} />

                        <Checkbox
                          name="rgpd"
                          label="J’accepte que mes informations soient utilisées pour me recontacter au sujet de ce projet."
                          error={fieldError("rgpd")}
                          required
                        />

                        {sendError ? (
                          <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{sendError}</div>
                        ) : null}

                        {sendOk ? (
                          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                            Projet envoyé. Je reviens vers vous après étude.
                          </div>
                        ) : null}

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (sendPending) return;
                              setSendOpen(false);
                            }}
                            className="h-11 rounded-xl border border-white/10 bg-slate-950/30 px-4 text-sm font-semibold text-slate-100 hover:border-white/15"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            disabled={sendPending}
                            className={
                              sendPending
                                ? "h-11 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-200/70"
                                : "h-11 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 text-sm font-semibold text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.20)] hover:bg-emerald-500/20"
                            }
                          >
                            {sendPending ? "Envoi…" : "Envoyer"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="relative border-t border-white/10 bg-slate-950/55 p-4 lg:col-span-4 lg:border-l lg:border-t-0 lg:p-6">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />
              </div>

              <div className="relative">
                <div className="text-base font-semibold text-white">Estimated Cost</div>
                <div className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                  <span className="text-slate-100">{euros(estimate.min)}</span> <span className="text-slate-400">–</span>{" "}
                  <span className="text-emerald-200">{euros(estimate.max)}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-300/90">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/30 px-2.5 py-1">Delivery: 7–14 Days</span>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="text-sm font-semibold text-slate-100">Included</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200/85">
                    {["Responsive Design", "SSL Certificate", "SEO Optimized", "Fast Loading", "1 Month Support"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <FiCheck className="mt-0.5 shrink-0 text-emerald-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl border border-emerald-400/45 bg-emerald-500/15 px-6 text-sm font-semibold text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.28)] hover:bg-emerald-500/25"
                  >
                    Get Free Quote
                  </Link>

                  <div className="mt-3 text-center text-xs text-slate-300/85">100% Secure & Professional</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
