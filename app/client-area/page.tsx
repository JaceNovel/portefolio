import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { requireClient } from "../../lib/auth";
import { MessageComposer } from "../../app/client/MessageComposer";
import { Button } from "../../components/ui/Button";

export const dynamic = "force-dynamic";

type ClientProjectFileItem = {
  id: string;
  name: string;
  url: string;
};

type ClientProjectItem = {
  id: string;
  title: string;
  description: string;
  progress: number;
  files: ClientProjectFileItem[];
};

type ClientMessageItem = {
  id: string;
  content: string;
  createdAt: Date;
};

export default async function ClientAreaPage() {
  const session = await requireClient();
  if (!session) redirect("/client-area/login");

  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    select: { name: true, email: true, mustResetPassword: true },
  });

  if (client?.mustResetPassword) redirect("/client-area/reset-password");

  const projects: ClientProjectItem[] = await prisma.clientProject.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    include: { files: true },
  });

  const messages: ClientMessageItem[] = await prisma.clientMessage.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Client Area</h1>
          <p className="mt-1 text-sm text-slate-300">{client ? `${client.name} • ${client.email}` : ""}</p>
        </div>
        <form action="/api/client/logout" method="post" className="sm:self-start">
          <Button variant="secondary" type="submit">
            Déconnexion
          </Button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-white">Projets</h2>
          <div className="mt-4 flex flex-col gap-3">
            {projects.map((p: ClientProjectItem) => (
              <div key={p.id} className="rounded-2xl border border-slate-800/70 p-4">
                <div className="text-sm font-semibold text-white">{p.title}</div>
                <div className="mt-1 text-sm text-slate-300">{p.description}</div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Avancement</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-900">
                    <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${Math.min(100, Math.max(0, p.progress))}%` }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fichiers</div>
                  <div className="mt-2 flex flex-col gap-2">
                    {p.files.map((f: ClientProjectFileItem) => (
                      <a key={f.id} href={f.url} className="text-sm font-medium text-slate-100 underline" target="_blank" rel="noreferrer">
                        {f.name}
                      </a>
                    ))}
                    {p.files.length === 0 ? <div className="text-sm text-slate-300">Aucun fichier.</div> : null}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 ? <div className="text-sm text-slate-300">Aucun projet pour le moment.</div> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5">
          <h2 className="text-sm font-semibold text-white">Messages</h2>
          <div className="mt-4 flex flex-col gap-3">
            <MessageComposer />
            <div className="mt-2 flex flex-col gap-2">
              {messages.map((m: ClientMessageItem) => (
                <div key={m.id} className="rounded-2xl border border-slate-800/70 p-4">
                  <div className="whitespace-pre-wrap text-sm text-slate-100">{m.content}</div>
                  <div className="mt-2 text-xs text-slate-400">{new Date(m.createdAt).toLocaleString("fr-FR")}</div>
                </div>
              ))}
              {messages.length === 0 ? <div className="text-sm text-slate-300">Aucun message.</div> : null}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm font-medium text-slate-300 underline">
          Retour au portfolio
        </Link>
      </div>
    </main>
  );
}
