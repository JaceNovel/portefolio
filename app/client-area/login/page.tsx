"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";

export default function ClientAreaLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const res = await fetch("/api/client/login", {
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
    if (data?.mustResetPassword) {
      router.replace("/client-area/reset-password");
      return;
    }
    router.replace("/client-area");
  }

  return (
    <main className="login-page-boost login-page-bg relative isolate min-h-screen overflow-hidden px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <section className="rounded-3xl border border-cyan-500/20 bg-slate-950/75 p-6 shadow-[0_0_70px_rgba(8,145,178,0.18)] backdrop-blur-md sm:p-8">
          <header className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Secure Client Login</h1>
            <p className="mt-2 text-sm text-slate-300">Log in to access your secure client dashboard</p>
            <div className="mx-auto mt-4 h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </header>

          <div className="my-6 flex justify-center text-cyan-300">
            <span className="inline-flex items-center justify-center">
              <Image
                src="https://img.icons8.com/?size=188&id=5gNd48f2S9rS&format=png"
                alt="User shield logo"
                width={64}
                height={64}
                className="h-16 w-16"
                priority
              />
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/85" aria-hidden="true" />
                <input
                  name="email"
                  type="email"
                  placeholder="Login"
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-cyan-500/25 bg-slate-900/85 pl-10 pr-3 text-slate-100 outline-none transition focus:border-cyan-400/75 focus:ring-2 focus:ring-cyan-500/25"
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Mot de passe</span>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/85" aria-hidden="true" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-cyan-500/25 bg-slate-900/85 pl-10 pr-11 text-slate-100 outline-none transition focus:border-cyan-400/75 focus:ring-2 focus:ring-cyan-500/25"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800/80 hover:text-cyan-300"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" aria-hidden="true" /> : <FiEye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="remember" type="checkbox" className="h-4 w-4 rounded border-cyan-500/40 bg-slate-900 accent-cyan-400" />
              <span>Remember me</span>
            </label>

            {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500/75 to-cyan-400/85 font-semibold text-white shadow-[0_0_25px_rgba(34,211,238,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Connexion…" : "Login"}
            </button>

            <div className="text-center text-sm">
              <Link href="/contact" className="text-slate-300 transition hover:text-cyan-300">
                Forgot Password?
              </Link>
            </div>
          </form>

          <footer className="mt-6 border-t border-cyan-500/20 pt-4 text-sm text-slate-300">
            <p className="flex items-center gap-2">
              <FiLock className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              <span>This is a secure area of the website.</span>
            </p>
            <p className="mt-1 text-cyan-200/85">Security Level: High</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
