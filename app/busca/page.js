"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

function BuscaPage() {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "";
  const cidade = searchParams.get("cidade") || "";

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscar() {
      setLoading(true);

      let query = supabase
        .from("anuncios")
        .select("*")
        .eq("status", "ativo");

      if (categoria) {
        query = query.eq("categoria", categoria);
      }

      if (cidade) {
        query = query.eq("cidade", cidade);
      }

      if (q) {
        query = query.or(
          `titulo.ilike.%${q}%,descricao.ilike.%${q}%,area_profissional.ilike.%${q}%`
        );
      }

      const { data, error } = await query
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error) {
        setResultados(data || []);
      }

      setLoading(false);
    }

    buscar();
  }, [q, categoria, cidade]);

  return (
    <main className="min-h-screen bg-white pb-10">
      {/* TOPO */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-lg md:text-xl font-bold text-slate-900">
            Resultados da busca
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {q && <>Busca por <strong>{q}</strong></>}
            {categoria && <> • Categoria: <strong>{categoria}</strong></>}
            {cidade && <> • Cidade: <strong>{cidade}</strong></>}
          </p>
        </div>
      </section>

      {/* BANNER TOPO (gancho para Opção C) */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 h-[120px] flex items-center justify-center text-xs text-slate-500">
          Banner patrocinado (em breve por cidade)
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="max-w-6xl mx-auto px-4">
        {loading && (
          <p className="text-sm text-slate-500">Buscando anúncios...</p>
        )}

        {!loading && resultados.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhum anúncio encontrado para os filtros selecionados.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((item) => {
            const imagens = Array.isArray(item.imagens) ? item.imagens : [];
            const thumb = imagens.length > 0 ? imagens[0] : null;

            return (
              <Link
                key={item.id}
                href={`/anuncios/${item.id}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="h-36 bg-slate-200 flex items-center justify-center overflow-hidden">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Sem imagem
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-1">
                  {item.destaque && (
                    <span className="text-[10px] uppercase font-semibold text-emerald-600">
                      Destaque
                    </span>
                  )}
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {item.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    {item.cidade}
                    {item.bairro ? ` • ${item.bairro}` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

// Função para envolver com Suspense Boundary
export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <BuscaPage />
    </Suspense>
  );
}
