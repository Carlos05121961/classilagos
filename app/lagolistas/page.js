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

  // ✅ JANELINHA (Guia rápido LagoListas) — padrão IPTU/Utilidades
  const [openInfo, setOpenInfo] = useState(false);
  const [infoTab, setInfoTab] = useState("cadastrar"); // cadastrar | seguranca | ajuda

  // Busca (vai para /busca)
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");

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

  // Buscar cadastros do LagoListas (lista base da página)
  useEffect(() => {
    const fetchLagolistas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, descricao, cidade, bairro, area_profissional, telefone, whatsapp, email, site_url, instagram, imagens, destaque, status, categoria"
        )
        .eq("categoria", "lagolistas")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("titulo", { ascending: true });

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

  // ✅ Busca premium: manda para o motorzão (/busca)
  function handleBuscar() {
    const partes = [];
    if (buscaTexto.trim()) partes.push(buscaTexto.trim());
    if (filtroCategoria && filtroCategoria !== "Todos") partes.push(filtroCategoria);
    if (filtroCidade && filtroCidade !== "Toda a região") partes.push(filtroCidade);

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

  // Card de cada cadastro
  const CardLagoLista = ({ item }) => {
    const imagens = Array.isArray(item.imagens) ? item.imagens : [];
    const thumb = imagens.length > 0 ? imagens[0] : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group flex gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition shadow-sm hover:shadow-md px-4 py-3"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-yellow-200 flex items-center justify-center text-xs font-semibold text-yellow-700">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={item.titulo || "LagoListas"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <span>{item.titulo?.charAt(0) || "L"}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-[13px] text-slate-900 truncate">{item.titulo}</p>
            {item.destaque && (
              <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-400 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                DESTAQUE
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 mb-0.5">
            {item.cidade}
            {item.bairro ? ` • ${item.bairro}` : ""}
          </p>

          {item.area_profissional && (
            <p className="text-[11px] text-slate-800 mb-1 line-clamp-1">{item.area_profissional}</p>
          )}

          {item.descricao && <p className="text-[11px] text-slate-700 line-clamp-2">{item.descricao}</p>}

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
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
              <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5">Site</span>
            )}
          </div>

          <span className="mt-1 inline-block text-[11px] text-blue-700 group-hover:underline">Ver detalhes →</span>
        </div>
      </Link>
    );
  };

  // ✅ Lista da página (leve e rápida)
  const listaDaPagina = useMemo(() => {
    const base = Array.isArray(anuncios) ? anuncios : [];
    return base.slice(0, 60);
  }, [anuncios]);

  const categoriaLabel = filtroCategoria || "Todos";
  const cidadeLabel = filtroCidade || "Toda a região";

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (Premium, rotativo, clicável) */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* ✅ HERO LAGOLISTAS – SLIDER Premium sem piscar */}
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

          {/* preload invisível */}
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
              Telefones, WhatsApp, endereços, sites e muito mais de comércios, serviços, saúde, turismo e profissionais liberais.
            </p>
          </div>

          {/* bolinhas do slider */}
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

      {/* ✅ CAIXA DE BUSCA (Premium -> /busca) + atalhos visíveis */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">O que você procura?</label>
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

            {/* ✅ Atalhos VISÍVEIS (nada escondido) */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 text-center sm:text-left">
                ✅ Busca ligada ao motor do Classilagos (abre resultados em outra página).
              </div>

              <div className="flex gap-2">
                <a
                  href="#cadastros"
                  className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                >
                  Ver cadastros ↓
                </a>
                <Link
                  href="/anunciar/lagolistas"
                  className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white hover:bg-blue-700"
                >
                  Anunciar no LagoListas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA PARA ANUNCIAR (Premium) */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">Quer colocar sua empresa no LagoListas?</p>
          <p className="text-xs text-slate-700 mb-4">
            Cadastre gratuitamente seu comércio, serviço ou profissão e seja encontrado por milhares de pessoas em toda a Região dos Lagos.
          </p>

          <Link
            href="/anunciar/lagolistas"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no LagoListas
          </Link>
        </div>
      </section>

      {/* LISTÃO BASE (com âncora) */}
      <section id="cadastros" className="max-w-5xl mx-auto px-4 pb-10 scroll-mt-24">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Cadastros do LagoListas</h2>
          {!loading && <p className="text-[11px] text-slate-500">{anuncios.length} cadastro(s) no total</p>}
        </div>

        {loading && <p className="text-[11px] text-slate-500">Carregando cadastros do LagoListas…</p>}

        {!loading && anuncios.length === 0 && <p className="text-[11px] text-slate-500">Ainda não há cadastros no LagoListas.</p>}

        {!loading && anuncios.length > 0 && (
          <>
            <p className="text-[11px] text-slate-500 mb-3">Mostrando {listaDaPagina.length} itens (página leve e rápida).</p>

            <div className="space-y-3">
              {listaDaPagina.map((item) => (
                <CardLagoLista key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ✅ GUIA RÁPIDO — LAGOLISTAS (3 botões + janelinha / padrão IPTU) */}
      <section className="bg-white pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Guia rápido do LagoListas</h2>
                <p className="mt-1 text-[11px] text-slate-600 max-w-2xl">
                  Dicas e atalhos para anunciar, contratar com mais segurança e pedir ajuda.
                  <span className="block mt-1 text-[10px] text-slate-500">
                    EN: Quick guide • ES: Guía rápida
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenInfo((v) => !v)}
                className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                {openInfo ? "Fechar" : "Abrir"} informações
              </button>
            </div>

            {/* Botões (abas) */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setInfoTab("cadastrar");
                  setOpenInfo(true);
                }}
                className={[
                  "btn-lente rounded-2xl border px-4 py-3 text-left transition",
                  infoTab === "cadastrar"
                    ? "bg-white border-slate-300 shadow-sm"
                    : "bg-white/60 border-slate-200 hover:bg-white",
                ].join(" ")}
              >
                <div className="text-xs font-semibold text-slate-900">Cadastrar meu negócio</div>
                <div className="mt-0.5 text-[10px] text-slate-600">
                  EN: List my business • ES: Registrar mi negocio
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInfoTab("seguranca");
                  setOpenInfo(true);
                }}
                className={[
                  "btn-lente rounded-2xl border px-4 py-3 text-left transition",
                  infoTab === "seguranca"
                    ? "bg-white border-slate-300 shadow-sm"
                    : "bg-white/60 border-slate-200 hover:bg-white",
                ].join(" ")}
              >
                <div className="text-xs font-semibold text-slate-900">Contratar com segurança</div>
                <div className="mt-0.5 text-[10px] text-slate-600">
                  EN: Hire safely • ES: Contratar con seguridad
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInfoTab("ajuda");
                  setOpenInfo(true);
                }}
                className={[
                  "btn-lente rounded-2xl border px-4 py-3 text-left transition",
                  infoTab === "ajuda"
                    ? "bg-white border-slate-300 shadow-sm"
                    : "bg-white/60 border-slate-200 hover:bg-white",
                ].join(" ")}
              >
                <div className="text-xs font-semibold text-slate-900">Ajuda & denúncias</div>
                <div className="mt-0.5 text-[10px] text-slate-600">
                  EN: Help • ES: Ayuda
                </div>
              </button>
            </div>

            {/* Janelinha (painel compacto) */}
            {openInfo && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                {infoTab === "cadastrar" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">Cadastrar meu negócio</h3>

                    <ul className="text-[11px] text-slate-700 space-y-2 list-disc pl-5">
                      <li>
                        <strong>Título</strong> claro (ex.: “Clínica Veterinária X”, “Oficina Y”, “Pizzaria Z”).
                      </li>
                      <li>
                        <strong>Segmento</strong> (área_profissional) — escolha o mais correto.
                      </li>
                      <li>
                        <strong>Cidade</strong> obrigatória; <strong>bairro</strong> ajuda muito na busca.
                      </li>
                      <li>
                        <strong>Logo primeiro</strong> + até <strong>5 fotos</strong> (máx. 6 imagens).
                      </li>
                      <li>
                        <strong>Contato</strong> principal: WhatsApp ou telefone ou email.
                      </li>
                      <li>
                        <strong>Links</strong> (opcional): site e Instagram.
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href="/anunciar/lagolistas"
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-[11px] font-semibold text-white hover:bg-blue-700"
                      >
                        Anunciar no LagoListas
                      </Link>

                      <a
                        href="#cadastros"
                        className="inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2 text-[11px] font-semibold text-slate-900 hover:bg-slate-200 border border-slate-200"
                      >
                        Ver cadastros
                      </a>
                    </div>
                  </div>
                )}

                {infoTab === "seguranca" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">Contratar com segurança</h3>

                    <ul className="text-[11px] text-slate-700 space-y-2 list-disc pl-5">
                      <li>Peça <strong>orçamento por escrito</strong> (WhatsApp serve).</li>
                      <li>Combine <strong>prazo</strong>, <strong>valor</strong> e o que está incluído.</li>
                      <li>Se for serviço maior, prefira <strong>pagamento por etapa</strong>.</li>
                      <li>Peça <strong>fotos</strong> de trabalhos anteriores e <strong>referências</strong>.</li>
                      <li>Quando existir, confirme <strong>MEI/CNPJ</strong> e dados do profissional.</li>
                    </ul>

                    <p className="text-[11px] text-slate-500">
                      Dica: depois a gente liga isso a “selo/avaliações” e LagoListas por cidade.
                      <span className="block mt-1 text-[10px] text-slate-400">
                        EN/ES: We’ll add ratings & verification later.
                      </span>
                    </p>
                  </div>
                )}

                {infoTab === "ajuda" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Ajuda & denúncias</h3>
                      <p className="mt-1 text-[11px] text-slate-600">
                        Contatos úteis de Procon na região (para orientação e reclamações).
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-900 mb-1">Procon — Cabo Frio</p>
                        <p className="text-[11px] text-slate-700">
                          WhatsApp:{" "}
                          <a
                            className="text-blue-700 font-semibold hover:underline"
                            href="https://wa.me/5522999072821"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            (22) 99907-2821
                          </a>
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Rua Nicola Aslan (Braga) ou Shopping UnaPark (Tamoios).
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-900 mb-1">Procon — Búzios</p>
                        <p className="text-[11px] text-slate-700">
                          WhatsApp:{" "}
                          <a
                            className="text-blue-700 font-semibold hover:underline"
                            href="https://wa.me/552226230314"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            (22) 2623-0314
                          </a>
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Travessa dos Pescadores (Centro).
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-900 mb-1">Procon — Arraial do Cabo</p>
                        <p className="text-[11px] text-slate-700">
                          WhatsApp:{" "}
                          <a
                            className="text-blue-700 font-semibold hover:underline"
                            href="https://wa.me/552226221417"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            (22) 2622-1417
                          </a>
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Rua Ezer Teixeira de Melo (Praia dos Anjos).
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/fale-conosco"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                      >
                        Fale com o Classilagos
                      </Link>

                      <button
                        type="button"
                        onClick={() => setOpenInfo(false)}
                        className="inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2 text-[11px] font-semibold text-slate-900 hover:bg-slate-200 border border-slate-200"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) */}
      <section className="bg-white py-10 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

      {/* Footer global vem do layout */}
    </main>
  );
}

