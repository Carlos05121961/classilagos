"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

function normalizar(txt = "") {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detectarTipoImovel(termoNorm) {
  if (termoNorm.includes("apartamento") || termoNorm.includes("apto")) {
    return "Apartamento";
  }
  if (termoNorm.includes("casa")) return "Casa";
  if (termoNorm.includes("terreno") || termoNorm.includes("lote")) {
    return "Terreno";
  }
  return ""; // sem filtro de tipo
}

function detectarFinalidadeImovel(termoNorm) {
  // Regras:
  // - "temporada" => Aluguel temporada
  // - "aluguel" => Aluguel (mas se tiver temporada, já cai no caso acima)
  // - "venda" / "comprar" => Venda
  if (termoNorm.includes("temporada")) return "Aluguel temporada";
  if (termoNorm.includes("aluguel") || termoNorm.includes("alugar"))
    return "Aluguel";
  if (termoNorm.includes("venda") || termoNorm.includes("comprar"))
    return "Venda";
  return ""; // sem filtro de finalidade
}

function BuscaContent() {
  const searchParams = useSearchParams();

  const termo = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "";
  const cidade = searchParams.get("cidade") || "";

  const termoNorm = useMemo(() => normalizar(termo), [termo]);

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscar() {
      setLoading(true);
      setErro("");

      try {
        let query = supabase.from("anuncios").select("*");

        // CATEGORIA
        if (categoria) {
          query = query.eq("categoria", categoria);
        }

        // CIDADE
        if (cidade && cidade !== "Toda a região") {
          query = query.eq("cidade", cidade);
        }

        // ===== REFINO ESPECÍFICO PARA IMÓVEIS =====
        if (categoria === "imoveis") {
          const tipoImovel = detectarTipoImovel(termoNorm);
          const finalidade = detectarFinalidadeImovel(termoNorm);

          // Tipo do imóvel (se o termo indicar)
          if (tipoImovel) {
            query = query.eq("tipo_imovel", tipoImovel);
          }

          // Finalidade (se o termo indicar)
          // Como no seu formulário é EXATO: Venda / Aluguel / Aluguel temporada
          if (finalidade) {
            query = query.eq("finalidade", finalidade);
          }
        }

        // TEXTO LIVRE (título + descrição)
        // Importante: não atrapalhar buscas tipo "casa" / "apartamento"
        // então só aplica OR quando tiver termo de verdade.
        if (termoNorm) {
          const termoOriginal = termo.trim();
          query = query.or(
            `titulo.ilike.%${termoOriginal}%,descricao.ilike.%${termoOriginal}%`
          );
        }

        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error("Erro busca:", error);
          setErro(error.message || "Erro inesperado na busca.");
          setResultados([]);
        } else {
          setResultados(data || []);
        }
      } catch (e) {
        console.error(e);
        setErro(e?.message || "Erro inesperado na busca.");
        setResultados([]);
      }

      setLoading(false);
    }

    buscar();
  }, [termo, termoNorm, categoria, cidade]);

  return (
    <main className="bg-slate-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-white text-xl font-bold mb-4">Resultado da busca</h1>

        {/* chips simples de contexto */}
        <div className="mb-5 flex flex-wrap gap-2 text-[11px]">
          {termo && (
            <span className="rounded-full border border-white/15 px-3 py-1 text-white/80">
              Texto: <strong className="text-white">{termo}</strong>
            </span>
          )}
          {categoria && (
            <span className="rounded-full border border-white/15 px-3 py-1 text-white/80">
              Categoria: <strong className="text-white">{categoria}</strong>
            </span>
          )}
          {cidade && (
            <span className="rounded-full border border-white/15 px-3 py-1 text-white/80">
              Cidade: <strong className="text-white">{cidade}</strong>
            </span>
          )}
        </div>

        {erro && (
          <p className="text-red-200 text-sm border border-red-400/20 bg-red-500/10 rounded-xl px-4 py-3 mb-4">
            {erro}
          </p>
        )}

        {loading && <p className="text-slate-300 text-sm">Carregando...</p>}

        {!loading && resultados.length === 0 && (
          <p className="text-slate-300 text-sm">Nenhum resultado encontrado.</p>
        )}

        {!loading && resultados.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((item) => (
              <Link
                key={item.id}
                href={`/anuncios/${item.id}`}
                className="border border-white/15 rounded-2xl p-4 hover:bg-white/5 transition"
              >
                <h2 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {item.titulo}
                </h2>

                <p className="text-slate-300 text-xs">
                  {item.categoria} • {item.cidade}
                </p>

                {/* Imóveis: mostrar tipo/finalidade quando existir */}
                {(item.tipo_imovel || item.finalidade) && (
                  <p className="text-slate-400 text-xs mt-2">
                    {item.tipo_imovel ? `Tipo: ${item.tipo_imovel}` : ""}
                    {item.tipo_imovel && item.finalidade ? " • " : ""}
                    {item.finalidade ? `Finalidade: ${item.finalidade}` : ""}
                  </p>
                )}

                {item.preco && (
                  <p className="text-white text-xs font-semibold mt-2">
                    R$ {item.preco}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="text-white p-6">Carregando…</div>}>
      <BuscaContent />
    </Suspense>
  );
}

