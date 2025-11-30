"use client";

import Link from "next/link";

export default function AdminNoticiasPage() {
  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          Administração • Classilagos
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Gerenciar notícias do portal
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Aqui você controla as notícias que aparecem no Classilagos: importa
          matérias do G1 e RC24h, revisa com IA, publica no portal e organiza
          o que é mais importante para a Região dos Lagos.
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Painel de notícias importadas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Notícias importadas
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Acesse o painel onde chegam as notícias automáticas do{" "}
              <span className="font-semibold">G1 Região dos Lagos</span> e{" "}
              <span className="font-semibold">RC24h</span>. Lá você pode ver a
              matéria completa, refinar com IA, publicar no site ou excluir o
              que não for interessante.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/painel/noticias-importadas"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-700"
            >
              Abrir painel de notícias importadas
            </Link>
          </div>
        </div>

        {/* Página pública de notícias */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Página pública de notícias
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Veja como as notícias estão aparecendo para o público na página
              principal de notícias do Classilagos. Ótimo para conferir títulos,
              chamadas e a ordem de exibição.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/noticias"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ver página pública de notícias
            </Link>
          </div>
        </div>
      </div>

      {/* Próximas funcionalidades (informativo) */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Próximos passos para o módulo de notícias
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Estas são algumas melhorias que podemos implementar depois:
        </p>
        <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 space-y-1">
          <li>Cadastrar notícias 100% autorais direto pelo painel.</li>
          <li>
            Destacar algumas notícias como “capa” ou “manchete principal”.
          </li>
          <li>
            Separar as notícias em categorias: Local, Regional, Nacional,
            Turismo etc.
          </li>
          <li>
            Histórico de importações e filtros para ver o que já foi publicado
            ou está em rascunho.
          </li>
        </ul>
      </div>
    </div>
  );
}
