"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";
import { Textarea } from "../../../../../components/ui/Textarea";
import { Checkbox } from "../../../../../components/ui/Checkbox";
import { DashboardAdminNav } from "../../../../../components/DashboardAdminNav";

type Issues = Array<{ path: Array<string | number>; message: string }>;
type BlogPost = { id: string; title: string; slug: string; excerpt: string; content: string; published: boolean };

export default function DashboardAdminEditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issues>([]);

  const fieldError = (name: string) => issues.find((i) => i.path?.[0] === name)?.message;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/admin/blog", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      const found = (data.posts ?? []).find((p: BlogPost) => p.id === id) ?? null;
      setPost(found);
      setLoading(false);
    }
    if (id) void load();
  }, [id]);

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

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
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

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 text-sm text-slate-300">Chargement…</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
        <DashboardAdminNav />
        <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 text-sm text-slate-300">Article introuvable.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <DashboardAdminNav />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Éditer l’article</h1>
      <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/40 p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(new FormData(e.currentTarget));
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Titre" name="title" defaultValue={post.title} error={fieldError("title")} required />
          <Input label="Slug" name="slug" placeholder="mon-article" defaultValue={post.slug} error={fieldError("slug")} required />
          <Textarea label="Extrait" name="excerpt" defaultValue={post.excerpt} error={fieldError("excerpt")} required />
          <Textarea
            label="Contenu (Markdown)"
            name="content"
            className="min-h-56"
            defaultValue={post.content}
            error={fieldError("content")}
            required
          />
          <Checkbox label="Publié" name="published" defaultChecked={post.published} />
          {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Mise à jour…" : "Mettre à jour"}
          </Button>
        </form>
      </div>
    </main>
  );
}

