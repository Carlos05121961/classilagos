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

  // troca automática das 3 fotos
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
{/* BANNER FIXO NO TOPO (PADRÃO IGUAL OUTRAS PÁGINAS) */}
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


      {/* HERO IMÓVEIS COM FOTO + BUSCA */}
      <section className="relative w-full">
        {/* Imagem de fundo (carrossel simples) */}
        <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Imóveis"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
          {/* camada leve escura pra dar contraste no texto */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Conteúdo sobreposto (texto + busca) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pt-10 pb-8">
          <div className="text-center text-white px-4">
            <p className="text-sm md:text-base font-medium drop-shadow">
              Encontre casas, apartamentos, terrenos e oportunidades em toda a
              Região dos Lagos.
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Classilagos – Imóveis
            </h1>
          </div>

          {/* Barra de busca */}
          <div className="flex justify-center px-4">
            <div className="pointer-events-auto w-full max-w-4xl">
              <div className="bg-white/95 rounded-full shadow-lg border border-slate-200 px-4 py-2 md:py-2.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 items-center text-xs md:text-sm">
                  {/* Busca livre */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <span className="font-medium text-slate-600 mb-0.5 md:mb-0">
                      Busca:
                    </span>
                    <input
                      type="text"
                      placeholder="Ex.: casa 2 quartos com quintal"
                      className="flex-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Tipo de imóvel */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <span className="font-medium text-slate-600 mb-0.5 md:mb-0">
                      Imóvel:
                    </span>
                    <select className="flex-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Casa</option>
                      <option>Apartamento</option>
                      <option>Kitnet / Studio</option>
                      <option>Terreno</option>
                      <option>Sítio / Chácara</option>
                      <option>Comercial</option>
                    </select>
                  </div>

                  {/* Cidade */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <span className="font-medium text-slate-600 mb-0.5 md:mb-0">
                      Cidade:
                    </span>
                    <select className="flex-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                </div>
              </div>
              <p className="mt-1 text-[11px] text-center text-slate-200 drop-shadow">
                Em breve, essa busca estará ligada aos anúncios reais da
                plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Espaço depois do hero pra nada ficar "trepado" */}
      <div className="h-6 md:h-10" />

      {/* CATEGORIAS – LINHA 1 E LINHA 2 */}
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

        {/* LINHA 2 – MESMO TAMANHO DA LINHA 1 */}
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

        {/* LINHA DE DESTAQUES (LUGAR RESERVADO) */}
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

      {/* NOTÍCIAS – FAIXA AMARELA */}
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
          <h2 className="text-sm font-semibold text-slate-800">
            Links úteis
          </h2>
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

      {/* CHAMADA FINAL – ANUNCIE SEU IMÓVEL GRÁTIS */}
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









