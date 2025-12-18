"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./components/HeroCarousel";
import BannerRotator from "./components/BannerRotator";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";

export default function Home() {
  const router = useRouter();

  // HERO (WEBP em /public/hero) ✅ agora com 4
  const heroImages = [
    "/hero/home-01.webp",
    "/hero/home-02.webp",
    "/hero/home-03.webp",
    "/hero/home-04.webp",
  ];

  // BANNERS (padrão fixo: você só troca as imagens no GitHub e pronto)
  const bannersTopo = [
    "/banners/topo/banner-topo-01.webp",
    "/banners/topo/banner-topo-02.webp",
    "/banners/topo/banner-topo-03.webp",
    "/banners/topo/banner-topo-04.webp",
    "/banners/topo/banner-topo-05.webp",
  ];

  const bannersRodape = [
    "/banners/rodape/banner-rodape-01.webp",
    "/banners/rodape/banner-rodape-02.webp",
    "/banners/rodape/banner-rodape-03.webp",
    "/banners/rodape/banner-rodape-04.webp",
    "/banners/rodape/banner-rodape-05.webp",
  ];

  // ORDEM DOS ÍCONES
  const categorias = [
    { label: "Turismo", value: "turismo", href: "/turismo", icon: "/icons/turismo.png" },
    { label: "Imóveis", value: "imoveis", href: "/imoveis", icon: "/icons/imoveis.png" },
    { label: "Serviços", value: "servico", href: "/servicos", icon: "/icons/servicos.png" },
    { label: "LagoListas", value: "lagolistas", href: "/lagolistas", icon: "/icons/lagolistas.png" },
    { label: "Empregos", value: "emprego", href: "/empregos", icon: "/icons/empregos.png" },
    { label: "Veículos", value: "veiculos", href: "/veiculos", icon: "/icons/veiculos.png" },
    { label: "Náutica", value: "nautica", href: "/nautica", icon: "/icons/nautica.png" },
    { label: "Pets", value: "pets", href: "/pets", icon: "/icons/pets.png" },
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
      case "imoveis": return "Imóveis";
      case "veiculos": return "Veículos";
      case "nautica": return "Náutica";
      case "pets": return "Pets";
      case "emprego": return "Empregos";
      case "curriculo": return "Currículos";
      case "servico": return "Serviços";
      case "turismo": return "Turismo";
      case "lagolistas": return "LagoListas";
      default: return "Classificados";
    }
  };

  const formatarDataBR = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("pt-BR");
    } catch {
      return "";
    }
  };

  // TV
  const tvEmbedUrl = "https://www.youtube.com/embed/Q1z3SdRcYxs";
  const tvChannelUrl = "https://www.youtube.com/@classilagostv1370";

  // BUSCA
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (q?.trim()) params.set("q", q.trim());
    if (categoria) params.set("categoria", categoria);
    if (cidade) params.set("cidade", cidade);
    router.push(`/busca?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuscar();
    }
  };

  // ANÚNCIOS EM DESTAQUE (LANÇAMENTO) — sempre os mais recentes
  const [destaques, setDestaques] = useState([]);
  const [loadingDestaques, setLoadingDestaques] = useState(true);

  useEffect(() => {
    async function carregarDestaquesLancamento() {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error) setDestaques(data || []);
      setLoadingDestaques(false);
    }
    carregarDestaquesLancamento();
  }, []);

  // ✅ NOTÍCIAS (para os blocos ao lado da TV)
  const [ultimasNoticias, setUltimasNoticias] = useState([]);
  const [noticiasCards, setNoticiasCards] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarNoticias() {
      setLoadingNoticias(true);

      // Esquerda: Últimas notícias (lista)
      const { data: lista, error: errLista } = await supabase
        .from("anuncios")
        .select("id, created_at, titulo, cidade, categoria")
        .eq("categoria", "noticias")
        .order("created_at", { ascending: false })
        .limit(6);

      // Direita: Notícias (cards)
      const { data: cards, error: errCards } = await supabase
        .from("anuncios")
        .select("id, created_at, titulo, descricao, cidade, imagens, categoria")
        .eq("categoria", "noticias")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!ativo) return;

      if (errLista) console.error("Erro últimas notícias:", errLista);
      if (errCards) console.error("Erro cards notícias:", errCards);

      setUltimasNoticias(lista || []);
      setNoticiasCards(cards || []);
      setLoadingNoticias(false);
    }

    carregarNoticias();
    return () => { ativo = false; };
  }, []);

  // VITRINE PREMIUM (fixa por enquanto)
  const vitrine = [
    {
      titulo: "Passeio Turístico",
      subtitulo: "Escunas • City tour • Trilhas",
      tag: "Turismo",
      href: "/turismo",
      emoji: "🏖️",
      img: "/banners/anuncio-03.png",
    },
    {
      titulo: "Aluguel por Temporada",
      subtitulo: "Casas • Apto • Semana/feriado",
      tag: "Imóveis",
      href: "/imoveis",
      emoji: "🏠",
      img: "/banners/anuncio-01.png",
    },
    {
      titulo: "Pousadas & Hotéis",
      subtitulo: "Hospedagem com charme",
      tag: "Turismo",
      href: "/turismo",
      emoji: "🏨",
      img: "/banners/anuncio-05.png",
    },
    {
      titulo: "Locadora de Veículos",
      subtitulo: "Carro para viagem e praia",
      tag: "Veículos",
      href: "/veiculos",
      emoji: "🚗",
      img: "/banners/anuncio-02.png",
    },
  ];

  return (
    <main className="bg-white">
      {/* BANNER TOPO (rotator) — padrão 900x120, sem ficar gigante */}
      <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={900} contain />

      {/* HERO */}
      <section className="relative w-full">
        <HeroCarousel images={heroImages} interval={6000}>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/10 to-slate-950/45" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10">
            <div className="text-center drop-shadow max-w-3xl">
              <p
                className="
                  text-xs sm:text-sm md:text-base mb-3
                  text-white/95
                  [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]
                "
              >
                O seu guia de compras, serviços, turismo e oportunidades em toda a Região dos Lagos.
              </p>

              <h1
                className="
                  text-2xl sm:text-3xl md:text-4xl font-extrabold
                  tracking-[0.10em] uppercase
                  bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500
                  bg-clip-text text-transparent
                  [text-shadow:0_10px_28px_rgba(0,0,0,0.55)]
                "
              >
                Classilagos – Região dos Lagos em um só lugar
              </h1>

              <div className="mt-3 flex justify-center">
                <div className="h-[3px] w-48 rounded-full bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
              </div>
            </div>
          </div>
        </HeroCarousel>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-700">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-5">
          <div className="rounded-3xl bg-slate-950/92 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.65)] px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-white/90 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex.: aluguel temporada, veterinário, eletricista..."
                  className="w-full rounded-full border border-white/15 px-3 py-2 bg-white/5 text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-amber-200/60 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-white/90 mb-1">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-full border border-white/15 px-3 py-2 bg-white/5 text-white"
                >
                  <option value="" className="text-slate-900">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.value} value={c.value} className="text-slate-900">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-white/90 mb-1">
                  Cidade
                </label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full rounded-full border border-white/15 px-3 py-2 bg-white/5 text-white"
                >
                  <option value="" className="text-slate-900">Toda a região</option>
                  {cidades.map((c) => (
                    <option key={c} value={c} className="text-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleBuscar}
                className="rounded-full bg-white text-slate-900 hover:bg-amber-50 px-6 py-2 font-semibold shadow-md hover:scale-105 transition"
              >
                Buscar
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-center text-white/85">
            Agora a busca já direciona para a página de resultados.
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
                  <Image src={cat.icon} alt={cat.label} fill className="object-contain" />
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

      {/* VITRINE PREMIUM — 1 TEXTO SÓ, DISCRETO */}
      <section className="bg-white -mt-2 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Vitrine Premium</h2>
              <p className="text-[11px] text-slate-500">
                Turismo • Temporada • Hospedagem • Mobilidade
              </p>
            </div>

            <Link href="/anunciar" className="hidden sm:inline-block text-[11px] font-semibold text-cyan-700">
              Quero aparecer aqui →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vitrine.map((c) => (
              <Link
                key={c.titulo}
                href={c.href}
                className="group rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:-translate-y-[2px] hover:shadow-md transition"
              >
                <div className="relative h-28 bg-slate-100 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.titulo}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800">
                    <span>{c.emoji}</span>
                    <span>{c.tag}</span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm font-extrabold text-slate-900">{c.titulo}</p>
                  <p className="mt-1 text-[12px] text-slate-600">{c.subtitulo}</p>
                  <span className="mt-3 inline-flex text-[11px] font-semibold text-cyan-700">
                    Abrir agora →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 text-center sm:hidden">
            <Link href="/anunciar" className="text-[11px] font-semibold text-cyan-700">
              Quero aparecer aqui →
            </Link>
          </div>
        </div>
      </section>

      {/* DESTAQUES (LANÇAMENTO) — os mais recentes */}
      <section className="bg-white pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Anúncios em destaque</h2>
              <p className="text-[11px] text-slate-500">
                Lançamento: por um período, todos aparecem aqui e vão renovando automaticamente.
              </p>
            </div>

            <Link href="/anunciar" className="hidden sm:inline-block text-[11px] font-semibold text-cyan-700">
              Anunciar →
            </Link>
          </div>

          {loadingDestaques ? (
            <p className="text-center text-slate-500">Carregando...</p>
          ) : destaques.length === 0 ? (
            <p className="text-center text-slate-500">
              Ainda não há anúncios. Seja o primeiro a anunciar!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {destaques.map((item) => {
                const imagensValidas = Array.isArray(item.imagens) ? item.imagens : [];
                const thumb = imagensValidas.length > 0 ? imagensValidas[0] : "";

                return (
                  <Link
                    key={item.id}
                    href={`/anuncios/${item.id}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 shadow-sm hover:-translate-y-[2px] hover:shadow-md transition overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-28 bg-slate-900/85 flex items-center justify-center">
                      {thumb ? (
                        <img src={thumb} alt={item.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] text-slate-200">Imagem do anúncio</span>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-600">
                        • Destaque
                      </span>
                      <h3 className="text-sm font-semibold line-clamp-2">{item.titulo}</h3>
                      <p className="text-[11px] text-slate-600">
                        {formatCategoria(item.categoria)} • {item.cidade}
                      </p>
                      {item.preco && (
                        <p className="text-[11px] font-semibold text-slate-900">R$ {item.preco}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ✅ BLOCO PREMIUM 3 COLUNAS (CORRIGIDO: esquerda últimas notícias / direita notícias) */}
      <section className="bg-white pb-10 -mt-4">
        <div className="max-w-7xl mx-auto px-4 grid gap-4 md:grid-cols-3 items-stretch">
          {/* ESQUERDA — ÚLTIMAS NOTÍCIAS */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900">Últimas notícias</h3>
              <Link href="/noticias" className="text-[11px] font-semibold text-cyan-700">
                Ver tudo →
              </Link>
            </div>

            <p className="text-[11px] text-slate-600 mb-4">
              O que saiu agora na Região dos Lagos (últimas publicações).
            </p>

            <div className="space-y-3">
              {loadingNoticias ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-[12px] text-slate-600">Carregando...</p>
                </div>
              ) : ultimasNoticias.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-[12px] text-slate-600">Ainda não há notícias.</p>
                </div>
              ) : (
                ultimasNoticias.map((n) => (
                  <Link
                    key={n.id}
                    href={`/anuncios/${n.id}`}
                    className="block rounded-2xl bg-white border border-slate-200 p-3 hover:bg-slate-50 transition"
                  >
                    <p className="text-[10px] text-slate-500">
                      {formatarDataBR(n.created_at)} • <span className="font-semibold text-slate-700">{n.cidade}</span>
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-900 line-clamp-2">
                      {n.titulo}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-4">
              <Link href="/noticias" className="text-[11px] font-semibold text-cyan-700">
                Abrir portal de notícias →
              </Link>
            </div>
          </div>

          {/* MEIO — TV (IGUAL, NÃO MEXI) */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900">TV Classilagos</h3>
              <a
                href={tvChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-red-600 hover:text-red-700"
              >
                YouTube →
              </a>
            </div>

            <p className="text-[11px] text-slate-600 mb-3">
              Reportagens, cultura, turismo e acontecimentos da Região.
            </p>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900/80">
              <iframe
                src={tvEmbedUrl}
                title="Classilagos TV"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <a
              href={tvChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center text-[11px] font-semibold text-cyan-700 hover:text-cyan-900"
            >
              Ver mais vídeos →
            </a>
          </div>

          {/* DIREITA — NOTÍCIAS (CARDS) */}
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900">Notícias</h3>
              <Link href="/noticias" className="text-[11px] font-semibold text-cyan-700">
                Ver tudo →
              </Link>
            </div>

            <p className="text-[11px] text-slate-600 mb-4">
              Destaques recentes com imagem (layout leve, sem estourar altura).
            </p>

            <div className="space-y-3">
              {loadingNoticias ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-[12px] text-slate-600">Carregando...</p>
                </div>
              ) : noticiasCards.length === 0 ? (
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-[12px] text-slate-600">Ainda não há notícias.</p>
                </div>
              ) : (
                noticiasCards.map((item) => {
                  const imgs = Array.isArray(item.imagens) ? item.imagens : [];
                  const thumb = imgs?.[0] || "";
                  return (
                    <Link
                      key={item.id}
                      href={`/anuncios/${item.id}`}
                      className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden hover:bg-slate-50 transition"
                    >
                      <div className="relative w-full h-24 bg-slate-200">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={item.titulo}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                            Sem imagem
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <p className="text-[10px] text-slate-500">
                          {formatarDataBR(item.created_at)} • <span className="font-semibold text-slate-700">{item.cidade}</span>
                        </p>
                        <p className="mt-1 text-[12px] font-extrabold text-slate-900 line-clamp-2">
                          {item.titulo}
                        </p>
                        {item.descricao && (
                          <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                            {item.descricao}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <div className="mt-4">
              <Link href="/noticias" className="text-[11px] font-semibold text-cyan-700">
                Abrir Notícias →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER RODAPÉ (rotativo) — padrão 1200x300 */}
      <BannerRotator images={bannersRodape} interval={6500} height={300} maxWidth={1200} contain />

      {/* TARJA PREMIUM – Empregos e Currículos */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">Empregos – Vagas e Currículos</h2>
              <p className="text-[12px] text-white/70">
                O banco de oportunidades da Região dos Lagos, com padrão premium.
              </p>
            </div>

            <Link
              href="/empregos"
              className="hidden sm:inline-flex rounded-full bg-white/10 border border-white/15 px-4 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition"
            >
              Abrir Empregos →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/empregos"
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-md hover:-translate-y-1 hover:bg-white/7 transition"
            >
              <p className="text-sm font-extrabold text-white">🔎 Ver vagas</p>
              <p className="mt-1 text-[12px] text-white/70">
                Oportunidades em Maricá, Saquarema, Araruama e toda a região.
              </p>
              <span className="mt-4 inline-flex text-[12px] font-semibold text-cyan-300">
                Acessar vagas →
              </span>
            </Link>

            <Link
              href="/empregos"
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-md hover:-translate-y-1 hover:bg-white/7 transition"
            >
              <p className="text-sm font-extrabold text-white">📝 Cadastrar currículo</p>
              <p className="mt-1 text-[12px] text-white/70">
                Deixe seu perfil pronto e seja encontrado pelas empresas.
              </p>
              <span className="mt-4 inline-flex text-[12px] font-semibold text-cyan-300">
                Enviar currículo →
              </span>
            </Link>

            <Link
              href="/empregos"
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-md hover:-translate-y-1 hover:bg-white/7 transition"
            >
              <p className="text-sm font-extrabold text-white">🏢 Empresas</p>
              <p className="mt-1 text-[12px] text-white/70">
                Publique vagas e encontre profissionais com agilidade.
              </p>
              <span className="mt-4 inline-flex text-[12px] font-semibold text-cyan-300">
                Anunciar vaga →
              </span>
            </Link>
          </div>

          <div className="mt-5 sm:hidden text-center">
            <Link href="/empregos" className="text-[12px] font-semibold text-cyan-300">
              Abrir Empregos →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
