"use client";

import Link from "next/link";
import { camerasData } from "./camerasData";

export default function CamerasPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-1">
          <p className="text-[11px] text-slate-500">
            Classilagos • Notícias • Câmeras ao vivo
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Câmeras ao vivo da Região dos Lagos
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Acompanhe trânsito, praias, rodovias e pontos estratégicos da Região
            dos Lagos através de câmeras públicas e transmissões oficiais.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        {camerasData.map((grupo) => (
          <div key={grupo.grupo}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {grupo.grupo}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grupo.itens.map((cam) => (
                <div
                  key={cam.titulo}
                  className="rounded-3xl border border-slate-200 bg-white p-4 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-sky-700 uppercase">
                      {cam.local}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900">
                      {cam.titulo}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {cam.descricao}
                    </p>
                  </div>

                  <div className="pt-3">
                    <Link
                      href={cam.url}
                      target="_blank"
                      className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                    >
                      Abrir câmera
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-[11px] text-slate-400">
          As transmissões são de responsabilidade de seus respectivos órgãos e
          canais oficiais. Quando disponível, o Classilagos poderá incorporar
          visualizações diretas no portal.
        </p>
      </section>
    </main>
  );
}
