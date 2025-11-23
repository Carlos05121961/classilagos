"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

const CATEGORIA_LABELS = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  nautica: "Náutica",
  pets: "Pets",
  empregos: "Empregos",
  servicos: "Serviços",
  turismo: "Turismo",
  lagolistas: "LagoListas",
};

export default function AnuncioDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [anuncio, setAnuncio] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      setErro("");
      setLoading(true);

      // 1) Carrega o anúncio principal
      const { data, error } = await supabase
        .from("anuncios")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error || !data) {
        console.error(error);
        setErro("Não foi possível carregar este anúncio.");
        setAnuncio(null);
        setLoading(false);
        return;
      }

      setAnuncio(data);

      // 2) Carrega alguns anúncios similares (mesma categoria, outro id)
      const { data: similaresData, error: similaresError } = await supabase
        .from("anuncios")
        .select("*")
        .eq("categoria", data.categoria)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (similaresError) {
        console.error(similaresError);
      } else {
        setSimilares(similaresData || []);
      }

      setLoading(false);
    }

    carregar();
  }, [id]);

  // endereço para mapa
  const enderecoMapa = anuncio
    ? [anuncio.cidade].filter(Boolean).join(" - ")
    : "";

  const mapaEmbedUrl =
    enderecoMapa &&
    `https://www.google.com/maps?q=${encodeURIComponent(
      enderecoMapa
    )}&output=embed`;

  const mapaLink =
    enderecoMapa &&
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      enderecoMapa
    )}`;

  // link de WhatsApp para contato
  let whatsappUrl = null;
  if (anuncio?.contato) {
    const digits = anuncio.contato.replace(/\D/g, "");
    if (digits.length >= 10) {
      const num =
        digits.startsWith("55") || digits.length > 11 ? digits : `55${digits}`;
      whatsappUrl = `https://wa.me/${num}`;
    }
  }

  const categoria = anuncio?.categoria || "imoveis";
  const categoriaLabel = CATEGORIA_LABELS[categoria] || "Anúncio";

  const imagens = anuncio?.imagens || [];

  function abrirLightbox(index) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function fecharLightbox() {
    setLightboxOpen(false);
  }

  function proximaImagem() {
    if (!imagens.length) return;
    setLightboxIndex((prev) => (prev + 1) % imagens.length);
  }

  function imagemAnterior() {
    if (!imagens.length) return;
    setLightboxIndex((prev) =>
      (prev - 1 + imagens.length) % imagens.length
    );
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copiado!");
    } catch (e) {
      console.error(e);
      alert("Não foi possível copiar o link.");
    }
  }

  const shareText = anuncio
    ? `Dá uma olhada nesse anúncio no Classilagos: ${anuncio.titulo}`
    : "Veja este anúncio no Classilagos";

  const shareWhatsApp =
    currentUrl &&
    `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`;

  const shareFacebook =
    currentUrl &&
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-gray-600">Carregando anúncio...</p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        <p className="text-red-600">{erro || "Anúncio não encontrado."}</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Voltar para a página inicial
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Banner topo simples (você pode trocar por uma imagem fixa depois) */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 text-white shadow-sm">
        <p className="text-xs uppercase tracking-wide opacity-80">
          Classilagos · {categoriaLabel}
        </p>
        <h1 className="text-xl md:text-2xl font-semibold mt-1">
          {anuncio.titulo}
        </h1>
        {anuncio.cidade && (
          <p className="text-sm mt-1 opacity-90">{anuncio.cidade}</p>
        )}
      </div>

      {/* Link voltar */}
      <button
        onClick={() =>
          router.push(
            categoria === "imoveis" ? "/imoveis" : `/${categoria || ""}`
          )
        }
        className="text-xs text-gray-600 hover:text-gray-900"
      >
        ← Voltar para {categoriaLabel}
      </button>

      {/* Layout principal: conteúdo + lateral */}
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* Coluna esquerda */}
        <div className="space-y-6">
          {/* Galeria de fotos */}
          {imagens.length > 0 && (
            <section className="space-y-3">
              <div
                className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => abrirLightbox(0)}
              >
                <Image
                  src={imagens[0]}
                  alt={anuncio.titulo}
                  fill
                  className="object-cover"
                />
              </div>

              {imagens.length > 1 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {imagens.slice(1).map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => abrirLightbox(idx + 1)}
                      className="relative h-20 rounded-xl overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={url}
                        alt={`Foto ${idx + 2} do anúncio`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Descrição */}
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Descrição do imóvel
            </h2>
            <p className="whitespace-pre-line text-sm text-gray-800">
              {anuncio.descricao}
            </p>
          </section>

          {/* Mapa */}
          {mapaEmbedUrl && (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Localização aproximada
              </h2>
              <p className="text-xs text-gray-500">
                Endereço aproximado baseado na cidade informada. Para ver no
                mapa completo, clique abaixo.
              </p>
              <div className="w-full h-56 md:h-64 rounded-2xl overflow-hidden border">
                <iframe
                  src={mapaEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              {mapaLink && (
                <a
                  href={mapaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  📍 Abrir no Google Maps
                </a>
              )}
            </section>
          )}

          {/* Imóveis similares */}
          {similares.length > 0 && (
            <section className="space-y-3 pt-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Imóveis similares
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {similares.map((sim) => (
                  <Link
                    key={sim.id}
                    href={`/anuncios/${sim.id}`}
                    className="rounded-2xl border border-gray-200 bg-white p-3 hover:shadow-sm transition"
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {sim.cidade || "Cidade não informada"}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {sim.titulo}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {sim.descricao}
                    </p>
                    <p className="mt-2 text-[11px] text-gray-400">
                      Publicado em{" "}
                      {new Date(sim.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Coluna direita: contato, vídeo, anúncios parceiros */}
        <aside className="space-y-4">
          {/* Contato */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">
              Fale com o anunciante
            </h3>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Telefone / WhatsApp: </span>
              {anuncio.contato}
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
              >
                💬 Conversar no WhatsApp
              </a>
            )}
          </div>

          {/* Vídeo */}
          {anuncio.video_url && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">
                Vídeo do imóvel
              </h3>
              <a
                href={anuncio.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-xs font-semibold text-red-600 hover:text-red-700"
              >
                ▶ Assistir no YouTube
              </a>
            </div>
          )}

          {/* Compartilhar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">
              Compartilhar anúncio
            </h3>
            <div className="flex flex-wrap gap-2">
              {shareWhatsApp && (
                <a
                  href={shareWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                >
                  WhatsApp
                </a>
              )}
              {shareFacebook && (
                <a
                  href={shareFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  Facebook
                </a>
              )}
              <button
                type="button"
                onClick={copiarLink}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Copiar link
              </button>
            </div>
          </div>

          {/* Espaço para Mercado Livre / Shopee */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">
              Ofertas recomendadas
            </h3>
            <p className="text-xs text-gray-500">
              Espaço reservado para links de produtos do Mercado Livre, Shopee
              ou outros parceiros.
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kit ferramentas para casa (exemplo)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Decoração para sala (exemplo)
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Lightbox de imagens */}
      {lightboxOpen && imagens.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            type="button"
            onClick={fecharLightbox}
            className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-white"
          >
            Fechar ✕
          </button>

          <button
            type="button"
            onClick={imagemAnterior}
            className="absolute left-4 rounded-full bg-white/80 px-3 py-2 text-lg font-bold text-gray-800 hover:bg-white"
          >
            ‹
          </button>

          <div className="relative w-[90vw] max-w-3xl h-[60vh]">
            <Image
              src={imagens[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1} do anúncio`}
              fill
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={proximaImagem}
            className="absolute right-4 rounded-full bg-white/80 px-3 py-2 text-lg font-bold text-gray-800 hover:bg-white"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
