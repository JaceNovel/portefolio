"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function DashboardAdminLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Connexion impossible.");
      setPending(false);
      return;
    }

    router.replace("/dashboard-admin");
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard Admin</h1>
      <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/40 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(new FormData(e.currentTarget));
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Email" name="email" type="email" required />
          <Input label="Mot de passe" name="password" type="password" required />
          {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </main>
  );
}
