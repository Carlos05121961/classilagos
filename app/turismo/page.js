"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";

/* ✅ BANNERS AFILIADOS (TOPO) */
const bannersTopo = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

/* ✅ BANNERS AFILIADOS (RODAPÉ) — PRINCIPAL */
const bannersRodape = [
  {
    src: "/banners/rodape/banner-rodape-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

// COMPONENTE PRINCIPAL (usa useSearchParams, faz o fetch, renderiza tudo)
function TurismoPageContent() {
  // Imagens do hero de Turismo
  const heroImages = [
    "/turismo/hero-turismo01.jpg",
    "/turismo/hero-turismo02.jpg",
    "/turismo/hero-turismo03.jpg",
    "/turismo/hero-turismo04.jpg",
    "/turismo/hero-turismo05.jpg",
    "/turismo/hero-turismo06.jpg",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  // Anúncios de turismo
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Lê a seção da URL: ?secao=onde_ficar
  const searchParams = useSearchParams();
  const secao = searchParams.get("secao");

  // ROTATIVO DO HERO
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Carrega anúncios de turismo
  useEffect(() => {
    const fetchTurismo = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, pilar_turismo, subcategoria_turismo, preco, faixa_preco, imagens, destaque, created_at"
        )
        .eq("categoria", "turismo")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Erro ao carregar anúncios de turismo:", error);
        setErro("Não foi possível carregar os anúncios de turismo no momento.");
        setLoading(false);
        return;
      }

      setAnuncios(data || []);
      setLoading(false);
    };

    fetchTurismo();
  }, []);

  const labelPilar = {
    onde_ficar: "Onde ficar",
    onde_comer: "Onde comer",
    onde_se_divertir: "Onde se divertir",
    onde_passear: "Onde passear",
    servicos_turismo: "Serviços de turismo",
    produtos_turisticos: "Produtos turísticos",
    outros: "Turismo / serviços",
  };

  const labelSubcategoria = (sub) => {
    if (!sub) return "";
    return sub
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  // Cards do GUIA ONDE
  const guiaOndeCards = [
    {
      key: "onde_ficar",
      title: "Onde ficar",
      icon: "/turismo/onde-ficar.png",
      desc: "Pousadas, hotéis, hostels, casas de temporada e camping.",
      href: "/turismo?secao=onde_ficar",
    },
    {
      key: "onde_comer",
      title: "Onde comer",
      icon: "/turismo/onde-comer.png",
      desc: "Bares, restaurantes, quiosques, pizzarias, hamburguerias.",
      href: "/turismo?secao=onde_comer",
    },
    {
      key: "onde_se_divertir",
      title: "Onde se divertir",
      icon: "/turismo/onde-se-divertir.png",
      desc: "Casas de show, música ao vivo, baladas, pubs, eventos.",
      href: "/turismo?secao=onde_se_divertir",
    },
    {
      key: "onde_passear",
      title: "Onde passear",
      icon: "/turismo/onde-passear.png",
      desc: "Passeios de barco, buggy, trilhas, city tour, mergulho.",
      href: "/turismo?secao=onde_passear",
    },
    {
      key: "cartoes_postais",
      title: "Cartões postais",
      icon: "/turismo/cartoes-postais.png",
      desc: "Envie cartões postais digitais da Região dos Lagos para quem você ama.",
      href: "/turismo/cartoes-postais",
    },
  ];

  // Quais valores de pilar são válidos (para filtro)
  const pilaresValidos = [
    "onde_ficar",
    "onde_comer",
    "onde_se_divertir",
    "onde_passear",
    "servicos_turismo",
    "produtos_turisticos",
    "outros",
    "cartoes_postais",
  ];

  const pilarFiltro = pilaresValidos.includes(secao || "") ? secao : null;

  // Se houver filtro de pilar, aplica nos anúncios
  const anunciosFiltrados = pilarFiltro
    ? anuncios.filter((a) => a.pilar_turismo === pilarFiltro)
    : anuncios;

  const destaques = anunciosFiltrados.filter((a) => a.destaque);
  const recentes = anunciosFiltrados.filter((a) => !a.destaque);

  const textoFiltro =
    pilarFiltro && labelPilar[pilarFiltro]
      ? ` – ${labelPilar[pilarFiltro]}`
      : "";

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (Premium, rotativo, clicável) */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* HERO TURISMO – CARROSSEL DE IMAGENS (texto mais forte + sombra boa) */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Turismo"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          {/* overlay premium */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/55" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
              Classilagos – Turismo
            </h1>
            <p className="mt-3 text-sm md:text-base max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Descubra o melhor da Região dos Lagos em um só lugar.
            </p>
          </div>
        </div>
      </section>

      {/* GUIA ONDE – PILARES DO TURISMO */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/turismo/guia-onde.png"
                alt="Guia ONDE – Turismo Classilagos"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16 rounded-2xl drop-shadow"
              />
            </div>
            <h2 className="text-sm md:text-base font-bold text-sky-700 mb-1">
              GUIA ONDE – Turismo Classilagos
            </h2>
            <p className="text-[11px] md:text-xs text-slate-600 max-w-2xl">
              Escolha por tipo de experiência e encontre lugares para se hospedar, comer, passear e se divertir em toda a Região dos Lagos.
            </p>
          </div>

          {/* (ilustrativo por enquanto) */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-600">Cidade</label>
            <select className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-800">
              <option>Toda a região</option>
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

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {guiaOndeCards.map((card) => {
            const isActive = secao === card.key;

            return (
              <Link
                key={card.key}
                href={card.href}
                className={
                  "rounded-3xl border bg-gradient-to-br from-sky-50 via-white to-slate-50 p-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition " +
                  (isActive ? "border-sky-500 ring-1 ring-sky-200" : "border-slate-300")
                }
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-sky-700 text-center mb-1">
                  {card.title}
                </h3>

                <p className="text-[11px] text-slate-600 flex-1 mb-3 text-center">
                  {card.desc}
                </p>

                <button
                  type="button"
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700"
                >
                  Ver opções
                </button>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* DESTAQUES DE TURISMO */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Destaques de turismo{textoFiltro}
          </h2>
          <span className="text-[11px] text-slate-500">
            Anúncios com mais destaque aparecem primeiro.
          </span>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3 mb-3">
            {erro}
          </div>
        )}

        {loading ? (
          <p className="text-[11px] text-slate-500">Carregando anúncios de turismo…</p>
        ) : anunciosFiltrados.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            Ainda não há anúncios de turismo publicados
            {pilarFiltro && labelPilar[pilarFiltro] ? ` em "${labelPilar[pilarFiltro]}".` : "."}{" "}
            Aproveite a fase de lançamento para ser um dos primeiros a aparecer aqui!
          </p>
        ) : destaques.length === 0 ? (
          <p className="text-[11px] text-slate-500 mb-2">
            Quando houver anúncios em destaque
            {pilarFiltro && labelPilar[pilarFiltro] ? ` em "${labelPilar[pilarFiltro]}",` : ","}{" "}
            eles aparecerão aqui no topo.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {destaques.map((anuncio) => {
              const imagemCapa =
                anuncio.imagens && anuncio.imagens.length > 0 ? anuncio.imagens[0] : null;

              const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

              return (
                <Link
                  key={anuncio.id}
                  href={`/turismo/anuncio/${anuncio.id}`}
                  className="group rounded-3xl border border-amber-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="h-36 bg-slate-100 overflow-hidden relative">
                    {imagemCapa && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagemCapa}
                        alt={anuncio.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                      />
                    )}
                    <span className="absolute top-2 left-2 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold text-white shadow">
                      Destaque
                    </span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {labelPilar[anuncio.pilar_turismo] || "Turismo"} •{" "}
                        {labelSubcategoria(anuncio.subcategoria_turismo)}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>
                      {precoExibicao && (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          {precoExibicao}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                      Publicado em{" "}
                      {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ÚLTIMOS ANÚNCIOS DE TURISMO */}
      {!loading && anunciosFiltrados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-900">
              Últimos anúncios de turismo{textoFiltro}
            </h2>
            <span className="text-[11px] text-slate-500">
              Em breve: filtros por cidade e por tipo de experiência.
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(recentes.length > 0 ? recentes : anunciosFiltrados).map((anuncio) => {
              const imagemCapa =
                anuncio.imagens && anuncio.imagens.length > 0 ? anuncio.imagens[0] : null;

              const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

              return (
                <Link
                  key={anuncio.id}
                  href={`/turismo/anuncio/${anuncio.id}`}
                  className="group rounded-3xl border border-slate-200 bg-white hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="h-28 bg-slate-100 overflow-hidden">
                    {imagemCapa && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagemCapa}
                        alt={anuncio.titulo}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition"
                      />
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {labelPilar[anuncio.pilar_turismo] || "Turismo"}
                      </p>
                      <h3 className="text-xs font-semibold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>
                      {precoExibicao && (
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          {precoExibicao}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) */}
      <section className="bg-white py-10 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

{/* TARJA PREMIUM — TURISMO (Aeroportos / Transfers / Segurança) */}
<section className="bg-slate-950 text-slate-50">
  <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
    <div>
      <h2 className="text-sm font-semibold">Informações úteis para o turista</h2>
      <p className="mt-1 text-[11px] text-slate-300 max-w-2xl">
        Acessos, transfers e contatos de apoio — útil para quem chega na Região dos Lagos.
      </p>
    </div>

    {/* Abas */}
    <TurismoTabs />

    {/* Painel */}
    <TurismoPainel />

    <p className="text-[11px] text-slate-400">
      Dica: depois a gente liga isso ao LagoListas (transfer local por cidade, guias, suporte ao turista e serviços).
    </p>
  </div>
</section>

{/* ======= COMPONENTES LOCAIS (coloque abaixo dentro do mesmo page.js) ======= */}
function TurismoTabs() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") || "aeroportos").toLowerCase();

  const tabs = [
    { key: "aeroportos", label: "Aeroportos", sub: "EN: Airports • ES: Aeropuertos" },
    { key: "transfers", label: "Transfers", sub: "EN: Transfers • ES: Traslados" },
    { key: "seguranca", label: "Segurança", sub: "EN: Safety • ES: Seguridad" },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/turismo?tab=${t.key}`}
              className={[
                "btn-lente rounded-2xl px-4 py-3 text-center text-xs font-semibold border transition",
                active
                  ? "bg-white text-slate-900 border-white"
                  : "bg-slate-900/60 text-slate-100 border-slate-800 hover:bg-slate-900",
              ].join(" ")}
            >
              {t.label}
              <div className="mt-1 text-[10px] font-normal opacity-80">{t.sub}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TurismoPainel() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") || "aeroportos").toLowerCase();

  if (tab === "transfers") {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
        <h3 className="text-sm font-semibold mb-3">Transfers e conexões</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="https://transferrgturismo.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lente rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm block transition hover:bg-slate-900"
          >
            <p className="text-sm font-semibold text-white mb-1">Transfer Rio ⇄ Região</p>
            <p className="text-[11px] text-slate-300">Opções de transfer e turismo (site).</p>
          </a>

          <a
            href="https://ads.brazilconnection.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lente rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm block transition hover:bg-slate-900"
          >
            <p className="text-sm font-semibold text-white mb-1">Transfers & conexões</p>
            <p className="text-[11px] text-slate-300">Alternativas de transporte e atendimento (site).</p>
          </a>
        </div>

        <p className="mt-4 text-[11px] text-slate-400">
          Em breve: “Transfers por cidade” via LagoListas (Cabo Frio, Búzios, Arraial, Maricá etc.).
        </p>
      </div>
    );
  }

  if (tab === "seguranca") {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Segurança e defesa do consumidor</h3>
          <p className="text-[11px] text-slate-300">
            Contatos úteis para turista e atendimento ao consumidor.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-white mb-1">Apoio ao turista (DEAT / RJ)</p>
          <p className="text-[11px] text-slate-300">
            Tel:{" "}
            <a className="underline hover:text-white" href="tel:+552123322924">(21) 2332-2924</a>{" "}
            •{" "}
            <a className="underline hover:text-white" href="tel:+552123322429">2332-2429</a>{" "}
            •{" "}
            <a className="underline hover:text-white" href="tel:+552123322885">2332-2885</a>
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            (Útil em situações de turista no RJ / Região.)
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm font-semibold text-white mb-1">Procon — Cabo Frio</p>
            <p className="text-[11px] text-slate-300">
              WhatsApp:{" "}
              <a
                className="underline hover:text-white"
                href="https://wa.me/5522999072821"
                target="_blank"
                rel="noopener noreferrer"
              >
                (22) 99907-2821
              </a>
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              Rua Nicola Aslan (Braga) ou Shopping UnaPark (Tamoios).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm font-semibold text-white mb-1">Procon — Búzios</p>
            <p className="text-[11px] text-slate-300">
              WhatsApp:{" "}
              <a
                className="underline hover:text-white"
                href="https://wa.me/552226230314"
                target="_blank"
                rel="noopener noreferrer"
              >
                (22) 2623-0314
              </a>
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              Travessa dos Pescadores (Centro).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm font-semibold text-white mb-1">Procon — Arraial do Cabo</p>
            <p className="text-[11px] text-slate-300">
              WhatsApp:{" "}
              <a
                className="underline hover:text-white"
                href="https://wa.me/552226221417"
                target="_blank"
                rel="noopener noreferrer"
              >
                (22) 2622-1417
              </a>
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              Rua Ezer Teixeira de Melo (Praia dos Anjos).
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-[11px] text-slate-300">
            Emergência: <strong>190</strong> Polícia • <strong>193</strong> Bombeiros •{" "}
            <strong>199</strong> Defesa Civil
          </p>
        </div>
      </div>
    );
  }

  // AEROPORTOS (default)
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
      <h3 className="text-sm font-semibold mb-3">Aeroportos</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="https://www.galeon.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lente rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm block transition hover:bg-slate-900"
        >
          <p className="text-sm font-semibold text-white mb-1">Galeão (GIG)</p>
          <p className="text-[11px] text-slate-300">Site oficial: voos, acesso e serviços.</p>
        </a>

        <a
          href="https://www.aeroportosantosdumont.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lente rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm block transition hover:bg-slate-900"
        >
          <p className="text-sm font-semibold text-white mb-1">Santos Dumont (SDU)</p>
          <p className="text-[11px] text-slate-300">Informações de embarque, desembarque e acesso.</p>
        </a>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="btn-lente rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <p className="text-sm font-semibold text-white mb-1">Aeroporto de Cabo Frio</p>
          <p className="text-[11px] text-slate-300">
            Tel:{" "}
            <a className="underline hover:text-white" href="tel:+552226479500">
              (22) 2647-9500
            </a>
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            End.: Estrada Velha do Arraial do Cabo, s/n • Praia Sudoeste, Cabo Frio – RJ
          </p>
        </div>

        <div className="btn-lente rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <p className="text-sm font-semibold text-white mb-1">Aeroporto de Búzios (SSBZ)</p>
          <p className="text-[11px] text-slate-300">
            Centro de Operações:
            <br />
            <a className="underline hover:text-white" href="tel:+552226236033">
              +55 (22) 2623-6033
            </a>{" "}
            •{" "}
            <a className="underline hover:text-white" href="tel:+552226236517">
              +55 (22) 2623-6517
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


    </main>
  );
}

// WRAPPER COM SUSPENSE (resolve o erro do useSearchParams no Next)
export default function TurismoPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600">
            Carregando turismo…
          </section>
        </main>
      }
    >
      <TurismoPageContent />
    </Suspense>
  );
}
