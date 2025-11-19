"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/imoveis/maricaimoveis.jpg",
  "/imoveis/saquaremaimoveis.jpg",
  "/imoveis/buziosimoveis.jpg",
];

export default function ImoveisPage() {
  const [currentHero, setCurrentHero] = useState(0);

  // carrossel simples de 3 fotos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const categoriasLinha1 = [
    { nome: "Venda", img: "/imoveis/card-venda.jpg" },
    { nome: "Aluguel", img: "/imoveis/card-aluguel.jpg" },
    { nome: "Lançamentos", img: "/imoveis/card-lancamentos.jpg" },
    { nome: "Oportunidade", img: "/imoveis/card-oportunidade.jpg" },
  ];

  const categoriasLinha2 = [
    { nome: "Temporada" },
    { nome: "Terrenos" },
    { nome: "Sítios" },
    { nome: "Comercial" },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu imóvel totalmente GRÁTIS - Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO: SÓ FOTO + TEXTOS (SEM CAIXA DE BUSCA) */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Imóveis"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          {/* leve escurecida p/ dar contraste */}
          <div className="absolute inset-0 bg-black/25" />

          {/* textos centralizados na imagem */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre casas, apartamentos, terrenos e oportunidades em toda a
              Região dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Imóveis
            </h1>
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA FORA DA FOTO (OPÇÃO B) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Busca
                </label>
                <input
                  type="text"
                  placeholder="Ex.: casa 2 quartos com quintal"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* tipo de imóvel */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Imóvel
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Kitnet / Studio</option>
                  <option>Terreno</option>
                  <option>Sítio / Chácara</option>
                  <option>Comercial</option>
                </select>
              </div>

              {/* cidade */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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

              {/* botão */}
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
            Em breve, essa busca estará ligada aos anúncios reais da plataforma.
          </p>
        </div>
      </section>

      {/* pequeno respiro */}
      <div className="h-4 sm:h-6" />

      {/* CATEGORIAS – LINHA 1 E 2 */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {/* LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100"
            >
              <div className="relative h-32 md:h-36 w-full bg-slate-200">
                {cat.img && (
                  <Image
                    src={cat.img}
                    alt={cat.nome}
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => (
            <div
              key={cat.nome}
              className="overflow-hidden rounded-2xl shadow border border-slate-200"
            >
              <div className="h-32 md:h-36 w-full bg-indigo-700" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                {cat.nome}
              </div>
            </div>
          ))}
        </div>

        {/* DESTAQUES RESERVADOS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl shadow border border-slate-200"
            >
              <div className="h-28 md:h-32 w-full bg-indigo-800" />
              <div className="bg-slate-900 text-white text-xs md:text-sm font-semibold px-3 py-2">
                Destaque
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NOTÍCIAS – FAIXAS AMARELAS */}
      <section className="bg-white pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 flex items-center justify-center bg-yellow-300 text-slate-900 text-xl font-bold rounded-md"
              >
                Notícias
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINKS ÚTEIS */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Links úteis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Consulta IPTU
              </p>
              <p className="text-[12px] text-slate-600">
                Prefeitura de Maricá (em breve).
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Plantas &amp; Projetos
              </p>
              <p className="text-[12px] text-slate-600">
                Regularização e documentação.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-semibold text-slate-900 text-sm">
                Secretaria de Urbanismo
              </p>
              <p className="text-[12px] text-slate-600">
                Informações oficiais (em breve).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL – ANUNCIE SEU IMÓVEL */}
      <section className="bg-slate-50 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl bg-slate-100 border border-slate-200 px-6 py-7 text-center">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Quer anunciar seu imóvel?
            </p>
            <p className="text-xs text-slate-700 mb-4">
              Venda ou alugue seu imóvel rapidamente no Classilagos.
            </p>

            <Link
              href="/imoveis/anunciar"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Anuncie seu imóvel grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

