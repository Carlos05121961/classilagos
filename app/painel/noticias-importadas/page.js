"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NoticiasImportadasPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // Buscar notícias importadas
async function carregar() {
  setLoading(true);
  setMensagem("");

  try {
const res = await fetch(`/api/noticias/listar-importadas?t=${Date.now()}`, {
  cache: "no-store",
});


    // tenta ler como texto primeiro (evita crash quando volta HTML)
    const text = await res.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!res.ok) {
      const msg = json?.message || `Erro ao carregar (HTTP ${res.status}).`;
      setLista([]); // GARANTE array
      setMensagem(msg);
      setLoading(false);
      return;
    }

    // GARANTE array sempre
    const arr = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
    setLista(arr);
  } catch (e) {
    console.error(e);
    setLista([]); // GARANTE array
    setMensagem("Erro ao carregar notícias importadas.");
  }

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

      setMensagem(json.message || "Notícia refinada.");
      carregar();
    } catch (e) {
      console.error(e);
      setMensagem("Erro ao refinar notícia.");
    }

    setProcessando(null);
  }

  // Publicar notícia
  async function publicar(id) {
    setProcessando(id);
    setMensagem("Publicando notícia...");

    try {
      const res = await fetch(`/api/noticias/publicar?id=${id}`, {
        method: "POST",
      });
      const json = await res.json();

      setMensagem(json.message || "Notícia publicada com sucesso.");
      carregar();
    } catch (e) {
      console.error(e);
      setMensagem("Erro ao publicar notícia.");
    }

    setProcessando(null);
  }

  // Excluir notícia
async function excluir(id) {
  if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

  setProcessando(id);
  setMensagem("Excluindo notícia...");

  try {
    const res = await fetch(`/api/noticias/excluir?id=${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok) {
      setMensagem(json.message || "Erro ao excluir notícia.");
      return;
    }

    // 👉 AQUI É O PULO DO GATO
    // Remove a notícia da tela imediatamente
    setLista((listaAtual) =>
      listaAtual.filter((noticia) => noticia.id !== id)
    );

    setMensagem("Notícia excluída com sucesso.");
  } catch (e) {
    console.error(e);
    setMensagem("Erro ao excluir notícia.");
  }

  setProcessando(null);
}


  return (
    <main className="min-h-screen bg-white px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Notícias importadas
      </h1>

      <p className="text-sm text-slate-600 mb-4">
        Aqui você vê as notícias trazidas automaticamente do G1 Região dos
        Lagos e do RC24h. Você pode visualizar a notícia completa, refinar com
        IA, publicar no portal ou excluir o que não for interessante.
      </p>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={carregar}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2"
        >
          Atualizar lista
        </button>

        <span className="text-xs text-slate-500">
          Total importadas:{" "}
          <strong className="text-slate-700">{lista.length}</strong>
        </span>
      </div>

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
                {n.created_at
                  ? new Date(n.created_at).toLocaleDateString("pt-BR")
                  : "Data não informada"}
              </p>

              {n.status && (
                <p className="text-[11px] text-slate-500 mb-2">
                  Status:{" "}
                  <span
                    className={
                      n.status === "publicado"
                        ? "text-emerald-700 font-semibold"
                        : "text-amber-700 font-semibold"
                    }
                  >
                    {n.status}
                  </span>
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {/* Ver notícia */}
                <Link
                  href={`/painel/noticias-importadas/${n.id}`}
                  className="rounded-full bg-slate-600 text-white text-xs px-4 py-1.5 hover:bg-slate-700"
                >
                  Ver notícia
                </Link>

                {/* Refinar */}
                <button
                  disabled={processando === n.id}
                  onClick={() => refinar(n.id)}
                  className="rounded-full bg-emerald-600 text-white text-xs px-4 py-1.5 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {processando === n.id ? "Processando..." : "Refinar com IA"}
                </button>

                {/* Publicar */}
                <button
                  disabled={processando === n.id}
                  onClick={() => publicar(n.id)}
                  className="rounded-full bg-blue-600 text-white text-xs px-4 py-1.5 hover:bg-blue-700 disabled:opacity-60"
                >
                  Publicar
                </button>

                {/* Excluir */}
                <button
                  disabled={processando === n.id}
                  onClick={() => excluir(n.id)}
                  className="rounded-full bg-red-600 text-white text-xs px-4 py-1.5 hover:bg-red-700 disabled:opacity-60"
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
