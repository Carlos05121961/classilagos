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

const tiposEmbarcacao = [
  "Lancha",
  "Veleiro",
  "Jetski",
  "Barco de pesca",
  "Stand-up / Caiaque",
  "Vaga em marina",
  "Serviços náuticos",
  "Outros",
];

const finalidades = [
  { label: "Qualquer", value: "" },
  { label: "Venda", value: "venda" },
  { label: "Aluguel", value: "aluguel" },
  { label: "Passeio", value: "passeio" },
];

export default function ListaNauticaPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtros, setFiltros] = useState({
    finalidade: "",
    tipo: "",
    cidade: "",
  });

  // Ler query params da URL (sem useSearchParams)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const finalidade =
      (params.get("finalidade") || "").toLowerCase() || "";
    const tipo = params.get("tipo") || "";
    const cidade = params.get("cidade") || "";

    setFiltros({ finalidade, tipo, cidade });
  }, []);

  // Buscar anúncios quando filtros mudarem
  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro("");

        let query = supabase
          .from("anuncios")
          .select(
            "id, titulo, cidade, bairro, preco, imagens, tipo_imovel, finalidade, subcategoria_nautica, finalidade_nautica"
          )
          .eq("categoria", "nautica")
          .eq("status", "ativo")
          .order("destaque", { ascending: false })
          .order("created_at", { ascending: false });

        if (filtros.finalidade) {
          // tenta filtrar tanto por finalidade "genérica" quanto por finalidade_nautica
          query = query.or(
            `finalidade.eq.${filtros.finalidade},finalidade_nautica.eq.${filtros.finalidade}`
          );
        }

        if (filtros.tipo) {
          query = query.eq("tipo_imovel", filtros.tipo);
        }

        if (filtros.cidade) {
          query = query.eq("cidade", filtros.cidade);
        }

        const { data, error } = await query;

        if (error) throw error;
        setAnuncios(data || []);
      } catch (e) {
        console.error("Erro ao carregar náutica:", e);
        setErro("Não foi possível carregar os anúncios agora.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [filtros]);

  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  const descricaoFiltro = (() => {
    const partes = [];
    if (filtros.finalidade) {
      const f = finalidades.find((x) => x.value === filtros.finalidade);
      if (f) partes.push(f.label.toLowerCase());
    }
    if (filtros.tipo) partes.push(filtros.tipo.toLowerCase());
    if (filtros.cidade) partes.push(`em ${filtros.cidade}`);
    if (partes.length === 0) return "Todos os anúncios de náutica cadastrados";
    return "Filtrando: " + partes.join(" ") + ".";
  })();

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
          Náutica – Lista de anúncios
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mb-1">
          Anúncios publicados pelos usuários em toda a Região dos Lagos.
        </p>
        <p className="text-[11px] md:text-xs text-slate-500 mb-4">
          {descricaoFiltro}
        </p>

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
                onChange={(e) =>
                  atualizarFiltro("finalidade", e.target.value.toLowerCase())
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
                Tipo de embarcação
              </label>
              <select
                className="mt-1 w-full border rounded-full px-3 py-2 text-xs md:text-sm bg-white text-slate-900"
                value={filtros.tipo}
                onChange={(e) => atualizarFiltro("tipo", e.target.value)}
              >
                <option value="">Todas</option>
                {tiposEmbarcacao.map((t) => (
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
                  setFiltros({ finalidade: "", tipo: "", cidade: "" })
                }
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {/* LISTA DE ANÚNCIOS */}
        {erro && (
          <p className="text-xs text-red-600 mb-3 border border-red-100 rounded-md px-3 py-2 bg-red-50">
            {erro}
          </p>
        )}

        {carregando ? (
          <p className="text-xs text-slate-500">Carregando anúncios...</p>
        ) : anuncios.length === 0 ? (
          <p className="text-xs text-slate-500">
            Nenhum anúncio encontrado com esses filtros.
          </p>
        ) : (
          <div className="grid gap-3">
            {anuncios.map((item) => {
              const imagens = Array.isArray(item.imagens)
                ? item.imagens
                : [];
              const capa =
                imagens.length > 0 ? imagens[0] : "/nautica/sem-foto.jpg";

              const finalidadeLabel =
                (item.finalidade_nautica || item.finalidade || "") ?? "";

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Imagem */}
                  <div className="relative w-full md:w-56 h-40 md:h-32 bg-slate-100 overflow-hidden">
                    <img
                      src={capa}
                      alt={item.titulo || "Embarcação"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Texto */}
                  <div className="flex-1 px-3 py-2 md:px-4 md:py-3 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {item.titulo}
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-600">
                        {item.cidade}
                        {item.bairro ? ` • ${item.bairro}` : ""}
                      </p>
                      {(item.tipo_imovel || finalidadeLabel) && (
                        <p className="mt-1 text-[11px] text-slate-500">
                          {item.tipo_imovel}
                          {finalidadeLabel
                            ? ` • ${finalidadeLabel.toLowerCase()}`
                            : ""}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {item.preco && (
                        <span className="text-xs font-semibold text-emerald-700">
                          {item.preco}
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
