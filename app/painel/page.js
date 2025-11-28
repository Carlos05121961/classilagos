"use client";

import Link from "next/link";

export default function PainelPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Painel Classilagos
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Bem-vindo ao seu painel administrativo. Aqui você gerencia anúncios,
          notícias e outras áreas internas do portal.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card Meus anúncios */}
          <Link
            href="/painel/meus-anuncios"
            className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition p-4"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Meus anúncios
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Veja e gerencie todos os anúncios que você já publicou
              no Classilagos.
            </p>
            <span className="inline-flex text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
              Abrir painel de anúncios
            </span>
          </Link>

          {/* Card Importar notícias */}
          <Link
            href="/painel/importar-noticias"
            className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition p-4"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Importar notícias
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Busque automaticamente notícias do G1 Região dos Lagos e RC24h
              para o banco de dados.
            </p>
            <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
              Abrir importador de notícias
            </span>
          </Link>

          {/* Card Notícias importadas */}
          <Link
            href="/painel/noticias-importadas"
            className="block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition p-4"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Notícias importadas
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Veja as notícias trazidas das fontes externas, publique, refine
              ou exclua o que não for interessante.
            </p>
            <span className="inline-flex text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
              Gerenciar notícias importadas
            </span>
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Dica: a parte pública do portal de notícias fica em{" "}
          <strong>/noticias</strong>. Este painel é apenas para você gerenciar
          o conteúdo interno.
        </p>
      </div>
    </main>
  );
}
