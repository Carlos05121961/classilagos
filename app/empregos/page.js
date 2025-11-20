"use client";

import Link from "next/link";
import Image from "next/image";

export default function EmpregosPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO PRINCIPAL – PARA QUEM PROCURA EMPREGO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            src="/empregos/hero-empregos.png"
            alt="Classilagos Empregos"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre oportunidades e seja encontrado pelas empresas da Região dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Empregos
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Campo de busca */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: atendente, garçom, auxiliar, vendedor..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Toda a região</option>
                  <option>Maricá</option>
                  <option>Saquarema</option>
                  <option>Araruama</option>
                  <option>Iguaba Grande</option>
                  <option>São Pedro da Aldeia</option>
                  <option>Arraial do Cabo</option>
                  <option>Cabo Frio</option>
                  <option>Búzios</option>
                  <option>Rio das Ostras</option>
                </select>
              </div>

              {/* Botão */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará ligada às vagas reais da plataforma.
          </p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* SEGUNDO HERO – VAGAS DE EMPREGO PARA EMPRESAS */}
      <section className="relative w-full">
        <div className="relative w-full max-w-6xl mx-auto h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px] overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <Image
            src="/empregos/hero-vagas.jpg"
            alt="Vagas de emprego - anuncie no Classilagos"
            fill
            sizes="100vw"
            className="object-cover"
          />
          {/* leve escurecida para destacar o texto */}
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 text-white">
            <div className="max-w-xl text-center md:text-left mb-4 md:mb-0">
              <p className="text-xs md:text-sm font-semibold tracking-wide text-yellow-300">
                VAGAS DE EMPREGO
              </p>
              <h2 className="mt-1 text-base sm:text-lg md:text-xl font-bold drop-shadow">
                Empresário, esse espaço foi criado para você anunciar as suas vagas.
              </h2>
              <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-slate-50 drop-shadow">
                Comércio, pousadas, restaurantes, quiosques, mercados, escritórios e empresas em
                geral: quando precisar de gente, é aqui que você deve anunciar. E o melhor: é grátis
                na fase de lançamento.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/anunciar"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 shadow"
              >
                Anunciar vaga grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </main>
  );
}

