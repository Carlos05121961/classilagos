"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";
import BannerRotator from "../components/BannerRotator";

const CIDADES = [
  "Maricá",
  "Saquarema",
  "Araruama",
  "Iguaba Grande",
  "São Pedro da Aldeia",
  "Arraial do Cabo",
  "Cabo Frio",
  "Búzios",
  "Rio das Ostras",
];

// ✅ BANNERS NOTÍCIAS (arquivos diferentes dos pilares) + LINKS AFILIADOS
// 🔝 TOPO = 720x120
const bannersTopoNoticias = [
  {
    src: "/banners/topo/topo-noticias-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/topo/topo-noticias-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/topo/topo-noticias-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/topo/topo-noticias-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/topo/topo-noticias-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

// 🔻 RODAPÉ = 720x170
const bannersRodapeNoticias = [
  {
    src: "/banners/rodape/rodape-noticias-01.webp",
    href: "https://mercadolivre.com/sec/2KgtVeb",
    alt: "Ofertas de Verão – Ventiladores e Ar-condicionado (Mercado Livre)",
  },
  {
    src: "/banners/rodape/rodape-noticias-02.webp",
    href: "https://mercadolivre.com/sec/2nVCHmw",
    alt: "Verão Praia 2026 – Cadeiras, Sombreiros e Coolers (Mercado Livre)",
  },
  {
    src: "/banners/rodape/rodape-noticias-03.webp",
    href: "https://mercadolivre.com/sec/17Q8mju",
    alt: "Caixas de Som (Mercado Livre)",
  },
  {
    src: "/banners/rodape/rodape-noticias-04.webp",
    href: "https://mercadolivre.com/sec/2BbG4vr",
    alt: "TVs Smart (Mercado Livre)",
  },
  {
    src: "/banners/rodape/rodape-noticias-05.webp",
    href: "https://mercadolivre.com/sec/32bqvEJ",
    alt: "Celulares e Tablets (Mercado Livre)",
  },
];

function formatDateBR(value) {
  try {
    return new Date(value).toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

function safeText(v) {
  return typeof v === "string" ? v : "";
}

export default function NoticiasHomePage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("Todas");

  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("noticias")
        .select("id, titulo, cidade, categoria, resumo, imagem_capa, created_at, status")
        .eq("status", "publicado")
        .order("created_at", { ascending: false })
        .limit(24);

      if (error) {
        console.error("Erro ao carregar notícias:", error);
        setErro("Não foi possível carregar as notícias no momento.");
        setLoading(false);
        return;
      }

      setNoticias(data || []);
      setLoading(false);
    };

    fetchNoticias();
  }, []);

  const noticiasFiltradas = useMemo(() => {
    if (cidadeFiltro === "Todas") return noticias;
    return noticias.filter((n) => (n.cidade || "").toLowerCase() === cidadeFiltro.toLowerCase());
  }, [noticias, cidadeFiltro]);

  const destaques = noticiasFiltradas.slice(0, 3);
  const recentes = noticiasFiltradas.slice(3, 15);

  const imagemFallback = "/banners/noticias-default.webp";

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* ✅ BANNER TOPO (720x120) — PADRÃO PREMIUM + LINKS AFILIADOS */}
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersTopoNoticias} interval={6000} height={120} maxWidth={720} />
        </div>
      </section>

      {/* TOPO MARCA + SLOGAN */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 space-y-1">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">Classilagos Notícias</h1>
          <p className="text-xs md:text-sm text-slate-600">O portal oficial de informação da Região dos Lagos</p>
        </div>
      </section>

      {/* HERO PRINCIPAL */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-3">
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              Acompanhe o que acontece em Maricá, Saquarema, Araruama, Iguaba Grande, São Pedro da Aldeia, Arraial do Cabo,
              Cabo Frio, Búzios e Rio das Ostras: cidade, turismo, cultura, trânsito, clima e muito mais.
            </p>

            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] text-sky-700">Turismo &amp; Cultura</span>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">Cidade &amp; Serviços</span>
              <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-[11px] text-yellow-700">Praia, Marés &amp; Trânsito</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/noticias/publicar"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-sky-700"
              >
                Publicar uma notícia
              </Link>
              <Link
                href="/noticias/cameras"
                className="inline-flex items-center rounded-full border border-sky-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                Ver câmeras ao vivo
              </Link>
            </div>
          </div>

          {/* Painel rápido */}
          <div className="mt-4 lg:mt-0 lg:w-72">
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-[1px] shadow-md">
              <div className="rounded-3xl bg-white/95 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-800">Painel rápido da Região dos Lagos</p>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700">
                  <div>
                    <p className="font-semibold text-sky-700">Clima hoje</p>
                    <p>Máx 30º • Mín 22º</p>
                    <p>Céu parcialmente nublado</p>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-700">Tábua de marés</p>
                    <p>Maré alta: 09h40</p>
                    <p>Maré baixa: 15h55</p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-700">Ondas Saquarema</p>
                    <p>Altura: 1,2 m</p>
                    <p>Boas condições</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Trânsito agora</p>
                    <p>Ponte Rio–Niterói: fluxo intenso</p>
                    <p>Via Lagos: normal</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Em breve estes dados serão carregados automaticamente de fontes oficiais.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3">{erro}</div>
          )}

          {/* Filtro por cidade */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-sm font-semibold text-slate-900">Notícias por cidade</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCidadeFiltro("Todas")}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    cidadeFiltro === "Todas"
                      ? "border-sky-300 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700"
                  }`}
                >
                  Todas
                </button>

                {CIDADES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCidadeFiltro(c)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                      cidadeFiltro === c
                        ? "border-sky-300 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Exibindo: <span className="font-semibold text-slate-800">{cidadeFiltro}</span>
            </p>
          </div>

          {/* DESTAQUES */}
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Destaques de hoje</h2>

            {loading ? (
              <p className="text-xs text-slate-500">Carregando notícias…</p>
            ) : noticiasFiltradas.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhuma notícia publicada para esse filtro. Tente outra cidade.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {destaques[0] && (
                  <Link
                    href={`/noticias/${destaques[0].id}`}
                    className="md:col-span-2 group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col md:flex-row"
                  >
                    <div className="md:w-2/3 h-48 md:h-auto overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={destaques[0].imagem_capa || imagemFallback}
                        alt={safeText(destaques[0].titulo) || "Notícia"}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                      />
                    </div>
                    <div className="flex-1 p-4 space-y-2 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] text-sky-700 font-semibold uppercase tracking-wide">
                          {safeText(destaques[0].cidade)} • {safeText(destaques[0].categoria)}
                        </p>
                        <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2">{safeText(destaques[0].titulo)}</h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-3">{safeText(destaques[0].resumo)}</p>
                      </div>
                      <p className="text-[11px] text-slate-400">{formatDateBR(destaques[0].created_at)}</p>
                    </div>
                  </Link>
                )}

                {destaques.slice(1).map((n) => (
                  <Link
                    key={n.id}
                    href={`/noticias/${n.id}`}
                    className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col"
                  >
                    <div className="h-32 overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.imagem_capa || imagemFallback}
                        alt={safeText(n.titulo) || "Notícia"}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition"
                      />
                    </div>
                    <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                          {safeText(n.cidade)} • {safeText(n.categoria)}
                        </p>
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2">{safeText(n.titulo)}</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{formatDateBR(n.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* RECENTES */}
          {!loading && noticiasFiltradas.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">Últimas notícias</h2>
                <span className="text-[11px] text-slate-500">Em breve: filtros por tema.</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {recentes.length === 0 && <p className="text-[11px] text-slate-500">Quando houver mais notícias, elas aparecerão aqui.</p>}

                {recentes.map((n) => (
                  <Link
                    key={n.id}
                    href={`/noticias/${n.id}`}
                    className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col"
                  >
                    <div className="h-32 overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={n.imagem_capa || imagemFallback}
                        alt={safeText(n.titulo) || "Notícia"}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition"
                      />
                    </div>
                    <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                          {safeText(n.cidade)} • {safeText(n.categoria)}
                        </p>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{safeText(n.titulo)}</h3>
                        <p className="mt-1 text-[11px] text-slate-600 line-clamp-3">{safeText(n.resumo)}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{formatDateBR(n.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* TV CLASSILAGOS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">🎥 TV Classilagos</h2>
              <span className="text-[11px] text-slate-500">Conteúdos em vídeo sobre a Região dos Lagos</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "TV Classilagos – Canal 1",
                  desc: "Reportagens, bastidores, músicas, eventos e especiais da Região dos Lagos.",
                  url: "https://www.youtube.com/@tvclassilagos2214",
                },
                {
                  title: "TV Classilagos – Canal 2",
                  desc: "Conteúdos complementares, arquivos históricos e projetos especiais Classilagos.",
                  url: "https://www.youtube.com/@tvclassilagos6603",
                },
              ].map((c) => (
                <div key={c.url} className="rounded-3xl border border-slate-200 bg-white p-3 flex flex-col gap-2">
                  <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-white text-xs">
                    <span className="opacity-80">Player (em breve)</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-900">{c.title}</p>
                    <p className="text-[11px] text-slate-600">{c.desc}</p>
                    <Link
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700"
                    >
                      Assistir no YouTube
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-2 text-[10px] text-slate-400">Em breve, esta seção poderá puxar automaticamente os últimos vídeos do canal.</p>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Diretriz editorial</h2>
            <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-5">
              <li>Foco em cultura, turismo, serviços e comércio local.</li>
              <li>Sem violência e sem sensacionalismo.</li>
              <li>Sem política partidária (comunicados oficiais entram como “serviço”).</li>
              <li>Matérias com crédito e fonte quando forem de parceiros.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Fontes e parcerias</h2>
            <p className="text-[11px] text-slate-600">
              O Classilagos pode republicar manchetes e chamadas com <b>crédito</b> e <b>link</b> para a fonte.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Lagos Notícias", "Folha dos Lagos", "RC24h", "G1 Região dos Lagos"].map((f) => (
                <span key={f} className="inline-flex rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[11px] text-slate-700">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Trânsito e câmeras ao vivo</h2>
            <Link href="/noticias/cameras" className="text-[11px] text-sky-700 underline">
              Ponte Rio–Niterói, Via Lagos e RJ-106 (câmeras)
            </Link>
            <p className="mt-2 text-[10px] text-slate-400">Em breve: integração com dados em tempo real.</p>
          </div>
        </aside>
      </section>

      {/* ✅ BANNER RODAPÉ (720x170) — PADRÃO PREMIUM + LINKS AFILIADOS */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <BannerRotator images={bannersRodapeNoticias} interval={6500} height={170} maxWidth={720} />
        </div>
      </section>
    </main>
  );
}
