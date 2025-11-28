"use client";

import { useState } from "react";

export default function ImportarNoticiasPage() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [fonteAtual, setFonteAtual] = useState(null);

  async function chamarImportacao(endpoint, fonteLabel) {
    try {
      setLoading(true);
      setFonteAtual(fonteLabel);
      setMensagem("");

      const resp = await fetch(endpoint, {
        method: "POST",
      });

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        setMensagem(
          `Erro ao importar de ${fonteLabel}: ${
            data.error || "Erro desconhecido."
          }`
        );
        return;
      }

      setMensagem(
        `Importação de ${fonteLabel} concluída! Encontradas ${data.found || 0}, inseridas ${data.inserted || 0}, puladas ${data.skipped || 0}.`
      );
    } catch (e) {
      console.error(e);
      setMensagem(
        `Erro inesperado ao importar de ${fonteLabel}: ${
          e.message || "Ver console."
        }`
      );
    } finally {
      setLoading(false);
      setFonteAtual(null);
    }
  }

  const handleImportG1 = () =>
    chamarImportacao("/api/rss/g1", "G1 Região dos Lagos");

  const handleImportRC24h = () =>
    chamarImportacao("/api/rss/rc24h", "RC24h");

  return (
    <main className="min-h-screen bg-[#F5FBFF] py-8 px-4">
      <section className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-7 space-y-6">
        <header className="space-y-2">
          <h1 className="text-lg md:text-xl font-bold text-slate-900">
            Importar notícias externas
          </h1>
          <p className="text-xs md:text-sm text-slate-600">
            Aqui você traz notícias de portais parceiros para o banco de dados
            do <strong>Classilagos Notícias</strong>. Depois você pode abrir cada
            notícia, refinar com IA e publicar no seu padrão.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {/* BLOCO G1 */}
          <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between bg-slate-50">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-900">
                G1 – Região dos Lagos
              </h2>
              <p className="text-[11px] text-slate-600">
                Importa as últimas matérias do G1 com foco em Região dos Lagos,
                Maricá e entorno (quando o feed estiver disponível/adequado).
              </p>
            </div>
            <button
              onClick={handleImportG1}
              disabled={loading}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-[#21D4FD] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3EC9C3] disabled:opacity-60"
            >
              {loading && fonteAtual === "G1 Região dos Lagos"
                ? "Importando G1..."
                : "Importar do G1"}
            </button>
          </div>

          {/* BLOCO RC24h */}
          <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between bg-slate-50">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-900">
                RC24h – Rede Costa do Sol
              </h2>
              <p className="text-[11px] text-slate-600">
                Importa as notícias mais recentes do portal{" "}
                <strong>RC24h</strong>, focado na Região dos Lagos. Mantemos a
                URL de origem e a fonte para referência e crédito.
              </p>
            </div>
            <button
              onClick={handleImportRC24h}
              disabled={loading}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading && fonteAtual === "RC24h"
                ? "Importando RC24h..."
                : "Importar do RC24h"}
            </button>
          </div>
        </div>

        {mensagem && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
            {mensagem}
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <h3 className="text-xs font-semibold text-slate-900">
            Como funciona esse painel
          </h3>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
            <li>
              Os textos importados ficam guardados na tabela{" "}
              <code>noticias</code>, com <strong>fonte</strong> e{" "}
              <strong>url_origem</strong>.
            </li>
            <li>
              Nada é publicado direto: <strong>publicado = false</strong>. Você
              decide o que virar matéria Classilagos.
            </li>
            <li>
              Depois, você pode abrir a notícia no painel, refinar com IA,
              ajustar título, texto curto e imagem, e só então marcar como
              publicada.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

