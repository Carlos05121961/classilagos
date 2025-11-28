"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImportarNoticiasPage() {
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function importarG1() {
    setLoading(true);
    setMensagem("Importando notícias do G1… aguarde...");

    try {
      const res = await fetch("/api/rss/g1");
      const json = await res.json();

      if (json?.error) {
        setMensagem("Erro ao importar: " + json.error);
      } else {
        const total = json.total_encontrados ?? json.total ?? 0;
        const inseridos = json.inseridos ?? 0;
        const pulados = json.pulados ?? 0;

        setMensagem(
          `Importação concluída! Encontradas ${total}, inseridas ${inseridos}, puladas ${pulados}.`
        );
      }
    } catch (e) {
      setMensagem("Erro ao conectar com o servidor.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Importar notícias
      </h1>

      <p className="text-sm text-slate-600 mb-6">
        Aqui você busca as últimas matérias do{" "}
        <strong>G1 Região dos Lagos</strong> e salva como{" "}
        <strong>rascunho</strong> no Classilagos Notícias. Depois você pode
        revisar, refinar com IA e publicar.
      </p>

      {mensagem && (
        <p className="mb-4 text-sm font-medium text-blue-700">{mensagem}</p>
      )}

      <button
        onClick={importarG1}
        disabled={loading}
        className="rounded-full bg-emerald-600 text-white px-6 py-3 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Importando..." : "Importar do G1 agora"}
      </button>

      <div className="mt-6">
        <Link
          href="/painel/noticias-importadas"
          className="text-blue-600 text-sm hover:underline"
        >
          ➜ Ver notícias importadas
        </Link>
      </div>
    </main>
  );
}

