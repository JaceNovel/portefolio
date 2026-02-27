import { NextResponse } from "next/server";
import { clearAuthCookie } from "../../../../lib/auth";
import { enforceSameOrigin } from "../../../../lib/csrf";

export async function POST(req: Request) {
  try {
    enforceSameOrigin(req);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res, "admin_token");
  return res;
}
