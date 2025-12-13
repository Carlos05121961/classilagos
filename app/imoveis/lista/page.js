"use client";

import { useEffect, useState } from "react";
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

const finalidades = [
  { label: "Qualquer", value: "" },
  { label: "Venda", value: "venda" },
  { label: "Aluguel", value: "aluguel" },
  { label: "Temporada", value: "temporada" }, // temporarada (inclui aluguel temporada)
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
  return s === "temporada" || s === "aluguel temporada" || s === "aluguel_temporada";
}

function finalidadeEhAluguel(v) {
  const s = normalizar(v);
  // aluguel (fixo) ou similares
  return s === "aluguel" || s === "aluguel fixo" || s === "aluguel_fixo";
}

export default function ListaImoveisPage() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtros, setFiltros] = useState({
    finalidade: "",
    tipoImovel: "",
    cidade: "",
    destaque: "",
    lancamento: "", // novo: quando vier do card "Lançamentos"
  });

  // Lê query params da URL no navegador (sem useSearchParams)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const finalidade = params.get("finalidade") || "";
    const tipoImovel = params.get("tipo_imovel") || params.get("tipo") || "";
    const cidade = params.get("cidade") || "";
    const destaque = params.get("destaque") || "";
    const lancamento = params.get("lancamento") || "";

    setFiltros({ finalidade, tipoImovel, cidade, destaque, lancamento });
  }, []);

  // Busca imóveis sempre que os filtros mudarem
  useEffect(() => {
    async function carregarImoveis() {
      try {
        setCarregando(true);
        setErro("");

        let query = supabase
          .from("anuncios")
          .select("*")
          .eq("categoria", "imoveis");

        // ===== regra: Lançamentos =====
        // Se vier ?lancamento=1, prioriza "título contém lançamento" e ordena por data (sem destaque na frente)
        const lancamentoAtivo =
          filtros.lancamento === "1" ||
          filtros.lancamento === "true" ||
          filtros.lancamento === "sim";

        if (lancamentoAtivo) {
          query = query
            .ilike("titulo", "%lan%") // pega "lançamento" ou "lancamento"
            .order("created_at", { ascending: false });
        } else {
          // padrão do site: destaque primeiro
          query = query
            .order("destaque", { ascending: false })
            .order("created_at", { ascending: false });
        }

        // ===== filtros =====
        if (filtros.finalidade) {
          const f = normalizar(filtros.finalidade);

          // Temporada: incluir "temporada" e "aluguel temporada"
          if (f === "temporada") {
            query = query.or(
              "finalidade.eq.temporada,finalidade.eq.aluguel temporada,finalidade.eq.aluguel_temporada"
            );
          }
          // Aluguel: só aluguel (não temporada)
          else if (f === "aluguel") {
            query = query.or(
              "finalidade.eq.aluguel,finalidade.eq.aluguel fixo,finalidade.eq.aluguel_fixo"
            );
          }
          // outros: comparação direta
          else {
            query = query.eq("finalidade", filtros.finalidade);
          }
        }

        if (filtros.tipoImovel) {
          query = query.eq("tipo_imovel", filtros.tipoImovel);
        }
        if (filtros.cidade) {
          query = query.eq("cidade", filtros.cidade);
        }

        // Destaque (robusto para boolean OU texto)
        const destaqueAtivo =
          filtros.destaque === "1" ||
          filtros.destaque === "true" ||
          filtros.destaque === "sim";

        if (destaqueAtivo) {
          query = query.or(
            "destaque.eq.true,destaque.eq.TRUE,destaque.eq.1,destaque.eq.sim,destaque.eq.Sim,destaque.eq.true"
          );
        }

        const { data, error } = await query;
        if (error) throw error;

        // Segurança extra: se veio "destaque=1" e o banco tiver formatos diferentes, filtra no JS também
        let lista = data || [];
        if (destaqueAtivo) {
          lista = lista.filter((a) => isDestaqueTruthy(a.destaque));
        }

        // Se filtro de finalidade=temporada, garante no JS também (caso o OR não pegue por tipo do campo)
        if (normalizar(filtros.finalidade) === "temporada") {
          lista = lista.filter((a) => finalidadeEhTemporada(a.finalidade));
        }
        if (normalizar(filtros.finalidade) === "aluguel") {
          lista = lista.filter((a) => finalidadeEhAluguel(a.finalidade));
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

  const descricaoFiltro = (() => {
    const partes = [];
    if (filtros.lancamento && (filtros.lancamento === "1" || filtros.lancamento === "true" || filtros.lancamento === "sim")) {
      partes.push("lançamentos");
    }
    if (filtros.finalidade) {
      const f = finalidades.find((x) => x.value === filtros.finalidade);
      if (f) partes.push(f.label.toLowerCase());
    }
    if (filtros.tipoImovel) partes.push(filtros.tipoImovel.toLowerCase());
    if (filtros.cidade) partes.push(`em ${filtros.cidade}`);
    if (filtros.destaque && (filtros.destaque === "1" || filtros.destaque === "true" || filtros.destaque === "sim")) {
      partes.push("em destaque");
    }
    if (partes.length === 0) return "Todos os imóveis cadastrados";
    return "Filtrando: " + partes.join(" ") + ".";
  })();

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      // Se o usuário mexer em filtros manuais, desliga "lancamento" automático
      ...(campo !== "lancamento" ? { lancamento: "" } : {}),
    }));
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
          Imóveis – Lista
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mb-4">{descricaoFiltro}</p>

        {/* FILTROS RÁPIDOS */}
        <div className="mb-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-4 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700">
                Finalidade
              </label>
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
                  })
                }
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {/* LISTA DE IMÓVEIS */}
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
              const capa = imagens.length > 0 ? imagens[0] : "/imoveis/sem-foto.jpg";

              return (
                <Link
                  key={anuncio.id}
                  href={`/anuncios/${anuncio.id}`}
                  className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Imagem */}
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

                  {/* Texto */}
                  <div className="flex-1 px-3 py-2 md:px-4 md:py-3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {anuncio.titulo}
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {anuncio.cidade}
                        {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                      </p>
                      {(anuncio.finalidade || anuncio.tipo_imovel) && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {anuncio.tipo_imovel ? anuncio.tipo_imovel : ""}
                          {anuncio.tipo_imovel && anuncio.finalidade ? " • " : ""}
                          {finalidadeEhTemporada(anuncio.finalidade)
                            ? "aluguel temporada"
                            : anuncio.finalidade || ""}
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

