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

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

// Normaliza BR para wa.me
function normalizeWhatsAppBR(numberRaw) {
  let n = onlyDigits(numberRaw);
  while (n.startsWith("0")) n = n.slice(1);
  if (!n) return "";
  if (n.startsWith("55")) return n;
  if (n.length === 10 || n.length === 11) return `55${n}`;
  return n;
}

function textContainsAny(text, terms) {
  const s = String(text || "").toLowerCase();
  return terms.some((t) => s.includes(String(t || "").toLowerCase()));
}

function arrHasAny(arr, terms) {
  const base = Array.isArray(arr) ? arr.map((x) => String(x || "").toLowerCase()) : [];
  const wants = (terms || []).map((x) => String(x || "").toLowerCase());
  return wants.some((t) => base.includes(t));
}

export default function LagoListasPage() {
  const router = useRouter();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // BUSCA PRINCIPAL (vai para /busca)
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");
  const [filtroTipoOrg, setFiltroTipoOrg] = useState("Todos");

  // CLICK / DISK-ENTREGAS: filtros (público)
  const [cidadeEntrega, setCidadeEntrega] = useState("Toda a região");
  const [desejoEntrega, setDesejoEntrega] = useState("Todos");

  const [clickVitrine, setClickVitrine] = useState([]);
  const [loadingClickVitrine, setLoadingClickVitrine] = useState(false);

  function buildWhatsAppLink({ whatsapp, titulo, cidade, desejoLabel }) {
    const n = normalizeWhatsAppBR(whatsapp);
    if (!n) return "";

    const msg = `Olá! Vi no Classilagos – Click-Entregas${
      desejoLabel && desejoLabel !== "Todos" ? ` (${desejoLabel})` : ""
    }${cidade && cidade !== "Toda a região" ? ` em ${cidade}` : ""}. Quero fazer um pedido: "${titulo || ""}".`;

    return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
  }

  // HERO – 3 imagens em slide (Premium sem piscar)
  const heroImages = useMemo(
    () => [
      "/lagolistas/hero-lagolistas-01.webp",
      "/lagolistas/hero-lagolistas-02.webp",
      "/lagolistas/hero-lagolistas-03.webp",
    ],
    []
  );

  const [currentHero, setCurrentHero] = useState(0);
  const [loadedSet, setLoadedSet] = useState(() => new Set());
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, [heroImages]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setFadeIn(false);
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const src = heroImages[currentHero];
    if (loadedSet.has(src)) {
      const id = setTimeout(() => setFadeIn(true), 30);
      return () => clearTimeout(id);
    }
  }, [currentHero, loadedSet, heroImages]);

  const heroSrc = heroImages[currentHero];

  // cidades no padrão do formulário
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

  // ✅ Opções tipo anunciante (mesmo padrão do form)
  const tiposOrganizacao = [
    { label: "Todos", value: "Todos" },
    { label: "Empresa / Comércio", value: "empresa" },
    { label: "Profissional Liberal", value: "profissional" },
    { label: "Associação / Entidade", value: "associacao" },
    { label: "Institucional / Órgão / Projeto", value: "institucional" },
  ];

  // Mesma lista de segmentos usada no LagoListas (ordem alfabética)
  const segmentosLagolistas = [
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
  ];

  // ✅ Click-Entregas: opções do seletor “O que você deseja?”
  // (alinhado com o admin: tipos_delivery = keys)
  const desejosEntrega = useMemo(
    () => [
      { titulo: "Todos", key: "", termo: "", icon: "✨", tagsText: [], tagsKeys: [] },

      { titulo: "Pizza / Lanches", key: "pizza_lanches", termo: "pizza lanches delivery", icon: "🍕", tagsText: ["pizza", "pizzaria", "lanche", "lanches", "hamburguer", "hambúrguer", "delivery"], tagsKeys: ["pizza_lanches"] },
      { titulo: "Marmita", key: "marmita", termo: "marmita refeições delivery", icon: "🍲", tagsText: ["marmita", "refeição", "refeicoes", "almoço", "almoco"], tagsKeys: ["marmita"] },
      { titulo: "Restaurante", key: "restaurante", termo: "restaurante delivery", icon: "🍽️", tagsText: ["restaurante", "churrasco", "churrascaria"], tagsKeys: ["restaurante"] },
      { titulo: "Farmácia", key: "farmacia", termo: "farmácia drogaria entrega", icon: "💊", tagsText: ["farmácia", "farmacia", "drogaria", "remédio", "remedio"], tagsKeys: ["farmacia"] },
      { titulo: "Água / Gás", key: "agua_gas", termo: "água gás depósito entrega", icon: "🔥", tagsText: ["gás", "gas", "água", "agua", "depósito", "deposito"], tagsKeys: ["agua_gas"] },
      { titulo: "Bebidas", key: "bebidas", termo: "bebidas entrega", icon: "🥤", tagsText: ["bebida", "bebidas", "cerveja", "refrigerante"], tagsKeys: ["bebidas"] },
      { titulo: "Padaria", key: "padaria", termo: "padaria entrega", icon: "🥖", tagsText: ["padaria", "pão", "pao", "confeitaria"], tagsKeys: ["padaria"] },
      { titulo: "Pet delivery", key: "pet_delivery", termo: "pet shop entrega", icon: "🐾", tagsText: ["pet", "ração", "racao", "pet shop", "veterin"], tagsKeys: ["pet_delivery"] },
      { titulo: "Frango assado", key: "frango_assado", termo: "frango assado entrega", icon: "🍗", tagsText: ["frango", "assado", "galeto"], tagsKeys: ["frango_assado"] },
      { titulo: "Outros", key: "outros", termo: "delivery", icon: "🛵", tagsText: ["delivery", "entrega", "entregas", "motoboy"], tagsKeys: ["outros"] },
    ],
    []
  );

  function pushBusca({ texto, categoria, cidade, tipoOrg }) {
    const params = new URLSearchParams();
    const partes = [];

    if (texto?.trim()) partes.push(texto.trim());
    if (categoria && categoria !== "Todos") partes.push(categoria);
    if (cidade && cidade !== "Toda a região") partes.push(cidade);

    const q = partes.join(" ").trim();

    params.set("categoria", "lagolistas");
    if (q) params.set("q", q);
    if (tipoOrg && tipoOrg !== "Todos") params.set("tipo_organizacao", tipoOrg);

    router.push(`/busca?${params.toString()}`);
  }

  function handleBuscar() {
    pushBusca({
      texto: buscaTexto,
      categoria: filtroCategoria,
      cidade: filtroCidade,
      tipoOrg: filtroTipoOrg,
    });
  }

  function handleLimpar() {
    setBuscaTexto("");
    setFiltroCategoria("Todos");
    setFiltroCidade("Toda a região");
    setFiltroTipoOrg("Todos");
  }

  // ✅ Buscar cadastros do LagoListas (created_at para “entraram agora”)
  useEffect(() => {
    const fetchLagolistas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, created_at, titulo, descricao, cidade, bairro, area_profissional, imagens, destaque, status, categoria, tipo_organizacao"
        )
        .eq("categoria", "lagolistas")
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar LagoListas:", error);
        setAnuncios([]);
      } else {
        setAnuncios(data || []);
      }

      setLoading(false);
    };

    fetchLagolistas();
  }, []);

  // ✅ Vitrine Click-Entregas (patrocinados) — regra oficial (DB)
  useEffect(() => {
    const fetchClickVitrine = async () => {
      setLoadingClickVitrine(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, created_at, titulo, cidade, bairro, imagens, status, whatsapp, whatsapp_delivery, tem_delivery, vitrine_delivery, vitrine_delivery_ordem, tipos_delivery, descricao, area_profissional"
        )
        .eq("status", "ativo")
        .eq("tem_delivery", true)
        .eq("vitrine_delivery", true)
        .order("vitrine_delivery_ordem", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(48);

      if (error) {
        console.error("Erro ao carregar vitrine Click-Entregas:", error);
        setClickVitrine([]);
      } else {
        setClickVitrine(Array.isArray(data) ? data : []);
      }

      setLoadingClickVitrine(false);
    };

    fetchClickVitrine();
  }, []);

  // ✅ VITRINE GERAL (8): prioriza destaque e depois mais recentes
  const vitrineGeral = useMemo(() => {
    const base = Array.isArray(anuncios) ? anuncios : [];
    const destacados = base.filter((x) => x.destaque);
    const naoDestacados = base.filter((x) => !x.destaque);
    return [...destacados, ...naoDestacados].slice(0, 8);
  }, [anuncios]);

  // ✅ ENTRARAM AGORA (8 últimos)
  const entraramAgora = useMemo(() => {
    const base = Array.isArray(anuncios) ? anuncios : [];
    return base.slice(0, 8);
  }, [anuncios]);

  // ✅ Vitrine Click filtrada (cidade + desejo) — front (sem mexer no DB)
  const clickVitrineFiltrada = useMemo(() => {
    const base = Array.isArray(clickVitrine) ? clickVitrine : [];

    const cidadeOk =
      cidadeEntrega === "Toda a região"
        ? base
        : base.filter(
            (x) =>
              String(x?.cidade || "").toLowerCase() ===
              String(cidadeEntrega).toLowerCase()
          );

    if (!desejoEntrega || desejoEntrega === "Todos") return cidadeOk;

    const regra = desejosEntrega.find((d) => d.titulo === desejoEntrega);
    const tagsKeys = regra?.tagsKeys || [];
    const tagsText = regra?.tagsText || [];

    // 1) se tiver tipos_delivery (preferível), filtra por key
    const byKeys = cidadeOk.filter((x) => arrHasAny(x?.tipos_delivery, tagsKeys));
    if (byKeys.length > 0) return byKeys;

    // 2) fallback: tenta texto (título/descrição/área)
    return cidadeOk.filter((x) =>
      textContainsAny(`${x?.titulo || ""} ${x?.area_profissional || ""} ${x?.descricao || ""}`, tagsText)
    );
  }, [clickVitrine, cidadeEntrega, desejoEntrega, desejosEntrega]);

  const CardMini = ({ item }) => {
    const imagens = Array.isArray(item.imagens) ? item.imagens : [];
    const thumb = imagens.length > 0 ? imagens[0] : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md overflow-hidden"
      >
        <div className="h-28 bg-slate-100">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={item.titulo || "LagoListas"}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-slate-500">
              Sem imagem
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-[12px] font-extrabold text-slate-900 line-clamp-2">
            {item.titulo}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          {item.destaque && (
            <span className="mt-2 inline-flex items-center rounded-full bg-orange-500/10 border border-orange-400 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
              DESTAQUE
            </span>
          )}
        </div>
      </Link>
    );
  };

  function handleBuscarEntregas() {
    const regra = desejosEntrega.find((d) => d.titulo === desejoEntrega);
    const termo = regra?.termo || "";
    pushBusca({
      texto: termo,
      categoria: "Todos",
      cidade: cidadeEntrega,
      tipoOrg: "Todos",
    });
  }

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

      {/* ✅ HERO (Premium sem piscar) */}
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

          <Image
            src={heroSrc}
            alt="Pré-carregamento hero"
            fill
            className="opacity-0 pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/50" />

          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
              Classilagos – LagoListas
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              O maior guia comercial da Região dos Lagos.
            </p>
            <p className="mt-1 text-[11px] md:text-xs text-slate-100/90 max-w-2xl">
              Telefones, WhatsApp, endereços, sites e muito mais de comércios,
              serviços e profissionais.
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setFadeIn(false);
                  setCurrentHero(index);
                }}
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

      {/* ✅ BUSCA PRINCIPAL (fica em cima) */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex.: farmácia, pizzaria, encanador, clínica..."
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={filtroCategoria}
                options={["Todos", ...segmentosLagolistas]}
                onChange={(v) => setFiltroCategoria(v || "Todos")}
              />

              <SmartSelect
                label="Cidade"
                value={filtroCidade}
                options={["Toda a região", ...cidades]}
                onChange={(v) => setFiltroCidade(v || "Toda a região")}
              />

              <SmartSelect
                label="Tipo"
                value={
                  tiposOrganizacao.find((t) => t.value === filtroTipoOrg)
                    ?.label || "Todos"
                }
                options={tiposOrganizacao.map((t) => t.label)}
                onChange={(label) => {
                  const found = tiposOrganizacao.find((t) => t.label === label);
                  setFiltroTipoOrg(found?.value || "Todos");
                }}
              />

              <div className="flex justify-end gap-2">
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
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 text-center sm:text-left">
                ✅ Busca ligada ao motor do Classilagos (abre resultados em outra
                página).
              </div>

              <Link
                href="/anunciar/lagolistas"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                ➕ Anuncie sua empresa aqui
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ VITRINE GERAL (LagoListas normal) */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
          <div>
            <h2 className="text-sm md:text-base font-extrabold text-slate-900">
              Vitrine LagoListas (destaques)
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Destaques e novidades do guia comercial.
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-[11px] text-slate-500">Carregando vitrine…</p>
        )}

        {!loading && vitrineGeral.length === 0 && (
          <p className="text-[11px] text-slate-500">
            Ainda não há anúncios na vitrine.
          </p>
        )}

        {!loading && vitrineGeral.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitrineGeral.map((item) => (
              <CardMini key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ CLICK-ENTREGAS — VITRINE PAGA (DB) — SOMENTE WHATSAPP */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900">
                Click / Disk-Entregas (patrocinados)
              </h2>
              <p className="mt-1 text-[11px] text-slate-600 max-w-2xl">
                Vitrine patrocinada: só aparece quem está ativo, com delivery
                ligado e vitrine habilitada no painel.
              </p>
            </div>

            <div className="w-full md:w-[420px] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SmartSelect
                label="O que você deseja?"
                value={desejoEntrega}
                options={desejosEntrega.map((d) => d.titulo)}
                onChange={(v) => setDesejoEntrega(v || "Todos")}
              />
              <SmartSelect
                label="Cidade"
                value={cidadeEntrega}
                options={["Toda a região", ...cidades]}
                onChange={(v) => setCidadeEntrega(v || "Toda a região")}
              />
            </div>
          </div>

          <div className="mt-5">
            {loadingClickVitrine && (
              <p className="text-[11px] text-slate-500">
                Carregando vitrine Click-Entregas…
              </p>
            )}

            {!loadingClickVitrine && clickVitrine.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-[12px] font-semibold text-slate-800">
                  Vitrine ainda vazia
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Assim que você marcar{" "}
                  <span className="font-semibold">vitrine_delivery=true</span>{" "}
                  no painel Admin (Click-Entregas), os cards aparecerão aqui.
                </p>
                <div className="mt-3">
                  <Link
                    href="/admin/vitrine-click-entregas"
                    className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                  >
                    Ir para o painel (Admin)
                  </Link>
                </div>
              </div>
            )}

            {!loadingClickVitrine &&
              clickVitrine.length > 0 &&
              clickVitrineFiltrada.length === 0 && (
                <p className="text-[11px] text-slate-500">
                  Nenhum patrocinado nessa cidade/categoria.
                </p>
              )}

            {!loadingClickVitrine && clickVitrineFiltrada.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clickVitrineFiltrada.map((item) => {
                  const imagens = Array.isArray(item?.imagens) ? item.imagens : [];
                  const capa =
                    imagens.find((u) => typeof u === "string" && u.trim() !== "") ||
                    "/lagolistas/sem-foto.jpg";

                  const whatsPreferido = String(item?.whatsapp_delivery || item?.whatsapp || "").trim();

                  const wa = buildWhatsAppLink({
                    whatsapp: whatsPreferido,
                    titulo: item?.titulo,
                    cidade: cidadeEntrega,
                    desejoLabel: desejoEntrega,
                  });

                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="relative w-full h-24 sm:h-28 bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={capa}
                          alt={item?.titulo || "Click-Entregas"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="px-3 py-2">
                        <p className="text-[11px] font-extrabold text-slate-900 line-clamp-1 uppercase">
                          {item?.titulo || "Anúncio"}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-600 line-clamp-1">
                          {item?.cidade || "Região dos Lagos"}
                          {item?.bairro ? ` • ${item.bairro}` : ""}
                        </p>
                      </div>

                      <div className="px-3 pb-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!wa) return;
                            window.open(wa, "_blank", "noopener,noreferrer");
                          }}
                          disabled={!wa}
                          className={[
                            "w-full rounded-full px-3 py-2 text-[11px] font-semibold transition",
                            wa
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-slate-200 text-slate-500 cursor-not-allowed",
                          ].join(" ")}
                          title={wa ? "Abrir WhatsApp" : "Sem WhatsApp cadastrado"}
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ✅ CLICK-ENTREGAS — BUSCA (para achar outras opções além da vitrine paga) */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-slate-900">
                Buscar no Click-Entregas
              </h3>
              <p className="mt-1 text-[11px] text-slate-600 max-w-2xl">
                Use para encontrar opções mesmo quando não estiverem na vitrine patrocinada.
              </p>
            </div>

            <div className="w-full md:w-[420px] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SmartSelect
                label="O que você deseja?"
                value={desejoEntrega}
                options={desejosEntrega.map((d) => d.titulo)}
                onChange={(v) => setDesejoEntrega(v || "Todos")}
              />
              <SmartSelect
                label="Cidade"
                value={cidadeEntrega}
                options={["Toda a região", ...cidades]}
                onChange={(v) => setCidadeEntrega(v || "Toda a região")}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleBuscarEntregas}
              className="rounded-full bg-blue-600 px-5 py-2 text-[11px] font-semibold text-white hover:bg-blue-700"
            >
              Buscar opções
            </button>
          </div>
        </div>
      </section>

      {/* ✅ ENTRARAM AGORA (8) */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-10">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm md:text-base font-extrabold text-slate-900">
            Entraram agora
          </h2>
          <p className="text-[11px] text-slate-500">
            {loading ? "Carregando..." : "Últimos 8"}
          </p>
        </div>

        {loading && (
          <p className="text-[11px] text-slate-500">
            Carregando últimos cadastros…
          </p>
        )}

        {!loading && entraramAgora.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {entraramAgora.map((item) => (
              <CardMini key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ BANNER RODAPÉ */}
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
    </main>
  );
}

