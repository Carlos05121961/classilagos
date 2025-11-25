"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";
import BannerRotator from "./components/BannerRotator";
import UserMenu from "./components/UserMenu";

export default function Home() {
  const heroImages = [
    "/banners/pontanegra.png",
    "/banners/itaipuacu.png",
    "/banners/barra.png",
  ];

  const categorias = [
    ["Imóveis", "/imoveis"],
    ["Veículos", "/veiculos"],
    ["Náutica", "/nautica"],
    ["Pets", "/pets"],
    ["Empregos", "/empregos"],
    ["Serviços", "/servicos"],
    ["Turismo", "/turismo"],
    ["LagoListas", "/lagolistas"],
  ];

  const cidades = [
    "Maricá",
    "Saquarema",
    "Araruama",
    "Iguaba Grande",
    "São Pedro da Aldeia",
    "Arraial do Cabo",
    "Cabo Frio",
    "Búzios",
    "Rio das Ostras",
  ];

  return (
    <main className="bg-white">
      {/* BANNER COMERCIAL */}
      <BannerRotator />

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          <div className="absolute inset-0 flex flex-col">

            {/* TOPO DO HERO — LOGO + MENU + USERMENU */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 pt-4">
              
              {/* LOGO */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-classilagos.png"
                  alt="Classilagos"
                  width={150}
                  height={150}
                  priority
                />
              </Link>

              {/* MENU DESKTOP */}
              <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-white drop-shadow">
  <Link href="/imoveis">Imóveis</Link>
  <Link href="/veiculos">Veículos</Link>
  <Link href="/nautica">Náutica</Link>
  <Link href="/pets">Pets</Link>
  <Link href="/empregos">Empregos</Link>
  <Link href="/servicos">Serviços</Link>
  <Link href="/turismo">Turismo</Link>
  <Link href="/lagolistas">LagoListas</Link>
  <Link href="/noticias">Notícias</Link>

  {/* 🔵 BOTÃO ANUNCIE GRÁTIS — igual ao SiteHeader */}
  <Link
    href="/anunciar"
    className="rounded-full bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
  >
    Anuncie grátis
  </Link>

  {/* 🟣 MENU DO USUÁRIO — agora igual no site todo */}
  <div className="ml-3">
    <UserMenu />
  </div>
</nav>

            </div>

            {/* TEXTO CENTRAL */}
            <div className="flex-1 flex items-center justify-center px-4 pb-10">
              <div className="text-center text-white drop-shadow max-w-2xl">
                <p className="text-xs sm:text-sm md:text-base mb-2">
                  O seu guia de compras, serviços, turismo e oportunidades em toda a Região dos Lagos.
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  Classilagos – Região dos Lagos em um só lugar
                </h1>
              </div>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-6 py-5">

            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
              
              {/* CAMPO BUSCA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista, pousada, casa em Cabo Frio..."
                  className="w-full rounded-full border border-slate-200 px-3 py-2"
                />
              </div>

              {/* CATEGORIA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-2">
                  {categorias.map(([label]) => (
                    <option key={label}>{label}</option>
                  ))}
                </select>
              </div>

              {/* CIDADE */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-200 px-3 py-2">
                  {cidades.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* BOTÃO BUSCAR */}
              <button className="rounded-full bg-blue-600 text-white px-5 py-2 font-semibold">
                Buscar
              </button>

            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Em breve, essa busca estará totalmente integrada aos anúncios reais.
          </p>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-xl font-semibold text-white mb-2">
            Explore por categoria
          </h2>

          <p className="text-xs md:text-sm text-slate-400 mb-6">
            Clique e vá direto para a seção desejada.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categorias.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl bg-slate-900 text-center p-5 border border-pink-500 hover:shadow-[0_0_20px_#ff50c8] transition"
              >
                <div className="text-lg font-bold bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  {label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Abrir</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Anúncios em destaque
          </h2>

          <div className="rounded-2xl border border-slate-200 p-8 text-slate-600">
            Em breve os destaques aparecerão aqui.
          </div>
        </div>
      </section>

      {/* CHAMADAS */}
      <section className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-4">

          <Link href="#" className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Classilagos TV</h3>
            <p className="text-sm text-slate-600">Pautas locais e vídeos da nossa região.</p>
          </Link>

          <Link href="/turismo" className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Turismo</h3>
            <p className="text-sm text-slate-600">Pousadas, passeios, bares e restaurantes.</p>
          </Link>

          <Link href="/noticias" className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Notícias</h3>
            <p className="text-sm text-slate-600">Acompanhe novidades e oportunidades.</p>
          </Link>

        </div>
      </section>
    </main>
  );
}
