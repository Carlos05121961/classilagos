"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

function fmtData(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("pt-BR");
  } catch {
    return String(value);
  }
}

function safe(v) {
  return typeof v === "string" ? v : "";
}

export default function PainelAgendaAdminPage() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [status, setStatus] = useState("pendente");
  const [cidade, setCidade] = useState("Todas"); // ✅ CORRIGIDO (antes estava sem inicializar)

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ✅ checar sessão + admin
  useEffect(() => {
    let mounted = true;

    async function init() {
      setErro("");

      const { data } = await supabase.auth.getSession();
      const sess = data?.session || null;
      if (!mounted) return;

      setSession(sess);

      if (!sess?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sess.user.id)
        .single();

      if (!mounted) return;

      if (!profileError && profile?.role === "admin") setIsAdmin(true);
      else setIsAdmin(false);

      setLoading(false);
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function carregarEventos() {
    try {
      setLoading(true);
      setErro("");

      // ✅ TABELA: ajuste aqui se seu nome for diferente
      // Ex.: "agenda" OU "agenda_eventos"
      const tabela = "agenda_eventos";

      let query = supabase.from(tabela).select("*").order("created_at", { ascending: false });

      if (status) query = query.eq("status", status);
      if (cidade && cidade !== "Todas") query = query.eq("cidade", cidade);

      const { data, error } = await query;

      if (error) throw error;

      setEventos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erro ao carregar agenda:", e);
      setErro("Não foi possível carregar a agenda agora.");
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ carregar quando admin + filtros
  useEffect(() => {
    if (!isAdmin) return;
    carregarEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, status, cidade]);

  async function atualizarStatus(id, novoStatus) {
    try {
      setErro("");

      const tabela = "agenda_eventos";

      const { error } = await supabase.from(tabela).update({ status: novoStatus }).eq("id", id);

      if (error) throw error;

      // refresh simples
      carregarEventos();
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
      setErro("Não foi possível atualizar o status.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* topo */}
        <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 px-6 py-5 text-white shadow-md border border-white/10">
          <p className="text-xs uppercase tracking-[0.16em] text-white/90">Painel Admin</p>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">Agenda de Eventos &amp; Shows</h1>
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl">
            Apenas logado e com aprovação no Painel Admin.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/painel"
              className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/20"
            >
              ← Voltar ao Painel
            </Link>
            <Link
              href="/noticias"
              className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/20"
            >
              Ver Notícias
            </Link>
          </div>
        </section>

        {/* bloqueios */}
        {!session?.user && (
          <section className="rounded-3xl bg-white border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-900">Você precisa estar logado.</p>
            <p className="text-xs text-slate-600 mt-1">Faça login para acessar o Painel Admin.</p>
            <div className="mt-3">
              <Link
                href="/login"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Ir para Login
              </Link>
            </div>
          </section>
        )}

        {session?.user && !isAdmin && (
          <section className="rounded-3xl bg-white border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-900">Acesso restrito.</p>
            <p className="text-xs text-slate-600 mt-1">Somente administradores podem aprovar eventos.</p>
          </section>
        )}

        {/* conteúdo admin */}
        {session?.user && isAdmin && (
          <>
            {/* filtros */}
            <section className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="reprovado">Reprovado</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold text-slate-600 mb-1">Cidade</label>
                  <select
                    className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  >
                    <option value="Todas">Todas</option>
                    {CIDADES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("pendente");
                      setCidade("Todas");
                    }}
                    className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-300"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={carregarEventos}
                    className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Atualizar
                  </button>
                </div>
              </div>

              {erro && (
                <p className="mt-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                  {erro}
                </p>
              )}
            </section>

            {/* lista */}
            <section className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Eventos na fila</h2>
                <p className="text-[11px] text-slate-500">{eventos.length} item(ns)</p>
              </div>

              {loading && <p className="text-[11px] text-slate-500">Carregando…</p>}

              {!loading && eventos.length === 0 && (
                <p className="text-[11px] text-slate-500">Nenhum evento encontrado para esse filtro.</p>
              )}

              {!loading &&
                eventos.map((ev) => {
                  const titulo = safe(ev.titulo) || "Sem título";
                  const cidadeEv = safe(ev.cidade) || "";
                  const local = safe(ev.local) || safe(ev.endereco) || "";
                  const inicio = ev.data_inicio || ev.data || ev.data_evento || ev.inicio;
                  const fim = ev.data_fim || ev.fim;

                  return (
                    <div
                      key={ev.id}
                      className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-sky-700">
                            {cidadeEv}
                            {cidadeEv && inicio ? " • " : ""}
                            {inicio ? fmtData(inicio) : ""}
                            {fim ? ` → ${fmtData(fim)}` : ""}
                          </p>

                          <h3 className="mt-1 text-sm font-bold text-slate-900 truncate">{titulo}</h3>

                          {local && (
                            <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">{local}</p>
                          )}

                          {ev.descricao && (
                            <p className="mt-2 text-[11px] text-slate-700 line-clamp-3">
                              {safe(ev.descricao)}
                            </p>
                          )}

                          {ev.link && (
                            <a
                              href={ev.link}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex text-[11px] font-semibold text-blue-700 hover:underline"
                            >
                              Link do evento →
                            </a>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => atualizarStatus(ev.id, "aprovado")}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Aprovar
                          </button>
                          <button
                            type="button"
                            onClick={() => atualizarStatus(ev.id, "reprovado")}
                            className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                          >
                            Reprovar
                          </button>
                          <button
                            type="button"
                            onClick={() => atualizarStatus(ev.id, "pendente")}
                            className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-300"
                          >
                            Pendente
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

