"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";
import SmartSelect from "../components/SmartSelect";
import { LINKS_OFICIAIS } from "../../lib/linksOficiais";



// ⬇️ COLE AQUI (Parte 1)
function normCidade(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getLinksCidade(cidade, LINKS_OFICIAIS) {
  if (!cidade) return null;
  if (LINKS_OFICIAIS[cidade]) return LINKS_OFICIAIS[cidade];

  const alvo = normCidade(cidade);
  const chave = Object.keys(LINKS_OFICIAIS).find(
    (k) => normCidade(k) === alvo
  );

  return chave ? LINKS_OFICIAIS[chave] : null;
}
// ⬆️ ATÉ AQUI

const heroImages = [
  "/hero/imoveis-01.webp",
  "/hero/imoveis-02.webp",
  "/hero/imoveis-03.webp",
];

// ✅ BANNERS AFILIADOS (Topo)
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

// ✅ BANNERS AFILIADOS (Rodapé) — PRINCIPAL
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

const tiposImovel = [
  "Casa",
  "Apartamento",
  "Cobertura",
  "Kitnet / Studio",
  "Terreno / Lote",
  "Comercial",
  "Loja / Sala",
  "Galpão",
  "Sítio / Chácara",
  "Outros",
];

function norm(s) {
  return (s || "").toString().trim().toLowerCase();
}

function isFinalidadeTemporada(finalidade) {
  const f = norm(finalidade);
  return (
    f === "temporada" ||
    f === "aluguel temporada" ||
    f === "aluguel por temporada" ||
    f === "aluguelpor temporada" ||
    f === "aluguel_temporada" ||
    f === "aluguel-por-temporada"
  );
}

function isFinalidadeAluguel(finalidade) {
  const f = norm(finalidade);
  return f === "aluguel" || f === "aluguel fixo" || f === "aluguel_fixo";
}

const TIPOS_COMERCIAIS = ["Comercial", "Loja / Sala", "Galpão"];

// Cards na ORDEM NOVA
const cards = [
  { nome: "Aluguel por temporada", slug: "aluguel-temporada" },
  { nome: "Aluguel residencial", slug: "aluguel-residencial" },
  { nome: "Casas à venda", slug: "casas-venda" },
  { nome: "Apartamentos à venda", slug: "apartamentos-venda" },
  { nome: "Aluguel comercial", slug: "aluguel-comercial" },
  { nome: "Imóvel comercial (venda)", slug: "comercial-venda" },
  { nome: "Terrenos & Lotes", slug: "terrenos-lotes" },
  { nome: "Lançamentos", slug: "lancamentos" },
];

function montarUrlDaCategoria(slug) {
  const params = new URLSearchParams();

  switch (slug) {
    case "aluguel-temporada":
      params.set("finalidade", "temporada");
      break;

    case "aluguel-residencial":
      params.set("finalidade", "aluguel");
      params.set("aluguel_tipo", "residencial");
      break;

    case "casas-venda":
      params.set("finalidade", "venda");
      params.set("tipo_imovel", "Casa");
      break;

    case "apartamentos-venda":
      params.set("finalidade", "venda");
      params.set("tipo_imovel", "Apartamento");
      break;

    case "aluguel-comercial":
      params.set("finalidade", "aluguel");
      params.set("aluguel_tipo", "comercial");
      break;

    case "comercial-venda":
      params.set("comercial_venda", "1");
      break;

    case "terrenos-lotes":
      params.set("tipo_imovel", "Terreno / Lote");
      break;

    case "lancamentos":
      params.set("lancamento", "1");
      break;

    default:
      break;
  }

  const qs = params.toString();
  return qs ? `/imoveis/lista?${qs}` : "/imoveis/lista";
}

function pegarCapaDoAnuncio(anuncio) {
  const imgs = Array.isArray(anuncio?.imagens) ? anuncio.imagens : [];
  const capa =
    imgs.find((u) => typeof u === "string" && u.trim() !== "") ||
    "/imoveis/sem-foto.jpg";
  return capa;
}

// ✅ ORDEM PREMIUM (local) — garante padrão mesmo depois de filtros
function sortPremiumLocal(arr) {
  return [...(arr || [])].sort((a, b) => {
    const da = a?.destaque === true ? 1 : 0;
    const db = b?.destaque === true ? 1 : 0;
    if (db !== da) return db - da;

    const pa = Number.isFinite(Number(a?.prioridade)) ? Number(a.prioridade) : 0;
    const pb = Number.isFinite(Number(b?.prioridade)) ? Number(b.prioridade) : 0;
    if (pb !== pa) return pb - pa;

    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return tb - ta;
  });
}

export default function ImoveisPage() {
  const router = useRouter();

  // ✅ HERO premium: preload + fade “nuvem”
  const [heroIndex, setHeroIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState(() => new Set());
  const [fadeIn, setFadeIn] = useState(false);

  const [buscaTexto, setBuscaTexto] = useState("");
  const [buscaTipo, setBuscaTipo] = useState(""); // valor real ("" = todos)
  const [buscaCidade, setBuscaCidade] = useState(""); // valor real ("" = todas)

  const [imoveis, setImoveis] = useState([]);
  const [loadingImoveis, setLoadingImoveis] = useState(true);
  const linksCidade = useMemo(() => {
  const c = (buscaCidade || "").trim();
  if (!c) return null;
  return LINKS_OFICIAIS?.[c] || null;
}, [buscaCidade]);

  useEffect(() => {
    heroImages.forEach((src) => {
      const im = new window.Image();
      im.src = src;
      im.onload = () =>
        setLoadedSet((prev) => {
          const n = new Set(prev);
          n.add(src);
          return n;
        });
    });
  }, []);

  useEffect(() => {
    if (!heroImages.length) return;
    const t = setInterval(() => {
      setFadeIn(false);
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const src = heroImages[heroIndex];
    if (loadedSet.has(src)) {
      const id = setTimeout(() => setFadeIn(true), 30);
      return () => clearTimeout(id);
    }
  }, [heroIndex, loadedSet]);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoadingImoveis(true);

        // ✅ PADRÃO PREMIUM: destaque desc → prioridade desc → created_at desc
        const { data, error } = await supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "imoveis")
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(80);

        if (error) {
          console.error("Erro ao buscar imóveis:", error);
          setImoveis([]);
        } else {
          setImoveis(data || []);
        }
      } catch (e) {
        console.error("Erro inesperado ao buscar imóveis:", e);
        setImoveis([]);
      } finally {
        setLoadingImoveis(false);
      }
    }

    fetchImoveis();
  }, []);

  function escolherAnuncioParaCard(slug) {
    if (!imoveis || imoveis.length === 0) return null;

    let filtrados = [...imoveis];

    switch (slug) {
      case "aluguel-temporada":
        filtrados = filtrados.filter((a) => isFinalidadeTemporada(a.finalidade));
        break;

      case "aluguel-residencial":
        filtrados = filtrados.filter(
          (a) =>
            isFinalidadeAluguel(a.finalidade) &&
            a.tipo_imovel &&
            !TIPOS_COMERCIAIS.includes(a.tipo_imovel)
        );
        break;

      case "casas-venda":
        filtrados = filtrados.filter(
          (a) => norm(a.finalidade) === "venda" && norm(a.tipo_imovel) === "casa"
        );
        break;

      case "apartamentos-venda":
        filtrados = filtrados.filter(
          (a) => norm(a.finalidade) === "venda" && norm(a.tipo_imovel) === "apartamento"
        );
        break;

      case "aluguel-comercial":
        filtrados = filtrados.filter(
          (a) => isFinalidadeAluguel(a.finalidade) && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
        );
        break;

      case "comercial-venda":
        filtrados = filtrados.filter(
          (a) => norm(a.finalidade) === "venda" && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
        );
        break;

      case "terrenos-lotes":
        filtrados = filtrados.filter((a) => norm(a.tipo_imovel).includes("terreno"));
        break;

case "lancamentos": {
  filtrados = filtrados.filter((a) => {
    const t = norm(a.titulo);
    const d = norm(a.descricao);
    return (
      t.includes("lançamento") ||
      t.includes("lancamento") ||
      d.includes("lançamento") ||
      d.includes("lancamento")
    );
  });
  break;
}


      default:
        break;
    }

    if (filtrados.length === 0) return null;

    // ✅ garante que o "primeiro" aqui respeita o premium
    const ordenados = sortPremiumLocal(filtrados);
    return ordenados[0] || null;
  }

  const listaDestaques = useMemo(() => {
    if (!imoveis || imoveis.length === 0) return [];
    const ordenados = sortPremiumLocal(imoveis);

    const soDestaques = ordenados.filter((a) => a.destaque === true);
    if (soDestaques.length > 0) return soDestaques.slice(0, 8);

    return ordenados.slice(0, 8);
  }, [imoveis]);

  function executarBusca() {
    const partes = [];
    if (buscaTexto?.trim()) partes.push(buscaTexto.trim());
    if (buscaTipo) partes.push(buscaTipo);
    if (buscaCidade) partes.push(buscaCidade);

    const q = partes.join(" ").trim();
    router.push(`/busca?q=${encodeURIComponent(q)}&categoria=imoveis`);
  }

  const heroSrc = heroImages[heroIndex];

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (afiliado, clicável, rotativo) */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* ✅ HERO PREMIUM (sem piscar) */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200" />

          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: loadedSet.has(heroSrc) && fadeIn ? 1 : 0,
              backgroundImage: `url(${heroSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <Image src={heroSrc} alt="Pré-carregamento hero" fill className="opacity-0 pointer-events-none" />
        </div>

        {/* ✅ overlay premium em degradê */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35" />

        {/* ✅ textos mais altos + sombra premium */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white translate-y-[-26px] sm:translate-y-[-34px]">
          <p className="text-sm md:text-base font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
            Encontre casas, apartamentos, terrenos e oportunidades imobiliárias em toda a Região dos Lagos.
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold [text-shadow:0_6px_20px_rgba(0,0,0,0.75)]">
            Classilagos – Imóveis
          </h1>

          <div className="mt-3 flex justify-center">
            <div className="h-[3px] w-44 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Busca</label>
                <input
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executarBusca()}
                  type="text"
                  placeholder="Ex.: casa 2 quartos, frente para a lagoa"
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <SmartSelect
                label="Tipo"
                value={buscaTipo || "Todos"}
                onChange={(v) => setBuscaTipo(v === "Todos" ? "" : v)}
                options={["Todos", ...tiposImovel]}
              />

              <SmartSelect
                label="Cidade"
                value={buscaCidade || "Todas"}
                onChange={(v) => setBuscaCidade(v === "Todas" ? "" : v)}
                options={["Todas", ...cidades]}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={executarBusca}
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">Busca ligada ao motor do Classilagos.</p>
        </div>
      </section>

      <div className="h-4 sm:h-6" />

      {/* CARDS + DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const capa = anuncio ? pegarCapaDoAnuncio(anuncio) : null;
            const hrefCategoria = montarUrlDaCategoria(cat.slug);

            return (
              <Link
                key={cat.slug}
                href={hrefCategoria}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img src={capa} alt={anuncio?.titulo || cat.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, imóveis aqui
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 text-white px-3 py-2 min-h-[64px]">
                  <p className="text-xs md:text-sm font-semibold">{cat.nome}</p>
                  {anuncio && (
                    <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                      {anuncio.titulo} • {anuncio.cidade}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* IMÓVEIS EM DESTAQUE */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Imóveis em destaque</h2>

          {loadingImoveis ? (
            <p className="text-xs text-slate-500">Carregando imóveis em destaque...</p>
          ) : listaDestaques.length === 0 ? (
            <p className="text-xs text-slate-500">Ainda não há imóveis cadastrados. Seja o primeiro a anunciar!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {listaDestaques.map((anuncio) => {
                const href = `/anuncios/${anuncio.id}`;
                const capa = pegarCapaDoAnuncio(anuncio);

                return (
                  <Link
                    key={anuncio.id}
                    href={href}
                    className="group block overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    <div className="relative h-24 md:h-28 w-full bg-slate-100 overflow-hidden">
                      <img src={capa} alt={anuncio.titulo || "Imóvel"} className="w-full h-full object-cover" />
                    </div>

                    <div className="bg-slate-900 text-white px-3 py-2">
                      <p className="text-[11px] md:text-xs font-semibold line-clamp-2">{anuncio.titulo}</p>
                      <p className="text-[11px] text-slate-300">
                        {anuncio.cidade} {anuncio.bairro ? `• ${anuncio.bairro}` : ""}
                      </p>
                      {anuncio.preco && (
                        <p className="mt-1 text-[11px] text-emerald-200 font-semibold">{anuncio.preco}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) — com respiro */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

{/* FAIXA SERVIÇOS */}
<section className="bg-slate-900 py-8">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-sm font-semibold text-white mb-1">
      Serviços e informações para imóveis
    </h2>

    <p className="text-xs text-slate-300 mb-4 max-w-2xl">
      Use o Classilagos como guia para acessar tributos, registros oficiais e serviços essenciais.
    </p>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* CARD 1 – IPTU */}
      <Link
        href="/utilidades?tab=iptu"
        className="btn-lente rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm block transition"
      >
        <h3 className="text-sm font-semibold text-white mb-1">
          IPTU e tributos
        </h3>
        <p className="text-[11px] text-slate-300">
          Consulte IPTU e portais oficiais das prefeituras por cidade.
        </p>
      </Link>

      {/* CARD 2 – REGISTRO DE IMÓVEIS */}
      <a
        href="https://www.registrodeimoveis.org.br/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-lente rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm block transition"
      >
        <h3 className="text-sm font-semibold text-white mb-1">
          Registro de imóveis (ONR)
        </h3>
        <p className="text-[11px] text-slate-300">
          Plataforma oficial para certidões, matrículas e serviços digitais.
        </p>
      </a>

      {/* CARD 3 – DOCUMENTAÇÃO */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-1">
          Documentação e regularização
        </h3>
        <p className="text-[11px] text-slate-300">
          Escritura, registro, habite-se e orientações gerais.
        </p>
      </div>

      {/* CARD 4 – SERVIÇOS */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-1">
          Serviços para o imóvel
        </h3>
        <p className="text-[11px] text-slate-300">
          Em breve, profissionais indicados via LagoListas.
        </p>
      </div>

    </div>
  </div>
</section>

    </main>
  );
}
