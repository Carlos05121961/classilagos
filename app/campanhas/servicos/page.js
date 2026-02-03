"use client";

import Link from "next/link";

export default function CampanhaServicosPage() {
  const nextClassimed = encodeURIComponent("/anunciar/servicos/classimed?src=campanha");
  const nextEventos = encodeURIComponent("/anunciar/servicos/eventos?src=campanha");
  const nextProfissionais = encodeURIComponent("/anunciar/servicos/profissionais?src=campanha");

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
            Anuncie seus serviços
            <br className="hidden md:block" />
            na Região dos Lagos
          </h1>

          <p className="mt-3 text-slate-600 max-w-xl">
            Profissionais liberais, saúde, bem-estar, festas e eventos.
            Divulgação gratuita, contato direto e alcance regional.
          </p>

          {/* BOTÕES */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {/* CLASSIMED */}
            <Link
              href={`/cadastro?src=campanha&next=${nextClassimed}`}
              className="group rounded-2xl p-[2px] bg-gradient-to-r from-emerald-400 to-teal-500 hover:scale-[1.02] transition"
            >
              <div className="rounded-2xl bg-white p-5 h-full">
                <div className="text-3xl mb-2">🩺</div>
                <h2 className="font-bold text-slate-900">Classimed</h2>
                <p className="text-sm text-slate-600 mt-1">Saúde &amp; bem-estar</p>
                <span className="mt-3 inline-block text-sm font-semibold text-emerald-600">
                  Anunciar serviço →
                </span>
              </div>
            </Link>

            {/* EVENTOS */}
            <Link
              href={`/cadastro?src=campanha&next=${nextEventos}`}
              className="group rounded-2xl p-[2px] bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:scale-[1.02] transition"
            >
              <div className="rounded-2xl bg-white p-5 h-full">
                <div className="text-3xl mb-2">🎉</div>
                <h2 className="font-bold text-slate-900">Festas &amp; Eventos</h2>
                <p className="text-sm text-slate-600 mt-1">Eventos, DJs, buffets</p>
                <span className="mt-3 inline-block text-sm font-semibold text-fuchsia-600">
                  Anunciar serviço →
                </span>
              </div>
            </Link>

            {/* PROFISSIONAIS */}
            <Link
              href={`/cadastro?src=campanha&next=${nextProfissionais}`}
              className="group rounded-2xl p-[2px] bg-gradient-to-r from-sky-500 to-blue-500 hover:scale-[1.02] transition"
            >
              <div className="rounded-2xl bg-white p-5 h-full">
                <div className="text-3xl mb-2">🛠️</div>
                <h2 className="font-bold text-slate-900">Profissionais</h2>
                <p className="text-sm text-slate-600 mt-1">Serviços em geral</p>
                <span className="mt-3 inline-block text-sm font-semibold text-sky-600">
                  Anunciar serviço →
                </span>
              </div>
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Plataforma 100% gratuita. Alcance regional em toda a Região dos Lagos.
          </p>
        </div>
      </section>
    </main>
  );
}

