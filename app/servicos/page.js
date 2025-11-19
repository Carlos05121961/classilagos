"use client";

import Image from "next/image";
import Link from "next/link";

export default function ServicosPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* HERO – FOTO + TÍTULO + FRASE */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] md:h-[340px] lg:h-[400px] overflow-hidden">
          <Image
            src="/servicos/hero-servicos.jpg"
            alt="Classilagos - Serviços"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg">
              Classilagos – Serviços
            </h1>
            <p className="mt-3 text-sm md:text-base lg:text-lg font-medium drop-shadow">
              Encontre aqui o serviço que você precisa!
            </p>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA ABAIXO DO HERO */}
      <section className="bg-slate-50 pb-8">
        <div className="max-w-4xl mx-auto px-4 -mt-10 md:-mt-12">
          <div className="rounded-3xl bg-white shadow-lg border border-slate-200 px-4 py-4 md:py-5">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
              {/* BUSCA */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista, diarista, encanador..."
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CIDADE */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro d&apos;Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              {/* BOTÃO */}
              <button
                type="button"
                className="h-10 md:h-11 rounded-full bg-blue-600 text-white text-xs md:text-sm font-semibold px-5 md:px-6 hover:bg-blue-700"
              >
                Buscar serviços
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará ligada aos serviços anunciados na
            plataforma.
          </p>
        </div>
      </section>

      {/* CATEGORIAS DE SERVIÇOS (PLACEHOLDER) */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Serviços em destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Marido de aluguel",
            "Manutenção & Reparos",
            "Limpeza e diarista",
            "Serviços para eventos",
          ].map((nome, i) => (
            <div
              key={nome}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {nome}
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Cartão fictício apenas para mostrar como os serviços poderão
                  aparecer no Classilagos.
                </p>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Atendendo Maricá e Região dos Lagos.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CHAMADA FINAL – ANUNCIE SEU SERVIÇO */}
      <section className="bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-white border border-slate-200 px-6 py-7 text-center">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Quer anunciar o seu serviço?
            </p>
            <p className="text-xs text-slate-700 mb-4">
              Na fase de lançamento, os anúncios de serviços no Classilagos
              serão gratuitos.
            </p>

            <Link
              href="/servicos"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anuncie seu serviço grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
