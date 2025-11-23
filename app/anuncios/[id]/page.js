"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../supabaseClient"; // caminho correto

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      const { data, error } = await supabase
        .from("anuncios")       // tabela
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar anúncio:", error);
        setErro("Não foi possível carregar este anúncio.");
      } else {
        setAnuncio(data);
      }
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  const imageUrl =
    anuncio?.imagem_capa ||
    anuncio?.foto_principal ||
    "/imoveis/imovel-01.jpg";

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

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Classilagos – Imóveis</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {anuncio.titulo || "Imóvel à venda"}
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              {anuncio.cidade || "Região dos Lagos"}
              {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
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

      <section className="max-w-5xl mx-auto px-4 pt-6">
        {/* topo: foto + informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          <div className="overflow-hidden rounded-3xl bg-slate-200 border border-slate-200">
            <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px]">
              <Image
                src={imageUrl}
                alt={anuncio.titulo || "Foto do imóvel"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-3 bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            {anuncio.preco && (
              <p className="text-2xl font-extrabold text-emerald-700">
                {anuncio.preco}
              </p>
            )}

            <p className="text-sm text-slate-700">
              {anuncio.descricao ||
                anuncio.detalhes ||
                "Imóvel anunciado através da plataforma Classilagos."}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              {anuncio.quartos && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <p className="font-semibold text-slate-800">Quartos</p>
                  <p>{anuncio.quartos}</p>
                </div>
              )}
              {anuncio.banheiros && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <p className="font-semibold text-slate-800">Banheiros</p>
                  <p>{anuncio.banheiros}</p>
                </div>
              )}
              {anuncio.vagas && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <p className="font-semibold text-slate-800">Vagas</p>
                  <p>{anuncio.vagas}</p>
                </div>
              )}
              {anuncio.area && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <p className="font-semibold text-slate-800">Área</p>
                  <p>{anuncio.area}</p>
                </div>
              )}
            </div>

            {anuncio.telefone && (
              <div className="pt-1">
                <p className="text-[11px] text-slate-500 mb-1">
                  Contato do anunciante
                </p>
                <a
                  href={`https://wa.me/55${anuncio.telefone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Falar no WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        {/* descrição adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Detalhes do imóvel
            </h2>
            <p className="text-xs text-slate-700 whitespace-pre-line">
              {anuncio.descricao_long ||
                anuncio.descricao ||
                "Em breve mais detalhes deste imóvel serão exibidos aqui."}
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl border border-slate-200 px-5 py-4 text-xs text-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Dica Classilagos
            </h2>
            <p>
              Sempre visite o imóvel pessoalmente e confira documentos, registro
              e situação do IPTU. Em caso de dúvida, consulte um corretor de
              confiança.
            </p>
          </div>
        </div>

        {/* botão voltar (mobile) */}
        <div className="mt-8 flex justify-center sm:hidden">
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
