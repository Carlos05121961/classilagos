"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";

function BuscaContent() {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const categoria = searchParams.get("categoria") || "";
  const cidade = searchParams.get("cidade") || "";

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscar() {
      setLoading(true);

      let query = supabase.from("anuncios").select("*");

      if (q) query = query.ilike("titulo", `%${q}%`);
      if (categoria && categoria !== "todas")
        query = query.eq("categoria", categoria);
      if (cidade && cidade !== "todas")
        query = query.eq("cidade", cidade);

      const { data } = await query.order("created_at", {
        ascending: false,
      });

      setResultados(data || []);
      setLoading(false);
    }

    buscar();
  }, [q, categoria, cidade]);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-lg font-bold mb-4">Resultado da busca</h1>

      {resultados.length === 0 ? (
        <p>Nenhum resultado encontrado.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((item) => (
            <Link
              key={item.id}
              href={`/anuncios/${item.id}`}
              className="border rounded-xl p-4 hover:shadow"
            >
              <h2 className="font-semibold">{item.titulo}</h2>
              <p className="text-xs text-slate-600">
                {item.categoria} • {item.cidade}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<p className="p-6">Carregando...</p>}>
      <BuscaContent />
    </Suspense>
  );
}

