"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VerNoticiaPage() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    try {
      const res = await fetch(`/api/noticias/listar-importadas?t=${Date.now()}`, {
        cache: "no-store",
      });

      const text = await res.text();

      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }

      // ✅ pega o array certo (API retorna { data: [] })
      const arr = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const encontrada = arr.find((n) => String(n.id) === String(id));

      setNoticia(encontrada || null);
    } catch (e) {
      console.error("Erro ao carregar notícia:", e);
      setNoticia(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!id) return;
    carregar();
  }, [id]);

  if (loading) {
    return <main className="p-8 text-slate-600">Carregando notícia...</main>;
  }

  if (!noticia) {
    return <main className="p-8 text-slate-600">Notícia não encontrada.</main>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">{noticia.titulo}</h1>

      <p className="text-sm text-slate-600 mb-6">
        Fonte: <strong>{noticia.fonte || "Desconhecida"}</strong> •{" "}
        {noticia.created_at ? new Date(noticia.created_at).toLocaleString("pt-BR") : "—"}
      </p>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Resumo</h2>
        <p className="text-slate-700 text-sm mb-6">{noticia.resumo || "(Sem resumo)"}</p>

        <h2 className="text-lg font-semibold text-slate-800 mb-2">Texto completo</h2>
        <p className="text-slate-700 text-sm whitespace-pre-wrap">
          {noticia.texto || "(Sem texto importado)"}
        </p>
      </div>

      <div className="mt-6">
        <a
          href="/painel/noticias-importadas"
          className="inline-block rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Voltar
        </a>
      </div>
    </main>
  );
}
