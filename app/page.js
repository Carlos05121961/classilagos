import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";
import BannerRotator from "./components/BannerRotator";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Home() {
  const heroImages = [
    "/banners/pontanegra.png",
    "/banners/itaipuacu.png",
    "/banners/barra.png",
  ];

  const categorias = [
    { label: "Imóveis", href: "/imoveis", icon: "/icons/imoveis-neon.jpg" },
    { label: "Veículos", href: "/veiculos", icon: "/icons/veiculos-neon.jpg" },
    { label: "Náutica", href: "/nautica", icon: "/icons/nautica-neon.jpg" },
    { label: "Pets", href: "/pets", icon: "/icons/pets-neon.jpg" },
    { label: "Empregos", href: "/empregos", icon: "/icons/empregos-neon.jpg" },
    { label: "Serviços", href: "/servicos", icon: "/icons/servicos-neon.jpg" },
    { label: "Turismo", href: "/turismo", icon: "/icons/turismo-neon.jpg" },
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

  const formatCategoria = (cat) => {
    switch (cat) {
      case "imoveis":
        return "Imóveis";
      case "veiculos":
        return "Veículos";
      case "nautica":
        return "Náutica";
      case "pets":
        return "Pets";
      case "emprego":
        return "Empregos";
      case "curriculo":
        return "Currículos";
      case "servico":
        return "Serviços";
      case "turismo":
        return "Turismo";
      case "lagolistas":
        return "LagoListas";
      default:
        return "Classificados";
    }
  };

  // 🔥 DESTAQUES AUTOMÁTICOS DO SUPABASE
  const [destaques, setDestaques] = useState([]);
  const [loadingDestaques, setLoadingDestaques] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("destaque", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error) setDestaques(data || []);
      setLoadingDestaques(false);
    }
    carregarDestaques();
  }, []);

  return (
    <main className="bg-white">
      {/* BANNER COMERCIAL TOPO */}
      <BannerRotator />

      {/* HERO PRINCIPAL */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/10 to-slate-950/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10">
            {/* TEXTO HERO */}
            <div className="text-center text-white drop-shadow max-w-2xl">
              <p className="text-xs sm:text-sm md:text-base mb-3 text-slate-100/90">
                O seu guia de compras, serviços, turismo e oportunidades em toda
                a Região dos Lagos.
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200 bg-clip-text text-transparent tracking-[0.08em] uppercase">
                Classilagos – Região dos Lagos em um só lugar
              </h1>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-4">
          <div className="rounded-3xl bg-slate-950/95 border border-slate-700/70 shadow-[0_0_30px_rgba(0,0,0,0.8)] px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
              {/* BUSCA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: eletricista, pousada, casa em Cabo Frio..."
                  className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 transition"
                />
              </div>

              {/* SELECT CATEGORIA */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50">
                  {categorias.map((c) => (
                    <option key={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* SELECT CIDADE */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-200 mb-1">
                  Cidade
                </label>
                <select className="w-full rounded-full border border-slate-600/80 px-3 py-2 bg-slate-900/80 text-slate-50">
                  {cidades.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* BOTÃO BUSCAR (ainda ilustrativo) */}
              <button className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2 font-semibold shadow-md hover:scale-105 transition">
                Buscar
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-slate-400">
            Em breve, essa busca estará totalmente integrada aos anúncios reais.
          </p>
        </div>
      </section>

          {/* PILARES – FUNDO PRAIA + CARDS MAIS ENXUTOS */}
      <section className="py-12 bg-[url('/fundobotoes.jpg')] bg-cover bg-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                  className="max-w-[150px] w-full mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-md hover:shadow-lg hover:-translate-y-1 transition flex flex-col items-center justify-between py-3 px-2"

              >
                <div className="relative w-12 h-12 mb-2">
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 uppercase tracking-[0.12em] text-center">
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-500">Abrir</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ANÚNCIOS EM DESTAQUE (DINÂMICOS) */}
      <section className="bg-white pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Anúncios em destaque
              </h2>
              <p className="text-xs text-slate-500">
                Os anúncios mais vistos e marcados como destaque.
              </p>
            </div>

            <Link
              href="/anunciar"
              className="hidden sm:inline-block text-xs font-semibold text-cyan-700"
            >
              Anuncie em destaque →
            </Link>
          </div>

          {loadingDestaques ? (
            <p className="text-center text-slate-500">Carregando...</p>
          ) : destaques.length === 0 ? (
            <p className="text-center text-slate-500">
              Nenhum destaque ainda. Seja o primeiro a anunciar!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {destaques.map((item) => {
                const imagensValidas = Array.isArray(item.imagens)
                  ? item.imagens
                  : [];
                const thumb =
                  imagensValidas.length > 0 ? imagensValidas[0] : "";

                return (
                  <Link
                    key={item.id}
                    href={/anuncios/${item.id}}
                    className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm hover:-translate-y-[2px] hover:shadow-md transition overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-28 bg-slate-900/85 flex items-center justify-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={item.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] text-slate-200">
                          Imagem do anúncio
                        </span>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-600">
                        • Destaque
                      </span>
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {item.titulo}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {formatCategoria(item.categoria)} • {item.cidade}
                      </p>
                      {item.preco && (
                        <p className="text-[11px] font-semibold text-slate-900">
                          R$ {item.preco}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-4 text-center sm:hidden">
            <Link
              href="/anunciar"
              className="text-xs font-semibold text-cyan-700"
            >
              Quero anunciar em destaque →
            </Link>
          </div>
        </div>
      </section>

      {/* CHAMADAS INSTITUCIONAIS – TV / NOTÍCIAS / TURISMO */}
      <section className="bg-white pb-10 -mt-4">
        <div className="max-w-7xl mx-auto px-4 grid gap-4 md:grid-cols-3">
          <Link
            href="/tv"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 mb-1">
              Classilagos TV
            </h3>
            <p className="text-sm text-slate-600">
              Reportagens, vídeos locais e transmissões especiais.
            </p>
          </Link>

          <Link
            href="/noticias"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Notícias</h3>
            <p className="text-sm text-slate-600">
              Últimas notícias da Região dos Lagos e do Brasil.
            </p>
          </Link>

          <Link
            href="/turismo"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Turismo</h3>
            <p className="text-sm text-slate-600">
              Pousadas, restaurantes, passeios e pontos turísticos.
            </p>
          </Link>
        </div>
      </section>

      {/* PAINEL RÁPIDO – REGIÃO DOS LAGOS */}
      <section className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-bold text-white mb-4">
            Painel Rápido – Região dos Lagos
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md">
              <p className="text-sm text-slate-300">Clima agora</p>
              <p className="text-2xl font-bold text-white">27°C</p>
              <p className="text-[12px] text-slate-400">
                Parcialmente nublado
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md">
              <p className="text-sm text-slate-300">Altura das ondas</p>
              <p className="text-2xl font-bold text-white">1.2 m</p>
              <p className="text-[12px] text-slate-400">Mar moderado</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md">
              <p className="text-sm text-slate-300">Trânsito</p>
              <p className="text-xl font-bold text-white">Normal</p>
              <p className="text-[12px] text-slate-400">RJ-106 fluindo bem</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md">
              <p className="text-sm text-slate-300">Índice UV</p>
              <p className="text-xl font-bold text-white">8</p>
              <p className="text-[12px] text-slate-400">
                Muito alto – Protetor 50+
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
