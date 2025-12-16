"use client";

import Link from "next/link";
import { correspondentesData } from "./correspondentesData";

function StatusChip({ status }) {
  if (status === "ativo") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700">
        Ativo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-[11px] font-semibold text-yellow-700">
      Em formação
    </span>
  );
}

export default function CorrespondentesPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* HERO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-2">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Correspondentes
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Correspondentes Culturais Classilagos
              </h1>
              <p className="text-sm text-slate-600 max-w-3xl mt-1">
                Uma rede de representantes por cidade para valorizar cultura,
                turismo, comércio tradicional e histórias locais — sem violência
                e sem política partidária.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Link
                href="/noticias/correspondentes/candidatar"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Quero ser correspondente
              </Link>

              <Link
                href="/noticias"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Voltar para Notícias
              </Link>
            </div>
          </div>

          <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">
              Como funciona (resumo rápido)
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conteúdo cultural/comercial positivo da cidade.</li>
              <li>Reportagens comemorativas podem ser remuneradas (comissão 70/30).</li>
              <li>Conteúdo passa por curadoria editorial Classilagos.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {correspondentesData.map((c) => (
            <div
              key={c.cidade}
              className="rounded-3xl border border-slate-200 bg-white p-4 space-y-2 hover:shadow-md transition"
            >
              <p className="text-xs font-semibold text-sky-700 uppercase">
                {c.cidade}
              </p>

              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-bold text-slate-900">{c.nome}</h2>
                <StatusChip status={c.status} />
              </div>

              <p className="text-xs text-slate-600">{c.bio}</p>

              {c.instagram ? (
                <Link
                  href={c.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-700 underline"
                >
                  Ver Instagram
                </Link>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Contato disponível em breve.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

