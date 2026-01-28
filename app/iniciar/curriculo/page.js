// app/iniciar/curriculo/page.js
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function IniciarCurriculo() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const ok = useMemo(() => isValidEmail(email), [email]);

  function handleContinue(e) {
    e.preventDefault();
    setTouched(true);
    if (!ok) return;

    const q = encodeURIComponent(email.trim());
    router.push(`/anunciar/curriculo?email=${q}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Comece aqui • Currículo
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Digite seu e-mail para continuar
            </h1>

            <p className="mt-3 text-slate-600">
              Usaremos seu e-mail apenas para identificar seu currículo e permitir continuidade.
            </p>

            <form onSubmit={handleContinue} className="mt-7 flex flex-col gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="seuemail@exemplo.com"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />

              {touched && !ok ? (
                <p className="text-sm text-rose-600">
                  Informe um e-mail válido para continuar.
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Dica: você pode completar depois, sem pressa.
                </p>
              )}

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-4 text-base font-bold text-white shadow-[0_14px_40px_rgba(16,185,129,0.25)] transition hover:brightness-110 disabled:opacity-60"
                disabled={!ok}
              >
                Continuar
                <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
              </button>

              <Link
                href="/lands/empregos"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Voltar
              </Link>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Plataforma regional • 100% gratuito • Contato direto
          </p>
        </div>
      </section>
    </main>
  );
}
