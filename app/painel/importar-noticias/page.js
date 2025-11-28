"use client";

import { useState } from "react";

export default function ImportarNoticiasPage() {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);

  async function importarG1() {
    setLoading(true);
    setLog("Importando notícias do G1, aguarde...");

    try {
      const res = await fetch("/api/rss/g1");
      const json = await res.json();
      setLog(JSON.stringify(json, null, 2));
    } catch (err) {
      setLog("Erro ao executar importação.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Importar Notícias (G1)
      </h1>

      <p className="text-slate-600 text-sm mb-6">
        Clique no botão abaixo para buscar as últimas notícias do G1 Região dos
        Lagos. As matérias serão armazenadas como <b>rascunho</b> no Supabase.
      </p>

      <button
        onClick={importarG1}
        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2"
        disabled={loading}
      >
        {loading ? "Importando..." : "Importar do G1 agora"}
      </button>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Retorno da importação
        </h2>

        <pre className="bg-slate-100 text-xs p-4 rounded-xl whitespace-pre-wrap text-slate-800">
          {log ? log : "Nenhuma importação feita ainda."}
        </pre>
      </div>

      <div className="mt-10 border-t pt-6">
        <a
          href="/noticias"
          className="text-blue-600 hover:underline text-sm"
        >
          Voltar para notícias
        </a>
      </div>
    </main>
  );
}
