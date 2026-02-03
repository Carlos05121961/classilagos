"use client";

import Link from "next/link";

export default function EscolherTipoServicoPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          {/* selo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Serviços • 100% grátis
          </div>

          {/* título */}
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Anuncie seus serviços
            <br />
            na Região dos Lagos.
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-3xl">
            Escolha abaixo o tipo de serviço para abrir o formulário certo.
            <span className="font-semibold text-slate-800"> É gratuito.</span>
          </p>

          {/* 3 destaques */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Sem cobrança</p>
              <p className="mt-1 text-xs text-slate-600">Publicação 100% gratuita.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Contato direto</p>
              <p className="mt-1 text-xs text-slate-600">WhatsApp, telefone ou e-mail.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Mais visibilidade</p>
              <p className="mt-1 text-xs text-slate-600">Apareça nas buscas do portal.</p>
            </div>
          </div>

          {/* cards/ações */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* CLASSIMED */}
            <Link
              href="/anunciar/servicos/classimed"
              className="group rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                  🩺
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    Saúde &amp; bem-estar
                  </p>
                  <h2 className="mt-0.5 text-base md:text-lg font-bold text-slate-900">
                    Classimed
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-slate-600">
                    Clínicas, consultórios, terapias, profissionais da saúde e bem-estar.
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                Anunciar no Classimed
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>

            {/* EVENTOS */}
            <Link
              href="/anunciar/servicos/eventos"
              className="group rounded-3xl border border-fuchsia-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-2xl">
                  🎉
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700">
                    Festas &amp; eventos
                  </p>
                  <h2 className="mt-0.5 text-base md:text-lg font-bold text-slate-900">
                    Festas e Eventos
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-slate-600">
                    Buffet, doces, decoração, DJ, som/luz, foto/vídeo, espaços e mais.
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-700">
                Anunciar para eventos
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>

            {/* PROFISSIONAIS */}
            <Link
              href="/anunciar/servicos/profissionais"
              className="group rounded-3xl border border-sky-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                  🛠️
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                    Profissionais &amp; serviços gerais
                  </p>
                  <h2 className="mt-0.5 text-base md:text-lg font-bold text-slate-900">
                    Profissionais Liberais
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-slate-600">
                    Eletricista, encanador, diarista, professor, consultor, designer e mais.
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
                Anunciar meu serviço
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </div>

          <p className="mt-5 text-xs text-slate-500 text-center">
            Plataforma 100% gratuita • A maior vitrine de anúncios da Região dos Lagos.
          </p>
        </div>
      </section>
    </main>
  );
}
