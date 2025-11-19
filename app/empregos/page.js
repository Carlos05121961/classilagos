import Link from "next/link";
import Image from "next/image";

export default function EmpregosPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* HERO */}
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

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Você será encontrado aqui!
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Empregos
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA FORA DA FOTO */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: padeiro, vendedor, garçom, recepcionista..."
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

      {/* CHAMADA SIMPLES ABAIXO (PLACEHOLDER) */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="rounded-3xl bg-slate-100 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Quer anunciar vagas da sua empresa?
          </p>
          <p className="text-xs text-slate-700 mb-4">
            Divulgue oportunidades para comércio, turismo, serviços, pousadas, quiosques e muito
            mais na Classilagos. Durante a fase de lançamento, os anúncios de empregos serão
            gratuitos.
          </p>

          <Link
            href="/anunciar"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar vaga grátis
          </Link>
        </div>
      </section>
    </main>
  );
}
