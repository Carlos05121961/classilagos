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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

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

  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos e gostaria de mais informações.`
        )}`
      : null;

  // Links de compartilhamento
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este imóvel no Classilagos: ${anuncio.titulo}`
  );

  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Handlers modal
  const abrirModalNaFoto = (index) => {
    setFotoIndex(index);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
  };

  const fotoAnterior = () => {
    setFotoIndex((prev) =>
      prev === 0 ? imagens.length - 1 : Math.max(prev - 1, 0)
    );
  };

  const proximaFoto = () => {
    setFotoIndex((prev) =>
      prev === imagens.length - 1 ? 0 : Math.min(prev + 1, imagens.length - 1)
    );
  };

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* CABEÇALHO SUPERIOR */}
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

          <div className="flex flex-col items-end gap-2">
            {/* Botões de compartilhar */}
            <div className="flex gap-2">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
              >
                {/* Ícone WhatsApp simples */}
                <span className="mr-1 text-sm">🟢</span>
                WhatsApp
              </a>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-[#1877F2] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
              >
                <span className="mr-1 text-sm">📘</span>
                Facebook
              </a>
            </div>

            <Link
              href="/imoveis"
              className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Voltar para Imóveis
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER TOPO (ESPAÇO) */}
      <section className="max-w-5xl mx-auto px-4 mt-4">
        <div className="w-full h-24 rounded-2xl bg-slate-200/70 border border-slate-300/60 flex items-center justify-center text-[11px] text-slate-600">
          Espaço reservado para banner 1200x150 (Imóveis – Classilagos)
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* FOTO PRINCIPAL */}
        {fotoAtiva && (
          <div className="w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer">
            <div
              className="w-full h-[220px] sm:h-[260px] md:h-[320px]"
              onClick={() => abrirModalNaFoto(fotoIndex)}
            >
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
                onClick={() => abrirModalNaFoto(index)}
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

        {/* GRID PRINCIPAL: DESCRIÇÃO + CONTATO + ML */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-4">
            {/* Resumo do imóvel */}
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
                    {anuncio.finalidade === "aluguel" && "Aluguel"}
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
              {(anuncio.condominio ||
                anuncio.iptu ||
                anuncio.aceita_financiamento) && (
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

          {/* COLUNA DIREITA: CONTATO + MERCADO LIVRE */}
          <div className="space-y-4">
            {/* CONTATO */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Fale com o anunciante
              </h2>

              {/* Botão discreto WhatsApp */}
              {whatsappLink && (
                <div className="mb-4">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1EBE57]"
                  >
                    {/* Íconezinho simples */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                    >
                      <path d="M12.04 2C6.58 2 2.2 6.37 2.2 11.84c0 2.09.61 4.03 1.78 5.72L2 22l4.58-1.94a9.83 9.83 0 0 0 5.46 1.6h.01c5.46 0 9.84-4.37 9.84-9.84C21.9 6.37 17.5 2 12.04 2Zm0 17.8h-.01a8 8 0 0 1-4.1-1.13l-.29-.17-2.72 1.15.58-2.88-.19-.3a7.83 7.83 0 0 1-1.2-4.2c0-4.33 3.53-7.86 7.88-7.86 4.34 0 7.87 3.53 7.87 7.87 0 4.34-3.53 7.86-7.88 7.86Zm4.3-5.87c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.55.12-.16.24-.63.78-.78.94-.14.16-.29.18-.54.06-.24-.12-1.02-.38-1.94-1.21-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.12-.12.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.76-1.8-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.33.98 2.49c.12.16 1.69 2.59 4.1 3.63.57.25 1.02.4 1.37.51.57.18 1.08.16 1.49.1.46-.07 1.43-.58 1.63-1.15.2-.57.2-1.06.14-1.15-.06-.1-.22-.16-.46-.28Z" />
                    </svg>
                    Conversar no WhatsApp
                  </a>
                </div>
              )}

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

            {/* BLOCO OFERTAS MERCADO LIVRE */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Ofertas para sua casa (Mercado Livre)
              </h2>
              <p className="text-[11px] text-slate-600 mb-3">
                Itens que combinam com este imóvel. Clique para ver mais
                detalhes no Mercado Livre.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li>
                  <a
                    href="https://www.mercadolivre.com.br/ofertas?c=decoracao-sala"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Sofás e decoração para sala de estar
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mercadolivre.com.br/ofertas?c=cozinha-planejada"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Eletrodomésticos e itens de cozinha
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mercadolivre.com.br/ofertas?c=area-gourmet"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    • Churrasqueiras, mesas externas e área gourmet
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-[10px] text-slate-400">
                Em breve este bloco poderá usar seus links de afiliado
                personalizados.
              </p>
            </div>
          </div>
        </div>

        {/* Imóveis similares – placeholder simples por enquanto */}
        <section className="mt-6">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Imóveis similares na Região dos Lagos
            </h2>
            <p className="text-[11px] text-slate-600 mb-3">
              Em breve aqui teremos uma lista automática de imóveis semelhantes
              (mesma cidade, faixa de preço e tipo).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="font-semibold mb-1">Casa próxima à praia</p>
                <p>Cabo Frio • 3 quartos • R$ 650.000</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="font-semibold mb-1">
                  Apartamento vista lagoa
                </p>
                <p>Araruama • 2 quartos • R$ 420.000</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="font-semibold mb-1">
                  Casa linear com área gourmet
                </p>
                <p>São Pedro da Aldeia • 4 quartos • R$ 720.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Botão voltar (mobile) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/imoveis"
            className="rounded-full bg-[#21D4FD] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3EC9C3]"
          >
            Voltar para Imóveis
          </Link>
        </div>

        {/* RODAPÉ SIMPLES DA PÁGINA DO ANÚNCIO */}
        <footer className="mt-8 text-center text-[11px] text-slate-500 space-y-1">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/quem-somos" className="hover:underline">
              Quem somos
            </Link>
            <Link href="/como-anunciar" className="hover:underline">
              Como anunciar
            </Link>
            <Link href="/fale-conosco" className="hover:underline">
              Fale conosco
            </Link>
            <Link href="/termos-de-uso" className="hover:underline">
              Termos de uso
            </Link>
            <Link href="/politica-de-privacidade" className="hover:underline">
              Política de privacidade
            </Link>
          </div>
          <p>Classilagos • O seu guia de compras e serviços na Região dos Lagos</p>
        </footer>
      </section>

      {/* MODAL DE FOTOS */}
      {isModalOpen && temImagens && (
        <div
          className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center px-4"
          onClick={fecharModal}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-black/80 rounded-2xl overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              type="button"
              onClick={fecharModal}
              className="absolute top-3 right-3 text-white/80 hover:text-white text-xl"
            >
              ×
            </button>

            {/* Setas navegação */}
            {imagens.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={fotoAnterior}
                  className="absolute left-3 md:left-4 text-white/80 hover:text-white text-3xl"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={proximaFoto}
                  className="absolute right-3 md:right-4 text-white/80 hover:text-white text-3xl"
                >
                  ›
                </button>
              </>
            )}

            <img
              src={imagens[fotoIndex]}
              alt={`${anuncio.titulo} - foto ampliada`}
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
