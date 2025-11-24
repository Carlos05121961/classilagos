"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../supabaseClient";
import ContatoAnuncio from "../../components/ContatoAnuncio";

export default function PaginaDetalhesImovel({ params }) {
  const { id } = params;

  const [anuncio, setAnuncio] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Galeria
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchAnuncio = async () => {
      try {
        const { data, error } = await supabase
          .from("anuncios")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao carregar anúncio:", error);
          setErro("Erro ao carregar o anúncio.");
          setLoading(false);
          return;
        }

        setAnuncio(data);

        // Buscar anúncios similares (mesma categoria, outros IDs)
        if (data?.categoria) {
          const { data: similaresData, error: simError } = await supabase
            .from("anuncios")
            .select("*")
            .eq("categoria", data.categoria)
            .neq("id", data.id)
            .order("created_at", { ascending: false })
            .limit(4);

          if (simError) {
            console.error("Erro ao carregar anúncios similares:", simError);
          } else {
            setSimilares(similaresData || []);
          }
        }
      } catch (e) {
        console.error("Erro inesperado:", e);
        setErro("Erro inesperado ao carregar o anúncio.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-center text-sm text-slate-600">
        Carregando anúncio...
      </div>
    );
  }

  if (erro || !anuncio) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-center text-red-500">
        {erro || "Anúncio não encontrado."}
      </div>
    );
  }

  // Imagens: tenta primeiro "imagens", depois "fotos"
  const fotosRaw =
    Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0
      ? anuncio.imagens
      : Array.isArray(anuncio.fotos)
      ? anuncio.fotos
      : [];

  const fotos = fotosRaw || [];
  const hasFotos = fotos.length > 0;

  // Garante que o índice selecionado sempre é válido
  const safeIndex =
    selectedIndex >= 0 && selectedIndex < fotos.length ? selectedIndex : 0;
  const fotoPrincipal = hasFotos ? fotos[safeIndex] : null;

  const handleNext = () => {
    if (!hasFotos) return;
    setSelectedIndex((prev) => (prev + 1) % fotos.length);
  };

  const handlePrev = () => {
    if (!hasFotos) return;
    setSelectedIndex((prev) =>
      prev - 1 < 0 ? fotos.length - 1 : prev - 1
    );
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Título */}
      <h1 className="text-2xl font-bold text-slate-900">
        {anuncio.titulo || "Imóvel sem título"}
      </h1>

      {/* Localização */}
      <p className="mt-1 text-sm text-slate-600">
        {anuncio.cidade} {anuncio.bairro ? `• ${anuncio.bairro}` : ""}
      </p>

      {/* Galeria de fotos */}
      <div className="mt-6">
        {hasFotos && (
          <>
            {/* Foto principal */}
            <div
              className="relative h-72 w-full overflow-hidden rounded-xl sm:h-96 cursor-pointer"
              onClick={() => setShowLightbox(true)}
            >
              <Image
                src={fotoPrincipal}
                alt="Foto do imóvel"
                fill
                className="object-cover"
              />
            </div>

            {/* Miniaturas */}
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {fotos.map((foto, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-20 w-full overflow-hidden rounded-lg border ${
                    index === safeIndex
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* LIGHTBOX / MODAL DE FOTOS */}
      {showLightbox && hasFotos && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative w-full max-w-4xl px-4"
            onClick={(e) => e.stopPropagation()} // não fecha ao clicar na imagem
          >
            {/* Botão fechar */}
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute -top-8 right-0 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-white"
            >
              ✕ Fechar
            </button>

            {/* Imagem grande */}
            <div className="relative h-[60vh] w-full overflow-hidden rounded-xl bg-black">
              <Image
                src={fotoPrincipal}
                alt="Foto ampliada do imóvel"
                fill
                className="object-contain"
              />
            </div>

            {/* Setas navegação */}
            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-lg font-bold text-slate-800 hover:bg-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-lg font-bold text-slate-800 hover:bg-white"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* GRID PRINCIPAL: infos à esquerda / contato + banner à direita */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6">
          {/* Resumo do imóvel */}
          <section className="rounded-xl bg-slate-50 p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              Resumo do imóvel
            </h2>

            <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-3">
              <p>
                <span className="font-semibold">Valor:</span>{" "}
                {anuncio.preco ? `R$ ${anuncio.preco}` : "A consultar"}
              </p>
              <p>
                <span className="font-semibold">Tipo:</span>{" "}
                {anuncio.tipo || "-"}
              </p>
              <p>
                <span className="font-semibold">Finalidade:</span>{" "}
                {anuncio.finalidade || "-"}
              </p>
              <p>
                <span className="font-semibold">Área:</span>{" "}
                {anuncio.area ? `${anuncio.area} m²` : "-"}
              </p>
              <p>
                <span className="font-semibold">Quartos:</span>{" "}
                {anuncio.quartos || "-"}
              </p>
              <p>
                <span className="font-semibold">Banheiros:</span>{" "}
                {anuncio.banheiros || "-"}
              </p>
              <p>
                <span className="font-semibold">Vagas:</span>{" "}
                {anuncio.vagas || "-"}
              </p>
            </div>
          </section>

          {/* Descrição */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              Descrição do imóvel
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {anuncio.descricao || "Sem descrição detalhada."}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-700 sm:grid-cols-2">
              {anuncio.condominio && (
                <p>
                  <span className="font-semibold">Condomínio:</span> R${" "}
                  {anuncio.condominio}
                </p>
              )}
              {anuncio.iptu && (
                <p>
                  <span className="font-semibold">IPTU (ano):</span> R${" "}
                  {anuncio.iptu}
                </p>
              )}
              {anuncio.aceita_financiamento && (
                <p>
                  <span className="font-semibold">Aceita financiamento:</span>{" "}
                  {anuncio.aceita_financiamento}
                </p>
              )}
            </div>
          </section>

          {/* Anúncios similares */}
          {similares.length > 0 && (
            <section className="mt-2">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">
                Imóveis similares
              </h2>
<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
  {similares.map((item) => (
    <a
      key={item.id}
      href={`/imoveis/${item.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-24 w-full bg-slate-100 overflow-hidden">
        {Array.isArray(item.imagens) && item.imagens.length > 0 ? (
          <img
            src={item.imagens[0]}
            alt={item.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
            Sem foto
          </div>
        )}
      </div>

      {/* CAIXA DO TITULO COM ALTURA FIXA */}
      <div className="bg-slate-900 px-3 py-2 text-white h-[58px] flex flex-col justify-center">
        <p className="line-clamp-1 text-[11px] font-semibold leading-tight">
          {item.titulo}
        </p>
        <p className="text-[11px] text-slate-300 leading-tight">
          {item.cidade}
        </p>
      </div>
    </a>
  ))}
</div>

            </section>
          )}
        </div>

        {/* COLUNA DIREITA */}
        <aside className="space-y-4">
          {/* Contato */}
          <ContatoAnuncio
            telefone={anuncio.telefone}
            whatsapp={anuncio.whatsapp}
            email={anuncio.email}
            imobiliaria={anuncio.imobiliaria}
            corretor={anuncio.corretor}
            creci={anuncio.creci}
            anuncioId={anuncio.id}
          />

          {/* Banner Mercado Livre / Ofertas */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-900">
              Ofertas e promoções
            </h3>
            <a
              href="https://www.mercadolivre.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block overflow-hidden rounded-lg bg-slate-100"
            >
              <img
                src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.19.11/mercadolibre/logo__large_plus.png"
                alt="Ofertas no Mercado Livre"
                className="mx-auto w-full max-w-[260px] py-4 object-contain"
              />
            </a>
            <p className="mt-1 text-[10px] text-slate-500">
              Espaço reservado para banners de parceiros, afiliados e
              promoções da região.
            </p>
          </div>
        </aside>
      </div>

      {/* Links inferiores pequeninos */}
      <footer className="mt-10 border-t border-slate-200 pt-4">
        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
          <a href="/quem-somos" className="hover:underline">
            Quem somos
          </a>
          <a href="/fale-conosco" className="hover:underline">
            Fale conosco
          </a>
          <a href="/avisos-de-seguranca" className="hover:underline">
            Avisos de segurança
          </a>
          <a href="/termos-de-uso" className="hover:underline">
            Termos de uso
          </a>
          <a href="/politica-de-privacidade" className="hover:underline">
            Política de privacidade
          </a>
        </div>
      </footer>
    </div>
  );
}
