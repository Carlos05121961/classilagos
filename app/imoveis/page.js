"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

const heroImages = ["/imoveis/imovel-01.jpg", "/imoveis/imovel-02.jpg", "/imoveis/imovel-03.jpg"];

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
      params.set("finalidade", "temporada"); // lista entende temporada e "aluguel temporada"
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
      params.set("comercial_venda", "1"); // filtro de grupo no /lista
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
  const capa = imgs.find((u) => typeof u === "string" && u.trim() !== "") || "/imoveis/sem-foto.jpg";
  return capa;
}

export default function ImoveisPage() {
  const router = useRouter();
  const [currentHero, setCurrentHero] = useState(0);

  const [buscaTexto, setBuscaTexto] = useState("");
  const [buscaTipo, setBuscaTipo] = useState("");
  const [buscaCidade, setBuscaCidade] = useState("");

  const [imoveis, setImoveis] = useState([]);
  const [loadingImoveis, setLoadingImoveis] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCurrentHero((prev) => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoadingImoveis(true);

        const { data, error } = await supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "imoveis")
          .order("destaque", { ascending: false })
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
          (a) => isFinalidadeAluguel(a.finalidade) && a.tipo_imovel && !TIPOS_COMERCIAIS.includes(a.tipo_imovel)
        );
        break;

      case "casas-venda":
        filtrados = filtrados.filter((a) => norm(a.finalidade) === "venda" && norm(a.tipo_imovel) === "casa");
        break;

      case "apartamentos-venda":
        filtrados = filtrados.filter((a) => norm(a.finalidade) === "venda" && norm(a.tipo_imovel) === "apartamento");
        break;

      case "aluguel-comercial":
        filtrados = filtrados.filter(
          (a) => isFinalidadeAluguel(a.finalidade) && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
        );
        break;

      case "comercial-venda":
        filtrados = filtrados.filter((a) => norm(a.finalidade) === "venda" && TIPOS_COMERCIAIS.includes(a.tipo_imovel));
        break;

      case "terrenos-lotes":
        filtrados = filtrados.filter((a) => norm(a.tipo_imovel).includes("terreno"));
        break;

      case "lancamentos": {
        const comPalavra = filtrados.filter((a) => {
          const t = norm(a.titulo);
          const d = norm(a.descricao);
          return t.includes("lançamento") || t.includes("lancamento") || d.includes("lançamento") || d.includes("lancamento");
        });

        if (comPalavra.length > 0) filtrados = comPalavra;
        else filtrados = filtrados.filter((a) => norm(a.finalidade) === "venda");
        break;
      }

      default:
        break;
    }

    if (filtrados.length === 0) return null;

    // prioriza destaque dentro do grupo
    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  const listaDestaques = useMemo(() => {
    if (!imoveis || imoveis.length === 0) return [];
    const soDestaques = imoveis.filter((a) => a.destaque === true);
    if (soDestaques.length > 0) return soDestaques.slice(0, 8);
    return imoveis.slice(0, 8);
  }, [imoveis]);

  function executarBusca() {
    const partes = [];
    if (buscaTexto?.trim()) partes.push(buscaTexto.trim());
    if (buscaTipo) partes.push(buscaTipo);
    if (buscaCidade) partes.push(buscaCidade);

    const q = partes.join(" ").trim();
    router.push(`/busca?q=${encodeURIComponent(q)}&categoria=imoveis`);
  }

  return (
    <main className="bg-white min-h-screen">
      {/* BANNER FIXO NO TOPO */}
      <section className="w-full flex justify-center bg-slate-100 border-b py-3">
        <div className="w-full max-w-[1000px] px-4">
          <div className="relative w-full h-[130px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden flex items-center justify-center">
            <Image
              src="/banners/anuncio-01.png"
              alt="Anuncie seu IMÓVEL totalmente GRÁTIS - Classilagos"
              fill
              sizes="900px"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden">
          <Image
            key={heroImages[currentHero]}
            src={heroImages[currentHero]}
            alt="Classilagos Imóveis"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-opacity duration-700"
          />
        </div>

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-sm md:text-base font-medium drop-shadow">
            Encontre casas, apartamentos, terrenos e oportunidades imobiliárias em toda a Região dos Lagos.
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">Classilagos – Imóveis</h1>
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

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Tipo</label>
                <select
                  value={buscaTipo}
                  onChange={(e) => setBuscaTipo(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {tiposImovel.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-slate-600 mb-1">Cidade</label>
                <select
                  value={buscaCidade}
                  onChange={(e) => setBuscaCidade(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

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
                {/* padroniza tamanho para nenhum card ficar “menor” */}
                <div className="relative h-32 md:h-36 w-full bg-slate-300 overflow-hidden">
                  {capa ? (
                    <img src={capa} alt={anuncio?.titulo || cat.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-600">
                      Em breve, imóveis aqui
                    </div>
                  )}
                </div>

                {/* garante mesma altura do bloco de texto */}
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

      {/* FAIXA SERVIÇOS */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">Serviços e informações para imóveis</h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para entender tributos, documentos e serviços importantes.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">IPTU e tributos</h3>
              <p className="text-[11px] text-slate-300">
                Em breve, links diretos para consultar IPTU, taxas municipais e informações das prefeituras.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Financiamento imobiliário</h3>
              <p className="text-[11px] text-slate-300">Dicas básicas sobre crédito, simulações e contato com bancos.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Regularização e documentos</h3>
              <p className="text-[11px] text-slate-300">Orientações sobre escritura, registro, habite-se e etc.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Serviços para o seu imóvel</h3>
              <p className="text-[11px] text-slate-300">
                Em breve, integração com o LagoListas para encontrar profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
