"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";
import BannerRotator from "../../../components/BannerRotator";

// rótulos para o pilar
const PILAR_LABEL = {
  onde_ficar: "Onde ficar",
  onde_comer: "Onde comer",
  onde_se_divertir: "Onde se divertir",
  onde_passear: "Onde passear",
  servicos_turismo: "Serviços de turismo",
  produtos_turisticos: "Produtos turísticos",
  outros: "Turismo / serviços",
};

// formata a subcategoria (ex.: "pousada_hotel_hostel" -> "Pousada Hotel Hostel")
function labelSubcategoria(sub) {
  if (!sub) return "";
  return sub
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default function TurismoAnuncioPage() {
  const { id } = useParams();

  const [anuncio, setAnuncio] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [fotoIndex, setFotoIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  // URL atual (para compartilhar)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Carrega anúncio + similares (só de TURISMO)
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

      // similares na mesma cidade
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

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-sky-950 text-slate-100">
        <p className="text-sm">Carregando anúncio de turismo…</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-sky-950 text-slate-100 px-4">
        <p className="text-sm mb-4">
          {erro || "Anúncio de turismo não encontrado."}
        </p>
        <Link
          href="/turismo"
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
        >
          Voltar para Turismo
        </Link>
      </main>
    );
  }

  // imagens
  const imagens = Array.isArray(anuncio.imagens) ? anuncio.imagens : [];
  const temImagens = imagens.length > 0;

  // preço / faixa de preço (no turismo geralmente usamos faixa_preco)
  const precoExibicao =
    anuncio.faixa_preco || (anuncio.preco ? `R$ ${anuncio.preco}` : "");

  // pilar e subcategoria
  const pilarLabel = PILAR_LABEL[anuncio.pilar_turismo] || "Turismo";
  const subLabel = labelSubcategoria(anuncio.subcategoria_turismo);

  // compartilhamento
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(
    `Olha este lugar no Classilagos Turismo: ${anuncio.titulo}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // contato
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

  // endereço / mapa
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
    <main
      className="min-h-screen"
      style={{
        backgroundImage: "url(/turismo/bg-mergulho.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* camada bem suave por cima do fundo */}
      <div className="min-h-screen bg-sky-950/30">
        {/* BANNER TOPO (igual às outras páginas) */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 pt-4 pb-3">
            <BannerRotator />
          </div>
        </section>

        {/* CABEÇALHO TURISMO */}
        <section className="pt-4 pb-3">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-3xl bg-sky-900/90 text-white px-5 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-sky-200">
                  Classilagos – Turismo &amp; Guia ONDE
                </p>
                <h1 className="text-2xl md:text-3xl font-extrabold">
                  {anuncio.titulo}
                </h1>
                <p className="text-xs md:text-sm text-sky-100">
                  {pilarLabel}
                  {subLabel ? ` • ${subLabel}` : ""}
                </p>
                <p className="text-xs text-sky-200">
                  {anuncio.cidade}
                  {anuncio.bairro ? ` • ${anuncio.bairro}` : ""}
                </p>

                {/* compartilhar */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] mt-2">
                  <span className="text-sky-200">Compartilhar:</span>
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

              <div className="flex flex-col items-end gap-2">
                {precoExibicao && (
                  <div className="rounded-full bg-emerald-500 px-5 py-2 text-xs md:text-sm font-semibold text-white shadow">
                    {precoExibicao}
                  </div>
                )}

                <Link
                  href="/turismo"
                  className="rounded-full border border-sky-200/70 bg-sky-900/60 px-4 py-1.5 text-[11px] font-semibold text-sky-50 hover:bg-sky-800"
                >
                  Voltar para Turismo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTEÚDO EM CARDS BRANCOS */}
        <section className="max-w-6xl mx-auto px-4 pb-10 space-y-6">
          {/* GALERIA DE FOTOS */}
          {temImagens && (
            <section className="w-full flex flex-col gap-3">
              <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg">
                <img
                  src={imagens[fotoIndex]}
                  alt={anuncio.titulo}
                  className="w-full h-auto max-h-[320px] object-cover object-center rounded-2xl"
                />
              </div>

              {imagens.length > 1 && (
                <div className="w-full max-w-5xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {imagens.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFotoIndex(index)}
                      className={`rounded-xl overflow-hidden border transition ${
                        fotoIndex === index
                          ? "border-cyan-500 ring-2 ring-cyan-400/40"
                          : "border-slate-300 hover:border-cyan-400"
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

          {/* GRID PRINCIPAL: SOBRE / CONTATO / MAPA */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-6">
            {/* COLUNA ESQUERDA */}
            <div className="space-y-4">
              {/* SOBRE ESSE LUGAR */}
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Sobre este lugar
                </h2>
                <p className="text-xs text-slate-700 whitespace-pre-line">
                  {anuncio.descricao}
                </p>

                <div className="mt-4 space-y-1 text-xs text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">
                      Tipo de lugar:{" "}
                    </span>
                    {pilarLabel}
                    {subLabel ? ` • ${subLabel}` : ""}
                  </p>
                  {precoExibicao && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Faixa de preço:{" "}
                      </span>
                      {precoExibicao}
                    </p>
                  )}
                  {anuncio.site_url && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        Site / reservas:{" "}
                      </span>
                      <a
                        href={anuncio.site_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline break-all"
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
                        className="text-blue-600 hover:underline break-all"
                      >
                        {anuncio.instagram}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* MAPA */}
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm space-y-3">
                <h3 className="text-xs font-semibold text-slate-900">
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
                <p className="text-[10px] text-slate-500">
                  O mapa é aproximado e pode não indicar o endereço exato.
                  Confirme sempre com o anunciante.
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA – CONTATO + COMPLEMENTO */}
            <div className="space-y-4">
              {/* CONTATO */}
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Fale com o anunciante
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

                <p className="text-[11px] text-slate-500 pt-3">
                  Anúncio publicado em{" "}
                  {new Date(anuncio.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {/* COMPLEMENTAR VIAGEM */}
              <div className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Para completar sua viagem
                </h2>
                <p className="text-xs text-slate-700 mb-2">
                  Em breve, aqui você poderá ver ofertas de parceiros e produtos
                  que combinam com esta experiência na Região dos Lagos.
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1">
                  <li>Equipamentos de praia e mergulho.</li>
                  <li>Roupas leves e acessórios de viagem.</li>
                  <li>
                    Itens para registrar a viagem (câmeras, suportes etc.).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* OUTROS LUGARES */}
          <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Outros lugares que você pode gostar
            </h2>

            {similares.length === 0 ? (
              <p className="text-[11px] text-slate-600">
                Em breve, mais opções de turismo nesta região aparecerão aqui.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
                {similares.map((item) => {
                  const img =
                    Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : null;
                  const precoCard =
                    item.faixa_preco || (item.preco ? `R$ ${item.preco}` : "");

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
                          {PILAR_LABEL[item.pilar_turismo] || "Turismo"}
                        </p>
                        <p className="font-semibold line-clamp-2">
                          {item.titulo}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {item.cidade}
                          {item.bairro ? ` • ${item.bairro}` : ""}
                        </p>
                        {precoCard && (
                          <p className="text-[11px] font-semibold text-emerald-700">
                            {precoCard}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Botão voltar (mobile) */}
          <div className="mt-4 flex justify-center sm:hidden">
            <Link
              href="/turismo"
              className="rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Voltar para Turismo
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

