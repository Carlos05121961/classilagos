// app/lands/empregos/page.js
"use client";

import Link from "next/link";

export default function LandEmpregos() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto max-w-3xl">
        {/* ... seu conteúdo/hero aqui ... */}

        <div className="mt-6 space-y-3">
          {/* ✅ Currículo */}
          <Link
            href="/anunciar/curriculo"
            className="block w-full rounded-2xl px-6 py-4 text-center font-semibold shadow-sm transition hover:opacity-95 bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
          >
            Começar meu currículo →
          </Link>

          {/* ✅ Vaga */}
          <Link
            href="/anunciar/empregos"
            className="block w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            Anunciar uma vaga
          </Link>
        </div>

        {/* ... resto ... */}
      </section>
    </main>
  );
}

