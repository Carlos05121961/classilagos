"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function LagoListasPage() {
  const router = useRouter();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca (vai para /busca)
  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");

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
        {/* Logo / foto */}
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

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-[13px] text-slate-900 truncate">
              {item.titulo}
            </p>
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
            <p className="text-[11px] text-slate-800 mb-1 line-clamp-1">
              {item.area_profissional}
            </p>
          )}

          {item.descricao && (
            <p className="text-[11px] text-slate-700 line-clamp-2">
              {item.descricao}
            </p>
          )}

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
              <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5">
                Site
              </span>
            )}
          </div>

          <span className="mt-1 inline-block text-[11px] text-blue-700 group-hover:underline">
            Ver detalhes →
          </span>
        </div>
      </Link>
    );
  };

  // ✅ Lista da página (não fica “presa” por busca)
  const listaDaPagina = useMemo(() => {
    const base = Array.isArray(anuncios) ? anuncios : [];
    return base.slice(0, 60);
  }, [anuncios]);

  return (
    <main className="bg-white min-h-screen">
      {/* ✅ BANNER TOPO (Premium, rotativo, clicável) */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopo} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* HERO LAGOLISTAS – SLIDER */}
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
              Telefones, WhatsApp, endereços, sites e muito mais de comércios, serviços, saúde, turismo e profissionais liberais.
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
                  currentHero === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Hero ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA LAGOLISTAS (✅ PREMIUM -> /busca) */}
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

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Categoria
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {segmentosLagolistas.map((seg) => (
                    <option key={seg} value={seg}>
                      {seg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">
                  Cidade
                </label>
                <select
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filtroCidade}
                  onChange={(e) => setFiltroCidade(e.target.value)}
                >
                  <option value="Toda a região">Toda a região</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

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
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            ✅ Busca ligada ao motor do Classilagos (abre resultados em outra página).
          </p>
        </div>
      </section>

      {/* CHAMADA PARA ANUNCIAR */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Quer colocar sua empresa no LagoListas?
          </p>
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

      {/* LISTÃO BASE */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Cadastros do LagoListas
          </h2>
          {!loading && (
            <p className="text-[11px] text-slate-500">
              {anuncios.length} cadastro(s) no total
            </p>
          )}
        </div>

        {loading && (
          <p className="text-[11px] text-slate-500">
            Carregando cadastros do LagoListas…
          </p>
        )}

        {!loading && anuncios.length === 0 && (
          <p className="text-[11px] text-slate-500">
            Ainda não há cadastros no LagoListas.
          </p>
        )}

        {!loading && anuncios.length > 0 && (
          <>
            <p className="text-[11px] text-slate-500 mb-3">
              Mostrando {listaDaPagina.length} itens (página leve e rápida).
            </p>

            <div className="space-y-3">
              {listaDaPagina.map((item) => (
                <CardLagoLista key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ✅ BANNER RODAPÉ (PRINCIPAL) */}
      <section className="bg-white py-10 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodape} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>

      {/* Footer global do peixinho vem do layout */}
    </main>
  );
}

