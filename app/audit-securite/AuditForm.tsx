"use client";

import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Checkbox } from "../../components/ui/Checkbox";

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
      rgpd: formData.get("rgpd") === "on",
      hp: String(formData.get("company") ?? ""),
    };

    const res = await fetch("/api/audit-securite", {
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
        <p className="text-sm leading-6 text-zinc-600">Un email d’accusé de réception a été envoyé si la configuration email est active.</p>
      </div>
    );
  }

  const fieldError = (name: string) => issues.find((i) => i.path?.[0] === name)?.message;

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

      <Input label="Nom" name="name" placeholder="Votre nom" error={fieldError("name")} required />
      <Input label="Email" name="email" type="email" placeholder="vous@exemple.com" error={fieldError("email")} required />
      <Input
        label="URL du site"
        name="websiteUrl"
        type="url"
        placeholder="https://exemple.com"
        error={fieldError("websiteUrl")}
        required
      />
      <Textarea
        label="Description"
        name="description"
        placeholder="Décrivez votre besoin, symptômes, contexte..."
        error={fieldError("description")}
        required
      />

      <Checkbox
        name="rgpd"
        label="J’accepte que mes informations soient utilisées pour me recontacter au sujet de cette demande."
        error={fieldError("rgpd")}
        required
      />

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Demander l’audit"}
      </Button>
    </form>
  );
}
