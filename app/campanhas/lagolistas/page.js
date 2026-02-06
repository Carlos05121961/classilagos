"use client";

import Link from "next/link";

export default function CampanhaLagolistasPage() {
  return (
    <main className="px-4 py-6 bg-slate-50 min-h-screen">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          {/* Selo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • LagoListas • 100% grátis
          </div>

          {/* Título */}
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Cadastre seu negócio no LagoListas
            <br className="hidden md:block" />
            (Guia da Região dos Lagos)
          </h1>

          {/* Texto curto e objetivo */}
          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
            O LagoListas é o guia de profissionais, serviços e comércios do Classilagos — um inventário vivo da região.
            Cadastre grátis e apareça na busca.
          </p>

          {/* CTA único */}
          <div className="mt-8">
            <Link
              href="/anunciar/lagolistas?src=campanha"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 transition"
            >
              Cadastrar no LagoListas <span>→</span>
            </Link>

            <p className="mt-3 text-xs text-slate-500 text-center">
              Simples e rápido. Você escolhe a categoria/segmento e informa o contato.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
