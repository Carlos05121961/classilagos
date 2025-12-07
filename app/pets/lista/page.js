"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabaseClient";

// Componente que usa useSearchParams (precisa ficar separado)
function ListaPetsContent() {
  const params = useSearchParams();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTROS CAPTURADOS DA URL
  const tipo = params.get("tipo") || "";
  const subcategoria = params.get("subcategoria") || "";

  // TÍTULO DA PÁGINA
  let tituloPagina = "Anúncios de pets";

  if (subcategoria) {
    tituloPagina = `Pets — ${subcategoria}`;
  } else if (tipo) {
    tituloPagina = `Pets — ${tipo}`;
  }

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);

      let query = supabase
        .from("anuncios")
        .select(
          `
          id,
          titulo,
          cidade,
          bairro,
          preco,
          imagens,
          subcategoria_pet,
          tipo_pet,
          tipo_imovel,
          categoria,
          status,
          created_at
        `
        )
        // categoria "pets" ou "Pets", etc (case-insensitive)
        .ilike("categoria", "pets")
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao carregar anúncios de pets:", error);
        setAnuncios([]);
        setLoading(false);
        return;
      }

      let filtrados = data || [];
      const norm = (s) => (s || "").toLowerCase();

      // Filtro por subcategoria vinda da URL (exato ou contendo)
      if (subcategoria) {
        const s = subcategoria.toLowerCase();
        filtrados = filtrados.filter((a) =>
          norm(a.subcategoria_pet).includes(s)
        );
      }

      // Se no futuro você usar ?tipo=Animais, etc:
      if (tipo) {
        const t = tipo.toLowerCase();
        filtrados = filtrados.filter((a) => {
          return (
            norm(a.tipo_pet).includes(t) ||
            norm(a.tipo_imovel).includes(t) ||
            norm(a.subcategoria_pet).includes(t)
          );
        });
      }

      setAnuncios(filtrados);
      setLoading(false);
    };

    carregar();
  }, [tipo, subcategoria]);

  return (
    <main className="bg-white min-h-screen">
      {/* TOPO */}
      <section className="border-b bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">
              Classilagos &gt; Pets
            </p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {tituloPagina}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Animais, acessórios, serviços pet e muito mais na Região dos
              Lagos.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <Link href="/pets" className="text-xs text-slate-600 underline">
              &larr; Voltar para Pets
            </Link>
            <Link
              href="/anunciar?tipo=pets"
              className="inline-flex mt-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Anunciar para pets
            </Link>
          </div>
        </div>
      </section>

      {/* LISTA DE ANÚNCIOS */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="h-28 md:h-32 bg-slate-200 animate-pulse" />
                <div className="bg-slate-900 text-white text-xs px-3 py-2">
                  Carregando...
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && anuncios.length === 0 && (
          <div className="text-center py-10 text-sm text-slate-600">
            Nenhum anúncio encontrado.
            <div className="mt-4">
              <Link className="text-blue-600 underline" href="/pets">
                Voltar para Pets
              </Link>
            </div>
          </div>
        )}

        {!loading && anuncios.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anuncios.map((item) => {
              const img =
                Array.isArray(item.imagens) && item.imagens.length > 0
                  ? item.imagens[0]
                  : null;

              return (
                <Link
                  key={item.id}
                  href={`/anuncios/${item.id}`}
                  className="group overflow-hidden rounded-2xl shadow border border-slate-200 bg-white hover:-translate-y-0.5 transition"
                >
                  <div className="relative w-full h-28 md:h-32 bg-slate-200 overflow-hidden">
                    {img ? (
                      <Image
                        src={img}
                        alt={item.titulo}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[11px] text-white bg-gradient-to-br from-amber-500 to-rose-500">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white px-3 py-2 space-y-1">
                    <p className="text-[11px] font-semibold uppercase line-clamp-2">
                      {item.titulo}
                    </p>

                    <p className="text-[10px] text-slate-300">
                      {item.subcategoria_pet
                        ? `${item.subcategoria_pet} • `
                        : ""}
                      {item.cidade}
                      {item.bairro ? ` • ${item.bairro}` : ""}
                    </p>

                    {item.preco && (
                      <p className="text-[11px] font-bold text-emerald-300">
                        {item.preco}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

// Página com Suspense (exigido pelo useSearchParams)
export default function ListaPetsPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen">
          <section className="max-w-6xl mx-auto px-4 py-10">
            <p className="text-sm text-slate-600">Carregando anúncios...</p>
          </section>
        </main>
      }
    >
      <ListaPetsContent />
    </Suspense>
  );
}
