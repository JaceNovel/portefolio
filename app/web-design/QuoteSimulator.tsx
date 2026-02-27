"use client";

import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { computeEstimateCents, formatEurosFromCents } from "../../lib/quote";
import type { SiteType } from "../../lib/quote";

type Issues = Array<{ path: Array<string | number>; message: string }>;

export function QuoteSimulator() {
  const [siteType, setSiteType] = useState<SiteType>("vitrine");
  const [pageCount, setPageCount] = useState(5);
  const [options, setOptions] = useState({
    blog: false,
    paiement: false,
    espaceMembre: false,
    maintenance: false,
  });

  const [pending, setPending] = useState(false);
  const [ok, setOk] = useState(false);
  const [issues, setIssues] = useState<Issues>([]);
  const [error, setError] = useState<string | null>(null);

  const estimateCents = useMemo(() => computeEstimateCents({ siteType, pageCount, options }), [siteType, pageCount, options]);
  const estimateEuros = useMemo(() => formatEurosFromCents(estimateCents), [estimateCents]);

  const fieldError = (name: string) => issues.find((i) => i.path?.[0] === name)?.message;

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setIssues([]);
    setOk(false);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      siteType,
      pageCount,
      options,
      rgpd: formData.get("rgpd") === "on",
      hp: String(formData.get("company") ?? ""),
    };

    const res = await fetch("/api/devis", {
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
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold text-zinc-900">Demande envoyée</div>
        <p className="text-sm leading-6 text-zinc-600">Estimation: {estimateEuros}. Un email peut être envoyé si l’emailing est configuré.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="text-sm font-semibold text-zinc-900">Estimation</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{estimateEuros}</div>
        <p className="mt-2 text-sm leading-6 text-zinc-600">Estimation indicative, ajustée après cadrage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">Type de site</span>
          <select
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-base outline-none focus:border-zinc-900"
            value={siteType}
            onChange={(e) => setSiteType(e.target.value as SiteType)}
          >
            <option value="vitrine">Vitrine</option>
            <option value="ecommerce">E-commerce</option>
            <option value="sur-mesure">Sur mesure</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">Nombre de pages</span>
          <input
            type="number"
            min={1}
            max={50}
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value))}
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-base outline-none focus:border-zinc-900"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Checkbox
          label="Blog"
          checked={options.blog}
          onChange={(e) => setOptions((o) => ({ ...o, blog: e.target.checked }))}
        />
        <Checkbox
          label="Paiement"
          checked={options.paiement}
          onChange={(e) => setOptions((o) => ({ ...o, paiement: e.target.checked }))}
        />
        <Checkbox
          label="Espace membre"
          checked={options.espaceMembre}
          onChange={(e) => setOptions((o) => ({ ...o, espaceMembre: e.target.checked }))}
        />
        <Checkbox
          label="Maintenance"
          checked={options.maintenance}
          onChange={(e) => setOptions((o) => ({ ...o, maintenance: e.target.checked }))}
        />
      </div>

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
          <Input label="Nom" name="name" placeholder="Votre nom" error={fieldError("name")} required />
          <Input label="Email" name="email" type="email" placeholder="vous@exemple.com" error={fieldError("email")} required />
        </div>

        <Checkbox
          name="rgpd"
          label="J’accepte que mes informations soient utilisées pour me recontacter au sujet de cette demande."
          error={fieldError("rgpd")}
          required
        />

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Envoi…" : "Envoyer la demande de devis"}
        </Button>
      </form>
    </div>
  );
}
