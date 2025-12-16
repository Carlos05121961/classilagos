"use client";

import { correspondentesData } from "./correspondentesData";

export default function CorrespondentesPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-1">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Correspondentes Culturais Classilagos
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Pessoas que representam a identidade cultural, histórica e comercial
            de cada cidade da Região dos Lagos.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {correspondentesData.map((c) => (
          <div
            key={c.cidade}
            className="rounded-3xl border border-slate-200 bg-white p-4 space-y-2"
          >
            <p className="text-xs font-semibold text-sky-700 uppercase">
              {c.cidade}
            </p>
            <h2 className="text-sm font-bold text-slate-900">{c.nome}</h2>
            <p className="text-xs text-slate-600">{c.bio}</p>

            <span className="inline-flex rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-[11px] text-yellow-700">
              Em formação
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
