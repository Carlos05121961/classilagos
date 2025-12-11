"use client";

import Link from "next/link";
import BannerRotator from "../../components/BannerRotator";

// Aqui você cadastra os cartões postais
const POSTAIS = [
  {
    id: "restinga-aerea-01",
    cidade: "Maricá",
    titulo: "Restinga de Maricá – vista aérea",
    caminho: "/postais/marica/restinga-aerea-01.webp",
    credito: "Foto: Carlinhos Soares",
    descricao:
      "Vista aérea da restinga entre a lagoa e o mar em Maricá, cartão postal clássico da Região dos Lagos.",
  },
  // Exemplo extra – depois você copia esse bloco e cria quantos quiser
  /*
  {
    id: "ponta-negra-01",
    cidade: "Maricá",
    titulo: "Farol de Ponta Negra",
    caminho: "/postais/ponta-negra-01.webp",
    credito: "Foto: Carlinhos Soares",
    descricao:
      "Farol de Ponta Negra ao entardecer, com as ondas batendo nas pedras.",
  },
  */
];

export default function CartoesPostaisPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO (igual ao resto do site) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CABEÇALHO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] text-slate-500">
              Classilagos – Turismo &amp; Guia ONDE
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Cartões postais da Região dos Lagos
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-600 max-w-2xl">
              Uma galeria especial com imagens autorais da Região dos Lagos.
              Use para divulgar sua cidade, enviar para amigos ou simplesmente
              apreciar as paisagens.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Link
              href="/turismo"
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Voltar para Turismo
            </Link>
            <p className="text-[11px] text-slate-400 max-w-[220px] text-right">
              Em breve, esta galeria poderá ser integrada com um banco de
              imagens maior no Classilagos.
            </p>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {POSTAIS.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-6 shadow-sm text-center">
            <p className="text-sm text-slate-600">
              Ainda não há cartões postais cadastrados. Assim que você enviar as
              primeiras imagens para a pasta{" "}
              <span className="font-mono text-xs">/public/postais</span> e
              cadastrar aqui no código, elas aparecerão nesta galeria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTAIS.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="w-full h-56 md:h-64 overflow-hidden bg-slate-100">
                  <img
                    src={p.caminho}
                    alt={p.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="px-4 py-3 space-y-1 flex-1 flex flex-col">
                  <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                    {p.cidade}
                  </p>
                  <h2 className="text-sm md:text-base font-semibold text-slate-900">
                    {p.titulo}
                  </h2>
                  {p.descricao && (
                    <p className="mt-1 text-[11px] text-slate-600 line-clamp-3">
                      {p.descricao}
                    </p>
                  )}
                  {p.credito && (
                    <p className="mt-2 text-[10px] text-slate-500">
                      {p.credito}
                    </p>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={p.caminho}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-500"
                    >
                      Abrir em tela cheia
                    </a>
                    <span className="text-[10px] text-slate-400">
                      Formato recomendado: 1600×900px · WebP
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

