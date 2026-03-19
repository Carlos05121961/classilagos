"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../supabaseClient";

/** =========================
 *  CONFIG
 *  ========================= */

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

/** ✅ Badge do tipo (Importada / Correspondente / Classilagos) */
function getTipoInfo(tipoRaw) {
  const t = (tipoRaw || "").toString().trim().toLowerCase();

  if (t === "importada") {
    return {
      label: "IMPORTADA",
      cls: "bg-slate-50 text-slate-700 border-slate-200",
      title: "Conteúdo importado (com fonte e referência)",
    };
  }

  if (t === "correspondente") {
    return {
      label: "CORRESPONDENTE",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      title: "Matéria enviada por correspondente Classilagos",
    };
  }

  return {
    label: "CLASSILAGOS",
    cls: "bg-sky-50 text-sky-700 border-sky-200",
    title: "Conteúdo autoral / curadoria Classilagos",
  };
}

/** ✅ Agenda (MVP) — depois podemos puxar do Supabase */
const AGENDA_EVENTOS_MVP = [
  {
    id: "ev1",
    cidade: "Maricá",
    titulo: "Show ao vivo – Música & Praia",
    local: "Orla / Centro",
    dataISO: "2025-12-21",
    hora: "20:00",
    tag: "Show",
  },
  {
    id: "ev2",
    cidade: "Saquarema",
    titulo: "Feira Gastronômica & Artesanato",
    local: "Praça Central",
    dataISO: "2025-12-22",
    hora: "17:00",
    tag: "Feira",
  },
  {
    id: "ev3",
    cidade: "Cabo Frio",
    titulo: "Festival de Verão – Música & Cultura",
    local: "Orla",
    dataISO: "2025-12-27",
    hora: "19:30",
    tag: "Festival",
  },
  {
    id: "ev4",
    cidade: "Búzios",
    titulo: "Noite do Samba",
    local: "Rua das Pedras",
    dataISO: "2025-12-28",
    hora: "21:00",
    tag: "Show",
  },
];

function formatAgendaDate(iso) {
  try {
    const d = new Date(`${iso}T12:00:00`);
    const dia = d.toLocaleDateString("pt-BR", { day: "2-digit" });
    const mes = d
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "");
    return { dia, mes: mes.toUpperCase() };
  } catch {
    return { dia: "--", mes: "---" };
  }
}

/** =========================
 *  COMPONENTS
 *  ========================= */

function BannerRotator({ banners = [], height = 120, label = "" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners]);

  const current = banners?.[idx] || null;
  const isExternal = (href) => typeof href === "string" && /^https?:\/\//i.test(href);

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
                key={current.src}
                src={current.src}
                alt={current.alt || label || "Banner"}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain cursor-pointer"
                priority={false}
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

function PainelRapidoRegiao() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 p-[1px] shadow-md">
      <div className="rounded-3xl bg-white/95 p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-800">
          Painel rápido da Região dos Lagos
        </p>

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

        <p className="text-[10px] text-slate-400">
          Em breve estes dados serão carregados automaticamente de fontes oficiais.
        </p>
      </div>
    </div>
  );
}

