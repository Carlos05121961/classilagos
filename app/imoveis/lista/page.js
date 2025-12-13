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
  { label: "Aluguel por temporada", value: "temporada" }, // inclui aluguel temporada
];

// ===== helpers =====
function normalizar(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function isDestaqueTruthy(v) {
  if (v === true) return true;
  const s = normalizar(v);
  return s === "true" || s === "1" || s === "sim" || s === "yes";
}

function finalidadeEhTemporada(v) {
  const s = normalizar(v);
  return (
    s === "temporada" ||
    s === "aluguel temporada" ||
    s === "aluguel_temporada" ||
    s === "aluguel-por-temporada"
  );
}

function finalidadeEhAluguel(v) {
  const s = normalizar(v);
  return s === "aluguel" || s === "aluguel fixo" || s === "aluguel_fixo";
}

const TIPOS_COMERCIAIS = ["Comercial", "Loja / Sala", "Galpão"];

function ListaImoveisContent() {
  const searchParams = useSearchParams();

  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // ===== lê sempre da URL (sempre que mudar) =====
  const filtrosUrl = useMemo(() => {
    const finalidade = searchParams.get("finalidade") || "";
    const tipoImovel = searchParams.get("tipo_imovel") || searchParams.get("tipo") || "";
    const cidade = searchParams.get("cidade") || "";
    const destaque = searchParams.get("destaque") || "";
    const lancamento = searchParams.get("lancamento") || "";

    // novos:
    const aluguelTipo = searchParams.get("aluguel_tipo") || ""; // residencial | comercial
    const comercialVenda = searchParams.get("comercial_venda") || ""; // 1 | true | sim

    return { finalidade, tipoImovel, cidade, destaque, lancamento, aluguelTipo, comercialVenda };
  }, [searchParams]);

  // ===== estado editável dos selects =====
  const [filtros, setFiltros] = useState({
    finalidade: "",
    tipoImovel: "",
    cidade: "",
    destaque: "",
    lancamento: "",
    aluguelTipo: "",
    comercialVenda: "",
  });

  // sincroniza estado quando URL muda (isso impede “ficar preso” no filtro anterior)
  useEffect(() => {
    setFiltros(filtrosUrl);
  }, [filtrosUrl]);

  // Busca imóveis sempre que filtros mudarem
  useEffect(() => {
    async function carregarImoveis() {
      try {
        setCarregando(true);
        setErro("");

        let query = supabase.from("anuncios").select("*").eq("categoria", "imoveis");

        // ===== regra: Lançamentos =====
        const lancamentoAtivo =
          filtros.lancamento === "1" || filtros.lancamento === "true" || filtros.lancamento === "sim";

        if (lancamentoAtivo) {
          // pega "lançamento" ou "lancamento"
          query = query
            .or("titulo.ilike.%lan%C3%A7%,titulo.ilike.%lancamento%,descricao.ilike.%lan%C3%A7%,descricao.ilike.%lancamento%")
            .order("created_at", { ascending: false });
        } else {
          // padrão do site: destaque primeiro
          query = query.order("destaque", { ascending: false }).order("created_at", { ascending: false });
        }

        // ===== regra: Comercial Venda (grupo) =====
        const comercialVendaAtivo =
          filtros.comercialVenda === "1" ||
          filtros.comercialVenda === "true" ||
          filtros.comercialVenda === "sim";

        if (comercialVendaAtivo) {
          query = query.eq("finalidade", "venda").in("tipo_imovel", TIPOS_COMERCIAIS);
        } else {
          // ===== regra: aluguel_tipo =====
          const aluguelTipo = normalizar(filtros.aluguelTipo);

          if (aluguelTipo === "residencial") {
            // aluguel residencial = aluguel (não temporada) e NÃO comercial
            query = query.or("finalidade.eq.aluguel,finalidade.eq.aluguel fixo,finalidade.eq.aluguel_fixo");
            query = query.not("tipo_imovel", "in", `(${TIPOS_COMERCIAIS.join(",")})`);
          }

          if (aluguelTipo === "comercial") {
            // aluguel comercial = aluguel (não temporada) e tipos comerciais
            query = query.or("finalidade.eq.aluguel,finalidade.eq.aluguel fixo,finalidade.eq.aluguel_fixo");
            query = query.in("tipo_imovel", TIPOS_COMERCIAIS);
          }

          // ===== filtros normais =====
          if (filtros.finalidade) {
            const f = normalizar(filtros.finalidade);

            if (f === "temporada" || f === "aluguel temporada") {
              query = query.or(
                "finalidade.eq.temporada,finalidade.eq.aluguel temporada,finalidade.eq.aluguel_temporada,finalidade.eq.aluguel-por-temporada"
              );
            } else if (f === "aluguel") {
              query = query.or("finalidade.eq.aluguel,finalidade.eq.aluguel fixo,finalidade.eq.aluguel_fixo");
            } else {
              query = query.eq("finalidade", filtros.finalidade);
            }
          }

          if (filtros.tipoImovel) query = query.eq("tipo_imovel", filtros.tipoImovel);
          if (filtros.cidade) query = query.eq("cidade", filtros.cidade);
        }

        // Destaque (robusto)
        const destaqueAtivo =
          filtros.destaque === "1" || filtros.destaque === "true" || filtros.destaque === "sim";

        if (destaqueAtivo) {
          query = query.or(
            "destaque.eq.true,destaque.eq.TRUE,destaque.eq.1,destaque.eq.sim,destaque.eq.Sim,destaque.eq.true"
          );
        }

        const { data, error } = await query;
        if (error) throw error;

        let lista = data || [];

        // reforço JS (pra não depender 100% do tipo do campo)
        if (destaqueAtivo) lista = lista.filter((a) => isDestaqueTruthy(a.destaque));

        if (normalizar(filtros.finalidade) === "temporada" || normalizar(filtros.finalidade) === "aluguel temporada") {
          lista = lista.filter((a) => finalidadeEhTemporada(a.finalidade));
        }
        if (normalizar(filtros.finalidade) === "aluguel") {
          lista = lista.filter((a) => finalidadeEhAluguel(a.finalidade));
        }

        // reforço do aluguel_tipo via JS
        if (normalizar(filtros.aluguelTipo) === "residencial") {
          lista = lista.filter(
            (a) => finalidadeEhAluguel(a.finalidade) && !TIPOS_COMERCIAIS.includes(a.tipo_imovel)
          );
        }
        if (normalizar(filtros.aluguelTipo) === "comercial") {
          lista = lista.filter(
            (a) => finalidadeEhAluguel(a.finalidade) && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
          );
        }

        // reforço do comercial_venda via JS
        const comercialVendaAtivo2 =
          filtros.comercialVenda === "1" ||
          filtros.comercialVenda === "true" ||
          filtros.comercialVenda === "sim";

        if (comercialVendaAtivo2) {
          lista = lista.filter(
            (a) => normalizar(a.finalidade) === "venda" && TIPOS_COMERCIAIS.includes(a.tipo_imovel)
          );
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
      // se mexer manual, zera “atalhos” especiais
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

        {/* FILTROS RÁPIDOS */}
        <div className="mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-4 items-end">
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
                  })
                }
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {/* LISTA */}
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

