"use client";

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
    { label: "Imóveis", href: "/imoveis", icon: "/icons/imoveis.png" },
    { label: "Veículos", href: "/veiculos", icon: "/icons/veiculos.png" },
    { label: "Náutica", href: "/nautica", icon: "/icons/nautica.png" },
    { label: "Pets", href: "/pets", icon: "/icons/pets.png" },
    { label: "Empregos", href: "/empregos", icon: "/icons/empregos.png" },
    { label: "Serviços", href: "/servicos", icon: "/icons/servicos.png" },
    { label: "Turismo", href: "/turismo", icon: "/icons/turismo.png" },
    {
      label: "LagoListas",
      href: "/lagolistas",
      icon: "/icons/lagolistas.png",
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

  // CLASSILAGOS TV
  // Neste momento estamos usando UM VÍDEO específico do canal,
  // porque é 100% garantido no iframe.
  //
  // Se quiser trocar por uma PLAYLIST:
  // 1. Vá no YouTube, abra a playlist.
  // 2. Clique em COMPARTILHAR → INCORPORAR.
  // 3. Copie o valor de src="https://www.youtube.com/embed/...."
  // 4. Cole aqui em tvEmbedUrl.
  const tvEmbedUrl = "https://www.youtube.com/embed/Q1z3SdRcYxs";

  // DESTAQUES
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
      {/* BANNER COMERCIAL */}
      <BannerRotator />

      {/* HERO */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/0 to-slate-950/75" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10">
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
      <section className="bg-gradient-to-b from-cyan-700 via-cyan-600 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-4">
          <div className="rounded-3xl bg-slate-950/95 border border-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)] px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
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

              {/* Categoria */}
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

              {/* Cidade */}
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

              <button className="rounded-full bg-white text-cyan-700 hover:bg-cyan-50 px-6 py-2 font-semibold shadow-md hover:scale-105 transition">
                Buscar
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-cyan-100/90">
            Em breve, essa busca estará totalmente integrada aos anúncios reais.
          </p>
        </div>
      </section>

      {/* PILARES */}
      <section className="py-12 bg-[url('/fundobotoes.jpg')] bg-cover bg-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="max-w-[150px] w-full mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-md hover:shadow-lg hover:-translate-y-1 transition flex flex-col items-center justify-between py-3 px-2"
              >
                <div className="relative w-24 h-24 mb-1">
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-center text-[13px] font-semibold text-slate-700">
                  {cat.label}
                </p>

                <span className="text-[11px] text-cyan-700 font-medium hover:text-cyan-900">
                  Abrir
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
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
              <p className="text-[11px] text-slate-400 mt-1">
                Anúncios marcados como <strong>destaque</strong> aparecem aqui
                na página principal da Classilagos.
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
                    href={`/anuncios/${item.id}`}
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

      {/* TV, NOTÍCIAS, TURISMO */}
      <section className="bg-white pb-10 -mt-4">
        <div className="max-w-7xl mx-auto px-4 grid gap-4 md:grid-cols-3">
          {/* TV */}
          <div className="rounded-2xl border border-slate-200 p-4 sm:p-6 bg-slate-50 shadow-sm flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-2">Classilagos TV</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3">
              Reportagens, vídeos locais, clipes e transmissões especiais da
              Região dos Lagos.
            </p>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900/80">
              <iframe
                src={tvEmbedUrl}
                title="Classilagos TV"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <Link
              href="/tv"
              className="mt-3 inline-flex items-center text-xs sm:text-sm font-semibold text-cyan-700 hover:text-cyan-900"
            >
              Ver mais vídeos →
            </Link>
          </div>

          {/* Notícias */}
          <Link
            href="/noticias"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm flex flex-col"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Notícias</h3>
            <p className="text-sm text-slate-600">
              Últimas notícias da Região dos Lagos e do Brasil.
            </p>
            <span className="mt-3 text-xs font-semibold text-cyan-700">
              Acessar portal de notícias →
            </span>
          </Link>

          {/* Turismo */}
          <Link
            href="/turismo"
            className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:bg-slate-100 transition shadow-sm flex flex-col"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Turismo</h3>
            <p className="text-sm text-slate-600">
              Pousadas, restaurantes, passeios e cartões-postais da Região dos
              Lagos.
            </p>
            <span className="mt-3 text-xs font-semibold text-cyan-700">
              Explorar guia de turismo →
            </span>
          </Link>
        </div>
      </section>

      {/* PAINEL RÁPIDO */}
      <section className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-bold text-white mb-4">
            Painel Rápido – Região dos Lagos
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Empregos */}
            <Link
              href="/empregos"
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  Empregos na Região
                </p>
                <p className="text-[12px] text-slate-300 mt-1">
                  Vagas de trabalho nas 9 cidades.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-cyan-300 font-semibold">
                Ver vagas →
              </span>
            </Link>

            {/* Hotéis */}
            <Link
              href="/turismo"
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  Pousadas & Hotéis
                </p>
                <p className="text-[12px] text-slate-300 mt-1">
                  Hospedagem para todos os estilos.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-cyan-300 font-semibold">
                Ver opções →
              </span>
            </Link>

            {/* LagoListas */}
            <Link
              href="/lagolistas"
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  Guia Comercial – LagoListas
                </p>
                <p className="text-[12px] text-slate-300 mt-1">
                  Comércio, serviços e profissionais.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-cyan-300 font-semibold">
                Buscar empresas →
              </span>
            </Link>

            {/* Anuncie */}
            <Link
              href="/anunciar"
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  Anuncie Grátis
                </p>
                <p className="text-[12px] text-slate-300 mt-1">
                  Divulgue seu serviço ou produto em minutos.
                </p>
              </div>
              <span className="mt-3 text-[11px] text-cyan-300 font-semibold">
                Criar anúncio →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

