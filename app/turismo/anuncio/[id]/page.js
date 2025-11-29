"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../../supabaseClient";
import BannerRotator from "../../../components/BannerRotator";

// Fundo marinho em tela cheia
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
      {/* camada leve pra dar contraste */}
      <div className="absolute inset-0 bg-sky-950/35" />
    </div>
  );
}

export default function TurismoAnuncioPage() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [similares, setSimilares] = useState([]);

  // URL para compartilhar
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
        .select(
          `
          id,
          titulo,
          cidade,
          bairro,
          descricao,
          imagens,
          preco,
          faixa_preco,
          telefone,
          whatsapp,
          email,
          nome_contato,
          site_url,
          instagram,
          endereco,
          pilar_turismo,
          subcategoria_turismo,
          video_url,
          created_at,
          categoria
          `
        )
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        setErro("Não foi possível carregar este anúncio de turismo.");
        setLoading(false);
        return;
      }

      // Garantir que é turismo (por segurança)
      if (data.categoria !== "turismo") {
        setErro("Este anúncio não pertence ao portal de Turismo.");
        setLoading(false);
        return;
      }

      setAnuncio(data);
      setFotoIndex(0);

      const { data: similaresData } = await supabase
        .from("anuncios")
        .select(
          "id, titulo, cidade, bairro, imagens, faixa_preco, preco, pilar_turismo, subcategoria_turismo"
        )
        .eq("categoria", "turismo")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(4);

      setSimilares(similaresData || []);
      setLoading(false);
    };

    fetchAnuncio();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm text-slate-200">Carregando anúncio de turismo…</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
        <p className="text-sm mb-4 text-center">{erro || "Anúncio não encontrado."}</p>
        <Link
          href="/turismo"
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-600"
        >
          Voltar para Turismo
        </Link>
      </main>
    );
  }

  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;

  const whatsappRaw = anuncio.whatsapp || "";
  const telefoneRaw = anuncio.telefone || "";
  const email = anuncio.email || "";

  const whatsappDigits = whatsappRaw.replace(/\D/g, "");
  const whatsappLink =
    whatsappDigits && shareUrl
      ? `https://wa.me/55${whatsappDigits}?text=${encodeURIComponent(
          `Olá, vi o anúncio "${anuncio.titulo}" no Classilagos Turismo e gostaria de mais informações.`
        )}`
      : null;

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este lugar no Classilagos Turismo: ${anuncio.titulo}`
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

  // AQUI estava o erro: tirei o ": Record<string,string>"
  const labelPilar = {
    onde_ficar: "Onde ficar",
    onde_comer: "Onde comer",
    onde_se_divertir: "Onde se divertir",
    onde_passear: "Onde passear",
    servicos_turismo: "Serviços de turismo",
    produtos_turisticos: "Produtos turísticos",
    outros: "Turismo / serviços",
  };

  const pilarLabel = labelPilar[anuncio.pilar_turismo] || "Turismo";

  // AQUI também: tirei o "(p: string)" e deixei só "(p)"
  const subLabel = anuncio.subcategoria_turismo
    ? anuncio.subcategoria_turismo
        .split("_")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ")
    : "";

  const precoExibicao = anuncio.faixa_preco || anuncio.preco || "";

  const tituloSimilares = "Outros lugares que você pode gostar";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900 relative overflow-x-hidden">
      <BackgroundMarinho />

      {/* BANNER NO TOPO */}
      <section className="relative bg-white/90">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
          <BannerRotator />
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="relative max-w-5xl mx-auto px-4 pb-10">
        {/* Cabeçalho */}
        <header className="pt-6 pb-4 flex flex-col gap-3">
          <p className="text-[11px] text-slate-100/90">
            Classilagos – Turismo &amp; Guia ONDE
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">
                {anuncio.titulo}
              </h1>

              <p className="mt-1 text-[11px] md:text-xs text-sky-100">
                {pilarLabel}
                {subLabel ? ` • ${subLabel}` : ""}
              </p>

              <p className="text-xs md:text-sm text-slate-100 mt-1">
                {anuncio.cidade}
                {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              {precoExibicao && (
                <div className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                  {precoExibicao}
                </div>
              )}

              <Link
                href="/turismo"
                className="rounded-full border border-sky-100/60 bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-800 hover:bg-white"
              >
                Voltar para Turismo
              </Link>
            </div>
          </div>

          {/* Compartilhar */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
            <span className="text-slate-100">Compartilhar:</span>
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
        </header>

        {/* Cardão branco principal */}
        <div className="mt-2 rounded-3xl bg-white/95 border border-slate-200 shadow-xl overflow-hidden">
          {/* FOTO DE DESTAQUE */}
          {temImagens && (
            <section className="w-full">
              <div className="w-full bg-slate-100">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] overflow-hidden">
                  <img
                    src={imagens[fotoIndex]}
                    alt={anuncio.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {imagens.length > 1 && (
                <div className="px-4 py-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 bg-slate-50 border-t border-slate-200">
                  {imagens.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFotoIndex(index)}
                      className={`rounded-xl overflow-hidden border transition ${
                        fotoIndex === index
                          ? "border-sky-500 ring-2 ring-sky-300/50"
                          : "border-slate-300 hover:border-sky-400"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-14 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* GRID ESQUERDA / DIREITA */}
          <div className="px-4 sm:px-6 py-5 grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-5">
            {/* ESQUERDA – sobre o lugar */}
            <div className="space-y-4">
              <section>
                <h2 className="text-sm font-semibold text-slate-900 mb-1">
                  Sobre este lugar
                </h2>
                <p className="text-xs text-slate-700 whitespace-pre-line">
                  {anuncio.descricao}
                </p>

                {(anuncio.site_url || anuncio.instagram) && (
                  <div className="mt-3 space-y-1 text-xs text-slate-700">
                    {anuncio.site_url && (
                      <p>
                        <span className="font-semibold text-slate-900">
                          Site / reservas:{" "}
                        </span>
                        <a
                          href={anuncio.site_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-700 hover:underline"
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
                          className="text-sky-700 hover:underline"
                        >
                          {anuncio.instagram}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Mapa */}
              <section>
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
              </section>

              {/* Vídeo se tiver */}
              {anuncio.video_url && (
                <section className="mt-2">
                  <h3 className="text-xs font-semibold text-slate-900 mb-1">
                    Vídeo
                  </h3>
                  <p className="text-[11px] text-slate-700 mb-2">
                    Assista ao vídeo completo deste lugar no YouTube.
                  </p>
                  <a
                    href={anuncio.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    ▶ Ver vídeo no YouTube
                  </a>
                </section>
              )}
            </div>

            {/* DIREITA – contato e complementos */}
            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-700">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Para falar com o responsável
                </h2>

                {whatsappLink && (
                  <div className="mb-3">
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

                <div className="space-y-1">
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

                <p className="text-[11px] text-slate-500 pt-3">
                  Anúncio publicado em{" "}
                  {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-700">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Para completar sua viagem
                </h2>
                <p className="text-[11px] text-slate-600 mb-2">
                  Em breve, aqui você poderá ver ofertas de parceiros e produtos
                  que combinam com esta experiência na Região dos Lagos.
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Equipamentos de praia e mergulho.</li>
                  <li>Roupas leves e acessórios de viagem.</li>
                  <li>
                    Itens para registrar a viagem (câmeras, suportes etc.).
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </div>

        {/* SIMILARES */}
        <section className="mt-6">
          <div className="rounded-3xl bg-white/95 border border-slate-200 px-4 sm:px-5 py-4 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              {tituloSimilares}
            </h2>

            {similares.length === 0 ? (
              <p className="text-[11px] text-slate-600">
                Em breve mais opções de turismo nesta região aparecerão aqui.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : null;
                  const precoSim =
                    item.faixa_preco || item.preco || "";

                  return (
                    <Link
                      key={item.id}
                      href={`/turismo/anuncio/${item.id}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                    >
                      {img && (
                        <div className="w-full h-24 overflow-hidden bg-slate-100">
                          <img
                            src={img}
                            alt={item.titulo}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                          />
                        </div>
                      )}
                      <div className="px-3 py-2 space-y-1 text-xs text-slate-700 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                            {labelPilar[item.pilar_turismo] || "Turismo"}
                          </p>
                          <p className="font-semibold line-clamp-2">
                            {item.titulo}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.cidade}
                            {item.bairro ? ` • ${item.bairro}` : ""}
                          </p>
                        </div>
                        {precoSim && (
                          <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                            {precoSim}
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

        {/* Rodapé dentro do fundo marinho */}
        <footer className="mt-8 text-center text-[11px] text-slate-100 space-y-1 pb-6">
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
            Classilagos Turismo • Onde ficar, onde comer e onde se divertir na
            Região dos Lagos.
          </p>
        </footer>
      </section>
    </main>
  );
}

