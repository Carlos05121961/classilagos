// app/lands/empregos/page.js
"use client";

import Link from "next/link";

export default function LandEmpregos() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto max-w-3xl">
        {/* Hero / conteúdo principal */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Classilagos • Empregos • Região dos Lagos
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Seu primeiro emprego
              <br />
              começa aqui.
            </h1>

            <p className="mt-3 text-base md:text-lg text-slate-600">
              Cadastre seu currículo ou anuncie uma vaga na Região dos Lagos.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-6 space-y-3">
            {/* ✅ Currículo -> vai para cadastro e volta para /anunciar/curriculo */}
            <Link
              href="/cadastro?next=/anunciar/curriculo"
              className="block w-full rounded-2xl px-6 py-4 text-center font-semibold shadow-sm transition hover:opacity-95 bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
            >
              Começar meu currículo →
            </Link>

            {/* ✅ Vaga -> vai para cadastro e volta para /anunciar/empregos */}
            <Link
              href="/cadastro?next=/anunciar/empregos"
              className="block w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              Anunciar uma vaga
            </Link>

            <p className="pt-2 text-xs text-slate-500">
              Plataforma regional • 100% gratuito • Contato direto
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
