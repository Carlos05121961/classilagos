"use client";

import Link from "next/link";

export default function SubmissoesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">
              Painel • Notícias
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Central de submissões
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Aqui ficam os conteúdos que chegam de correspondentes e comunicados
              oficiais para você aprovar antes de publicar.
            </p>
          </div>

          <Link
            href="/admin/noticias"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Voltar
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Correspondentes (pendentes)
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Envio feito por correspondentes culturais (por cidade). Você aprova
              e transforma em notícia publicada.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-semibold text-amber-800">
                (Em ligação com a tabela)
              </span>
              <Link
                href="/noticias/correspondentes"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ver rede de correspondentes →
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Comunicados oficiais (pendentes)
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Conteúdo vindo de imprensa/prefeituras/secretarias. Publica separado
              com selo “Oficial”.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-[11px] font-semibold text-sky-800">
                (Em ligação com a tabela)
              </span>
              <Link
                href="/painel/criar-noticia"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Criar notícia manual →
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Próximo passo (pra eu ligar isso 100%)
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Me diga o <span className="font-semibold">nome exato</span> da tabela
            que você criou no Supabase (ex.: <code>submissoes</code> /
            <code>comunicados</code> etc.) e as colunas principais. Aí eu te devolvo:
            lista, detalhe, aprovar/rejeitar e “converter em notícia”.
          </p>
        </div>
      </div>
    </main>
  );
}
