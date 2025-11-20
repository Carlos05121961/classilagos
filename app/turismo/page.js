"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TurismoPage() {
  // Imagens do hero de Turismo
  const heroImages = [
    "/turismo/hero-turismo01.jpg",
    "/turismo/hero-turismo02.jpg",
    "/turismo/hero-turismo03.jpg",
    "/turismo/hero-turismo04.jpg",
    "/turismo/hero-turismo05.jpg",
    "/turismo/hero-turismo06.jpg",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000); // troca a cada 6 segundos

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO (MESMO PADRÃO DAS OUTRAS PÁGINAS) */}
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

      {/* HERO TURISMO – CARROSSEL DE IMAGENS */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Turismo"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          {/* leve escurecida pra destacar o texto */}
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Descubra o melhor da Região dos Lagos em um só lugar.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Turismo
            </h1>
            <p className="mt-2 text-xs md:text-sm max-w-2xl drop-shadow">
              Pousadas, hotéis, bares, restaurantes, passeios de barco, praias,
              trilhas, cartões postais e muito mais.
            </p>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA TURISMO */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: pousada, hotel, passeio de barco..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categoria */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos</option>
                  <option>Pousadas &amp; Hotéis</option>
                  <option>Bares &amp; Restaurantes</option>
                  <option>Passeios &amp; Turismo</option>
                  <option>Praias &amp; Cartões Postais</option>
                  <option>Vida noturna</option>
                </select>
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
            Em breve, essa busca estará ligada aos anúncios reais de turismo na plataforma.
          </p>
        </div>
      </section>

      {/* Espaço para futuras seções (pousadas, bares, passeios, etc.) */}
      <div className="h-10 sm:h-14" />

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-8 px-4 text-center text-xs sm:text-sm text-slate-600">
          Em breve, aqui você verá destaques de pousadas, hotéis, bares,
          restaurantes, passeios de barco, guias e muito mais da Região dos
          Lagos. <br />
          <span className="font-semibold">
            Aproveite a fase de lançamento para anunciar gratuitamente!
          </span>
          <div className="mt-4">
            <Link
              href="/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anunciar no turismo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
