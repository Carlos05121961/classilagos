"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

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

const finalidades = [
  { label: "Qualquer", value: "" },
  { label: "Venda", value: "venda" },
  { label: "Aluguel", value: "aluguel" },
  { label: "Aluguel por temporada", value: "temporada" },
];

// ===== helpers =====
function normalizar(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function normalizarSemAcento(str = "") {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDestaqueTruthy(v) {
  if (v === true) return true;
  const s = normalizar(v);
  return s === "true" || s === "1" || s === "sim" || s === "yes";
}

function finalidadeEhTemporada(v) {
  const s = normalizar(v);
  return s === "temporada";
}

function finalidadeEhAluguel(v) {
  const s = normalizar(v);
  return s === "aluguel";
}

const TIPOS_COMERCIAIS = ["Comercial", "Loja / Sala", "Galpão"];

// ✅ ORDEM PREMIUM (local) — destaque desc → prioridade desc → created_at desc
function sortPremiumLocal(arr) {
  return [...(arr || [])].sort((a, b) => {
    const da = isDestaqueTruthy(a?.destaque) ? 1 : 0;
    const db = isDestaqueTruthy(b?.destaque) ? 1 : 0;
    if (db !== da) return db - da;

    const pa = Number.isFinite(Number(a?.prioridade)) ? Number(a.prioridade) : 0;
    const pb = Number.isFinite(Number(b?.prioridade)) ? Number(b.prioridade) : 0;
    if (pb !== pa) return pb - pa;

    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return tb - ta;
  });
}

// ====== INTERPRETADOR (Opção B embutida aqui) ======
const FINALIDADE_RULES = [
  { value: "temporada", words: ["temporada", "diaria", "diarias", "airbnb", "verao", "fim de semana", "feriado"] },
  { value: "aluguel", words: ["aluguel", "alugar", "locacao", "locar", "alugo"] },
  { value: "venda", words: ["venda", "vendo", "comprar", "compra", "a venda", "à venda", "vende se", "vende-se"] },
];

const TIPO_IMOVEL_RULES = [
  { value: "Casa", words: ["casa", "residencia", "residência"] },
  { value: "Apartamento", words: ["apartamento", "apto", "apt", "ap"] },
  { value: "Cobertura", words: ["cobertura"] },
  { value: "Kitnet / Studio", words: ["kitnet", "quitinete", "studio", "stúdio", "estudio"] },
  { value: "Terreno / Lote", words: ["terreno", "lote", "loteamento"] },
  { value: "Loja / Sala", words: ["loja", "sala", "sala comercial", "ponto comercial", "office"] },
  { value: "Galpão", words: ["galpao", "galpão", "deposito", "depósito", "armazem", "armazém"] },
  { value: "Sítio / Chácara", words: ["sitio", "sítio", "chacara", "chácara"] },
  { value: "Comercial", words: ["comercial"] },
  { value: "Outros", words: ["outros"] },
];

const CIDADE_RULES = [
  { value: "Maricá", words: ["marica"] },
  { value: "Saquarema", words: ["saquarema"] },
  { value: "Araruama", words: ["araruama"] },
  { value: "Iguaba Grande", words: ["iguaba", "iguaba grande"] },
  { value: "São Pedro da Aldeia", words: ["sao pedro", "sao pedro da aldeia", "aldeia"] },
  { value: "Arraial do Cabo", words: ["arraial", "arraial do cabo"] },
  { value: "Cabo Frio", words: ["cabo frio"] },
  { value: "Búzios", words: ["buzios", "armacao dos buzios", "armação dos búzios"] },
  { value: "Rio das Ostras", words: ["rio das ostras", "r das ostras", "r. das ostras"] },
];

const STOPWORDS = new Set([
  "em","no","na","nos","nas","de","da","do","das","dos","para","pra","pro",
  "com","sem","perto","proximo","proxima","ao","aos","as","os","um","uma",
  "e","ou","por","entre","bairro","centro"
]);

function findFirstByRules(textNorm, rules) {
  for (const r of rules) {
    for (const w of r.words) {
      const wn = normalizarSemAcento(w);
      const re = new RegExp(`(^|\\s)${wn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i");
      if (re.test(textNorm)) return r.value;
    }
  }
  return null;
}

function extractNumber(textNorm, patterns) {
  for (const re of patterns) {
    const m = textNorm.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

function removeMatchedPhrases(textNorm, phrases) {
  let t = ` ${textNorm} `;
  for (const p of phrases) {
    const pn = normalizarSemAcento(p);
    const re = new RegExp(`(^|\\s)${pn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "gi");
    t = t.replace(re, " ");
  }
  return t.replace(/\s+/g, " ").trim();
}

function interpretarBuscaImoveis(input = "") {
  const original = input || "";
  const textNorm = normalizarSemAcento(original);

  const quartos = extractNumber(textNorm, [/(\d+)\s*(quarto|quartos|qt|qts)\b/i]);
  const vagas = extractNumber(textNorm, [/(\d+)\s*(vaga|vagas)\b/i]);

  const finalidade = findFirstByRules(textNorm, FINALIDADE_RULES);
  const tipo_imovel = findFirstByRules(textNorm, TIPO_IMOVEL_RULES);
  const cidade = findFirstByRules(textNorm, CIDADE_RULES);

  const phrasesToRemove = ["quarto","quartos","qt","qts","vaga","vagas"];
  for (const r of FINALIDADE_RULES) if (r.value === finalidade) phrasesToRemove.push(...r.words);
  for (const r of TIPO_IMOVEL_RULES) if (r.value === tipo_imovel) phrasesToRemove.push(...r.words);
  for (const r of CIDADE_RULES) if (r.value === cidade) phrasesToRemove.push(...r.words);

  const rest = removeMatchedPhrases(textNorm, phrasesToRemove);

  const termosLivres = rest
    .split(" ")
    .map((x) => x.trim())
    .filter(Boolean)
    .filter((x) => !STOPWORDS.has(x))
    .filter((x) => x.length >= 2);

  return { original, tipo_imovel, finalidade, cidade, quartos, vagas, termosLivres };
}

function termosParaWebsearch(termos = []) {
  return (termos || []).join(" ").trim();
}

// ====== COMPONENTE ======
function ListaImoveisContent() {
  const searchParams = useSearchParams();

  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const filtrosUrl = useMemo(() => {
    const finalidade = searchParams.get("finalidade") || "";
    const tipoImovel = searchParams.get("tipo_imovel") || searchParams.get("tipo") || "";
    const cidade = searchParams.get("cidade") || "";
    const destaque = searchParams.get("destaque") || "";
    const lancamento = searchParams.get("lancamento") || "";

    const aluguelTipo = searchParams.get("aluguel_tipo") || "";
    const comercialVenda = searchParams.get("comercial_venda") || "";

    const busca = searchParams.get("busca") || "";

    return { finalidade, tipoImovel, cidade, destaque, lancamento, aluguelTipo, comercialVenda, busca };
  }, [searchParams]);

  const parsedBusca = useMemo(() => interpretarBuscaImoveis(filtrosUrl.busca), [filtrosUrl.busca]);

  const [filtros, setFiltros] = useState({
    finalidade: "",
    tipoImovel: "",
    cidade: "",
    destaque: "",
    lancamento: "",
    aluguelTipo: "",
    comercialVenda: "",
    busca: "",
  });

  useEffect(() => {
    const finalidadeAuto = filtrosUrl.finalidade || parsedBusca.finalidade || "";
    const tipoAuto = filtrosUrl.tipoImovel || parsedBusca.tipo_imovel || "";
    const cidadeAuto = filtrosUrl.cidade || parsedBusca.cidade || "";

    setFiltros({
      ...filtrosUrl,
      finalidade: finalidadeAuto,
      tipoImovel: tipoAuto,
      cidade: cidadeAuto,
      busca: filtrosUrl.busca || "",
    });
  }, [filtrosUrl, parsedBusca.finalidade, parsedBusca.tipo_imovel, parsedBusca.cidade]);

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setCarregando(true);
        setErro("");

        const parsedStateBusca = interpretarBuscaImoveis(filtros.busca);
        const buscaNorm = normalizarSemAcento(filtros.busca);
        const temLoja = /\bloja\b/.test(` ${buscaNorm} `);

        const lancamentoAtivo =
          filtros.lancamento === "1" ||
          filtros.lancamento === "true" ||
          filtros.lancamento === "sim";

        let query = supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "imoveis")
          .or("status.is.null,status.eq.ativo");

        // ✅ ORDEM PREMIUM SEMPRE (inclusive lançamentos)
        query = query
          .order("destaque", { ascending: false })
          .order("prioridade", { ascending: false })
          .order("created_at", { ascending: false });

        if (lancamentoAtivo) {
          query = query.or(
            "titulo.ilike.%lanç%,titulo.ilike.%lancamento%,descricao.ilike.%lanç%,descricao.ilike.%lancamento%"
          );

          const { data, error } = await query;
          if (error) throw error;

          setImoveis(sortPremiumLocal(data || []));
          return;
        }

        const comercialVendaAtivo =
          filtros.comercialVenda === "1" ||
          filtros.comercialVenda === "true" ||
          filtros.comercialVenda === "sim";

        if (comercialVendaAtivo) {
          query = query.eq("finalidade", "venda").in("tipo_imovel", TIPOS_COMERCIAIS);
        } else {
          const aluguelTipo = normalizar(filtros.aluguelTipo);

          if (aluguelTipo === "residencial") {
            query = query.eq("finalidade", "aluguel");
            const tiposComerciaisIn = `(${TIPOS_COMERCIAIS.map((t) => `"${t}"`).join(",")})`;
            query = query.not("tipo_imovel", "in", tiposComerciaisIn);
          }

          if (aluguelTipo === "comercial") {
            query = query.eq("finalidade", "aluguel").in("tipo_imovel", TIPOS_COMERCIAIS);
          }

          if (filtros.finalidade) query = query.eq("finalidade", filtros.finalidade);

          if (filtros.tipoImovel) {
            query = query.eq("tipo_imovel", filtros.tipoImovel);
          } else if (temLoja) {
            query = query.in("tipo_imovel", ["Comercial", "Loja / Sala"]);
          }

          if (filtros.cidade) query = query.eq("cidade", filtros.cidade);
        }

        const destaqueAtivo =
          filtros.destaque === "1" ||
          filtros.destaque === "true" ||
          filtros.destaque === "sim";

        if (destaqueAtivo) query = query.eq("destaque", true);

        const websearch = termosParaWebsearch(parsedStateBusca.termosLivres);
        if (websearch) {
          query = query.textSearch("search_tsv", websearch, {
            type: "websearch",
            config: "portuguese",
          });
        }

        const { data, error } = await query;
        if (error) throw error;

        let lista = data || [];

        if (destaqueAtivo) lista = lista.filter((a) => isDestaqueTruthy(a.destaque));

        // ✅ garante consistência visual sempre
        lista = sortPremiumLocal(lista);

        if (lista.length === 0 && normalizar(filtros.busca)) {
          const parsedFallback = interpretarBuscaImoveis(filtros.busca);

          const websearch2 = termosParaWebsearch([
            ...(parsedFallback.termosLivres || []),
            ...(parsedFallback.tipo_imovel ? [parsedFallback.tipo_imovel] : []),
            ...(parsedFallback.finalidade ? [parsedFallback.finalidade] : []),
            ...(parsedFallback.cidade ? [parsedFallback.cidade] : []),
          ]);

          let fb = supabase
            .from("anuncios")
            .select("*")
            .eq("categoria", "imoveis")
            .or("status.is.null,status.eq.ativo")
            .order("destaque", { ascending: false })
            .order("prioridade", { ascending: false })
            .order("created_at", { ascending: false });

          if (websearch2.trim()) {
            fb = fb.textSearch("search_tsv", websearch2, {
              type: "websearch",
              config: "portuguese",
            });
          }

          const { data: data2 } = await fb;
          lista = sortPremiumLocal(data2 || []);
        }

        setImoveis(lista);
      } catch (e) {
        console.error("Erro ao carregar imóveis:", e);
        setErro("Não foi possível carregar os imóveis agora.");
      } finally {
        setCarregando(false);
      }
    }

    carregarImoveis();
  }, [filtros]);

  const descricaoFiltro = useMemo(() => {
    const partes = [];

    const lancAtivo = filtros.lancamento === "1" || filtros.lancamento === "true" || filtros.lancamento === "sim";
    if (lancAtivo) partes.push("lançamentos");

    const comVenda = filtros.comercialVenda === "1" || filtros.comercialVenda === "true" || filtros.comercialVenda === "sim";
    if (comVenda) partes.push("comercial (venda)");

    if (filtros.aluguelTipo) partes.push(`aluguel ${normalizar(filtros.aluguelTipo)}`);

    if (filtros.busca) partes.push(`busca: "${filtros.busca}"`);

    if (filtros.finalidade) {
      const f = finalidades.find((x) => x.value === filtros.finalidade);
      if (f) partes.push(f.label.toLowerCase());
    }
    if (filtros.tipoImovel) partes.push(filtros.tipoImovel.toLowerCase());
    if (filtros.cidade) partes.push(`em ${filtros.cidade}`);

    const destAtivo = filtros.destaque === "1" || filtros.destaque === "true" || filtros.destaque === "sim";
    if (destAtivo) partes.push("em destaque");

    if (partes.length === 0) return "Todos os imóveis cadastrados";
    return "Filtrando: " + partes.join(" ") + ".";
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      ...(campo !== "lancamento" ? { lancamento: "" } : {}),
      ...(campo !== "aluguelTipo" ? { aluguelTipo: "" } : {}),
      ...(campo !== "comercialVenda" ? { comercialVenda: "" } : {}),
    }));
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Imóveis – Lista</h1>
        <p className="text-xs md:text-sm text-slate-600 mb-4">{descricaoFiltro}</p>

        <div className="mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-4 items-end">
            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-700">
                Buscar (ex: "casa aluguel maricá", "apartamento temporada saquarema")
              </label>
              <input
                value={filtros.busca}
                onChange={(e) => atualizarFiltro("busca", e.target.value)}
                placeholder="Digite palavras-chave..."
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Finalidade</label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.finalidade}
                onChange={(e) => atualizarFiltro("finalidade", e.target.value)}
              >
                {finalidades.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Tipo de imóvel</label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.tipoImovel}
                onChange={(e) => atualizarFiltro("tipoImovel", e.target.value)}
              >
                <option value="">Todos</option>
                {tiposImovel.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Cidade</label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.cidade}
                onChange={(e) => atualizarFiltro("cidade", e.target.value)}
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
                className="w-full md:w-auto rounded-full bg-slate-900 text-white px-4 py-2 text-xs md:text-sm font-semibold hover:bg-slate-800"
                onClick={() =>
                  setFiltros({
                    finalidade: "",
                    tipoImovel: "",
                    cidade: "",
                    destaque: "",
                    lancamento: "",
                    aluguelTipo: "",
                    comercialVenda: "",
                    busca: "",
                  })
                }
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {erro && (
          <p className="text-xs text-red-600 mb-3 border border-red-100 rounded-md px-3 py-2 bg-red-50">{erro}</p>
        )}

        {carregando ? (
          <p className="text-xs text-slate-500">Carregando imóveis...</p>
        ) : imoveis.length === 0 ? (
          <p className="text-xs text-slate-500">Nenhum imóvel encontrado com esses filtros.</p>
        ) : (
          <div className="grid gap-3">
            {imoveis.map((anuncio) => {
              const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
              const capa = imagens.length > 0 ? imagens[0] : "/imoveis/sem-foto.jpg";

              return (
                <Link
                  key={anuncio.id}
                  href={`/anuncios/${anuncio.id}`}
                  className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition overflow-hidden flex flex-col md:flex-row"
                >
                  <div className="relative w-full md:w-56 h-40 md:h-32 bg-slate-100 overflow-hidden">
                    <img
                      src={capa}
                      alt={anuncio.titulo || "Imóvel"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isDestaqueTruthy(anuncio.destaque) && (
                      <span className="absolute top-2 left-2 rounded-full bg-amber-500 text-[10px] font-semibold text-white px-2 py-1 shadow">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="flex-1 px-3 py-2 md:px-4 md:py-3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">{anuncio.titulo}</h2>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>

                      {(anuncio.finalidade || anuncio.tipo_imovel) && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {anuncio.tipo_imovel ? anuncio.tipo_imovel : ""}
                          {anuncio.tipo_imovel && anuncio.finalidade ? " • " : ""}
                          {finalidadeEhTemporada(anuncio.finalidade) ? "aluguel temporada" : anuncio.finalidade || ""}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {anuncio.preco && <span className="text-xs font-semibold text-emerald-700">{anuncio.preco}</span>}
                      <span className="text-[11px] text-slate-500 group-hover:text-slate-700">Ver detalhes →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ListaImoveisPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-500">Carregando...</div>}>
      <ListaImoveisContent />
    </Suspense>
  );
}
