"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Textarea } from "../../../../components/ui/Textarea";
import { Checkbox } from "../../../../components/ui/Checkbox";
import { DashboardAdminNav } from "../../../../components/DashboardAdminNav";

type Issues = Array<{ path: Array<string | number>; message: string }>;

export default function DashboardAdminNewPostPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issues>([]);

  const fieldError = (name: string) => issues.find((i) => i.path?.[0] === name)?.message;

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setIssues([]);

    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      published: formData.get("published") === "on",
    };

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Erreur.");
      setIssues(data?.issues ?? []);
      setPending(false);
      return;
    }

    router.replace("/dashboard-admin");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <DashboardAdminNav />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Nouvel article</h1>
      <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/40 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(new FormData(e.currentTarget));
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Titre" name="title" error={fieldError("title")} required />
          <Input label="Slug" name="slug" placeholder="mon-article" error={fieldError("slug")} required />
          <Textarea label="Extrait" name="excerpt" error={fieldError("excerpt")} required />
          <Textarea label="Contenu (Markdown)" name="content" className="min-h-56" error={fieldError("content")} required />
          <Checkbox label="Publié" name="published" />
          {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Création…" : "Créer"}
          </Button>
        </form>
      </div>
    </main>
  );
}
