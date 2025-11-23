"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabaseClient";

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0); // qual foto está ativa

  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar anúncio:", error);
        setErro("Não foi possível carregar este anúncio.");
      } else {
        setAnuncio(data);
        setFotoIndex(0); // sempre começa na primeira foto
      }
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-600">Carregando anúncio…</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <p className="text-sm text-slate-700 mb-4">
          {erro || "Anúncio não encontrado."}
        </p>
        <Link
          href="/imoveis"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700"
        >
          Voltar para Imóveis
        </Link>
      </main>
    );
  }

  // Trata o array de imagens
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;
  const fotoAtiva = temImagens ? imagens[Math.min(fotoIndex, imagens.length - 1)] : null;

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      {/* CABEÇALHO */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Classilagos – Imóveis</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {anuncio.titulo}
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              {anuncio.cidade}
            </p>
          </div>

          <Link
            href="/imoveis"
            className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Voltar para Imóveis
          </Link>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* FOTO PRINCIPAL */}
        {fotoAtiva && (
          <div className="w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
            <div className="w-full h-[260px] sm:h-[320px] md:h-[360px]">
              <img
                src={fotoAtiva}
                alt={anuncio.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* MINIATURAS */}
        {imagens.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {imagens.map((url, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFotoIndex(index)}
                className={`relative h-16 rounded-xl overflow-hidden border ${
                  index === fotoIndex
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-slate-200"
                } bg-slate-100`}
              >
                <img
                  src={url}
                  alt={`${anuncio.titulo} - foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Descrição + informações */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Descrição do imóvel
            </h2>
            <p className="text-xs text-slate-700 whitespace-pre-line">
              {anuncio.descricao}
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl border border-slate-200 px-5 py-4 text-xs text-slate-700 space-y-2">
            <p>
              <span className="font-semibold text-slate-900">Cidade: </span>
              {anuncio.cidade}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Contato: </span>
              {anuncio.contato}
            </p>
            {anuncio.categoria && (
              <p>
                <span className="font-semibold text-slate-900">
                  Categoria:{" "}
                </span>
                {anuncio.categoria}
              </p>
            )}
            <p className="text-[11px] text-slate-500 pt-2">
              Anúncio publicado em{" "}
              {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Botão voltar (mobile) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/imoveis"
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Voltar para Imóveis
          </Link>
        </div>
      </section>
    </main>
  );
}
