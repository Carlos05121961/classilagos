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

export default function LagoListasPage() {
  const router = useRouter();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // BUSCA (vai para /busca)
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");
  const [filtroTipoOrg, setFiltroTipoOrg] = useState("Todos");

  // CLICK / DISK-ENTREGAS (seletor único de cidade)
  const [cidadeEntrega, setCidadeEntrega] = useState("Toda a região");

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

  // ✅ CLICK / DISK-ENTREGAS — 8 cards (cada um um produto/serviço)
  const vitrineCardsEntrega = useMemo(
    () => [
      { titulo: "Gás & Água", termo: "gás água depósito", icon: "🔥" },
      { titulo: "Pizzaria", termo: "pizzaria pizza delivery", icon: "🍕" },
      { titulo: "Farmácia", termo: "farmácia drogaria", icon: "💊" },
      { titulo: "Mercado", termo: "supermercado hortifruti", icon: "🛒" },
      { titulo: "Lanches", termo: "lanchonete hamburguer", icon: "🍔" },
      { titulo: "Açaí", termo: "açaí sorveteria", icon: "🍧" },
      { titulo: "Pet Shop", termo: "pet shop veterinária", icon: "🐾" },
      { titulo: "Motoboy", termo: "motoboy entregas rápidas", icon: "🛵" },
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

    // filtro extra separado (se sua /busca já respeitar)
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

  // ✅ Buscar cadastros do LagoListas (agora com created_at)
  useEffect(() => {
    const fetchLagolistas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, created_at, titulo, descricao, cidade, bairro, area_profissional, telefone, whatsapp, email, site_url, instagram, imagens, destaque, status, categoria, tipo_organizacao"
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

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* ✅ HERO (mantido Premium sem piscar) */}
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

          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/50" />

          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
              Classilagos – LagoListas
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              O maior guia comercial da Região dos Lagos.
            </p>
            <p className="mt-1 text-[11px] md:text-xs text-slate-100/90 max-w-2xl">
              Telefones, WhatsApp, endereços, sites e muito mais de comércios, serviços e profissionais.
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
                  currentHero === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Hero ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ✅ BUSCA PRINCIPAL (AGORA É O PRINCIPAL E FICA EM CIMA) */}
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
                value={tiposOrganizacao.find((t) => t.value === filtroTipoOrg)?.label || "Todos"}
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

            {/* ✅ Botão pequeno ao lado da busca (padrão premium, sem poluição) */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 text-center sm:text-left">
                ✅ Busca ligada ao motor do Classilagos (abre resultados em outra página).
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

      {/* ✅ VITRINE GERAL (8) */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm md:text-base font-extrabold text-slate-900">
            Vitrine LagoListas (destaques)
          </h2>
          <p className="text-[11px] text-slate-500">
            {loading ? "Carregando..." : "8 cards"}
          </p>
        </div>

        {loading && (
          <p className="text-[11px] text-slate-500">Carregando vitrine…</p>
        )}

        {!loading && vitrineGeral.length === 0 && (
          <p className="text-[11px] text-slate-500">Ainda não há cadastros no LagoListas.</p>
        )}

        {!loading && vitrineGeral.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitrineGeral.map((item) => (
              <CardMini key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ CLICK / DISK-ENTREGAS (busca independente + seletor único de cidade) */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900">
                Click / Disk-Entregas
              </h2>
              <p className="mt-1 text-[11px] text-slate-600 max-w-2xl">
                Selecione a cidade e clique no card para ver opções no LagoListas (via busca).
              </p>
            </div>

            <div className="w-full md:w-[320px]">
              <SmartSelect
                label="Cidade"
                value={cidadeEntrega}
                options={["Toda a região", ...cidades]}
                onChange={(v) => setCidadeEntrega(v || "Toda a região")}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitrineCardsEntrega.map((c) => (
              <button
                key={c.titulo}
                type="button"
                onClick={() =>
                  pushBusca({
                    texto: c.termo,
                    categoria: "Todos",
                    cidade: cidadeEntrega,
                    tipoOrg: "Todos",
                  })
                }
                className="group text-left overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition shadow-sm hover:shadow-md"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-lg">
                      {c.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 truncate">{c.titulo}</p>
                      <p className="text-[11px] text-slate-600 truncate">
                        {cidadeEntrega === "Toda a região" ? "Região dos Lagos" : cidadeEntrega}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-700 line-clamp-2">
                    Clique para ver opções (busca automática).
                  </p>

                  <span className="mt-2 inline-block text-[11px] text-blue-700 group-hover:underline">
                    Ver agora →
                  </span>
                </div>
              </button>
            ))}
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
          <p className="text-[11px] text-slate-500">Carregando últimos cadastros…</p>
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
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>
    </main>
  );
}

