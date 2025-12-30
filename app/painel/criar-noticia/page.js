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
  "Região dos Lagos",
];

const CATEGORIAS = [
  "Geral",
  "Cultura",
  "Turismo",
  "Educação",
  "Esporte",
  "Economia",
  "Saúde",
  "Segurança",
  "Eventos",
  "Comércio",
  "Outros",
];

function clean(v) {
  return typeof v === "string" ? v.trim() : "";
}

export default function CriarNoticiaPage() {
  const [user, setUser] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("Maricá");
  const [categoria, setCategoria] = useState("Geral");
  const [resumo, setResumo] = useState("");
  const [texto, setTexto] = useState("");
  const [imagemCapa, setImagemCapa] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    })();
  }, []);

  const canSubmit = useMemo(() => {
    return clean(titulo).length >= 6 && clean(texto).length >= 20;
  }, [titulo, texto]);

  async function salvar(status) {
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const payload = {
        titulo: clean(titulo),
        cidade: clean(cidade),
        categoria: clean(categoria),
        resumo: clean(resumo),
        texto: clean(texto),
        imagem_capa: clean(imagemCapa) || null,
        status: status, // "rascunho" | "publicado"
        tipo: "autoral",
        published_at: status === "publicado" ? new Date().toISOString() : null,
      };

      // se existir user_id na tabela, a gente tenta preencher
      if (user?.id) payload.user_id = user.id;

      const { data, error } = await supabase
        .from("noticias")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        console.error(error);
        setErr(
          "Não consegui salvar. Pode ser alguma coluna obrigatória faltando na tabela 'noticias'."
        );
        setLoading(false);
        return;
      }

      setMsg(
        status === "publicado"
          ? "Notícia publicada com sucesso! ✅"
          : "Rascunho salvo com sucesso! ✅"
      );

      // limpa campos (opcional)
      setTitulo("");
      setResumo("");
      setTexto("");
      setImagemCapa("");

      // se publicou, já oferece abrir a notícia
      if (data?.id && status === "publicado") {
        setMsg(`Notícia publicada com sucesso! ✅ ID: ${data.id}`);
      }
    } catch (e) {
      console.error(e);
      setErr("Erro inesperado ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">
              Painel • Notícias
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Criar nova notícia (manual)
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Para testar o fluxo “do zero”: você escreve, salva como rascunho
              ou publica e já confere em /noticias.
            </p>
          </div>

          <Link
            href="/admin/noticias"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Voltar
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          {err ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {err}
            </div>
          ) : null}
          {msg ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {msg}
              {msg.includes("ID:") ? (
                <div className="mt-2">
                  <Link
                    href={`/noticias/${msg.split("ID:")[1].trim()}`}
                    className="text-sky-700 underline text-sm font-semibold"
                  >
                    Abrir notícia publicada →
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Título *
              </label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Ex.: Lagoa de Jacaroá recebe ação de limpeza..."
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Cidade
                </label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  {CIDADES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">
              Resumo (opcional)
            </label>
            <textarea
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="2 a 3 linhas chamando a atenção..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">
              Texto completo *
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={10}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Escreva a matéria completa aqui..."
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Dica: depois a gente evolui para upload de fotos (Storage) e galeria.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">
              URL da imagem de capa (opcional)
            </label>
            <input
              value={imagemCapa}
              onChange={(e) => setImagemCapa(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              disabled={!canSubmit || loading}
              onClick={() => salvar("rascunho")}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
            >
              Salvar rascunho
            </button>

            <button
              disabled={!canSubmit || loading}
              onClick={() => salvar("publicado")}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Publicar agora
            </button>

            <Link
              href="/noticias"
              className="ml-auto inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ver página pública →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
