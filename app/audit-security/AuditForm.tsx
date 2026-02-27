"use client";

import { useState } from "react";

type Issues = Array<{ path: Array<string | number>; message: string }>;

export function AuditForm() {
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
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      description: String(formData.get("description") ?? ""),
      rgpd: true,
      hp: String(formData.get("company") ?? ""),
    };

    const res = await fetch("/api/audit-security", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Unable to send.");
      setIssues(data?.issues ?? []);
      setPending(false);
      return;
    }

    setOk(true);
    setPending(false);
  }

  if (ok) {
    return (
      <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/20 p-4">
        <div className="text-sm font-semibold text-emerald-100">Request sent</div>
        <p className="mt-1 text-sm leading-6 text-emerald-50/90">You may receive a confirmation email if emailing is configured.</p>
      </div>
    );
  }

  const fieldError = (name: string) => issues.find((i) => i.path?.[0] === name)?.message;
  const fieldClass = (name: string) =>
    `h-12 w-full rounded-lg border bg-slate-950/75 px-4 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70 ${
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
      <input name="company" autoComplete="off" className="hidden" />
      <input name="rgpd" value="on" className="hidden" readOnly />

      <div>
        <label htmlFor="name" className="sr-only">
          Your Name
        </label>
        <input id="name" name="name" placeholder="Your Name*" required className={fieldClass("name")} />
        {fieldError("name") ? <p className="mt-1 text-xs text-red-300">{fieldError("name")}</p> : null}
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Your Email
        </label>
        <input id="email" name="email" type="email" placeholder="Your Email*" required className={fieldClass("email")} />
        {fieldError("email") ? <p className="mt-1 text-xs text-red-300">{fieldError("email")}</p> : null}
      </div>

      <div>
        <label htmlFor="websiteUrl" className="sr-only">
          Website URL
        </label>
        <input id="websiteUrl" name="websiteUrl" type="url" placeholder="Website URL*" required className={fieldClass("websiteUrl")} />
        {fieldError("websiteUrl") ? <p className="mt-1 text-xs text-red-300">{fieldError("websiteUrl")}</p> : null}
      </div>

      <div>
        <label htmlFor="description" className="sr-only">
          Issue Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Issue Description"
          required
          className={`min-h-28 w-full resize-y rounded-lg border bg-slate-950/75 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70 ${
            fieldError("description") ? "border-red-400" : "border-slate-700/80"
          }`}
        />
        {fieldError("description") ? <p className="mt-1 text-xs text-red-300">{fieldError("description")}</p> : null}
      </div>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-lg border border-cyan-300/40 bg-gradient-to-r from-cyan-500/20 to-emerald-400/20 px-6 text-lg font-semibold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.26)] transition hover:from-cyan-500/30 hover:to-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : "Request Audit"}
      </button>
    </form>
  );
}
