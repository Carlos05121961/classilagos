import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "../components/HeroCarousel";

const heroImages = [
  "/imoveis/maricaimoveis.jpg",
  "/imoveis/saquaremaimoveis.jpg",
  "/imoveis/buziosimoveis.jpg",
];

const categorias = [
  {
    slug: "#",
    nome: "Venda",
    imagem: "/imoveis/cat-venda.jpg",
  },
  {
    slug: "#",
    nome: "Aluguel",
    imagem: "/imoveis/cat-aluguel.jpg",
  },
  {
    slug: "#",
    nome: "Lançamentos",
    imagem: "/imoveis/cat-lancamentos.jpg",
  },
  {
    slug: "#",
    nome: "Oportunidade",
    imagem: "/imoveis/cat-oportunidade.jpg",
  },
  {
    slug: "#",
    nome: "Temporada",
  },
  {
    slug: "#",
    nome: "Terrenos",
  },
  {
    slug: "#",
    nome: "Sítios",
  },
  {
    slug: "#",
    nome: "Comercial",
  },
];

export default function ImoveisPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO – IMÓVEIS (ANÚNCIO) */}
      <section className="w-full flex justify-center bg-slate-50 border-b">
        <div className="w-full max-w-6xl px-4 py-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            {/* use aqui a imagem do banner que você já usa */}
            <Image
              src="/banners/anuncio-imoveis-topo.png"
              alt="Anuncie sua casa por temporada - Classilagos.shop"
              fill
              sizes="1024px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO – 3 FOTOS INTERCALANDO + TEXTOS + BUSCA */}
      <section className="relative">
        {/* fundo com carrossel */}
        <div className="h-[260px] sm:h-[320px] lg:h-[380px]">
          <HeroCarousel images={heroImages} />
        </div>

        {/* degradê para melhorar leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/5" />

        {/* textos mais para cima, não tão centralizados */}
        <div className="absolute inset-x-0 top-8 sm:top-10 flex flex-col items-center px-4">
          <p className="text-xs sm:text-sm text-slate-100 mb-1 text-center max-w-xl">
            Encontre casas, apartamentos, terrenos e oportunidades em toda a
            Região dos Lagos.
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center drop-shadow">
            Classilagos – Imóveis
          </h1>
        </div>

        {/* barra de busca – mais fininha */}
        <div className="absolute inset-x-0 bottom-6 px-4">
          <div className="max-w-4xl mx-auto bg-white/95 rounded-full shadow-xl border border-slate-200 px-4 py-2">
            <form className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 text-xs sm:text-sm">
              {/* Busca livre */}
              <div className="flex-1">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Busca:
                </label>
                <input
                  type="text"
                  placeholder="Ex.: casa 2 quartos com quintal"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo de imóvel */}
              <div className="w-full sm:w-40">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Imóvel:
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Terreno</option>
                  <option>Sítio / Chácara</option>
                  <option>Comercial</option>
                  <option>Outro</option>
                </select>
              </div>

              {/* Cidade */}
              <div className="w-full sm:w-48">
                <label className="block text-[11px] text-slate-500 mb-0.5">
                  Cidade:
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            </form>
          </div>
        </div>
      </section>

      {/* CATEGORIAS – 8 BLOCOS DO MESMO TAMANHO */}
      <section c








