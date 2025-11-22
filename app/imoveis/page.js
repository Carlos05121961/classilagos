"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";

export default function ImoveisPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarImoveis() {
      setLoading(true);
      setErro("");

      // Busca todos os anúncios da categoria "Imóveis"
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", "Imóveis")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setErro("Erro ao carregar os imóveis. Tente novamente mais tarde.");
      } else {
        setAnuncios(data || []);
      }

      setLoading(false);
    }

    carregarImoveis();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho da seção */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Imóveis</h1>
        <p className="text-slate-600 text-sm md:text-base">
          Encontre casas, apartamentos, sítios e outros imóveis anunciados
          gratuitamente no Classilagos. Em breve você poderá filtrar por cidade,
          tipo de imóvel e faixa de preço.
        </p>
      </header>

      {/* Link para anunciar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Quer anunciar o seu imóvel? Publique grátis em poucos minutos.
        </p>
        <Link
          href="/anunciar"
          className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + Anunciar meu imóvel
        </Link>
      </div>

      {/* Estados de carregamento / erro / vazio / lista */}
      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-slate-700">Carregando imóveis...</p>
        </div>
      )}

      {!loading && erro && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700 text-sm">{erro}</p>
        </div>
      )}

      {!loading && !erro && anuncios.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-700 mb-2">
            Ainda não temos imóveis cadastrados no sistema.
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Assim que os primeiros anúncios forem publicados, eles aparecerão
            aqui automaticamente.
          </p>
          <Link
            href="/anunciar"
            className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Quero ser o primeiro a anunciar
          </Link>
        </div>
      )}

      {!loading && !erro && anuncios.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {anuncios.map((anuncio) => (
            <article
              key={anuncio.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              {/* Categoria + data */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                  {anuncio.categoria || "Imóveis"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>

              {/* Título */}
              <h2 className="text-base font-semibold mb-1 line-clamp-2">
                {anuncio.titulo}
              </h2>

              {/* Descrição resumida */}
              <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                {anuncio.descricao}
              </p>

              {/* Cidade e contato */}
              <p className="text-xs text-slate-500 mb-1">
                <span className="font-medium">Cidade:</span>{" "}
                {anuncio.cidade || "-"}
              </p>
              <p className="text-xs text-slate-500 mb-4">
                <span className="font-medium">Contato:</span>{" "}
                {anuncio.contato || "-"}
              </p>

              {/* Rodapé do card */}
              <div className="mt-auto pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Ver detalhes (em breve)
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
