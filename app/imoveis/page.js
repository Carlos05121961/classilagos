"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

const CATEGORIA = "imoveis";

export default function ImoveisPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnuncios() {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", CATEGORIA)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar anúncios:", error.message);
      }

      setAnuncios(data || []);
      setLoading(false);
    }

    loadAnuncios();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Cabeçalho simples da categoria */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Imóveis</h1>
        <p className="text-sm text-gray-600 max-w-3xl">
          Encontre casas, apartamentos, sítios e outros imóveis anunciados
          gratuitamente no Classilagos. Em breve você poderá filtrar por cidade,
          tipo de imóvel e faixa de preço.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/anunciar/formulario?tipo=imoveis"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Anunciar meu imóvel
          </Link>
          <span className="text-xs text-gray-500">
            É rápido, simples e totalmente gratuito.
          </span>
        </div>
      </header>

      {/* Estado de carregamento */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Carregando imóveis cadastrados…
        </div>
      )}

      {/* Sem anúncios */}
      {!loading && anuncios.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Ainda não temos imóveis cadastrados no sistema.
          </h2>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Assim que os primeiros anúncios forem publicados, eles aparecerão
            aqui automaticamente.
          </p>
          <Link
            href="/anunciar/formulario?tipo=imoveis"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Quero ser o primeiro a anunciar
          </Link>
        </div>
      )}

      {/* Lista de anúncios */}
      {!loading && anuncios.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Imóveis anunciados recentemente
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {anuncios.map((anuncio) => (
              <article
                key={anuncio.id}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {anuncio.titulo}
                  </h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Imóveis
                  </span>
                </div>

                <p className="mb-2 text-xs font-medium text-gray-500">
                  {anuncio.cidade}
                </p>

                <p className="mb-3 line-clamp-3 text-sm text-gray-700">
                  {anuncio.descricao}
                </p>

                <div className="mt-auto space-y-2">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Contato: </span>
                    {anuncio.contato}
                  </p>

                  {/* Link do vídeo (YouTube) se existir */}
                  {anuncio.video_url && (
                    <a
                      href={anuncio.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      ▶ Ver vídeo do imóvel no YouTube
                    </a>
                  )}

                  <p className="text-[11px] text-gray-400">
                    Publicado em{" "}
                    {new Date(anuncio.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
