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
  const [fotoIndex, setFotoIndex] = useState(0);

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
        setFotoIndex(0);
      }
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex items-center justify-center">
        <p className="text-sm text-slate-600">Carregando anúncio…</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-slate-700 mb-4">
          {erro || "Anúncio não encontrado."}
        </p>
        <Link
          href="/imoveis"
          className="rounded-full bg-[#21D4FD] px-5 py-2 text-sm text-white font-semibold hover:bg-[#3EC9C3]"
        >
          Voltar para Imóveis
        </Link>
      </main>
    );
  }

  // Trata array de imagens
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;
  const fotoAtiva = temImagens
    ? imagens[Math.min(fotoIndex, imagens.length - 1)]
    : null;

  // Contatos
  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";
  const imobiliaria = anuncio.imobiliaria || "";
  const corretor = anuncio.corretor || "";
  const creci = anuncio.creci || "";

  const telefoneDigits = telefoneRaw.replace(/\D/g, "");
  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  const telLink = telefoneDigits ? `tel:+55${telefoneDigits}` : null;
  const whatsappLink = whatsappDigits
    ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
        `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos e gostaria de mais informações.`
      )}`
    : null;

  const emailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        `Contato sobre imóvel - ${anuncio.titulo}`
      )}`
    : null;

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* CABEÇALHO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Classilagos – Imóveis</p>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900">
              {anuncio.titulo}
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              {anuncio.cidade}
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
                    ? "border-[#21D4FD] ring-2 ring-[#21D4FD]/40"
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

        {/* Descrição + informações + contato */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* Descrição */}
          <div className="space-y-4">
            {/* Preço e resumo */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Resumo do imóvel
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                {anuncio.preco && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Valor:{" "}
                    </span>
                    R$ {anuncio.preco}
                  </div>
                )}
                {anuncio.tipo_imovel && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo:{" "}
                    </span>
                    {anuncio.tipo_imovel}
                  </div>
                )}
                {anuncio.finalidade && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Finalidade:{" "}
                    </span>
                    {anuncio.finalidade === "venda" && "Venda"}
                    {anuncio.finalidade === "aluguel_fixo" && "Aluguel fixo"}
                    {anuncio.finalidade === "temporada" &&
                      "Aluguel por temporada"}
                  </div>
                )}
                {anuncio.area && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Área:{" "}
                    </span>
                    {anuncio.area} m²
                  </div>
                )}
                {anuncio.quartos && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Quartos:{" "}
                    </span>
                    {anuncio.quartos}
                  </div>
                )}
                {anuncio.banheiros && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Banheiros:{" "}
                    </span>
                    {anuncio.banheiros}
                  </div>
                )}
                {anuncio.vagas && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Vagas:{" "}
                    </span>
                    {anuncio.vagas}
                  </div>
                )}
              </div>
            </div>

            {/* Descrição detalhada */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Descrição do imóvel
              </h2>
              <p className="text-xs text-slate-700 whitespace-pre-line">
                {anuncio.descricao}
              </p>

              {/* Dados financeiros extras */}
              {(anuncio.condominio || anuncio.iptu) && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  {anuncio.condominio && (
                    <div>
                      <span className="font-semibold text-slate-900">
                        Condomínio:{" "}
                      </span>
                      R$ {anuncio.condominio}
                    </div>
                  )}
                  {anuncio.iptu && (
                    <div>
                      <span className="font-semibold text-slate-900">
                        IPTU (ano):{" "}
                      </span>
                      R$ {anuncio.iptu}
                    </div>
                  )}
                  {anuncio.aceita_financiamento && (
                    <div className="col-span-full">
                      <span className="font-semibold text-slate-900">
                        Aceita financiamento:{" "}
                      </span>
                      {anuncio.aceita_financiamento}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vídeo (se tiver) */}
            {anuncio.video_url && (
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Vídeo do imóvel
                </h2>
                <p className="text-xs text-slate-700 mb-3">
                  Assista ao vídeo completo deste imóvel no YouTube.
                </p>
                <a
                  href={anuncio.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
                >
                  Ver vídeo no YouTube
                </a>
              </div>
            )}
          </div>

          {/* CONTATO / IMOBILIÁRIA */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Fale com o anunciante
              </h2>

              {/* Botões principais */}
              <div className="flex flex-col gap-2 mb-4">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3]"
                  >
                    Abrir WhatsApp
                  </a>
                )}

                {telLink && (
                  <a
                    href={telLink}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Ligar agora
                  </a>
                )}

                {emailLink && (
                  <a
                    href={emailLink}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Enviar e-mail
                  </a>
                )}
              </div>

              {/* Dados de contato em texto */}
              <div className="space-y-1 text-xs text-slate-700">
                {whatsappRaw && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      WhatsApp:{" "}
                    </span>
                    {whatsappRaw}
                  </p>
                )}
                {telefoneRaw && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      Telefone:{" "}
                    </span>
                    {telefoneRaw}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      E-mail:{" "}
                    </span>
                    {email}
                  </p>
                )}
              </div>

              {/* Imobiliária / corretor */}
              {(imobiliaria || corretor || creci) && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                  {imobiliaria && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Imobiliária:{" "}
                      </span>
                      {imobiliaria}
                    </p>
                  )}
                  {corretor && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Corretor:{" "}
                      </span>
                      {corretor}
                    </p>
                  )}
                  {creci && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        CRECI:{" "}
                      </span>
                      {creci}
                    </p>
                  )}
                </div>
              )}

              <p className="text-[11px] text-slate-500 pt-3">
                Anúncio publicado em{" "}
                {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Botão voltar (mobile) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/imoveis"
            className="rounded-full bg-[#21D4FD] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
          >
            Voltar para Imóveis
          </Link>
        </div>
      </section>
    </main>
  );
}
