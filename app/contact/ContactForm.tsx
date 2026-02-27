"use client";

import { useState } from "react";
import { Input } from "../../components/ui/Input";

type Issues = Array<{ path: Array<string | number>; message: string }>;

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-cyan-300">
      <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [ok, setOk] = useState(false);
  const [issues, setIssues] = useState<Issues>([]);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setIssues([]);
    setOk(false);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      requestType: String(formData.get("requestType") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      description: String(formData.get("description") ?? ""),
      rgpd: formData.get("rgpd") === "on",
      hp: String(formData.get("company") ?? ""),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Erreur lors de l’envoi.");
      setIssues(data?.issues ?? []);
      setPending(false);
      return;
    }

    setOk(true);
    setPending(false);
  }

  if (ok) {
    return (
      <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-4">
        <div className="text-sm font-semibold text-emerald-100">Message envoyé</div>
        <p className="mt-1 text-sm leading-6 text-emerald-50/90">Merci, je vous réponds rapidement.</p>
      </div>
    );
  }

  const fieldError = (name: string) => issues.find((i) => i.path?.[0] === name)?.message;
  const fieldClass = (name: string) =>
    `h-12 w-full rounded-xl border bg-slate-950/70 px-4 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/65 ${
      fieldError(name) ? "border-red-400" : "border-slate-700/80"
    }`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(new FormData(e.currentTarget));
      }}
      className="flex flex-col gap-4"
    >
      <div className="hidden">
        <Input label="Company" name="company" autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="sr-only">
            Your Name
          </label>
          <input id="name" name="name" required placeholder="Your Name*" className={fieldClass("name")} />
          {fieldError("name") ? <p className="mt-1 text-xs text-red-300">{fieldError("name")}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Your Email
          </label>
          <input id="email" name="email" type="email" required placeholder="Your Email*" className={fieldClass("email")} />
          {fieldError("email") ? <p className="mt-1 text-xs text-red-300">{fieldError("email")}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="sr-only">
            Phone Number
          </label>
          <input id="phone" name="phone" placeholder="Phone Number*" className={fieldClass("phone")} />
          {fieldError("phone") ? <p className="mt-1 text-xs text-red-300">{fieldError("phone")}</p> : null}
        </div>

        <label className="relative block text-sm">
          <span className="sr-only">Project Type</span>
          <select
            name="requestType"
            className={`${fieldClass("requestType")} appearance-none pr-10`}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Project Type
            </option>
            <option value="Business Website">Business Website</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Secure Dashboard">Secure Dashboard</option>
            <option value="Custom Web App">Custom Web App</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown />
          </span>
          {fieldError("requestType") ? <p className="mt-1 text-xs text-red-300">{fieldError("requestType")}</p> : null}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="relative block text-sm">
          <span className="sr-only">Budget Range</span>
          <select name="budget" className={`${fieldClass("budget")} appearance-none pr-10`} defaultValue="" required>
            <option value="" disabled>
              Budget Range
            </option>
            <option value="< 1 000 €">&lt; €1,000</option>
            <option value="1 000 - 3 000 €">€1,000 - €3,000</option>
            <option value="3 000 - 8 000 €">€3,000 - €8,000</option>
            <option value="> 8 000 €">&gt; €8,000</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown />
          </span>
          {fieldError("budget") ? <p className="mt-1 text-xs text-red-300">{fieldError("budget")}</p> : null}
        </label>

        <label className="relative block text-sm">
          <span className="sr-only">Budget Value</span>
          <input value="< €1,000" readOnly className={fieldClass("budget")} />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown />
          </span>
        </label>
      </div>

      <div>
        <label htmlFor="description" className="sr-only">
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Project Description"
          className={`min-h-36 w-full resize-y rounded-xl border bg-slate-950/70 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/65 ${
            fieldError("description") ? "border-red-400" : "border-slate-700/80"
          }`}
        />
        {fieldError("description") ? <p className="mt-1 text-xs text-red-300">{fieldError("description")}</p> : null}
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-300">
        <input name="rgpd" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900" required />
        <span>I agree to be contacted regarding this request.</span>
      </label>
      {fieldError("rgpd") ? <p className="-mt-2 text-xs text-red-300">{fieldError("rgpd")}</p> : null}

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-8 text-base font-semibold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)] transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
