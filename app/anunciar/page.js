"use client";

import Image from "next/image";
import FormularioImoveis from "../../components/forms/FormularioImoveis";

export default function AnunciarImovelPage() {
  return (
    <main className="bg-sky-50 min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-5xl px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu IMÓVEL totalmente GRÁTIS na Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* TÍTULO E SUBTÍTULO */}
      <section className="max-w-3xl mx-auto px-4 pt-8 pb-4">
        <p className="text-xs font-semibold text-sky-700 tracking-wide">
          ANUNCIE GRÁTIS NA CLASSILAGOS
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
          Anunciar Imóvel na Região dos Lagos
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Preencha os dados do seu imóvel. Seu anúncio ficará disponível para
          milhares de pessoas em toda a Região dos Lagos.
        </p>
      </section>

      {/* FORMULÁRIO DENTRO DO CARD BRANCO */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 px-4 py-5 md:px-8 md:py-7">
          <FormularioImoveis />
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          Classilagos é uma plataforma de classificados online. Não participa
          de pagamentos, contratos ou garantias das negociações realizadas
          entre as partes.
        </p>
      </section>
    </main>
  );
}
