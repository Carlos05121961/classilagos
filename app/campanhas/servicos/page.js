"use client";

import Link from "next/link";

export default function CampanhaServicosPage() {
  return (
    <main className="px-4 py-6 bg-slate-50 min-h-screen">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          {/* Selo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Serviços • 100% grátis
          </div>

          {/* Título */}
<h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
  Anuncie seus serviços{" "}
  <br className="hidden md:block" />
  na Região dos Lagos
</h1>


          {/* Subtítulo (suave – campanha) */}
          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
            Divulgue seu trabalho gratuitamente, fale direto com clientes e apareça para toda a Região dos Lagos.
          </p>

          {/* Cards/Botões Premium */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* CLASSIMED */}
            <Link
              href="/anunciar/servicos/classimed?src=campanha"
              className="group relative block rounded-3xl p-[2px] bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="rounded-3xl bg-white p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                    🩺
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Saúde &amp; bem-estar
                    </p>
                    <h2 className="text-base md:text-lg font-bold text-slate-900">Classimed</h2>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 mb-4">
                  Médicos, psicólogos, clínicas, terapias, academias e serviços de saúde em geral.
                </p>

                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500">
                  Anunciar serviço <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* FESTAS E EVENTOS */}
            <Link
              href="/anunciar/servicos/eventos?src=campanha"
              className="group relative block rounded-3xl p-[2px] bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="rounded-3xl bg-white p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-100 text-2xl">
                    🎉
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700">
                      Festas &amp; eventos
                    </p>
                    <h2 className="text-base md:text-lg font-bold text-slate-900">Festas &amp; Eventos</h2>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 mb-4">
                  Buffets, bolos e doces, decoração, DJs, som e luz, foto e filmagem, espaços e muito mais.
                </p>

                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-pink-500">
                  Anunciar serviço <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            {/* PROFISSIONAIS */}
            <Link
              href="/anunciar/servicos/profissionais?src=campanha"
              className="group relative block rounded-3xl p-[2px] bg-gradient-to-r from-sky-500 to-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="rounded-3xl bg-white p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                    🛠️
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                      Profissionais &amp; serviços
                    </p>
                    <h2 className="text-base md:text-lg font-bold text-slate-900">Profissionais</h2>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 mb-4">
                  Eletricista, encanador, diarista, professor particular, consultor, designer, técnicos e serviços em geral.
                </p>

                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-500">
                  Anunciar serviço <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500 text-center">
            Plataforma 100% gratuita. Alcance regional em toda a Região dos Lagos.
          </p>
        </div>
      </section>
    </main>
  );
}
