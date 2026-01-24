"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";
import SmartSelect from "../components/SmartSelect";

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

/* ✅ BANNERS AFILIADOS (RODAPÉ) */
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

/* ----------------- HELPERS ----------------- */

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function normalizeText(v) {
  return String(v || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isTruthy(v) {
  if (v === true) return true;
  const s = normalizeText(v);
  return s === "true" || s === "1" || s === "sim" || s === "yes";
}

function textContainsAny(text, terms = []) {
  const s = normalizeText(text);
  return terms.some((t) => s.includes(normalizeText(t)));
}

function normalizeWhatsAppBR(numberRaw) {
  let n = onlyDigits(numberRaw);
  while (n.startsWith("0")) n = n.slice(1);
  if (!n) return "";
  if (n.startsWith("55")) return n;
  if (n.length === 10 || n.length === 11) return `55${n}`;
  return n; // fallback
}

function waLink(numberRaw, msg) {
  const n = normalizeWhatsAppBR(numberRaw);
  if (!n) return "";
  const text = encodeURIComponent(msg || "");
  return `https://wa.me/${n}${text ? `?text=${text}` : ""}`;
}

/* ✅ ORDEM PREMIUM (local) — destaque desc -> prioridade desc -> created_at desc -> titulo asc */
function sortPremiumLocal(arr) {
  return [...(arr || [])].sort((a, b) => {
    const da = isTruthy(a?.destaque) ? 1 : 0;
    const db = isTruthy(b?.destaque) ? 1 : 0;
    if (db !== da) return db - da;

    const pa = Number.isFinite(Number(a?.prioridade)) ? Number(a.prioridade) : 0;
    const pb = Number.isFinite(Number(b?.prioridade)) ? Number(b.prioridade) : 0;
    if (pb !== pa) return pb - pa;

    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
    if (tb !== ta) return tb - ta;

    const aa = String(a?.titulo || "");
    const bb = String(b?.titulo || "");
    return aa.localeCompare(bb, "pt-BR");
  });
}

/* ----------------- PAGE ----------------- */

export default function LagoListasPage() {
  const router = useRouter();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca (vai para /busca)
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");

  // ✅ Delivery: seletor de cidade (canto direito)
  const [cidadeDelivery, setCidadeDelivery] = useState("Maricá");

  // HERO – 3 imagens em slide
  const heroImages = useMemo(
    () => [
      "/lagolistas/hero-lagolistas-01.webp",
      "/lagolistas/hero-lagolistas-02.webp",
      "/lagolistas/hero-lagolistas-03.webp",
    ],
    []
  );
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Cidades (padrão do projeto)
  const cidades = useMemo(
    () => [
      "Maricá",
      "Saquarema",
      "Araruama",
      "Iguaba Grande",
      "São Pedro da Aldeia",
      "Arraial do Cabo",
      "Cabo Frio",
      "Búzios",
      "Rio das Ostras",
    ],
    []
  );

  // Segmentos (usado no select de “Categoria”)
  const segmentosLagolistas = useMemo(
    () => [
      "Academias, pilates & estúdios de treino",
      "Advogados & serviços jurídicos",
      "Agências de publicidade & marketing digital",
      "Agências de viagens & turismo",
      "Assistência técnica (celular, informática, eletro)",
      "Autoescolas",
      "Autopeças & acessórios",
      "Bares & pubs",
      "Barbearias",
      "Bazar, utilidades & presentes",
      "Buffets, salgados & bolos",
      "Chaveiros",
      "Clínicas de estética & depilação",
      "Clínicas médicas & consultórios",
      "Clínicas odontológicas / dentistas",
      "Clínicas veterinárias & pet shops",
      "Comércio geral & lojas de rua",
      "Concessionárias & lojas de veículos",
      "Consultoria empresarial & administrativa",
      "Contabilidade & serviços contábeis",
      "Cursos de idiomas",
      "Dedetização & controle de pragas",
      "Delivery de marmita & refeições",
      "Depósitos de gás e água mineral",
      "Eletrodomésticos & eletrônicos",
      "Escolas, cursos & reforço escolar",
      "Faculdades & ensino superior",
      "Farmácias & drogarias",
      "Fisioterapia & terapias integradas",
      "Fotografia & filmagem de eventos",
      "Funilaria & pintura automotiva",
      "Gráficas & comunicação visual",
      "Hospitais & prontos-socorros",
      "Hotéis, pousadas & hospedagem",
      "Imobiliárias & corretores",
      "Internet, provedores & tecnologia",
      "Jardinagem, paisagismo & piscinas",
      "Joalherias & semijoias",
      "Lava-rápido & estética automotiva",
      "Lavanderias & tinturarias",
      "Locação de brinquedos, som & estrutura",
      "Lojas de roupas & calçados",
      "Materiais de construção & home center",
      "Motoboy & entregas rápidas",
      "Móveis & decoração",
      "Oficinas mecânicas & auto centers",
      "Organização de festas & eventos",
      "Outros serviços & negócios",
      "Padarias & confeitarias",
      "Papelarias, livrarias & copiadoras",
      "Pizzarias, lanchonetes & fast food",
      "Pneus, rodas & alinhamento",
      "Psicólogos, terapeutas & coaching",
      "Restaurantes & churrascarias",
      "Salões de beleza, manicure & cabeleireiros",
      "Seguradoras & corretores de seguros",
      "Serviços de limpeza & diaristas",
      "Serviços funerários",
      "Supermercados, hortifrutis & mercearias",
      "Transportes, fretes & mudanças",
      "Óticas & relojoarias",
    ],
    []
  );

  // Carregar base do LagoListas
  useEffect(() => {
    let cancelado = false;

    async function fetchLagolistas() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select(
            "id, titulo, descricao, cidade, bairro, area_profissional, telefone, whatsapp, email, site_url, instagram, imagens, destaque, prioridade, created_at, status, categoria"
          )
          .eq("categoria", "lagolistas")
          .eq("status", "ativo")
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false });

        if (cancelado) return;

        if (error) {
          console.error("Erro ao carregar LagoListas:", error);
          setAnuncios([]);
        } else {
          setAnuncios(sortPremiumLocal(data || []));
        }
      } catch (e) {
        console.error("Erro inesperado ao carregar LagoListas:", e);
        if (!cancelado) setAnuncios([]);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    fetchLagolistas();
    return () => {
      cancelado = true;
    };
  }, []);

  // ✅ lista leve (base democrática)
  const listaDaPagina = useMemo(() => {
    if (!Array.isArray(anuncios)) return [];
    return anuncios.slice(0, 60);
  }, [anuncios]);

  // ✅ Busca premium: manda para /busca
  function handleBuscar() {
    const partes = [];
    if (buscaTexto.trim()) partes.push(buscaTexto.trim());
    if (filtroCategoria && filtroCategoria !== "Todos")
      partes.push(filtroCategoria);
    if (filtroCidade && filtroCidade !== "Toda a região")
      partes.push(filtroCidade);

    const q = partes.join(" ").trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("categoria", "lagolistas");

    router.push(`/busca?${params.toString()}`);
  }

  function handleLimpar() {
    setBuscaTexto("");
    setFiltroCategoria("Todos");
    setFiltroCidade("Toda a região");
  }

  const categoriaLabel = filtroCategoria || "Todos";
  const cidadeLabel = filtroCidade || "Toda a região";

  // ✅ Separar vitrines (sem criar tabela nova)
  const destaques = useMemo(() => {
    const base = Array.isArray(anuncios) ? anuncios : [];
    const top = base.filter((a) => isTruthy(a?.destaque) || Number(a?.prioridade) > 0);
    return sortPremiumLocal(top).slice(0, 8);
  }, [anuncios]);

  const delivery = useMemo(() => {
    const base = Array.isArray(anuncios) ? anuncios : [];
    const terms = [
      "delivery",
      "entrega",
      "disk",
      "marmita",
      "gas",
      "água",
      "agua",
      "farmacia",
      "farmácia",
      "motoboy",
      "lanchonete",
      "pizza",
      "restaurante",
      "pizzaria",
    ];

    const filtered = base.filter((a) => {
      const t = `${a?.titulo || ""} ${a?.descricao || ""} ${a?.area_profissional || ""}`;
      const okDelivery = textContainsAny(t, terms) && (a?.whatsapp || a?.telefone);
      const okCidade = !cidadeDelivery ? true : (a?.cidade || "") === cidadeDelivery;
      return okDelivery && okCidade;
    });

    return sortPremiumLocal(filtered).slice(0, 8);
  }, [anuncios, cidadeDelivery]);

  // ----------------- COMPONENTS -----------------

  function CardVitrine({ item, variant = "default" }) {
    const imagens = Array.isArray(item?.imagens) ? item.imagens : [];
    const img = imagens.length > 0 ? imagens[0] : null;

    const badge =
      variant === "delivery"
        ? "ATENDIMENTO RÁPIDO"
        : isTruthy(item?.destaque)
        ? "DESTAQUE"
        : null;

    const ctaText = variant === "delivery" ? "Pedir agora" : "Ver detalhes";

    const msg =
      variant === "delivery"
        ? `Olá! Vi seu anúncio no Classilagos (LagoListas) e gostaria de fazer um pedido.`
        : `Olá! Vi seu anúncio no Classilagos (LagoListas) e gostaria de mais informações.`;

    const wpp = item?.whatsapp || item?.telefone;
    const wppHref = wpp ? waLink(wpp, msg) : "";

    return (
      <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
        <Link href={`/anuncios/${item.id}`} className="block">
          <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
            {img ? (
              <Image
                src={img}
                alt={item?.titulo || "LagoListas"}
                fill
                sizes="320px"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500">
                Sem foto
              </div>
            )}

            {badge && (
              <div className="absolute left-3 top-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold tracking-wide ${
                    variant === "delivery"
                      ? "bg-emerald-600 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {badge}
                </span>
              </div>
            )}
          </div>

          <div className="px-3 py-3">
            <p className="text-[12px] md:text-[13px] font-extrabold text-slate-900 line-clamp-2">
              {item?.titulo}
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              {item?.cidade}
              {item?.bairro ? ` • ${item.bairro}` : ""}
            </p>
            {item?.area_profissional && (
              <p className="mt-1 text-[11px] text-slate-700 line-clamp-1">
                {item.area_profissional}
              </p>
            )}
          </div>
        </Link>

        <div className="px-3 pb-3 flex items-center justify-between gap-2">
          <Link
            href={`/anuncios/${item.id}`}
            className="text-[11px] font-semibold text-blue-700 hover:underline"
          >
            Ver detalhes →
          </Link>

          {wppHref ? (
            <a
              href={wppHref}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-bold text-white ${
                variant === "delivery"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-900 hover:bg-slate-950"
              }`}
            >
              {ctaText}
            </a>
          ) : (
            <span className="text-[10px] text-slate-400">Sem contato</span>
          )}
        </div>
      </div>
    );
  }

  function CardTarja({ title, desc }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[12px] font-extrabold text-slate-900">{title}</p>
        <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{desc}</p>
      </div>
    );
  }

  // ----------------- RENDER -----------------

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator
            images={bannersTopo}
            interval={6000}
            height={120}
            maxWidth={720}
          />
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={currentHero}
            src={heroImages[currentHero]}
            alt="Classilagos LagoListas"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/45" />

          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
              Classilagos – LagoListas
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              O maior guia comercial da Região dos Lagos.
            </p>
            <p className="mt-1 text-[11px] md:text-xs text-slate-100/90 max-w-2xl">
              Telefones, WhatsApp, endereços, sites e muito mais de comércios,
              serviços, saúde, turismo e profissionais liberais.
            </p>
          </div>

          {/* bolinhas do slider */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentHero(index)}
                className={`h-2.5 w-2.5 rounded-full border border-white/70 ${
                  currentHero === index
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Hero ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BUSCA (vai para /busca) */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: farmácia, pizzaria, encanador, clínica..."
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleBuscar();
                    }
                  }}
                />
              </div>

              <SmartSelect
                label="Categoria"
                value={categoriaLabel}
                options={["Todos", ...segmentosLagolistas]}
                onChange={(v) => setFiltroCategoria(v || "Todos")}
              />

              <SmartSelect
                label="Cidade"
                value={cidadeLabel}
                options={["Toda a região", ...cidades]}
                onChange={(v) => setFiltroCidade(v || "Toda a região")}
              />

              <div className="flex justify-end gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleLimpar}
                  className="w-full md:w-auto rounded-full bg-slate-200 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 hover:bg-slate-300"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={handleBuscar}
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>

                {/* ✅ Botão azul (na linha da busca) */}
                <Link
                  href="/anunciar/lagolistas"
                  className="w-full md:w-auto inline-flex items-center justify-center rounded-full border border-blue-600 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Anunciar no LagoListas
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            ✅ Busca ligada ao motor do Classilagos (abre resultados em outra
            página).
          </p>
        </div>
      </section>


      {/* ✅ VITRINE DE DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Destaques do Comércio Local
            </h2>
            <p className="mt-1 text-[12px] text-slate-600">
              Empresas, serviços e profissionais em evidência na cidade.
            </p>
          </div>
        </div>

        {loading && <p className="text-[12px] text-slate-500">Carregando destaques…</p>}

        {!loading && destaques.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[12px] text-slate-600">
            Ainda não há destaques configurados. Assim que existirem anúncios com
            destaque/prioridade, eles aparecem aqui.
          </div>
        )}

        {!loading && destaques.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destaques.map((item) => (
              <CardVitrine key={item.id} item={item} variant="default" />
            ))}
          </div>
        )}
      </section>

      {/* ✅ DELIVERY / ATENDIMENTO RÁPIDO (com seletor de cidade à direita) */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Atendimento Rápido e Entregas na Cidade
            </h2>
            <p className="mt-1 text-[12px] text-slate-600">
              Serviços essenciais com contato direto, WhatsApp ativo e atendimento rápido.
            </p>
          </div>

          {/* ✅ seletor de cidade (no lugar do “Ver mais”) */}
          <div className="w-full sm:w-[260px]">
            <SmartSelect
              label="Cidade"
              value={cidadeDelivery}
              options={cidades}
              onChange={(v) => setCidadeDelivery(v || "Maricá")}
            />
          </div>
        </div>

        {!loading && delivery.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[12px] text-slate-600">
            Ainda não há opções de delivery detectadas para {cidadeDelivery}. Assim que
            existirem anúncios com termos de entrega e contato (WhatsApp/telefone), eles aparecem aqui.
          </div>
        )}

        {!loading && delivery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {delivery.map((item) => (
              <CardVitrine key={item.id} item={item} variant="delivery" />
            ))}
          </div>
        )}
      </section>

      {/* ✅ LISTA GERAL DO LAGOLISTAS (Base democrática) */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-10">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Cadastros do LagoListas
            </h2>
            <p className="mt-1 text-[12px] text-slate-600">
              Confira comércios, serviços e profissionais cadastrados (lista base, transparente e completa).
            </p>
          </div>

          <Link
            href="/busca?categoria=lagolistas"
            className="text-[12px] font-semibold text-blue-700 hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {loading && (
          <p className="text-[12px] text-slate-600">Carregando cadastros…</p>
        )}

        {!loading && anuncios.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[12px] text-slate-600">
            Ainda não há cadastros no LagoListas.
          </div>
        )}

        {!loading && anuncios.length > 0 && (
          <>
            <div className="mb-3 text-[11px] text-slate-500">
              {anuncios.length} cadastro(s) no total • mostrando {listaDaPagina.length} aqui para manter a página leve.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listaDaPagina.map((item) => (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  {(() => {
                    const imagens = Array.isArray(item.imagens) ? item.imagens : [];
                    const thumb = imagens.length > 0 ? imagens[0] : null;

                    return (
                      <>
                        <div className="relative w-full h-36 bg-slate-200 overflow-hidden">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumb}
                              alt={item.titulo || "LagoListas"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500">
                              Sem foto
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[13px] font-extrabold text-slate-900 line-clamp-2">
                              {item.titulo}
                            </p>
                            {item.destaque && (
                              <span className="shrink-0 inline-flex items-center rounded-full bg-orange-500/10 border border-orange-400 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                                DESTAQUE
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {item.cidade}
                            {item.bairro ? ` • ${item.bairro}` : ""}
                          </p>

                          {item.area_profissional && (
                            <p className="mt-1 text-[11px] text-slate-800 line-clamp-1">
                              {item.area_profissional}
                            </p>
                          )}

                          {item.descricao && (
                            <p className="mt-2 text-[11px] text-slate-700 line-clamp-2">
                              {item.descricao}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                            {item.whatsapp && (
                              <span className="inline-flex items-center rounded-full bg-green-600 text-white px-2 py-0.5">
                                WhatsApp
                              </span>
                            )}
                            {item.telefone && !item.whatsapp && (
                              <span className="inline-flex items-center rounded-full bg-slate-800 text-white px-2 py-0.5">
                                Telefone
                              </span>
                            )}
                            {item.site_url && (
                              <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5">
                                Site
                              </span>
                            )}
                          </div>

                          <span className="mt-3 inline-block text-[12px] text-blue-700 group-hover:underline">
                            Ver detalhes →
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/busca?categoria=lagolistas"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Ver todos os cadastros
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ✅ TARJA INSTITUCIONAL (MOVIDA PARA O FINAL) */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-base md:text-lg font-extrabold text-slate-900">
              Apoio ao Comércio Local e ao Empreendedor
            </h2>
            <p className="text-[12px] text-slate-600 max-w-3xl leading-relaxed">
              O LagoListas conecta comércio, serviços e profissionais a oportunidades e iniciativas
              que fortalecem a economia local e o desenvolvimento da cidade.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CardTarja
              title="Desenvolvimento Econômico"
              desc="Programas, ações e iniciativas voltadas ao fortalecimento do pequeno e médio empreendedor."
            />
            <CardTarja
              title="Empreendedorismo & Formalização"
              desc="Orientações, apoio e caminhos para quem deseja empreender, crescer ou formalizar seu negócio."
            />
            <CardTarja
              title="Economia Local & Solidária"
              desc="Iniciativas que estimulam o comércio local, a geração de renda e a circulação de oportunidades na cidade."
            />
            {/* ✅ TROCA SOMENTE ESTE CARD (mantendo os demais) */}
            <CardTarja
              title="Publicar Vagas de Empregos"
              desc="Divulgue oportunidades no comércio e serviços da cidade e fortaleça a economia local."
            />
          </div>
        </div>
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) */}
      <section className="bg-white py-10 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator
            images={bannersRodape}
            interval={6500}
            height={170}
            maxWidth={720}
          />
        </div>
      </section>

      {/* Footer global vem do layout */}
    </main>
  );
}

