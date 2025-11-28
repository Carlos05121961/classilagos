"use client";

import { useEffect, useState } from "react";

export default function NoticiasImportadasPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // Buscar notícias importadas
  async function carregar() {
    setLoading(true);
    const res = await fetch("/api/noticias/listar-importadas");
    const json = await res.json();
    setLista(json || []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  // Refinar com IA
  async function refinar(id) {
    setProcessando(id);
    setMensagem("Refinando com IA... aguarde...");

    try {
      const res = await fetch(`/api/noticias/refinar?id=${id}`, {
        method: "POST",
      });
      const json = await res.json();

      setMensagem(json.message || "Refinado!");
      carregar();
    } catch (e) {
      setMensagem("Erro ao refinar notícia.");
    }

    setProcessando(null);
  }

  // Publicar notícia
  async function publicar(id) {
    setProcessando(id);
    setMensagem("Publicando...");

    try {
      const res = await fetch(`/api/noticias/publicar?id=${id}`, {
        method: "POST",
      });
      const json = await res.json();

      setMensagem(json.message || "Publicado!");
      carregar();
    } catch (e) {
      setMensagem("Erro ao publicar.");
    }

    setProcessando(null);
  }

  // Excluir notícia
  async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

    setProcessando(id);
    setMensagem("Excluindo...");

    try {
      const res = await fetch(`/api/noticias/excluir?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      setMensagem(json.message || "Excluído!");
      carregar();
    } catch (e) {
      setMensagem("Erro ao excluir.");
    }

    setProcessando(null);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Notícias Importadas
      </h1>

      {mensagem && (
        <p className="mb-4 text-sm text-blue-600 font-medium">{mensagem}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-600">Carregando...</p>
      ) : lista.length === 0 ? (
        <p className="text-sm text-slate-600">
          Nenhuma notícia importada encontrada.
        </p>
      ) : (
        <div className="space-y-4">
          {lista.map((n) => (
            <div
              key={n.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {n.titulo || "(Sem título)"}
              </h2>

              <p className="text-xs text-slate-600 mb-2">
                Fonte: {n.fonte || "Desconhecida"} •{" "}
                {new Date(n.created_at).toLocaleDateString("pt-BR")}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  disabled={processando === n.id}
                  onClick={() => refinar(n.id)}
                  className="rounded-full bg-emerald-600 text-white text-xs px-4 py-1.5 hover:bg-emerald-700"
                >
                  {processando === n.id ? "Processando..." : "Refinar com IA"}
                </button>

                <button
                  disabled={processando === n.id}
                  onClick={() => publicar(n.id)}
                  className="rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 hover:bg-blue-700"
                >
                  Publicar
                </button>

                <button
                  disabled={processando === n.id}
                  onClick={() => excluir(n.id)}
                  className="rounded-full bg-red-600 text-white text-xs px-4 py-1.5 hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
