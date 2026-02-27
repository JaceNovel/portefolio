"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function ResetPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setPending(false);
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setPending(false);
      return;
    }

    const res = await fetch("/api/client/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Erreur lors de la mise à jour.");
      setPending(false);
      return;
    }

    router.replace("/client-area");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(new FormData(e.currentTarget));
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Nouveau mot de passe" name="password" type="password" required />
      <Input label="Confirmer" name="confirm" type="password" required />
      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Mise à jour…" : "Valider"}
      </Button>
    </form>
  );
}
