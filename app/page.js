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
    {
      label: "Imóveis",
      href: "/imoveis",
      icon: "/icons/imoveis-neon.jpg",
    },
    {
      label: "Veículos",
      href: "/veiculos",
      icon: "/icons/veiculos-neon.jpg",
    },
    {
      label: "Náutica",
      href: "/nautica",
      icon: "/icons/nautica-neon.jpg",
    },
    {
      label: "Pets",
      href: "/pets",
      icon: "/icons/pets-neon.jpg",
    },
    {
      label: "Empregos",
      href: "/empregos",
      icon: "/icons/empregos-neon.jpg",
    },
    {
      label: "Serviços",
      href: "/servicos",
      icon: "/icons/servicos-neon.jpg",
    },
    {
      label: "Turismo",
      href: "/turismo",
      icon: "/icons/turismo-neon.jpg",
    },
    {
      label: "LagoListas",
      href: "/lagolistas",
      icon: "/icons/lagolistas-neon.jpg",
    },
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

  // Anúncios em destaque – por enquanto estático
  const destaques = [
    {
      id: 1,
      titulo: "Casa de praia em Itaipuaçu",
      categoria: "Imóveis",
      cidade: "Maricá",
      imagem: null, // ex.: "/imoveis/casa-praia-01.jpg"
    },
    {
      id: 2,
      titulo: "Passeio de barco em Arraial",
      categoria: "Turismo / Náutica",
      cidade: "Arraial do Cabo",
      imagem: null,
    },
    {
      id: 3,
      titulo: "Ceia de Natal completa",
      categoria: "Serviços / Gastronomia",
      cidade: "Cabo Frio",
      imagem: null,
    },
    {
      id: 4,
      titulo: "Pousada pé na areia",
      categoria: "Turismo",
      cidade: "Búzios",
      imagem: null,
    },
  ];

  return (
    <main className="bg-white">
      {/* BANNER COMERCIAL */}
      <BannerRotator />

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          {/* overlay leve pra deixar o texto mais legível */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/10 to-slate-950/60" />

          <div className="absolute inset-0 flex flex-col">
            {/* TOPO DO HERO */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 pt-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-classilagos.png"
                  alt="Classilagos"
                  width={150}
                  height={150}
                  priority
                />
              </Link>

              {/* MENU */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white drop-shadow">
                <Link href="/imoveis">Imóveis</Link>
                <Link href="/veiculos">Veículos</Link>
                <Link href="/nautica">Náutica</Link>
                <Link href="/pets">Pets</Link>
                <Link href="/empregos">Empregos</Link>
                <Link href="/servicos">Serviços</Link>
                <Link href="/turismo">Turismo</Link>
                <Link href="/lagolistas">LagoListas</Link>
                <Link href="/noticias">Notícias</Link>
                <UserMenu />
              </nav>
            </div>

            {/* TEXTO CENTRAL */}
            <div className="flex-1 flex items-center justify-center px-4 pb-10">
              <div className="text-center text-white drop-shadow max-w-2xl">
                <p className="text-xs sm:text-sm md:text-base mb-3 text-slate-100/90">
                  O seu guia de compras, serviços, turismo e oportunidades em
                  toda a Região dos Lagos.
                </p>
                <h1
                  className="
                    text-2xl sm:text-3xl md:text-4xl font-extrabold
                    bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200
                    bg-clip-text text-transparent
                    tracking-[0.08em] uppercase
                    drop-shadow-[0_0_20px_rgba(15,230,255,0.7)]
                  "
                >
                  Classilagos – Região dos Lagos em um só lugar
                </h1>
              </div>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* BLOCO DE BUSCA – ESTILO NEON */}
      <section className="bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-4">
          <div
            className="
              rounded-3xl
              bg-slate-950/95
              border border-slate-700/70
              shadow-[0_0_30px_rgba(0,0,0,0.8)]
              px-6 py-5
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
              {/* CAMPO BUSCA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista, pousada, casa em Cabo Frio..."
                  className="
                    w-full rounded-full border border-slate-600/80 px-3 py-2
                    bg-slate-900/80 text-slate-50 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-pink-400/80 focus:border-pink-400
                    transition
                  "
                />
              </div>

              {/* CATEGORIA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  Categoria
                </label>
                <select
                  className="
                    w-full rounded-full border border-slate-600/80 px-3 py-2
                    bg-slate-900/80 text-slate-50
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400
                    transition
                  "
                >
                  {categorias.map((cat) => (
                    <option key={cat.label}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* CIDADE */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  Cidade
                </label>
                <select
                  className="
                    w-full rounded-full border border-slate-600/80 px-3 py-2
                    bg-slate-900/80 text-slate-50
                    focus:outline-none focus:ring-2 focus:ring-emerald-400/80 focus:border-emerald-400
                    transition
                  "
                >
                  {cidades.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* BOTÃO */}
              <button
                className="
                  rounded-full
                  bg-gradient-to-r from-pink-500 via-orange-400 to-cyan-400
                  text-white px-6 py-2 font-semibold
                  shadow-[0_0_20px_rgba(255,120,220,0.8)]
                  hover:shadow-[0_0_26px_rgba(255,160,240,1)]
                  hover:scale-[1.02]
                  active:scale-[0.99]
                  transition
                  whitespace-nowrap
                "
              >
                Buscar
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-slate-400">
            Em breve, essa busca estará totalmente integrada aos anúncios reais.
          </p>
        </div>
      </section>

      {/* ESPECIAL DE NATAL – FAIXA ENTRE BUSCA E PILARES */}
      <section className="bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <div
            className="
              w-full rounded-3xl
              bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950
              border border-emerald-400/60
              shadow-[0_0_30px_rgba(0,255,170,0.45)]
              flex items-center gap-4 px-4 py-3
            "
          >
            <div className="relative w-[72px] h-[72px] shrink-0">
              <Image
                src="/icons/especial-natal.jpg"
                alt="Especial de Natal"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-base font-semibold text-emerald-200">
                Especial de Natal Classilagos
              </h2>
              <p className="text-[11px] md:text-xs text-slate-200/90">
                Descubra ofertas, ceias, passeios, presentes e serviços para o
                fim de ano em toda a Região dos Lagos.
              </p>
            </div>
            <Link
              href="/lagolistas"
              className="
                text-[11px] md:text-xs font-semibold
                rounded-full border border-emerald-300/70
                px-3 py-1.5
                text-emerald-100
                hover:bg-emerald-400/15
                hover:shadow-[0_0_18px_rgba(16,185,129,0.7)]
                transition
                whitespace-nowrap
              "
            >
              Ver opções
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS – FUNDO PRAIA + CARDS NEON */}
      <section
        className="
          py-12
          bg-[url('/fundobotoes.jpg')]
          bg-cover bg-center bg-no-repeat
        "
      >
        <div className="max-w-7xl mx-auto px-4 -mt-4">
          <div className="flex items-center justify-center gap-3 overflow-x-auto scrollbar-none pb-2">
            {categorias.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="
                  w-[115px] h-[145px]
                  rounded-xl
                  flex flex-col items-center
                  bg-black/85
                  border border-white/10
                  shadow-[0_0_22px_rgba(0,0,0,0.85)]
                  hover:shadow-[0_0_26px_rgba(255,80,200,0.55)]
                  hover:border-pink-400/70
                  transition-all duration-200
                  shrink-0
                  pt-2 pb-2 px-2
                  backdrop-blur-sm
                "
              >
                <div className="relative w-full h-[68%] flex items-center justify-center">
                  {cat.icon && (
                    <Image
                      src={cat.icon}
                      alt={cat.label}
                      fill
                      className="object-contain pointer-events-none"
                    />
                  )}
                </div>

                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-white text-center uppercase tracking-[0.15em]">
                    {cat.label}
                  </span>
                  <span className="text-[9px] text-pink-200/80 leading-none">
                    Abrir
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ANÚNCIOS EM DESTAQUE */}
      <section className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Anúncios em destaque
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Alguns dos anúncios que estão chamando atenção no Classilagos.
              </p>
            </div>
            <Link
              href="/anunciar"
              className="hidden sm:inline-block text-xs md:text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              Anuncie em destaque →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destaques.map((item) => (
              <div
                key={item.id}
                className="
                  rounded-2xl border border-slate-200 bg-slate-50
                  shadow-sm hover:shadow-md hover:-translate-y-[2px]
                  transition cursor-pointer overflow-hidden
                "
              >
                {/* IMAGEM / PLACEHOLDER */}
                <div className="relative w-full h-28 bg-slate-900/85 flex items-center justify-center">
                  {item.imagem ? (
                    <Image
                      src={item.imagem}
                      alt={item.titulo}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-200">
                      Imagem do anúncio
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    • Destaque
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    {item.categoria} • {item.cidade}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center sm:hidden">
            <Link
              href="/anunciar"
              className="text-xs font-semibold text-pink-600 hover:text-pink-700"
            >
              Quero anunciar em destaque →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

