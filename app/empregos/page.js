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

      {/* HERO PRINCIPAL */}
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

      {/* RESPIRO ENTRE BUSCA E HERO DE VAGAS */}
      <div className="h-14 sm:h-16" />

      {/* HERO DE VAGAS – SÓ COM O BOTÃO */}
      <section className="relative w-full mt-4 sm:mt-6">
        <div className="relative w-full max-w-6xl mx-auto h-[230px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-3xl border border-slate-200 shadow">
          <Image
            src="/empregos/hero-vagas.jpg"
            alt="Vagas de emprego - anuncie no Classilagos"
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* leve escurecida opcional, se não quiser é só remover essa div */}
          <div className="absolute inset-0 bg-black/10" />

          {/* APENAS O BOTÃO, SEM TEXTOS SOBRE A IMAGEM */}
          <div className="absolute bottom-4 right-4">
            <Link
              href="/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 shadow-lg"
            >
              Anunciar vaga grátis
            </Link>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </main>
  );
}
