"use client";

import Link from "next/link";

export default function CampanhaServicosPage() {
  return (
    <main className="relative min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        {/* CARD PRINCIPAL */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          {/* Selo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Classilagos • Serviços • 100% grátis
          </div>

          {/* Título */}
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Anuncie seus serviços <br className="hidden sm:block" />
            na Região dos Lagos
          </h1>

          {/* Subtítulo */}
          <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-600">
            Profissionais liberais, saúde &amp; bem-estar e festas &amp; eventos.
            Alcance milhares de pessoas em um só lugar.
            <strong className="text-slate-900"> É gratuito.</strong>
          </p>

          {/* BENEFÍCIOS */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 p-4 text-sm">
              <strong className="block text-slate-900">Sem cobrança</strong>
              Publicação 100% gratuita.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-sm">
              <strong className="block text-slate-900">Contato direto</strong>
              WhatsApp, telefone ou e-mail.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-sm">
              <strong className="block text-slate-900">Alcance regional</strong>
              Toda a Região dos Lagos.
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CLASSIMED */}
            <Link
              href="/anunciar/servicos/classimed"
              className="group relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-emerald-400 to-teal-500 transition-transform hover:scale-[1.02]"
            >
              <div className="rounded-3xl bg-white p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🩺</span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Classimed
                  </h2>
                </div>
                <p className="text-sm text-slate-600 mb-5">
                  Médicos, psicólogos, clínicas, terapias, academias e serviços
                  de saúde em geral.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md transition-all group-hover:gap-3">
                  Anunciar serviço de saúde →
                </div>
              </div>
            </Link>

            {/* FESTAS E EVENTOS */}
            <Link
              href="/anunciar/servicos/eventos"
              className="group relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 transition-transform hover:scale-[1.03]"
            >
              <div className="rounded-3xl bg-white p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🎉</span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Festas & Eventos
                  </h2>
                </div>
                <p className="text-sm text-slate-600 mb-5">
                  Buffets, bolos, DJs, som, luz, decoração, foto, vídeo e espaços
                  para eventos.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 shadow-lg transition-all group-hover:gap-3">
                  Anunciar evento →
                </div>
              </div>
            </Link>

            {/* PROFISSIONAIS */}
            <Link
              href="/anunciar/servicos/profissionais"
              className="group relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-sky-500 to-cyan-400 transition-transform hover:scale-[1.02]"
            >
              <div className="rounded-3xl bg-white p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🛠️</span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Profissionais Liberais
                  </h2>
                </div>
                <p className="text-sm text-slate-600 mb-5">
                  Eletricistas, encanadores, diaristas, técnicos, designers,
                  professores e serviços em geral.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md transition-all group-hover:gap-3">
                  Anunciar meu serviço →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
