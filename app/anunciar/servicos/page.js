"use client";

import Link from "next/link";

export default function EscolherTipoServicoPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
            Anuncie gratuitamente
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Escolha o tipo de serviço que deseja anunciar
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Selecione abaixo se o seu serviço é da área de saúde (Classimed),
            festas &amp; eventos ou serviços profissionais em geral. Em seguida,
            você será levado ao formulário específico para cada área.
          </p>
        </div>

        {/* Cards de escolha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CLASSIMED */}
          <Link
            href="/anunciar/servicos/classimed"
            className="group block rounded-3xl border border-emerald-500 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🩺
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Saúde &amp; bem-estar
                </p>
                <h2 className="text-base md:text-lg font-bold text-slate-900">
                  Classimed
                </h2>
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mb-3">
              Psicólogos, dentistas, fisioterapeutas, médicos, terapeutas,
              nutricionistas, academias e outros serviços de saúde.
            </p>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
              Anunciar serviço de saúde <span>➜</span>
            </span>
          </Link>

          {/* FESTAS E EVENTOS */}
          <Link
            href="/anunciar/servicos/eventos"
            className="group block rounded-3xl border border-fuchsia-500 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-100 text-2xl">
                🎉
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700">
                  Festas &amp; eventos
                </p>
                <h2 className="text-base md:text-lg font-bold text-slate-900">
                  Festas e Eventos
                </h2>
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mb-3">
              Buffets, bolos e doces, decoração, DJs, som e luz, fotografia,
              filmagem, animação, espaços para festas e muito mais.
            </p>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-fuchsia-700 group-hover:gap-2 transition-all">
              Anunciar serviço de eventos <span>➜</span>
            </span>
          </Link>

          {/* PROFISSIONAIS LIBERAIS */}
          <Link
            href="/anunciar/servicos/profissionais"
            className="group block rounded-3xl border border-sky-500 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                🛠️
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                  Profissionais &amp; serviços gerais
                </p>
                <h2 className="text-base md:text-lg font-bold text-slate-900">
                  Profissionais Liberais
                </h2>
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mb-3">
              Eletricistas, encanadores, diaristas, professores particulares,
              consultores, designers, técnicos, consertos em geral e muito mais.
            </p>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-sky-700 group-hover:gap-2 transition-all">
              Anunciar meu serviço <span>➜</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
