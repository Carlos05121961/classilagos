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

  // URL atual p/ compartilhar
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Carrega anúncio + similares
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", id)
        .eq("categoria", "turismo")
        .single();

      if (error || !data) {
        console.error("Erro ao carregar anúncio de turismo:", error);
        setErro("Não foi possível carregar este anúncio de turismo.");
        setLoading(false);
        return;
      }

      setAnuncio(data);
      setFotoIndex(0);

      // similares: mesmo pilar ou mesma cidade
      const { data: similaresData } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, pilar_turismo, subcategoria_turismo, faixa_preco, preco, imagens"
        )
        .eq("categoria", "turismo")
        .eq("status", "ativo")
        .neq("id", data.id)
        .or(
          `pilar_turismo.eq.${data.pilar_turismo || ""},cidade.eq.${
            data.cidade || ""
          }`
        )
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

      setSimilares(similaresData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex items-center justify-center">
        <p className="text-sm text-slate-600">
          Carregando anúncio de turismo…
        </p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-[#F5FBFF] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-slate-700 mb-4">
          {erro || "Anúncio de turismo não encontrado."}
        </p>
        <Link
          href="/turismo"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-700"
        >
          Voltar para Turismo
        </Link>
      </main>
    );
  }

  // ---------- Dados e helpers ----------

  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;

  const cidadesTexto = [anuncio.cidade, anuncio.bairro]
    .filter(Boolean)
    .join(" • ");

  const whatsappRaw = anuncio.whatsapp || "";
  const telefoneRaw = anuncio.telefone || "";
  const email = anuncio.email || "";
  const nomeResponsavel = anuncio.nome_contato || anuncio.nome_responsavel || "";

  const whatsappDigits = whatsappRaw.replace(/\D/g, "");
  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos Turismo e gostaria de mais informações.`
        )}`
      : null;

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este anúncio no Classilagos Turismo: ${anuncio.titulo}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

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

  const labelPilar = {
    onde_ficar: "Onde ficar",
    onde_comer: "Onde comer",
    onde_se_divertir: "Onde se divertir",
    onde_passear: "Onde passear",
    servicos_turismo: "Serviços de turismo",
    produtos_turisticos: "Produtos turísticos",
    outros: "Turismo / serviços",
  };

  const tiposPasseio = [
    "Passeio de barco / lancha",
    "City tour / passeios terrestres",
    "Passeio de quadriciclo / buggy",
    "Mergulho",
    "Trilha / ecoturismo",
  ];

  const isPasseio = tiposPasseio.includes(anuncio.tipo_passeio || "") ||
    tiposPasseio.includes(anuncio.tipo_lugar || "");

  const labelSubcategoria = (sub) => {
    if (!sub) return "";
    return sub
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

  // ---------- JSX ----------

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* BANNER TOPO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CABEÇALHO TURISMO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
          <p className="text-[11px] text-slate-500">
            Classilagos – Turismo &amp; Guia ONDE
          </p>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                {anuncio.titulo}
              </h1>

              <p className="text-xs md:text-sm text-slate-600 mt-1">
                {labelPilar[anuncio.pilar_turismo] || "Turismo"}
                {anuncio.subcategoria_turismo
                  ? ` • ${labelSubcategoria(anuncio.subcategoria_turismo)}`
                  : ""}
              </p>

              {cidadesTexto && (
                <p className="text-xs md:text-sm text-slate-600">
                  {cidadesTexto}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <Link
                href="/turismo"
                className="hidden sm:inline-flex rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Voltar para Turismo
              </Link>
              {precoExibicao && (
                <div className="rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 text-[11px] font-semibold text-emerald-800">
                  {precoExibicao}
                </div>
              )}
            </div>
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
        {/* GALERIA DE FOTOS */}
        {temImagens && (
          <section className="w-full flex flex-col gap-3">
            <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
              <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px]">
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
                        ? "border-sky-500 ring-2 ring-sky-400/40"
                        : "border-slate-300 hover:border-sky-400"
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

        {/* GRID ESQUERDA / DIREITA */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="space-y-4">
            {/* RESUMO DO ANÚNCIO */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Resumo do anúncio
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                {anuncio.pilar_turismo && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Experiência:{" "}
                    </span>
                    {labelPilar[anuncio.pilar_turismo]}
                  </div>
                )}
                {anuncio.subcategoria_turismo && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Tipo de lugar:{" "}
                    </span>
                    {labelSubcategoria(anuncio.subcategoria_turismo)}
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
                {anuncio.nome_negocio && (
                  <div>
                    <span className="font-semibold text-slate-900">
                      Nome do negócio:{" "}
                    </span>
                    {anuncio.nome_negocio}
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
              </div>
            </div>

            {/* DETALHES DO PASSEIO / ATIVIDADE */}
            {isPasseio && (
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Detalhes do passeio / atividade
                </h2>
                <div className="grid gap-2 text-xs text-slate-700 md:grid-cols-2">
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
                    <div className="md:col-span-2">
                      <span className="font-semibold text-slate-900">
                        Ponto de embarque / encontro:{" "}
                      </span>
                      {anuncio.ponto_embarque}
                    </div>
                  )}
                  {anuncio.itens_inclusos && (
                    <div className="md:col-span-2">
                      <span className="font-semibold text-slate-900">
                        Itens inclusos:{" "}
                      </span>
                      {anuncio.itens_inclusos}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DESCRIÇÃO + MAPA */}
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Sobre o lugar / serviço
                </h2>
                <p className="text-xs text-slate-700 whitespace-pre-line">
                  {anuncio.descricao}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-900 mb-2">
                  Localização aproximada
                </h3>
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
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
                  O mapa é aproximado e pode não indicar o endereço exato.
                  Confirme sempre com o anunciante.
                </p>
              </div>
            </div>

            {/* VÍDEO */}
            {anuncio.video_url && (
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Vídeo
                </h2>
                <p className="text-xs text-slate-700 mb-3">
                  Assista a um vídeo deste lugar / passeio no YouTube.
                </p>
                <a
                  href={anuncio.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  ▶ Ver vídeo no YouTube
                </a>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA – CONTATO */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Reservas &amp; contato
              </h2>

              {nomeResponsavel && (
                <p className="text-xs text-slate-700 mb-1">
                  <span className="font-semibold text-slate-900">
                    Responsável:{" "}
                  </span>
                  {nomeResponsavel}
                </p>
              )}

              {whatsappLink && (
                <div className="mb-4">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1EBE57]"
                  >
                    <span className="mr-2 text-sm">🟢</span>
                    Conversar pelo WhatsApp
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

              {(anuncio.site_url ||
                anuncio.instagram ||
                anuncio.facebook) && (
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
                        className="text-blue-600 hover:underline"
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
                        className="text-pink-600 hover:underline"
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
                      <a
                        href={anuncio.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {anuncio.facebook}
                      </a>
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

        {/* SIMILARES */}
        <section className="mt-6">
          <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Outros lugares que você pode gostar
            </h2>

            {similares.length === 0 ? (
              <p className="text-[11px] text-slate-600">
                Em breve, mais anúncios de turismo nesta região aparecerão aqui.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : null;
                  const precoItem =
                    item.faixa_preco || item.preco || "";

                  return (
                    <Link
                      key={item.id}
                      href={`/turismo/anuncio/${item.id}`}
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

        {/* VOLTAR (MOBILE) */}
        <div className="mt-4 flex justify-center sm:hidden">
          <Link
            href="/turismo"
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Voltar para Turismo
          </Link>
        </div>

        {/* RODAPÉ SIMPLES */}
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
            Classilagos • O seu guia de compras, serviços e turismo na Região
            dos Lagos
          </p>
        </footer>
      </section>
    </main>
  );
}

