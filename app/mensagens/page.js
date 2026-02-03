"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function MensagensPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState("");

  async function load() {
    setErro("");
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const u = data?.user || null;
    setUser(u);

    if (!u) {
      setItens([]);
      setLoading(false);
      return;
    }

    const { data: rows, error } = await supabase
      .from("notificacoes")
      .select("id, created_at, tipo, titulo, mensagem, acao_label, acao_url, lida")
      .eq("user_id", u.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) setErro(error.message || "Não foi possível carregar suas mensagens.");
    setItens(rows || []);
    setLoading(false);
  }

  async function marcarComoLida(id) {
    if (!user) return;
    await supabase
      .from("notificacoes")
      .update({ lida: true, lida_em: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    load();
  }

  async function marcarTodasComoLidas() {
    if (!user) return;
    await supabase
      .from("notificacoes")
      .update({ lida: true, lida_em: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("lida", false);
    load();
  }

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub?.subscription?.unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user && !loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Mensagens</h1>
        <p className="mt-2 text-slate-600">
          Você precisa estar logado para ver suas mensagens.
        </p>
        <div className="mt-4 flex gap-2">
          <Link href="/login" className="rounded-full bg-sky-600 text-white px-5 py-2 font-bold">
            Entrar
          </Link>
          <Link href="/" className="rounded-full border border-slate-200 px-5 py-2 font-bold">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mensagens</h1>
          <p className="mt-1 text-sm text-slate-600">
            Avisos do Classilagos para você.
          </p>
        </div>

        {user && (
          <button
            onClick={marcarTodasComoLidas}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50"
          >
            Marcar tudo como lido
          </button>
        )}
      </div>

      {erro && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
            Carregando…
          </div>
        ) : itens.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
            Nenhuma mensagem no momento.
          </div>
        ) : (
          itens.map((m) => (
            <div
              key={m.id}
              className={`rounded-3xl border bg-white p-5 shadow-sm ${
                m.lida ? "border-slate-200" : "border-amber-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(m.created_at).toLocaleString("pt-BR")}
                    {!m.lida && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-red-600 text-white px-2 py-0.5 text-[10px] font-extrabold">
                        NOVA
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 text-base font-extrabold text-slate-900">
                    {m.titulo}
                  </h2>
                  <p className="mt-1 text-sm text-slate-700 whitespace-pre-line">
                    {m.mensagem}
                  </p>
                </div>

                {!m.lida && (
                  <button
                    onClick={() => marcarComoLida(m.id)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>

              {(m.acao_url || m.acao_label) && (
                <div className="mt-3 flex gap-2">
                  {m.acao_url && (
                    <Link
                      href={m.acao_url}
                      className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-extrabold hover:bg-emerald-700"
                    >
                      {m.acao_label || "Abrir"}
                    </Link>
                  )}
                  <Link
                    href="/"
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50"
                  >
                    Ir para o site
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
