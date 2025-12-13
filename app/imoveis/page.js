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

// Cards da primeira faixa
const categoriasLinha1 = [
  { nome: "Casas à venda", slug: "casas-venda" },
  { nome: "Apartamentos à venda", slug: "apartamentos-venda" },
  { nome: "Lançamentos", slug: "lancamentos" },
  { nome: "Destaques", slug: "destaques" }, // era "Oportunidades" -> agora é Destaques (sem confusão)
];

// Cards da segunda faixa
const categoriasLinha2 = [
  { nome: "Aluguel residencial", slug: "aluguel-residencial" },
  { nome: "Aluguel comercial", slug: "aluguel-comercial" },
  { nome: "Aluguel por temporada", slug: "temporada" },
  { nome: "Terrenos & Lotes", slug: "terrenos-lotes" },
];

// ===== helpers =====
function norm(v) {
  return (v || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
}
function isFinalidadeTemporada(finalidade) {
  const f = norm(finalidade);
  return f === "temporada" || f === "aluguel temporada" || f === "aluguel_temporada";
}
function isFinalidadeAluguel(finalidade) {
  const f = norm(finalidade);
  return f === "aluguel" || f === "aluguel fixo" || f === "aluguel_fixo";
}
function pegarCapaDoAnuncio(anuncio) {
  const imgs = Array.isArray(anuncio?.imagens) ? anuncio.imagens : [];
  return imgs.find((u) => typeof u === "string" && u.trim() !== "") || "/imoveis/sem-foto.jpg";
}

// ===== SEGMENTO (chave interna) =====
// Isso mantém compatibilidade: quem não tiver segmento, cai no filtro antigo.
function derivarSegmentoImovel({ finalidade, tipo_imovel, titulo, descricao, lancamentoFlag }) {
  const f = norm(finalidade);
  const t = norm(tipo_imovel);
  const texto = `${norm(titulo)} ${norm(descricao)}`;

  if (lancamentoFlag === true) return "lancamento";
  if (texto.includes("lançamento") || texto.includes("lancamento")) return "lancamento";

  if (f === "venda") {
    if (t === "casa") return "casa_venda";
    if (t === "apartamento") return "apartamento_venda";
    if (t.includes("comercial")) return "comercial_venda";
    if (t.includes("terreno") || t.includes("lote")) return "terreno_venda";
    return "venda_outros";
  }

  if (isFinalidadeTemporada(finalidade)) return "aluguel_temporada";

  if (isFinalidadeAluguel(finalidade)) {
    if (t.includes("comercial")) return "aluguel_comercial";
    return "aluguel_residencial";
  }

  return "";
}

// ===== URL dos cards =====
function montarUrlDaCategoria(slug) {
  const params = new URLSearchParams();

  switch (slug) {
    case "casas-venda":
      params.set("segmento_imovel", "casa_venda");
      break;
    case "apartamentos-venda":
      params.set("segmento_imovel", "apartamento_venda");
      break;
    case "lancamentos":
      params.set("segmento_imovel", "lancamento");
      break;
    case "destaques":
      params.set("destaque", "1");
      break;

    case "aluguel-residencial":
      params.set("segmento_imovel", "aluguel_residencial");
      break;
    case "aluguel-comercial":
      params.set("segmento_imovel", "aluguel_comercial");
      break;
    case "temporada":
      params.set("segmento_imovel", "aluguel_temporada");
      break;
    case "terrenos-lotes":
      params.set("segmento_imovel", "terreno_venda");
      break;

    default:
      break;
  }

  const qs = params.toString();
  return qs ? `/imoveis/lista?${qs}` : "/imoveis/lista";
}

export default function ImoveisPage() {
  const router = useRouter();

  const [currentHero, setCurrentHero] = useState(0);

  // Busca da página
  const [buscaTexto, setBuscaTexto] = useState("");
  const [buscaTipo, setBuscaTipo] = useState("");
  const [buscaCidade, setBuscaCidade] = useState("");

  // Lista geral
  const [imoveis, setImoveis] = useState([]);
  const [loadingImoveis, setLoadingImoveis] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCurrentHero((prev) => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(interval);
  }, []);

  // busca imóveis (até 80) para montar cards/destaques
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
          return;
        }

        // garante segmento calculado em memória (para anúncios antigos que ainda não têm)
        const lista = (data || []).map((a) => ({
          ...a,
          segmento_calc:
            a.segmento_imovel ||
            derivarSegmentoImovel({
              finalidade: a.finalidade,
              tipo_imovel: a.tipo_imovel,
              titulo: a.titulo,
              descricao: a.descricao,
              lancamentoFlag: false,
            }),
        }));

        setImoveis(lista);
      } catch (e) {
        console.error("Erro inesperado ao buscar imóveis:", e);
        setImoveis([]);
      } finally {
        setLoadingImoveis(false);
      }
    }

    fetchImoveis();
  }, []);

  // escolhe anúncio do card usando MESMA regra da URL (segmento)
  function escolherAnuncioParaCard(slug) {
    if (!imoveis?.length) return null;

    const alvo =
      slug === "casas-venda"
        ? "casa_venda"
        : slug === "apartamentos-venda"
        ? "apartamento_venda"
        : slug === "lancamentos"
        ? "lancamento"
        : slug === "aluguel-residencial"
        ? "aluguel_residencial"
        : slug === "aluguel-comercial"
        ? "aluguel_comercial"
        : slug === "temporada"
        ? "aluguel_temporada"
        : slug === "terrenos-lotes"
        ? "terreno_venda"
        : "";

    // Destaques é por destaque mesmo
    if (slug === "destaques") {
      const filtrados = imoveis.filter((a) => a.destaque === true);
      return filtrados[0] || imoveis[0] || null;
    }

    // 1) tenta por segmento (novo e calculado)
    let filtrados = imoveis.filter((a) => (a.segmento_imovel || a.segmento_calc) === alvo);

    // 2) fallback antigo (caso não tenha nada)
    if (filtrados.length === 0) {
      switch (alvo) {
        case "casa_venda":
          filtrados = imoveis.filter((a) => norm(a.finalidade) === "venda" && norm(a.tipo_imovel) === "casa");
          break;
        case "apartamento_venda":
          filtrados = imoveis.filter((a) => norm(a.finalidade) === "venda" && norm(a.tipo_imovel) === "apartamento");
          break;
        case "terreno_venda":
          filtrados = imoveis.filter((a) => norm(a.tipo_imovel).includes("terreno"));
          break;
        case "aluguel_comercial":
          filtrados = imoveis.filter((a) => isFinalidadeAluguel(a.finalidade) && norm(a.tipo_imovel).includes("comercial"));
          break;
        case "aluguel_residencial":
          filtrados = imoveis.filter((a) => isFinalidadeAluguel(a.finalidade) && !norm(a.tipo_imovel).includes("comercial"));
          break;
        case "aluguel_temporada":
          filtrados = imoveis.filter((a) => isFinalidadeTemporada(a.finalidade));
          break;
        case "lancamento":
          filtrados = imoveis.filter((a) => norm(a.titulo).includes("lanç") || norm(a.descricao).includes("lanç"));
          break;
        default:
          break;
      }
    }

    if (!filtrados.length) return null;

    // prioriza destaque dentro do card
    const emDestaque = filtrados.find((a) => a.destaque === true);
    return emDestaque || filtrados[0];
  }

  const listaDestaques = useMemo(() => {
    if (!imoveis?.length) return [];
    const soDestaques = imoveis.filter((a) => a.destaque === true);
    return (soDestaques.length ? soDestaques : imoveis).slice(0, 8);
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
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold drop-shadow-lg">
            Classilagos – Imóveis
          </h1>
        </div>
      </section>

      {/* CAIXA DE BUSCA (LIGADA) */}
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

      {/* CATEGORIAS + DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        {/* LINHA 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoriasLinha1.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const capa = anuncio ? pegarCapaDoAnuncio(anuncio) : "/imoveis/sem-foto.jpg";
            const hrefCategoria = montarUrlDaCategoria(cat.slug);

            return (
              <Link
                key={cat.slug}
                href={hrefCategoria}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-300 overflow-hidden">
                  <img src={capa} alt={anuncio?.titulo || cat.nome} className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
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

        {/* LINHA 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoriasLinha2.map((cat) => {
            const anuncio = escolherAnuncioParaCard(cat.slug);
            const capa = anuncio ? pegarCapaDoAnuncio(anuncio) : "/imoveis/sem-foto.jpg";
            const hrefCategoria = montarUrlDaCategoria(cat.slug);

            return (
              <Link
                key={cat.slug}
                href={hrefCategoria}
                className="overflow-hidden rounded-2xl shadow border border-slate-200 bg-slate-100 block hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="relative h-32 md:h-36 w-full bg-slate-400 overflow-hidden">
                  <img src={capa} alt={anuncio?.titulo || cat.nome} className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-900 text-white px-3 py-2">
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

        {/* DESTAQUES */}
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

      {/* faixa final mantém igual */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-white mb-1">Serviços e informações para imóveis</h2>
          <p className="text-xs text-slate-300 mb-4 max-w-2xl">
            Use o Classilagos também como guia para entender tributos, documentos e serviços importantes na hora de comprar,
            vender ou alugar um imóvel na Região dos Lagos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">IPTU e tributos</h3>
              <p className="text-[11px] text-slate-300">Em breve, links diretos para consultar IPTU e taxas municipais.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Financiamento imobiliário</h3>
              <p className="text-[11px] text-slate-300">Dicas sobre crédito, simulações e contato com bancos.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Regularização e documentos</h3>
              <p className="text-[11px] text-slate-300">Orientações sobre escritura, cartório, habite-se e registros.</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-1">Serviços para o seu imóvel</h3>
              <p className="text-[11px] text-slate-300">Em breve, integração com o LagoListas para profissionais.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

