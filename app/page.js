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

  // Agora categorias é um array de objetos (mais flexível, já preparado para ícones neon)
  const categorias = [
    {
      label: "Imóveis",
      href: "/imoveis",
      icon: "/icons/pilares/imoveis-neon.png",
    },
    {
      label: "Veículos",
      href: "/veiculos",
      icon: "/icons/pilares/veiculos-neon.png",
    },
    {
      label: "Náutica",
      href: "/nautica",
      icon: "/icons/pilares/nautica-neon.png",
    },
    {
      label: "Pets",
      href: "/pets",
      icon: "/icons/pilares/pets-neon.png",
    },
    {
      label: "Empregos",
      href: "/empregos",
      icon: "/icons/pilares/empregos-neon.png",
    },
    {
      label: "Serviços",
      href: "/servicos",
      icon: "/icons/pilares/servicos-neon.png",
    },
    {
      label: "Turismo",
      href: "/turismo",
      icon: "/icons/pilares/turismo-neon.png",
    },
    {
      label: "LagoListas",
      href: "/lagolistas",
      icon: "/icons/pilares/lagolistas-neon.png",
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

  return (
    <main className="bg-white">
      {/* BANNER COMERCIAL */}
      <BannerRotator />

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
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
                  {categorias.map((cat) => (
                    <option key={cat.label}>{cat.label}</option>
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

              {/* BOTÃO */}
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

      {/* CATEGORIAS – FUNDO PRAIA DIRETO NO SECTION */}
      <section
        className="
          py-12
          bg-[url('/fundobotoes.jpg')]
          bg-cover bg-center bg-no-repeat
        "
      >
        <div className="max-w-7xl mx-auto px-4 -mt-4">
          {/* Linha com os 8 ícones em cards neon reduzidos */}
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
                {/* ÍCONE NEON – parte de cima do card */}
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

                {/* TEXTO DA CATEGORIA */}
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

      {/* CHAMADAS */}
      <section className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-4">
          <Link
            href="#"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100"
          >
            <h3 className="font-semibold text-slate-900 mb-2">
              Classilagos TV
            </h3>
            <p className="text-sm text-slate-600">
              Pautas locais e vídeos da nossa região.
            </p>
          </Link>

          <Link
            href="/turismo"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100"
          >
            <h3 className="font-semibold text-slate-900 mb-2">Turismo</h3>
            <p className="text-sm text-slate-600">
              Pousadas, passeios, bares e restaurantes.
            </p>
          </Link>

          <Link
            href="/noticias"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100"
          >
            <h3 className="font-semibold text-slate-900 mb-2">Notícias</h3>
            <p className="text-sm text-slate-600">
              Acompanhe novidades e oportunidades.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

