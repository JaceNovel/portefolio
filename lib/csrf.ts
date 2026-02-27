import { getServerEnv } from "./env";

function getAllowedOrigins() {
  const env = getServerEnv();
  const list: string[] = [];
  if (env.NEXT_PUBLIC_SITE_URL) list.push(env.NEXT_PUBLIC_SITE_URL);
  return list;
}

export function enforceSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return;

  const allowed = getAllowedOrigins();
  if (allowed.length === 0) return;

  const ok = allowed.some((o) => {
    try {
      return new URL(o).origin === new URL(origin).origin;
    } catch {
      return false;
    }
  });

  if (!ok) {
    throw new Response("Forbidden", { status: 403 });
  }
}
