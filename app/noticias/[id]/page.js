"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

/** ✅ BANNERS AFILIADOS (Topo) */
const bannersTopo = [
  {
    src: "/banners/topo/banner-topo-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/banner-topo-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

/** ✅ BANNERS AFILIADOS (Rodapé) */
const bannersRodape = [
  {
    src: "/banners/rodape/banner-rodape-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/rodape/banner-rodape-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

function safeText(v) {
  return typeof v === "string" ? v : "";
}

function formatDateBR(value) {
  try {
    return new Date(value).toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

/** ✅ Decodifica coisas tipo &#8230; &#8220; etc */
function decodeHtmlEntities(input = "") {
  const str = safeText(input);
  if (!str) return "";
  if (typeof window === "undefined") {
    return str
      .replace(/&#8230;/g, "...")
      .replace(/&#8220;|&#8221;/g, '"')
      .replace(/&#8216;|&#8217;/g, "'")
      .replace(/&#8211;/g, "-")
      .replace(/&nbsp;/g, " ");
  }
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value || str;
}

function isExternal(href) {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

/** ✅ Banner rotativo (clicável) */
function BannerRotator({ banners = [], height = 120, label = "" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners]);

  const current = banners?.[idx] || null;

  return (
    <section className="w-full bg-slate-100 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col items-center">
        <div
          className="relative w-full max-w-[900px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden"
          style={{ height }}
        >
          {current ? (
            <Link
              href={current.href || "#"}
              target={isExternal(current.href) ? "_blank" : undefined}
              rel={isExternal(current.href) ? "noreferrer" : undefined}
              className="absolute inset-0 block"
              title={current.alt || "Banner"}
            >
              <Image
                src={current.src}
                alt={current.alt || label || "Banner"}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain cursor-pointer"
              />
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-black/0 hover:bg-black/5" />
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              (sem banner)
            </div>
          )}
        </div>

        {label ? (
          <p className="mt-2 text-[11px] text-slate-500 text-center">{label}</p>
        ) : null}

        {banners?.length > 1 && (
          <div className="mt-2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full border border-slate-300 ${
                  idx === i ? "bg-slate-700" : "bg-white hover:bg-slate-200"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function NoticiaDetalhePage() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchNoticia = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErro("Notícia não encontrada.");
        setLoading(false);
        return;
      }

      setNoticia(data);

      const { data: rel } = await supabase
        .from("noticias")
        .select("id, titulo, cidade, categoria, imagem_capa, resumo, created_at, tipo")
        .eq("cidade", data.cidade)
        .neq("id", data.id)
        .eq("status", "publicado")
        .order("created_at", { ascending: false })
        .limit(4);

      setRelacionadas(rel || []);
      setLoading(false);
    };

    fetchNoticia();
  }, [id]);

  const tituloOk = useMemo(() => decodeHtmlEntities(noticia?.titulo || ""), [noticia]);
  const resumoOk = useMemo(() => decodeHtmlEntities(noticia?.resumo || ""), [noticia]);
  const textoOk = useMemo(() => decodeHtmlEntities(noticia?.texto || ""), [noticia]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5FBFF]">
        <BannerRotator banners={bannersTopo} height={120} label="Ofertas e parceiros (afiliados)." />
        <div className="min-h-[55vh] flex items-center justify-center">
          <p className="text-sm text-slate-600">Carregando notícia…</p>
        </div>
        <BannerRotator banners={bannersRodape} height={120} label="Ofertas e parceiros (afiliados)." />
      </main>
    );
  }

  if (erro || !noticia) {
    return (
      <main className="min-h-screen bg-[#F5FBFF]">
        <BannerRotator banners={bannersTopo} height={120} label="Ofertas e parceiros (afiliados)." />
        <div className="min-h-[55vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-slate-700 mb-4">{erro}</p>
          <Link
            href="/noticias"
            className="rounded-full bg-blue-500 px-5 py-2 text-sm text-white font-semibold hover:bg-blue-600"
          >
            Voltar para notícias
          </Link>
        </div>
        <BannerRotator banners={bannersRodape} height={120} label="Ofertas e parceiros (afiliados)." />
      </main>
    );
  }

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const shareText = encodeURIComponent(tituloOk || "Classilagos Notícias");
  const whatsappShare = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const isImportada = (noticia.tipo || "").toLowerCase() === "importada";
  const temFonte = !!safeText(noticia.fonte);
  const temLinkOriginal = !!safeText(noticia.link_original);

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-12">
      {/* ✅ BANNER TOPO (clicável) */}
      <BannerRotator banners={bannersTopo} height={120} label="Ofertas e parceiros (afiliados)." />

      {/* TOPO MARCA + SLOGAN */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-1">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Classilagos Notícias
          </h1>
          <p className="text-xs md:text-sm text-slate-600">
            O portal oficial de informação da Região dos Lagos
          </p>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* CAPA */}
        {noticia.imagem_capa ? (
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={noticia.imagem_capa}
              alt={tituloOk || "Notícia"}
              className="w-full h-[240px] sm:h-[320px] md:h-[380px] object-cover"
            />
          </div>
        ) : null}

        {/* CABEÇALHO DA MATÉRIA */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            {tituloOk}
          </h2>

          <p className="text-xs text-slate-500">
            {safeText(noticia.cidade)} • {safeText(noticia.categoria)} •{" "}
            {formatDateBR(noticia.published_at || noticia.created_at)}
          </p>

          {/* ✅ Resumo (opcional) */}
          {resumoOk ? (
            <p className="text-sm text-slate-700 leading-relaxed">{resumoOk}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
            <span className="text-slate-500">Compartilhar:</span>

            <a
              href={whatsappShare}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#1EBE57]"
            >
              🟢 WhatsApp
            </a>

            <a
              href={facebookShare}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#1877F2] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0F5BCC]"
            >
              📘 Facebook
            </a>

            <Link
              href="/noticias"
              className="ml-auto inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* TEXTO */}
        <article className="bg-white rounded-3xl border border-slate-200 px-5 py-6 shadow-sm">
          <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {textoOk}
          </p>

          {/* ✅ Fonte / Link original (quando importada) */}
          {(isImportada || temFonte || temLinkOriginal) && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold text-slate-700">
                Fonte e referência
              </p>

              <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                {temFonte && (
                  <p>
                    <span className="font-semibold text-slate-700">Fonte:</span>{" "}
                    {safeText(noticia.fonte)}
                  </p>
                )}

                {temLinkOriginal && (
                  <p className="break-all">
                    <span className="font-semibold text-slate-700">Link:</span>{" "}
                    <a
                      href={noticia.link_original}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 underline"
                    >
                      {safeText(noticia.link_original)}
                    </a>
                  </p>
                )}

                {isImportada && (
                  <p className="text-[10px] text-slate-500">
                    Este conteúdo foi importado automaticamente e pode ter sido adaptado para o padrão editorial do Classilagos.
                  </p>
                )}
              </div>
            </div>
          )}
        </article>

        {/* RELACIONADAS */}
        <section className="bg-white rounded-3xl border border-slate-200 px-5 py-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Notícias relacionadas em {safeText(noticia.cidade)}
          </h3>

          {relacionadas.length === 0 && (
            <p className="text-xs text-slate-500">
              Nenhuma notícia relacionada por enquanto.
            </p>
          )}

          {relacionadas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relacionadas.map((n) => {
                const t = decodeHtmlEntities(n.titulo || "");
                const r = decodeHtmlEntities(n.resumo || "");
                return (
                  <Link
                    key={n.id}
                    href={`/noticias/${n.id}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden flex flex-col"
                  >
                    {n.imagem_capa ? (
                      <div className="w-full h-28 overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={n.imagem_capa}
                          alt={t || "Notícia"}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-28 bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center text-[11px] text-slate-500">
                        Classilagos
                      </div>
                    )}

                    <div className="px-3 py-2 space-y-1">
                      <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                        {safeText(n.cidade)} • {safeText(n.categoria)}
                      </p>
                      <p className="text-[13px] font-semibold line-clamp-2">{t}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{r}</p>
                      <p className="text-[11px] text-slate-400">
                        {formatDateBR(n.created_at)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* VOLTAR (MOBILE) */}
        <div className="mt-2 flex justify-center sm:hidden">
          <Link
            href="/noticias"
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Voltar
          </Link>
        </div>
      </section>

      {/* ✅ BANNER RODAPÉ (clicável) */}
      <div className="mt-8">
        <BannerRotator banners={bannersRodape} height={120} label="Ofertas e parceiros (afiliados)." />
      </div>

      {/* RODAPÉ */}
      <footer className="mt-6 text-center text-[11px] text-slate-500 space-y-1">
        <p>Classilagos • O seu guia de notícias da Região dos Lagos</p>
      </footer>
    </main>
  );
}
