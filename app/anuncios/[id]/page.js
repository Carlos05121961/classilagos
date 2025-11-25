"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabaseClient";
import BannerRotator from "../../components/BannerRotator";

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [similares, setSimilares] = useState([]);

  // URL atual (para compartilhar)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Buscar anúncio + similares
  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar anúncio:", error);
        setErro("Não foi possível carregar este anúncio.");
        setLoading(false);
        return;
      }

      setAnuncio(data);
      setFotoIndex(0);

      const { data: similaresData } = await supabase
        .from("anuncios")
        .select("id, titulo, cidade, bairro, preco, tipo_imovel, imagens")
        .eq("categoria", data.categoria || "imoveis")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(4);

      setSimilares(similaresData || []);
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  // Estados de carregamento / erro
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

  // Imagens
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;

  // Contatos
  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";
  const imobiliaria = anuncio.imobiliaria || "";
  const corretor = anuncio.corretor || "";
  const creci = anuncio.creci || "";

  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos e gostaria de mais informações.`
        )}`
      : null;

  // Compartilhamento
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este imóvel no Classilagos: ${anuncio.titulo}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Endereço para mapa
  const enderecoCompleto = [
    anuncio.endereco || "",
    anuncio.bairro || "",
    anuncio.cidade || "",
  ]
    .join(" ")
    .trim();

  const mapaQuery = encodeURIComponent(
    enderecoCompleto || anuncio.cidade || "Região dos Lagos RJ"
  );
  const mapaUrl = `https://www.google.com/maps?q=${mapaQuery}&output=embed`;

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CABEÇALHO DO ANÚNCIO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-500">Classilagos – Imóveis</p>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
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

          {/* COMPARTILHAR */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-500">Compartilhar:</span>
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
            >
              🟢 WhatsApp
            </a>
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#1877F2] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
            >
              📘 Facebook
            </a>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* CARD DE FOTOS NOVO */}
     {temImagens && (
  <section className="w-full flex flex-col gap-3">
    {/* Foto principal (ajustada) */}
    <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[280px]">
        <img
          src={imagens[fotoIndex]}
          alt={anuncio.titulo}
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>

    {/* Miniaturas */}
    {imagens.length > 1 && (
      <div className="w-full max-w-3xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {imagens.map((url, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setFotoIndex(index)}
            className={`rounded-lg overflow-hidden border ${
              fotoIndex === index
                ? "border-cyan-500 ring-2 ring-cyan-400/40"
                : "border-slate-300"
            }`}
          >
            <img
              src={url}
              alt={`Foto ${index + 1}`}
              className="w-full h-16 object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </section>
)}


        {/* GRID PRINCIPAL: ESQUERDA (imóvel) / DIREITA (contato + ML) */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-4">
            {/* Resumo */}
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

            {/* Descrição + mapa */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Descrição do imóvel
                </h2>
                <p className="text-xs text-slate-700 whitespace-pre-line">
                  {anuncio.descricao}
                </p>

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

              {/* Mapa */}
              <div className="mt-2">
                <h3 className="text-xs font-semibold text-slate-900 mb-2">
                  Localização aproximada
                </h3>
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <iframe
                    title="Mapa do imóvel"
                    src={mapaUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  O mapa é aproximado e pode não indicar o número exato do
                  imóvel. Confirme sempre com o anunciante.
                </p>
              </div>
            </div>

            {/* Vídeo */}
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
            {/* Contato */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Fale com o anunciante
              </h2>

              {whatsappLink && (
                <div className="mb-4">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1EBE57]"
                  >
                    <span className="mr-2 text-sm">🟢</span>
                    Conversar no WhatsApp
                  </a>
                </div>
              )}

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

            {/* Mercado Livre */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Ofertas para sua casa (Mercado Livre)
              </h2>
              <p className="text-[11px] text-slate-600 mb-3">
                Itens que combinam com este imóvel. Clique para ver mais detalhes
                no Mercado Livre.
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

        {/* Imóveis similares */}
        <section className="mt-6">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Imóveis similares na Região dos Lagos
            </h2>

            {similares.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Em breve mais imóveis nesta região aparecerão aqui.
              </p>
            )}

            {similares.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : null;

                  return (
                    <Link
                      key={item.id}
                      href={`/anuncios/${item.id}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                    >
                      {img && (
                        <div className="w-full h-24 overflow-hidden">
                          <img
                            src={img}
                            alt={item.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="px-3 py-2 space-y-1">
                        <p className="font-semibold line-clamp-2">
                          {item.titulo}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {item.cidade}
                          {item.bairro ? ` • ${item.bairro}` : ""}
                        </p>
                        {item.preco && (
                          <p className="text-[11px] font-semibold text-slate-900">
                            R$ {item.preco}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
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

        {/* Rodapé simples */}
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
          <p>
            Classilagos • O seu guia de compras e serviços na Região dos Lagos
          </p>
        </footer>
      </section>
    </main>
  );
}
