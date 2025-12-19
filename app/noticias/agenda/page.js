"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../supabaseClient";

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

const CATEGORIAS = [
  "Show",
  "Festival",
  "Feira",
  "Gastronomia",
  "Cultura",
  "Esporte",
  "Religioso",
  "Teatro",
  "Outros",
];

function formatDateBRDateOnly(value) {
  try {
    const d = new Date(`${value}T12:00:00`);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

function safeText(v) {
  return typeof v === "string" ? v : "";
}

export default function AgendaNoticiasPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // filtros
  const [cidade, setCidade] = useState("Toda a região");
  const [categoria, setCategoria] = useState("Todas");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      setErro("");

      // busca próximos eventos (publicados) — do dia de hoje em diante
      const hoje = new Date();
      const yyyy = hoje.getFullYear();
      const mm = String(hoje.getMonth() + 1).padStart(2, "0");
      const dd = String(hoje.getDate()).padStart(2, "0");
      const hojeISO = `${yyyy}-${mm}-${dd}`;

      const { data, error } = await supabase
        .from("agenda_eventos")
        .select(
          "id, titulo, cidade, local, data_inicio, hora_inicio, categoria, imagem_capa, destaque, link_ingresso, descricao"
        )
        .eq("status", "publicado")
        .gte("data_inicio", hojeISO)
        .order("destaque", { ascending: false })
        .order("data_inicio", { ascending: true })
        .limit(80);

      if (error) {
        console.error("Erro ao carregar agenda:", error);
        setErro("Não foi possível carregar a agenda agora. Tente novamente em instantes.");
        setEventos([]);
      } else {
        setEventos(data || []);
      }

      setLoading(false);
    };

    fetchEventos();
  }, []);

  const filtrados = useMemo(() => {
    let lista = Array.isArray(eventos) ? eventos : [];

    if (cidade !== "Toda a região") {
      lista = lista.filter((e) => (e.cidade || "") === cidade);
    }

    if (categoria !== "Todas") {
      lista = lista.filter((e) => (e.categoria || "") === categoria);
    }

    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      lista = lista.filter((e) => {
        const t = safeText(e.titulo).toLowerCase();
        const l = safeText(e.local).toLowerCase();
        const d = safeText(e.descricao).toLowerCase();
        return t.includes(q) || l.includes(q) || d.includes(q);
      });
    }

    return lista;
  }, [eventos, cidade, categoria, busca]);

  const destaques = filtrados.filter((e) => e.destaque).slice(0, 6);
  const listaNormal = filtrados.filter((e) => !e.destaque);

  const fallback = "/banners/noticias-default.webp";

  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* topo */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-5">
          <p className="text-[11px] text-slate-500">Classilagos • Notícias • Agenda</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
            Agenda de Eventos & Shows
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-600">
            O que vai acontecer na Região dos Lagos — por cidade, categoria e data.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/noticias/agenda/enviar"
              className="inline-flex items-center rounded-full bg-rose-600 px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-rose-700"
            >
              Enviar evento
            </Link>
            <Link
              href="/noticias"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar para Notícias
            </Link>
          </div>
        </div>
      </section>

      {/* filtros */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-3">
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">Buscar</label>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Ex.: show, feira, gastronomia, nome do local..."
                className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">Cidade</label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option>Toda a região</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Todas">Todas</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Mostrando <b className="text-slate-800">{filtrados.length}</b> evento(s).
          </p>
        </div>
      </section>

      {/* conteúdo */}
      <section className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        {erro && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl px-4 py-3">
            {erro}
          </div>
        )}

        {loading && <p className="text-xs text-slate-500">Carregando agenda…</p>}

        {!loading && filtrados.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-slate-900">Nenhum evento encontrado.</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Tente outra cidade/categoria ou envie um evento para aparecer aqui.
            </p>
            <div className="mt-4">
              <Link
                href="/noticias/agenda/enviar"
                className="inline-flex items-center rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Enviar evento
              </Link>
            </div>
          </div>
        )}

        {/* destaques */}
        {!loading && destaques.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">⭐ Destaques</h2>
              <span className="text-[11px] text-slate-500">Eventos em evidência</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {destaques.map((ev) => (
                <div key={ev.id} className="rounded-3xl overflow-hidden border border-rose-200 bg-white hover:shadow-md transition">
                  <div className="relative h-36 bg-slate-100">
                    <Image
                      src={ev.imagem_capa || fallback}
                      alt={safeText(ev.titulo) || "Evento"}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/90 border border-rose-200 px-2.5 py-1 text-[10px] font-semibold text-rose-700">
                      DESTAQUE
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                      {ev.cidade} • {ev.categoria || "Evento"}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 line-clamp-2">
                      {ev.titulo}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {formatDateBRDateOnly(ev.data_inicio)}
                      {ev.hora_inicio ? ` • ${ev.hora_inicio}` : ""}
                      {ev.local ? ` • ${ev.local}` : ""}
                    </p>

                    {ev.link_ingresso && (
                      <a
                        href={ev.link_ingresso}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700 mt-2"
                      >
                        Ver ingresso / link →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* lista normal */}
        {!loading && listaNormal.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Próximos eventos</h2>

            <div className="space-y-3">
              {listaNormal.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition p-4 flex gap-3"
                >
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                      <Image
                        src={ev.imagem_capa || fallback}
                        alt={safeText(ev.titulo) || "Evento"}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {ev.cidade} • {ev.categoria || "Evento"}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 truncate">{ev.titulo}</p>
                    <p className="text-[11px] text-slate-600">
                      {formatDateBRDateOnly(ev.data_inicio)}
                      {ev.hora_inicio ? ` • ${ev.hora_inicio}` : ""}
                      {ev.local ? ` • ${ev.local}` : ""}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {ev.link_ingresso && (
                        <a
                          href={ev.link_ingresso}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Link / ingresso →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
