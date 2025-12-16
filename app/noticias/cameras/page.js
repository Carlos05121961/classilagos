"use client";

import Link from "next/link";
import { camerasData } from "./camerasData";

function toYouTubeEmbed(url) {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;
  return null;
}

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
            Acompanhe praias, rodovias, trânsito e pontos estratégicos da Região
            dos Lagos através de câmeras públicas e transmissões oficiais.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-6xl mx-auto px-4 pt-6 space-y-10">
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

                    {cam.embed && toYouTubeEmbed(cam.url) && (
                      <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video border border-slate-200 mt-2">
                        <iframe
                          className="w-full h-full"
                          src={toYouTubeEmbed(cam.url)}
                          title={cam.titulo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex items-center gap-2 flex-wrap">
                    <Link
                      href={cam.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                    >
                      Abrir câmera
                    </Link>

                    {cam.embed && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        Ao vivo
                      </span>
                    )}

                    {cam.status === "externo" && (
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-600 border border-slate-200">
                        Link externo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-[11px] text-slate-400">
          As transmissões são de responsabilidade de seus respectivos canais e
          órgãos oficiais. Alguns links externos podem variar de disponibilidade.
        </p>
      </section>
    </main>
  );
}

