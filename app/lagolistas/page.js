"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function LagoListasPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaTexto, setBuscaTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroCidade, setFiltroCidade] = useState("Toda a região");

  // HERO – 3 imagens em slide
  const heroImages = [
    "/lagolistas/hero-lagolistas-01.webp",
    "/lagolistas/hero-lagolistas-02.webp",
    "/lagolistas/hero-lagolistas-03.webp",
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 segundos

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

  const segmentosLagolistas = [
    // COMÉRCIO & LOJAS
    "Comércio geral & lojas de rua",
    "Supermercados, hortifrutis & mercearias",
    "Materiais de construção & home center",
    "Depósitos de gás e água mineral",
    "Bazar, utilidades & presentes",
    "Móveis & decoração",
    "Eletrodomésticos & eletrônicos",
    "Lojas de roupas & calçados",
    "Óticas & relojoarias",
    "Joalherias & semijoias",
    "Papelarias, livrarias & copiadoras",

    // AUTOMOTIVO
    "Autopeças & acessórios",
    "Concessionárias & lojas de veículos",
    "Oficinas mecânicas & auto centers",
    "Funilaria & pintura automotiva",
    "Lava-rápido & estética automotiva",
    "Pneus, rodas & alinhamento",

    // IMÓVEIS & NEGÓCIOS
    "Imobiliárias & corretores",
    "Contabilidade & serviços contábeis",
    "Advogados & serviços jurídicos",
    "Seguradoras & corretores de seguros",
    "Consultoria empresarial & administrativa",
    "Gráficas & comunicação visual",
    "Agências de publicidade & marketing digital",
    "Internet, provedores & tecnologia",
    "Assistência técnica (celular, informática, eletro)",

    // SAÚDE & BEM-ESTAR
    "Clínicas médicas & consultórios",
    "Hospitais & prontos-socorros",
    "Clínicas odontológicas / dentistas",
    "Clínicas veterinárias & pet shops",
    "Farmácias & drogarias",
    "Clínicas de estética & depilação",
    "Salões de beleza, manicure & cabeleireiros",
    "Barbearias",
    "Fisioterapia & terapias integradas",
    "Psicólogos, terapeutas & coaching",
    "Academias, pilates & estúdios de treino",

    // EDUCAÇÃO
    "Escolas, cursos & reforço escolar",
    "Cursos de idiomas",
    "Autoescolas",
    "Faculdades & ensino superior",

    // FESTAS, EVENTOS & LAZER
    "Buffets, salgados & bolos",
    "Organização de festas & eventos",
    "Locação de brinquedos, som & estrutura",
    "Fotografia & filmagem de eventos",

    // ALIMENTAÇÃO
    "Restaurantes & churrascarias",
    "Pizzarias, lanchonetes & fast food",
    "Padarias & confeitarias",
    "Delivery de marmita & refeições",
    "Bares & pubs",

    // TURISMO & HOSPEDAGEM
    "Hotéis, pousadas & hospedagem",
    "Agências de viagens & turismo",

    // SERVIÇOS EM GERAL
    "Transportes, fretes & mudanças",
    "Motoboy & entregas rápidas",
    "Lavanderias & tinturarias",
    "Chaveiros",
    "Dedetização & controle de pragas",
    "Serviços funerários",
    "Serviços de limpeza & diaristas",
    "Jardinagem, paisagismo & piscinas",

    // OUTROS
    "Outros serviços & negócios",
  ];


  // Buscar cadastros do LagoListas
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

  // Filtro em memória (busca, categoria, cidade)
  const filtrados = anuncios.filter((item) => {
    const texto = buscaTexto.trim().toLowerCase();

    const atendeTexto =
      !texto ||
      [
        item.titulo,
        item.descricao,
        item.nome_negocio,
        item.area_profissional,
        item.cidade,
        item.bairro,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(texto);

    const atendeCategoria =
      filtroCategoria === "Todos" ||
      item.area_profissional === filtroCategoria;

    const atendeCidade =
      filtroCidade === "Toda a região" || item.cidade === filtroCidade;

    return atendeTexto && atendeCategoria && atendeCidade;
  });

  // Card de cada cadastro
  const CardLagoLista = ({ item }) => {
    const thumb =
      Array.isArray(item.imagens) && item.imagens.length > 0
        ? item.imagens[0]
        : null;

    return (
      <Link
        href={`/anuncios/${item.id}`}
        className="group flex gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition shadow-sm hover:shadow-md px-4 py-3"
      >
        {/* Logo / foto */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-yellow-200 flex items-center justify-center text-xs font-semibold text-yellow-700">
          {thumb ? (
            <img
              src={thumb}
              alt={item.titulo}
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

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie no Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO LAGOLISTAS – SLIDER */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={currentHero} // força transição suave
            src={heroImages[currentHero]}
            alt="Classilagos LagoListas"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />

          {/* leve escurecida pra destacar textos */}
          <div className="absolute inset-0 bg-black/20" />

          {/* textos sobre a imagem */}
          <div className="absolute inset-x-0 top-[18%] flex flex-col items-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
              Classilagos – LagoListas
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-white drop-shadow">
              O maior guia comercial da Região dos Lagos.
            </p>
            <p className="mt-1 text-[11px] md:text-xs text-slate-100/90 max-w-2xl">
              Telefones, WhatsApp, endereços, sites, mapas e muito mais de
              comércios, serviços, turismo, saúde e profissionais liberais.
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* CAIXA DE BUSCA LAGOLISTAS */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white/95 rounded-3xl shadow-lg border border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end text-xs md:text-sm">
              {/* O que você procura */}
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
                />
              </div>

              {/* Categoria */}
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

              {/* Cidade */}
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

              {/* Botão (visual) */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="w-full md:w-auto rounded-full bg-blue-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1 text-[11px] text-center text-slate-500">
            Essa busca já está ligada aos cadastros reais do LagoListas.
          </p>
        </div>
      </section>

      {/* BLOCO CHAMADA PARA ANÚNCIO */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 px-6 py-7 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Quer colocar sua empresa no LagoListas?
          </p>
          <p className="text-xs text-slate-700 mb-4">
            Cadastre gratuitamente seu comércio, serviço ou profissão e seja
            encontrado por milhares de pessoas em toda a Região dos Lagos.
          </p>

          <Link
            href="/anunciar/lagolistas"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Anunciar no LagoListas
          </Link>
        </div>
      </section>

      {/* LISTÃO LAGOLISTAS */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Cadastros do LagoListas
          </h2>
          {!loading && (
            <p className="text-[11px] text-slate-500">
              {filtrados.length} encontrado(s)
            </p>
          )}
        </div>

        {loading && (
          <p className="text-[11px] text-slate-500">
            Carregando cadastros do LagoListas…
          </p>
        )}

        {!loading && filtrados.length === 0 && (
          <p className="text-[11px] text-slate-500">
            Ainda não há cadastros no LagoListas para os filtros selecionados.
          </p>
        )}

        <div className="mt-3 space-y-3">
          {filtrados.map((item) => (
            <CardLagoLista key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
