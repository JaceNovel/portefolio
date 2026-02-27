"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";

export function MessageComposer() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const payload = { content: String(formData.get("content") ?? "") };
    const res = await fetch("/api/client/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Erreur.");
      setPending(false);
      return;
    }

    setPending(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(new FormData(e.currentTarget));
      }}
      className="flex flex-col gap-3"
    >
      <Textarea label="Nouveau message" name="content" placeholder="Votre message…" required />
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
