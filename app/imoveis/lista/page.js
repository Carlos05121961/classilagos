"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

// Padrão do banco agora: "venda" | "aluguel" | "aluguel temporada"
const finalidades = [
  { label: "Qualquer", value: "" },
  { label: "Venda", value: "venda" },
  { label: "Aluguel", value: "aluguel" },
  { label: "Temporada", value: "aluguel temporada" },
];

function normaliza(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizarFinalidade(v) {
  if (!v) return "";
  const s = normaliza(v);
  if (s === "temporada") return "aluguel temporada"; // compat com links antigos
  if (s === "aluguel por temporada") return "aluguel temporada";
  return v;
}

// Detecta finalidade a partir do texto digitado
function extrairFinalidadeDaBusca(busca) {
  const t = normaliza(busca);

  // temporada
  if (t.includes("temporada") || t.includes("por temporada")) {
    return "aluguel temporada";
  }

  // aluguel (mas não temporada)
  if (t.includes("aluguel") || t.includes("alugar")) {
    return "aluguel";
  }

  // venda
  if (t.includes("venda") || t.includes("comprar") || t.includes("vende")) {
    return "venda";
  }

  return "";
}

// remove palavras de finalidade do texto, pra melhorar o FTS
function limparBusca(busca) {
  let q = String(busca || "");
  q = q.replace(/aluguel por temporada/gi, "");
  q = q.replace(/\bpor temporada\b/gi, "");
  q = q.replace(/\btemporada\b/gi, "");
  q = q.replace(/\baluguel\b/gi, "");
  q = q.replace(/\balugar\b/gi, "");
  q = q.replace(/\bvenda\b/gi, "");
  q = q.replace(/\bcomprar\b/gi, "");
  q = q.replace(/\bvende\b/gi, "");
  q = q.replace(/\s+/g, " ").trim();
  return q;
}

export default function ListaImoveisPage() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtros, setFiltros] = useState({
    busca: "",
    finalidade: "",
    tipoImovel: "",
    cidade: "",
    destaque: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const busca = params.get("q") || params.get("busca") || "";
    const finalidadeRaw = params.get("finalidade") || "";
    const finalidade = normalizarFinalidade(finalidadeRaw);

    const tipoImovel = params.get("tipo_imovel") || params.get("tipo") || "";
    const cidade = params.get("cidade") || "";
    const destaque = params.get("destaque") || "";

    setFiltros({ busca, finalidade, tipoImovel, cidade, destaque });
  }, []);

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setCarregando(true);
        setErro("");

        // Se o usuário não escolheu finalidade no select,
        // tentamos inferir pela busca (aluguel/temporada/venda)
        const finInferida = !filtros.finalidade
          ? extrairFinalidadeDaBusca(filtros.busca)
          : "";

        const finFinal = filtros.finalidade || finInferida;

        const qLimpa = limparBusca(filtros.busca);

        const { data, error } = await supabase.rpc("buscar_anuncios", {
          q: qLimpa ? qLimpa : null,
          cat: "imoveis",
          cid: filtros.cidade ? filtros.cidade : null,
          fin: finFinal ? finFinal : null,
          lim: 300,
          off: 0,
        });

        if (error) throw error;

        let lista = Array.isArray(data) ? data : [];

        if (filtros.tipoImovel) {
          lista = lista.filter((x) => x.tipo_imovel === filtros.tipoImovel);
        }

        if (
          filtros.destaque === "1" ||
          filtros.destaque === "true" ||
          filtros.destaque === "sim"
        ) {
          lista = lista.filter((x) => x.destaque === true);
        }

        // Destaque primeiro, depois rank, depois data
        lista.sort((a, b) => {
          const ad = a?.destaque ? 1 : 0;
          const bd = b?.destaque ? 1 : 0;
          if (bd !== ad) return bd - ad;

          const ar = typeof a?.rank === "number" ? a.rank : 0;
          const br = typeof b?.rank === "number" ? b.rank : 0;
          if (br !== ar) return br - ar;

          const at = new Date(a?.created_at || 0).getTime();
          const bt = new Date(b?.created_at || 0).getTime();
          return bt - at;
        });

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
    if (filtros.busca) partes.push(`"${filtros.busca}"`);

    if (filtros.finalidade) {
      const f = finalidades.find((x) => x.value === filtros.finalidade);
      if (f) partes.push(f.label.toLowerCase());
    } else {
      const finInferida = extrairFinalidadeDaBusca(filtros.busca);
      if (finInferida) {
        const f = finalidades.find((x) => x.value === finInferida);
        if (f) partes.push(f.label.toLowerCase());
      }
    }

    if (filtros.tipoImovel) partes.push(filtros.tipoImovel.toLowerCase());
    if (filtros.cidade) partes.push(`em ${filtros.cidade}`);

    if (
      filtros.destaque === "1" ||
      filtros.destaque === "true" ||
      filtros.destaque === "sim"
    ) {
      partes.push("em destaque");
    }

    if (partes.length === 0) return "Todos os imóveis cadastrados";
    return "Filtrando: " + partes.join(" ") + ".";
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
          Imóveis – Lista
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mb-4">
          {descricaoFiltro}
        </p>

        <div className="mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-5 items-end">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700">
                Busca
              </label>
              <input
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                placeholder='Ex: "casa aluguel", "apartamento temporada saquarema"...'
                value={filtros.busca}
                onChange={(e) => atualizarFiltro("busca", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Finalidade
              </label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.finalidade}
                onChange={(e) =>
                  atualizarFiltro("finalidade", normalizarFinalidade(e.target.value))
                }
              >
                {finalidades.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Tipo de imóvel
              </label>
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
              <label className="block text-[11px] font-semibold text-slate-700">
                Cidade
              </label>
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

            <div className="flex justify-end md:col-span-5">
              <button
                type="button"
                className="w-full md:w-auto rounded-full bg-slate-900 text-white px-4 py-2 text-xs md:text-sm font-semibold hover:bg-slate-800"
                onClick={() =>
                  setFiltros({
                    busca: "",
                    finalidade: "",
                    tipoImovel: "",
                    cidade: "",
                    destaque: "",
                  })
                }
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {erro && (
          <p className="text-xs text-red-600 mb-3 border border-red-100 rounded-md px-3 py-2 bg-red-50">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="text-xs text-slate-500">Carregando imóveis...</p>
        ) : imoveis.length === 0 ? (
          <p className="text-xs text-slate-500">
            Nenhum imóvel encontrado com esses filtros.
          </p>
        ) : (
          <div className="grid gap-3">
            {imoveis.map((anuncio) => {
           const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
const capa =
  imagens.find((x) => typeof x === "string" && x.trim().length > 0) ||
  "/imoveis/sem-foto.jpg";

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
                    {anuncio.destaque && (
                      <span className="absolute top-2 left-2 rounded-full bg-amber-500 text-[10px] font-semibold text-white px-2 py-1 shadow">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="flex-1 px-3 py-2 md:px-4 md:py-3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>
                      {anuncio.finalidade && anuncio.tipo_imovel && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {anuncio.tipo_imovel} • {anuncio.finalidade}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {anuncio.preco && (
                        <span className="text-xs font-semibold text-emerald-700">
                          {anuncio.preco}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 group-hover:text-slate-700">
                        Ver detalhes →
                      </span>
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
