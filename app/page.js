"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";
import BannerRotator from "./components/BannerRotator";

export default function Home() {
  const heroImages = [
    "/banners/pontanegra.png",
    "/banners/itaipuacu.png",
    "/banners/barra.png",
  ];

  return (
    <main className="bg-white">
      {/* BANNER EM CARROSSEL CENTRALIZADO NO TOPO */}
      <BannerRotator />

      {/* HERO COM LOGO + MENU + FRASE CENTRAL */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          <div className="absolute inset-0 flex flex-col">
            {/* LOGO + MENU NO TOPO */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 pt-4">
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo-classilagos.png"
                  alt="Classilagos"
                  width={150}
                  height={150}
                  priority
                />
              </Link>

              {/* MENU – DESKTOP */}
              <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-50 drop-shadow">
                <Link href="/imoveis" className="hover:text-blue-200">
                  Imóveis
                </Link>
                <Link href="/veiculos" className="hover:text-blue-200">
                  Veículos
                </Link>
                <Link href="/nautica" className="hover:text-blue-200">
                  Náutica
                </Link>
                <Link href="/servicos" className="hover:text-blue-200">
                  Serviços
                </Link>
                <Link href="/turismo" className="hover:text-blue-200">
                  Turismo
                </Link>
                <Link href="/lagolistas" className="hover:text-blue-200">
                  LagoListas
                </Link>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link
                  href="/anunciar"
                  className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Anuncie grátis
                </Link>
              </nav>
            </div>

            {/* FRASE CENTRAL NA IMAGEM */}
            <div className="flex-1 flex items-center justify-center px-4 pb-8 md:pb-10">
              <div className="text-center text-white drop-shadow max-w-2xl">
                <p className="text-xs sm:text-sm md:text-base mb-2">
                  O seu guia de compras, serviços, turismo e oportunidades em
                  toda a Região dos Lagos.
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  Classilagos – Região dos Lagos em um só lugar
                </h1>
              </div>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CAIXA DE BUSCA GERAL – FORA DA FOTO */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* Busca livre */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista em Maricá, pousada em Búzios, casa 2 quartos..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categoria */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Imóveis</option>
                  <option>Veículos</option>
                  <option>Náutica</option>
                  <option>Empregos</option>
                  <option>Serviços</option>
                  <option>Turismo</option>
                  <option>LagoListas</option>
                </select>
              </div>

              {/* Cidade */}
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
            Em breve, essa busca estará ligada aos anúncios reais da plataforma.
          </p>
        </div>
      </section>

      {/* PEQUENO RESPIRO */}
      <div className="h-4 sm:h-6" />

      {/* CATEGORIAS – BOTÕES NEON (OPÇÃO B) */}
      <section className="bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold text-slate-50 mb-2">
            Explore por categoria
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mb-6">
            Clique e vá direto para a seção que você procura.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              ["Imóveis", "/imoveis"],
              ["Veículos", "/veiculos"],
              ["Náutica", "/nautica"],
              ["Pets", "/pets"],
              ["Empregos", "/empregos"],
              ["Serviços", "/servicos"],
              ["Turismo", "/turismo"],
              ["LagoListas", "/lagolistas"],
            ].map(([label, href]) => (
             
