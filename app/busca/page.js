"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

function BuscaContent() {
  const searchParams = useSearchParams();

  const termo = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "";
  const cidade = searchParams.get("cidade") || "";

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscar() {
      setLoading(true);

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
        const termoLower = termo.toLowerCase();

        // TIPO DE IMÓVEL
        if (termoLower.includes("casa")) {
          query = query.eq("tipo_imovel", "Casa");
        }
        if (termoLower.includes("apartamento")) {
          query = query.eq("tipo_imovel", "Apartamento");
        }
        if (termoLower.includes("terreno")) {
          query = query.eq("tipo_imovel", "Terreno");
        }

        // FINALIDADE
    if (termoLower.includes("temporada")) {
  query = query.ilike("finalidade", "%temporada%");
}

if (termoLower.includes("aluguel")) {
  query = query.ilike("finalidade", "%aluguel%");
}

if (
  termoLower.includes("venda") ||
  termoLower.includes("comprar")
) {
  query = query.ilike("finalidade", "%venda%");
}

      // TEXTO LIVRE (título + descrição)
      if (termo) {
        query = query.or(
          `titulo.ilike.%${termo}%,descricao.ilike.%${termo}%`
        );
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (!error && data) {
        setResultados(data);
      } else {
        setResultados([]);
      }

      setLoading(false);
    }

    buscar();
  }, [termo, categoria, cidade]);

  return (
    <main className="bg-slate-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-white text-xl font-bold mb-4">
          Resultado da busca
        </h1>

        {loading && (
          <p className="text-slate-300 text-sm">Carregando...</p>
        )}

        {!loading && resultados.length === 0 && (
          <p className="text-slate-300 text-sm">
            Nenhum resultado encontrado.
          </p>
        )}

        {!loading && resultados.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((item) => (
              <Link
                key={item.id}
                href={`/anuncios/${item.id}`}
                className="border border-white/20 rounded-2xl p-4 hover:bg-white/5 transition"
              >
                <h2 className="text-white font-semibold text-sm mb-1">
                  {item.titulo}
                </h2>
                <p className="text-slate-300 text-xs">
                  {item.categoria} • {item.cidade}
                </p>

                {item.finalidade && (
                  <p className="text-slate-400 text-xs mt-1">
                    {item.finalidade}
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

