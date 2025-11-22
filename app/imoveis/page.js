"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarImoveis() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "imoveis")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar imóveis:", error);
        setError("Não foi possível carregar os imóveis agora.");
        setImoveis([]);
      } else {
        setImoveis(data || []);
      }

      setLoading(false);
    }

    carregarImoveis();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Cabeçalho da página */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Imóveis</h1>
        <p className="text-slate-700 max-w-2xl">
          Encontre casas, apartamentos, sítios e outros imóveis anunciados
          gratuitamente no Classilagos. Em breve você poderá filtrar por cidade,
          tipo de imóvel e faixa de preço.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/anunciar/formulario?tipo=imoveis"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            + Anunciar meu imóvel
          </Link>

          <Link
            href="/anunciar"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Quero ser o primeiro a anunciar
          </Link>
        </div>
      </section>

      {/* Estado de carregamento */}
      {loading && (
        <p className="text-slate-600">Carregando imóveis cadastrados...</p>
      )}

      {/* Estado de erro */}
      {!loading && error && (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      {/* Lista de imóveis */}
      {!loading && !error && imoveis.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2">
          {imoveis.map((item) => (
            <article
              key={item.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h2 className="text-lg font-semibold mb-1">
                {item.titulo || "Imóvel sem título"}
              </h2>

              <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                {item.descricao ||
                  "Imóvel cadastrado no Classilagos. Em breve mais detalhes."}
              </p>

              <div className="text-sm text-slate-700 space-y-1 mb-3">
                <p>
                  <span className="font-semibold">Cidade:</span>{" "}
                  {item.cidade || "Não informado"}
                </p>
                <p>
                  <span className="font-semibold">Contato:</span>{" "}
                  {item.contato || "Não informado"}
                </p>
              </div>

              <p className="text-xs text-slate-400">
                Anúncio publicado em{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString("pt-BR")
                  : "data não disponível"}
              </p>
            </article>
          ))}
        </section>
      )}

      {/* Estado sem imóveis */}
      {!loading && !error && imoveis.length === 0 && (
        <section className="mt-8 border border-dashed rounded-2xl p-8 text-center bg-slate-50">
          <p className="text-slate-700 mb-2">
            Ainda não temos imóveis cadastrados no sistema.
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Assim que os primeiros anúncios forem publicados, eles aparecerão
            aqui automaticamente.
          </p>

          <Link
            href="/anunciar/formulario?tipo=imoveis"
            className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            Quero ser o primeiro a anunciar
          </Link>
        </section>
      )}
    </main>
  );
}
