"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../../supabaseClient";
import BannerRotator from "../../../components/BannerRotator";

export default function TurismoAnuncioPage() {
  const { id } = useParams();

  const [anuncio, setAnuncio] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  // URL atual para compartilhar
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Buscar anúncio de turismo + similares
  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Erro ao carregar anúncio de turismo:", error);
        setErro("Não foi possível carregar este anúncio de turismo.");
        setLoading(false);
        return;
      }

      setAnuncio(data);
      setFotoIndex(0);

      // Buscar outros anúncios de turismo na mesma cidade
      const { data: similaresData } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, faixa_preco, preco, imagens, pilar_turismo, subcategoria_turismo"
        )
        .eq("categoria", "turismo")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(4);

      setSimilares(similaresData || []);
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-slate-900">
        {/* Fundo de mergulho */}
        <BackgroundMarinho />
        <p className="text-sm text-slate-100 z-10">
          Carregando anúncio de turismo…
        </p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-slate-900">
        <BackgroundMarinho />
        <p className="text-sm text-slate-100 mb-4 z-10">
          {erro || "Anúncio de turismo não encontrado."}
        </p>
        <Link
          href="/turismo"
          className="z-10 rounded-full bg-sky-500 px-5 py-2 text-sm text-white font-semibold hover:bg-sky-600"
        >
          Voltar para Turismo
        </Link>
      </main>
    );
  }

  // Campos principais
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;

  const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

  const labelPilar = {
    onde_ficar: "Onde ficar",
    onde_comer: "Onde comer",
    onde_se_divertir: "Onde se divertir",
    onde_passear: "Onde passear",
    servicos_turismo: "Serviços de turismo",
    produtos_turisticos: "Produtos turísticos",
    outros: "Turismo / serviços",
  };

  const labelSubcategoria = (sub) => {
    if (!sub) return "";
    return sub
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  const pilarLabel = labelPilar[anuncio.pilar_turismo] || "Turismo";
  const subLabel = labelSubcategoria(anuncio.subcategoria_turismo);

  // Contatos
  const telefoneRaw = anuncio.telefone || "";
  const whatsappRaw = anuncio.whatsapp || "";
  const email = anuncio.email || "";

  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos Turismo e gostaria de mais informações.`
        )}`
      : null;

  // Compartilhamento
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este lugar na Região dos Lagos que encontrei no Classilagos Turismo: ${anuncio.titulo}`
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

  // Rota voltar
  const rotaVoltar = "/turismo";

  return (
    <main className="relative min-h-screen pb-12">
      {/* Fundo marinho em toda a página */}
      <BackgroundMarinho />

      {/* BANNER TOPO */}
      <section className="relative bg-white/90 border-b border-slate-200/70 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CABEÇALHO DO ANÚNCIO – TURISMO */}
      <section className="relative z-10 border-b border-slate-200/60 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
          <p className="text-[11px] text-slate-500">
            Classilagos – Turismo &amp; Guia ONDE
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                {anuncio.titulo}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-700">
                {pilarLabel}
                {subLabel ? ` • ${subLabel}` : ""} <br />
                {anuncio.cidade}
                {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {precoExibicao && (
                <div className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-emerald-500/30">
                  {precoExibicao}
                </div>
              )}

              <Link
                href={rotaVoltar}
                className="hidden sm:inline-flex rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Voltar para Turismo
              </Link>
            </div>
          </div>

          {/* Compartilhar */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
            <span className="text-slate-500">Compartilhar:</span>
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
            >
              🟢 WhatsApp
            </a>
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#1877F2] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
            >
              📘 Facebook
            </a>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL SOBRE O FUNDO MARINHO */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* GALERIA DE FOTOS */}
        {temImagens && (
          <section className="w-full flex flex-col gap-3" id="galeria">
            <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg shadow-sky-900/20">
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
                <img
                  src={imagens[fotoIndex]}
                  alt={anuncio.titulo}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {imagens.length > 1 && (
              <div className="w-full max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {imagens.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFotoIndex(index)}
                    className={`rounded-xl overflow-hidden border transition ${
                      fotoIndex === index
                        ? "border-sky-400 ring-2 ring-sky-300/60"
                        : "border-slate-300 hover:border-sky-300"
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

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-4">
            {/* RESUMO DA EXPERIÊNCIA */}
            <div className="bg-white/95 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Resumo da experiência
              </h2>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                {pilarLabel && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo de experiência:{" "}
                    </span>
                    {pilarLabel}
                    {subLabel ? ` • ${subLabel}` : ""}
                  </div>
                )}

                {anuncio.nome_negocio && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Nome do local:{" "}
                    </span>
                    {anuncio.nome_negocio}
                  </div>
                )}

                {precoExibicao && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Faixa de preço:{" "}
                    </span>
                    {precoExibicao}
                  </div>
                )}

                {anuncio.cidade && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Cidade:{" "}
                    </span>
                    {anuncio.cidade}
                  </div>
                )}

                {anuncio.bairro && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Bairro / região:{" "}
                    </span>
                    {anuncio.bairro}
                  </div>
                )}

                {anuncio.tipo_passeio && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo de passeio:{" "}
                    </span>
                    {anuncio.tipo_passeio}
                  </div>
                )}

                {anuncio.duracao_passeio && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Duração:{" "}
                    </span>
                    {anuncio.duracao_passeio}
                  </div>
                )}

                {anuncio.valor_passeio_pessoa && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Valor por pessoa:{" "}
                    </span>
                    {anuncio.valor_passeio_pessoa}
                  </div>
                )}

                {anuncio.valor_passeio_fechado && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Passeio fechado:{" "}
                    </span>
                    {anuncio.valor_passeio_fechado}
                  </div>
                )}

                {anuncio.ponto_embarque && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Ponto de encontro / embarque:{" "}
                    </span>
                    {anuncio.ponto_embarque}
                  </div>
                )}
              </div>
            </div>

            {/* DETALHES DO PASSEIO / ITENS INCLUSOS (se houver) */}
            {(anuncio.tipo_passeio ||
              anuncio.itens_inclusos ||
              anuncio.valor_passeio_pessoa ||
              anuncio.valor_passeio_fechado) && (
              <div className="bg-white/95 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Detalhes do passeio / atividade
                </h2>

                <div className="space-y-2 text-xs text-slate-700">
                  {anuncio.tipo_passeio && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Modalidade:{" "}
                      </span>
                      {anuncio.tipo_passeio}
                    </p>
                  )}
                  {anuncio.duracao_passeio && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Duração aproximada:{" "}
                      </span>
                      {anuncio.duracao_passeio}
                    </p>
                  )}
                  {anuncio.valor_passeio_pessoa && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Valor por pessoa:{" "}
                      </span>
                      {anuncio.valor_passeio_pessoa}
                    </p>
                  )}
                  {anuncio.valor_passeio_fechado && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Passeio fechado / grupo:{" "}
                      </span>
                      {anuncio.valor_passeio_fechado}
                    </p>
                  )}
                  {anuncio.ponto_embarque && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Ponto de encontro / embarque:{" "}
                      </span>
                      {anuncio.ponto_embarque}
                    </p>
                  )}
                  {anuncio.itens_inclusos && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        Itens inclusos:
                      </p>
                      <p className="whitespace-pre-line">
                        {anuncio.itens_inclusos}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DESCRIÇÃO + MAPA */}
            <div className="bg-white/95 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10 space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Sobre este lugar
                </h2>
                <p className="text-xs text-slate-700 whitespace-pre-line">
                  {anuncio.descricao}
                </p>
              </div>

              <div className="mt-2">
                <h3 className="text-xs font-semibold text-slate-900 mb-2">
                  Localização aproximada
                </h3>
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                  <iframe
                    title="Mapa do anúncio"
                    src={mapaUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  O mapa é aproximado e pode não indicar o endereço exato. Combine
                  sempre o ponto de encontro diretamente com o anunciante.
                </p>
              </div>
            </div>

            {/* VÍDEO (se houver) */}
            {anuncio.video_url && (
              <div className="bg-white/95 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Vídeo da experiência
                </h2>
                <p className="text-xs text-slate-700 mb-3">
                  Veja mais detalhes deste lugar em um vídeo externo.
                </p>
                <a
                  href={anuncio.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                >
                  ▶️ Assistir ao vídeo
                </a>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA – CONTATO */}
          <div className="space-y-4">
            <div className="bg-white/95 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Reservas &amp; contato
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
                {anuncio.nome_contato && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      Responsável:{" "}
                    </span>
                    {anuncio.nome_contato}
                  </p>
                )}
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

              {(anuncio.site_url || anuncio.instagram || anuncio.facebook) && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                  {anuncio.site_url && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Site / reservas:{" "}
                      </span>
                      <a
                        href={anuncio.site_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline"
                      >
                        {anuncio.site_url}
                      </a>
                    </p>
                  )}
                  {anuncio.instagram && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Instagram:{" "}
                      </span>
                      <a
                        href={
                          anuncio.instagram.startsWith("http")
                            ? anuncio.instagram
                            : `https://instagram.com/${anuncio.instagram.replace(
                                "@",
                                ""
                              )}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-500 hover:underline"
                      >
                        {anuncio.instagram}
                      </a>
                    </p>
                  )}
                  {anuncio.facebook && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Facebook:{" "}
                      </span>
                      {anuncio.facebook}
                    </p>
                  )}
                </div>
              )}

              <p className="text-[11px] text-slate-500 pt-3">
                Anúncio publicado em{" "}
                {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Bloco de afiliados / ofertas relacionadas (mantido para o futuro) */}
            <div className="bg-white/90 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Para completar sua viagem
              </h2>
              <p className="text-[11px] text-slate-600 mb-3">
                Em breve, aqui você poderá ver ofertas de parceiros e produtos
                que combinam com esta experiência na Região dos Lagos.
              </p>
              <ul className="space-y-2 text-[11px] text-slate-700">
                <li>• Equipamentos de praia e mergulho.</li>
                <li>• Roupas leves e acessórios de viagem.</li>
                <li>• Itens para registrar a viagem (câmeras, suportes etc.).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SIMILARES */}
        <section className="mt-6">
          <div className="bg-white/92 rounded-3xl border border-slate-200 px-5 py-4 shadow-md shadow-sky-900/10">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Outros lugares que você pode gostar
            </h2>

            {similares.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Em breve, mais opções de turismo nesta região aparecerão aqui.
              </p>
            )}

            {similares.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : null;
                  const precoItem = item.faixa_preco || item.preco || "";

                  return (
                    <Link
                      key={item.id}
                      href={`/turismo/anuncio/${item.id}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50/90 hover:bg-slate-100 transition overflow-hidden flex flex-col"
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
                        <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                          {labelPilar[item.pilar_turismo] || "Turismo"}
                        </p>
                        <p className="font-semibold line-clamp-2">
                          {item.titulo}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {item.cidade}
                          {item.bairro ? ` • ${item.bairro}` : ""}
                        </p>
                        {precoItem && (
                          <p className="text-[11px] font-semibold text-emerald-700">
                            {precoItem}
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

        {/* BOTÃO VOLTAR (MOBILE) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href={rotaVoltar}
            className="rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Voltar para Turismo
          </Link>
        </div>

        {/* RODAPÉ SIMPLES */}
        <footer className="mt-8 text-center text-[11px] text-slate-100/90 space-y-1">
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
            Classilagos • O seu guia de compras, serviços e turismo na Região
            dos Lagos
          </p>
        </footer>
      </section>
    </main>
  );
}

/**
 * Fundo com imagem de mar / mergulho ocupando a tela toda,
 * com leve escurecida para o conteúdo branco “flutuar” por cima.
 *
 * Coloque um arquivo em /public/turismo/bg-mergulho.jpg
 * com a cena de mar/corais que você quiser.
 */
function BackgroundMarinho() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Image
        src="/turismo/bg-mergulho.jpg"
        alt="Fundo marinho – Classilagos Turismo"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* camada para dar contraste e deixar meio transparente */}
      <div className="absolute inset-0 bg-sky-950/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-sky-950/40 to-sky-950/80" />
    </div>
  );
}