function AgendaPremium() {
  const [cidadeAgenda, setCidadeAgenda] = useState("Toda a região");

  const lista = useMemo(() => {
    const base = Array.isArray(AGENDA_EVENTOS_MVP) ? AGENDA_EVENTOS_MVP : [];
    if (!cidadeAgenda || cidadeAgenda === "Toda a região") return base.slice(0, 6);
    return base.filter((e) => e.cidade === cidadeAgenda).slice(0, 6);
  }, [cidadeAgenda]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 p-[1px] shadow-md">
      <div className="rounded-3xl bg-white/95 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-700">
              Agenda Premium
            </p>
            <h3 className="text-sm font-extrabold text-slate-900">
              Eventos & Shows na Região dos Lagos
            </h3>
            <p className="mt-1 text-[11px] text-slate-600">
              Datas, cidades e o que está acontecendo por aí.
            </p>
          </div>

          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
              Cidade
            </label>
            <select
              className="w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={cidadeAgenda}
              onChange={(e) => setCidadeAgenda(e.target.value)}
            >
              <option value="Toda a região">Toda a região</option>
              {CIDADES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-[11px] text-slate-500">
              Ainda não há eventos nessa cidade.
            </div>
          ) : (
            lista.map((ev) => {
              const dt = formatAgendaDate(ev.dataISO);
              return (
                <div
                  key={ev.id}
                  className="group rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition px-3 py-2 flex items-center gap-3"
                >
                  <div className="w-12 flex-shrink-0 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-700 text-white text-center py-2">
                    <div className="text-sm font-extrabold leading-none">{dt.dia}</div>
                    <div className="text-[10px] font-semibold leading-none opacity-90">{dt.mes}</div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-rose-700">
                      {ev.cidade} • {ev.tag}
                    </p>
                    <p className="text-xs font-bold text-slate-900 truncate">{ev.titulo}</p>
                    <p className="text-[11px] text-slate-600">
                      {ev.hora ? `${ev.hora}` : ""}
                      {ev.local ? ` • ${ev.local}` : ""}
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-rose-700">
                    Ver →
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/noticias/agenda"
            className="inline-flex items-center rounded-full bg-rose-600 px-4 py-2 text-[11px] font-semibold text-white hover:bg-rose-700"
          >
            Ver agenda completa
          </Link>

          <Link
            href="/noticias/agenda/enviar"
            className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
          >
            Enviar evento
          </Link>
        </div>

        <p className="mt-2 text-[10px] text-slate-400">
          (MVP) Depois ligamos isso ao banco para eventos entrarem automaticamente.
        </p>
      </div>
    </div>
  );
}

/** ✅ HERO MAPA PREMIUM */
function HeroMapaNoticias({ cidadeAtiva = "Todas", onSelectCidade }) {
  const pins = [
    {
      cidade: "Maricá",
      left: "48.7%",
      top: "80.5%",
      labelClass: "translate-x-[-18%] -translate-y-[135%]",
    },
    {
      cidade: "Saquarema",
      left: "63.2%",
      top: "81.5%",
      labelClass: "translate-x-[-35%] -translate-y-[145%]",
    },
    {
      cidade: "Araruama",
      left: "70.6%",
      top: "73.8%",
      labelClass: "translate-x-[-20%] -translate-y-[145%]",
    },
    {
      cidade: "Iguaba Grande",
      left: "75.4%",
      top: "69.9%",
      labelClass: "translate-x-[-15%] -translate-y-[145%]",
    },
    {
      cidade: "São Pedro da Aldeia",
      left: "78.2%",
      top: "69.2%",
      labelClass: "translate-x-[-15%] -translate-y-[145%]",
    },
    {
      cidade: "Cabo Frio",
      left: "82.3%",
      top: "76.4%",
      labelClass: "translate-x-[-20%] -translate-y-[145%]",
    },
    {
      cidade: "Arraial do Cabo",
      left: "83.9%",
      top: "89.3%",
      labelClass: "translate-x-[-35%] -translate-y-[145%]",
    },
    {
      cidade: "Búzios",
      left: "92.8%",
      top: "58.2%",
      labelClass: "translate-x-[-50%] -translate-y-[145%]",
    },
    {
      cidade: "Rio das Ostras",
      left: "89.4%",
      top: "28.7%",
      labelClass: "translate-x-[-50%] -translate-y-[145%]",
    },
  ];

  const pick = (cidade) => {
    if (typeof onSelectCidade === "function") onSelectCidade(cidade);
  };

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="relative aspect-[1919/662] w-full">
            <Image
              src="/hero/noticias-mapa.webp"
              alt="Mapa da Região dos Lagos"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />

            {/* brilho suave no lado esquerdo */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-white/85 via-white/55 to-transparent" />

            {/* conteúdo */}
            <div className="absolute inset-0 z-10 flex">
              <div className="w-full md:w-[42%] px-5 py-5 sm:px-7 sm:py-7 lg:px-9 lg:py-9 flex flex-col justify-center">
                <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-700 shadow-sm">
                  Região dos Lagos
                </span>

                <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                  Classilagos Notícias
                </h1>

                <p className="mt-3 max-w-md text-sm md:text-base text-slate-700">
                  O portal oficial de informação da Região dos Lagos.
                </p>

                <p className="mt-2 max-w-md text-xs md:text-sm text-slate-500">
                  Clique em uma cidade do mapa para filtrar as notícias locais.
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link
                    href="/noticias/cameras"
                    className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-[11px] md:text-sm font-semibold text-white shadow hover:bg-sky-700"
                  >
                    Ver câmeras ao vivo
                  </Link>

                  <button
                    type="button"
                    onClick={() => pick("Todas")}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Ver todas as notícias
                  </button>

                  <Link
                    href="/noticias/correspondentes"
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-[11px] md:text-sm font-semibold text-slate-700 hover:bg-white"
                  >
                    Correspondentes
                  </Link>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Exibindo:
                    <b className="text-slate-900">{cidadeAtiva || "Todas"}</b>
                  </span>
                </div>

                <div className="mt-4 md:hidden">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1.5">
                    Filtrar por cidade
                  </label>
                  <select
                    className="w-full rounded-full border border-slate-300 bg-white px-3 py-2 text-[12px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={cidadeAtiva || "Todas"}
                    onChange={(e) => pick(e.target.value)}
                  >
                    <option value="Todas">Todas</option>
                    {CIDADES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* pins desktop */}
            <div className="absolute inset-0 z-20 hidden md:block">
              {pins.map((p) => {
                const ativo = cidadeAtiva === p.cidade;
                return (
                  <button
                    key={p.cidade}
                    type="button"
                    onClick={() => pick(p.cidade)}
                    title={p.cidade}
                    aria-label={`Filtrar por ${p.cidade}`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: p.left, top: p.top }}
                  >
                    <span
                      className={[
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                        ativo ? "h-7 w-7 bg-sky-400/25" : "h-6 w-6 bg-amber-300/20",
                        "animate-pulse",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "relative flex h-4 w-4 items-center justify-center rounded-full border-2 shadow-md transition-all duration-200",
                        ativo
                          ? "border-sky-700 bg-sky-500 scale-110"
                          : "border-slate-800 bg-amber-300 hover:scale-110 hover:bg-amber-400",
                      ].join(" ")}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>

                    <span
                      className={[
                        "absolute whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-bold shadow-sm transition-all duration-200",
                        "bg-white/95 text-slate-800 border-slate-200",
                        p.labelClass,
                        ativo ? "ring-2 ring-sky-200" : "group-hover:border-sky-200 group-hover:text-sky-700",
                      ].join(" ")}
                    >
                      {p.cidade}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Dica: clique em uma cidade do mapa para filtrar as notícias locais.
        </p>
      </div>
    </section>
  );
}

/** =========================
 *  PAGE
 *  ========================= */

export default function NoticiasHomePage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("Todas");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cidade = params.get("cidade");
    if (cidade) setCidadeFiltro(cidade);
  }, []);

  const aplicarCidade = (cidade) => {
    const val = cidade || "Todas";
    setCidadeFiltro(val);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (!val || val === "Todas") url.searchParams.delete("cidade");
      else url.searchParams.set("cidade", val);
      window.history.pushState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true);
      setErro("");

      const { data, error } = await supabase
        .from("noticias")
        .select("id, titulo, cidade, categoria, resumo, imagem_capa, created_at, published_at, status, tipo")
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
    return noticias.filter(
      (n) => (n.cidade || "").toLowerCase() === cidadeFiltro.toLowerCase()
    );
  }, [noticias, cidadeFiltro]);

  const destaques = noticiasFiltradas.slice(0, 3);
  const recentes = noticiasFiltradas.slice(3, 15);

  const imagemFallback = "/banners/noticias-default.webp";

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      <BannerRotator
        banners={bannersTopo}
        height={120}
        label="Ofertas e parceiros (afiliados)."
      />

      <HeroMapaNoticias cidadeAtiva={cidadeFiltro} onSelectCidade={aplicarCidade} />

      <section className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
        <div className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3">
              {erro}
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-sm font-semibold text-slate-900">Notícias por cidade</h2>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => aplicarCidade("Todas")}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${
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
                  onClick={() => aplicarCidade(c)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    cidadeFiltro === c
                      ? "border-sky-300 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Exibindo: <span className="font-semibold text-slate-800">{cidadeFiltro}</span>
            </p>
          </div>

          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Destaques</h2>

            {loading ? (
              <p className="text-xs text-slate-500">Carregando notícias…</p>
            ) : noticiasFiltradas.length === 0 ? (
              <p className="text-xs text-slate-500">
                Nenhuma notícia publicada para esse filtro. Tente outra cidade.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {destaques[0] && (
                  <Link
                    href={`/noticias/${destaques[0].id}`}
                    className="md:col-span-2 group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col md:flex-row"
                  >
                    <div className="md:w-2/3 h-48 md:h-auto overflow-hidden bg-slate-100">
                      <img
                        src={destaques[0].imagem_capa || imagemFallback}
                        alt={decodeHtmlEntities(destaques[0].titulo) || "Notícia"}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                      />
                    </div>

                    <div className="flex-1 p-4 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[11px] text-sky-700 font-semibold uppercase tracking-wide">
                            {safeText(destaques[0].cidade)} • {safeText(destaques[0].categoria)}
                          </p>

                          {(() => {
                            const info = getTipoInfo(destaques[0].tipo);
                            return (
                              <span
                                title={info.title}
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${info.cls}`}
                              >
                                {info.label}
                              </span>
                            );
                          })()}
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2">
                          {decodeHtmlEntities(destaques[0].titulo)}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-3">
                          {decodeHtmlEntities(destaques[0].resumo)}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        {formatDateBR(destaques[0].published_at || destaques[0].created_at)}
                      </p>
                    </div>
                  </Link>
                )}

                {destaques.slice(1).map((n) => {
                  const info = getTipoInfo(n.tipo);
                  return (
                    <Link
                      key={n.id}
                      href={`/noticias/${n.id}`}
                      className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col"
                    >
                      <div className="h-32 overflow-hidden bg-slate-100">
                        <img
                          src={n.imagem_capa || imagemFallback}
                          alt={decodeHtmlEntities(n.titulo) || "Notícia"}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition"
                        />
                      </div>

                      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                              {safeText(n.cidade)} • {safeText(n.categoria)}
                            </p>
                            <span
                              title={info.title}
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${info.cls}`}
                            >
                              {info.label}
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                            {decodeHtmlEntities(n.titulo)}
                          </h3>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatDateBR(n.published_at || n.created_at)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {!loading && noticiasFiltradas.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">Últimas notícias</h2>
                <span className="text-[11px] text-slate-500">Em breve: filtros por tema.</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {recentes.map((n) => {
                  const info = getTipoInfo(n.tipo);
                  return (
                    <Link
                      key={n.id}
                      href={`/noticias/${n.id}`}
                      className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-md transition flex flex-col"
                    >
                      <div className="h-32 overflow-hidden bg-slate-100">
                        <img
                          src={n.imagem_capa || imagemFallback}
                          alt={decodeHtmlEntities(n.titulo) || "Notícia"}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition"
                        />
                      </div>

                      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[10px] text-sky-700 font-semibold uppercase tracking-wide">
                              {safeText(n.cidade)} • {safeText(n.categoria)}
                            </p>
                            <span
                              title={info.title}
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${info.cls}`}
                            >
                              {info.label}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                            {decodeHtmlEntities(n.titulo)}
                          </h3>

                          <p className="mt-1 text-[11px] text-slate-600 line-clamp-3">
                            {decodeHtmlEntities(n.resumo)}
                          </p>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatDateBR(n.published_at || n.created_at)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">🎥 TV Classilagos</h2>
              <span className="text-[11px] text-slate-500">
                Conteúdos em vídeo sobre a Região dos Lagos
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "TV Classilagos – Canal 1",
                    desc: "Reportagens, bastidores, músicas, eventos e especiais.",
                    url: "https://www.youtube.com/@tvclassilagos2214",
                  },
                  {
                    title: "TV Classilagos – Canal 2",
                    desc: "Conteúdos complementares e projetos especiais.",
                    url: "https://www.youtube.com/@tvclassilagos6603",
                  },
                ].map((c) => (
                  <div
                    key={c.url}
                    className="rounded-3xl border border-slate-200 bg-white p-3 flex flex-col gap-2"
                  >
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

              <div className="lg:pl-1">
                <PainelRapidoRegiao />
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Em breve, esta seção poderá puxar automaticamente os últimos vídeos do canal.
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <AgendaPremium />

          <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Diretriz editorial</h2>
            <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-5">
              <li>Foco em cultura, turismo, serviços e comércio local.</li>
              <li>Sem violência e sem sensacionalismo.</li>
              <li>Sem política partidária (comunicados oficiais entram como “serviço”).</li>
              <li>Crédito e fonte quando forem de parceiros.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Fontes e parcerias</h2>
            <p className="text-[11px] text-slate-600">
              O Classilagos pode republicar chamadas com <b>crédito</b> e <b>link</b> para a fonte.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Lagos Notícias", "Folha dos Lagos", "RC24h", "G1 Região dos Lagos"].map((f) => (
                <span
                  key={f}
                  className="inline-flex rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[11px] text-slate-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Trânsito e câmeras ao vivo
            </h2>
            <Link href="/noticias/cameras" className="text-[11px] text-sky-700 underline">
              Ponte Rio–Niterói, Via Lagos e RJ-106 (câmeras)
            </Link>
            <p className="mt-2 text-[10px] text-slate-400">
              Em breve: integração com dados em tempo real.
            </p>
          </div>
        </aside>
      </section>

      <BannerRotator
        banners={bannersRodape}
        height={120}
        label="Ofertas e parceiros (afiliados)."
      />
    </main>
  );
}
