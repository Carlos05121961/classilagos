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

const CITY_SLUG = {
  "Maricá": "marica",
  "Saquarema": "saquarema",
  "Araruama": "araruama",
  "Iguaba Grande": "iguaba",
  "São Pedro da Aldeia": "sao-pedro",
  "Arraial do Cabo": "arraial",
  "Cabo Frio": "cabo-frio",
  "Búzios": "buzios",
  "Rio das Ostras": "rio-das-ostras",
};

const BANNERS_TOPO_NOTICIAS = [
  "/banners/topo/topo-noticias-01.webp",
  "/banners/topo/topo-noticias-02.webp",
  "/banners/topo/topo-noticias-03.webp",
  "/banners/topo/topo-noticias-04.webp",
  "/banners/topo/topo-noticias-05.webp",
];

const BANNERS_RODAPE_NOTICIAS = [
  "/banners/rodape/rodape-noticias-01.webp",
  "/banners/rodape/rodape-noticias-02.webp",
  "/banners/rodape/rodape-noticias-03.webp",
  "/banners/rodape/rodape-noticias-04.webp",
  "/banners/rodape/rodape-noticias-05.webp",
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

function BannerRotator({ images = [], height = 170, label = "" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images]);

  const current = images?.[idx] || null;

  return (
    <section className="w-full bg-slate-100 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col items-center">
        <div
          className="relative w-full max-w-[760px] rounded-3xl bg-white border border-slate-200 shadow overflow-hidden"
          style={{ height }}
        >
          {current ? (
            <Image
              key={current}
              src={current}
              alt={label || "Banner"}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              (sem banner)
            </div>
          )}
        </div>

        {label ? (
          <p className="mt-2 text-[11px] text-slate-500 text-center">{label}</p>
        ) : null}

        {images?.length > 1 && (
          <div className="mt-2 flex gap-2">
            {images.map((_, i) => (
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

/** ✅ HERO MAPA PREMIUM + ÍCONES clicáveis (sem texto no mapa) */
function HeroMapaNoticias({ cidadeAtiva = "Todas", onSelectCidade }) {
  // ✅ pins calculados pelo mapa novo que você enviou
  const pins = [
    { cidade: "Rio das Ostras", left: "74.1%", top: "8.2%",  icon: "/icons/cidades/rio-das-ostras.webp" },
    { cidade: "Búzios",        left: "75.6%", top: "49.4%", icon: "/icons/cidades/buzios.webp" },
    { cidade: "Cabo Frio",     left: "71.4%", top: "68.9%", icon: "/icons/cidades/cabo-frio.webp" },
    { cidade: "Arraial do Cabo", left: "67.2%", top: "78.0%", icon: "/icons/cidades/arraial.webp" },

    { cidade: "São Pedro da Aldeia", left: "63.6%", top: "60.0%", icon: "/icons/cidades/sao-pedro.webp" },
    { cidade: "Iguaba Grande",       left: "53.9%", top: "62.4%", icon: "/icons/cidades/iguaba.webp" },
    { cidade: "Araruama",            left: "47.5%", top: "66.1%", icon: "/icons/cidades/araruama.webp" },

    // ✅ Saquarema = Surf
    { cidade: "Saquarema", left: "35.1%", top: "74.9%", icon: "/icons/cidades/surf-saquarema.webp" },

    { cidade: "Maricá", left: "15.2%", top: "77.5%", icon: "/icons/cidades/marica.webp" },
  ];

  const handlePick = (cidade) => {
    if (typeof onSelectCidade === "function") onSelectCidade(cidade);
  };

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 shadow bg-slate-950">
          <div className="relative w-full aspect-[12/5] max-h-[260px] md:max-h-[340px] lg:max-h-[400px]">
            {/* ✅ mapa base */}
            <Image
              src="/hero/noticias-mapa.webp"
              alt="Mapa – Região dos Lagos"
              fill
              priority
              sizes="100vw"
              className="object-cover scale-[1.03] brightness-[0.98] contrast-[1.04] saturate-[1.02]"
            />

            {/* overlays leves (limpo, sem escurecer demais) */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-slate-950/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: "inset 0 0 160px rgba(0,0,0,0.30)" }}
            />

            {/* conteúdo (texto do Hero) */}
            <div className="absolute inset-0">
              <div className="h-full max-w-6xl mx-auto px-4 py-6 lg:py-10 grid grid-cols-1 gap-6 lg:items-start">
                <div className="max-w-xl">
                  <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white border border-white/15 backdrop-blur">
                    REGIÃO DOS LAGOS
                  </div>

                  <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    Classilagos Notícias
                  </h1>

                  <p className="mt-2 text-sm md:text-base text-white/85">
                    O portal oficial de informação da Região dos Lagos
                  </p>

                  <p className="mt-3 text-xs md:text-sm text-white/70">
                    Clique em uma cidade no mapa para ver as notícias locais.
                  </p>

                  {/* Mobile: seletor (limpo) */}
                  <div className="mt-4 md:hidden">
                    <label className="block text-[10px] font-semibold text-white/75 mb-1">
                      Filtrar por cidade
                    </label>
                    <select
                      className="w-full rounded-full border border-white/15 bg-white/10 text-white px-3 py-2 text-[12px] backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/25"
                      value={cidadeAtiva || "Todas"}
                      onChange={(e) => handlePick(e.target.value)}
                    >
                      <option value="Todas">Todas</option>
                      {CIDADES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/noticias/cameras"
                      className="inline-flex items-center rounded-full bg-white/12 px-4 py-2 text-[11px] md:text-sm font-semibold text-white border border-white/15 hover:bg-white/20 backdrop-blur"
                    >
                      Ver câmeras ao vivo
                    </Link>

                    <button
                      type="button"
                      onClick={() => handlePick("Todas")}
                      className="inline-flex items-center rounded-full bg-white/12 px-4 py-2 text-[11px] md:text-sm font-semibold text-white border border-white/15 hover:bg-white/20 backdrop-blur"
                    >
                      Ver todas as notícias
                    </button>
                  </div>

                  <div className="mt-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/85 border border-white/15 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-white/80" />
                      Exibindo: <b className="text-white">{cidadeAtiva || "Todas"}</b>
                    </span>
                  </div>
                </div>
              </div>

            {/* PINS – bolinhas vermelhas simples */}
<div className="absolute inset-0 hidden md:block">
  {pins.map((p) => (
    <button
      key={p.cidade}
      type="button"
      onClick={() => handlePick(p.cidade)}
      style={{ left: p.left, top: p.top }}
      className="
        absolute
        h-3.5 w-3.5
        rounded-full
        bg-red-600
        border border-white
        shadow
        transition-transform
        duration-200
        hover:scale-150
      "
      title={p.cidade}
      aria-label={p.cidade}
    />
  ))}
</div>


        <p className="mt-3 text-[11px] text-slate-500">
          Dica: clique em uma cidade do mapa para filtrar as notícias locais.
        </p>
      </div>
    </section>
  );
}


export default function NoticiasHomePage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("Todas");

  // lê ?cidade=... na URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cidade = params.get("cidade");
    if (cidade) setCidadeFiltro(cidade);
  }, []);

  // aplica filtro e atualiza URL
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
    return noticias.filter(
      (n) => (n.cidade || "").toLowerCase() === cidadeFiltro.toLowerCase()
    );
  }, [noticias, cidadeFiltro]);

  const destaques = noticiasFiltradas.slice(0, 3);
  const recentes = noticiasFiltradas.slice(3, 15);
  const imagemFallback = "/banners/noticias-default.webp";

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* BANNER TOPO */}
      <BannerRotator
        images={BANNERS_TOPO_NOTICIAS}
        height={120}
        label="Espaço para banners institucionais e Prefeituras (em breve)."
      />

      {/* HERO MAPA */}
      <HeroMapaNoticias cidadeAtiva={cidadeFiltro} onSelectCidade={aplicarCidade} />

      {/* CONTEÚDO PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
        {/* ESQUERDA */}
        <div className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3">
              {erro}
            </div>
          )}

          {/* Filtro por cidade (chips no mobile com scroll) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
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
              Exibindo:{" "}
              <span className="font-semibold text-slate-800">{cidadeFiltro}</span>
            </p>
          </div>

          {/* DESTAQUES */}
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
                        <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2">
                          {safeText(destaques[0].titulo)}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-3">
                          {safeText(destaques[0].resumo)}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {formatDateBR(destaques[0].created_at)}
                      </p>
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
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                          {safeText(n.titulo)}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatDateBR(n.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ÚLTIMAS */}
          {!loading && noticiasFiltradas.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">Últimas notícias</h2>
                <span className="text-[11px] text-slate-500">Em breve: filtros por tema.</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                          {safeText(n.titulo)}
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-600 line-clamp-3">
                          {safeText(n.resumo)}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatDateBR(n.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* TV + Painel */}
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

        {/* SIDEBAR */}
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
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Trânsito e câmeras ao vivo</h2>
            <Link href="/noticias/cameras" className="text-[11px] text-sky-700 underline">
              Ponte Rio–Niterói, Via Lagos e RJ-106 (câmeras)
            </Link>
            <p className="mt-2 text-[10px] text-slate-400">
              Em breve: integração com dados em tempo real.
            </p>
          </div>
        </aside>
      </section>

      {/* BANNER RODAPÉ */}
      <BannerRotator
        images={BANNERS_RODAPE_NOTICIAS}
        height={170}
        label="Área reservada para campanhas públicas, utilidade e comunicados oficiais."
      />
    </main>
  );
}
