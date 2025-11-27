"use client";

import FormularioEventos from "../../../components/forms/FormularioEventos";

export default function AnunciarEventosPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-3 py-1 text-[11px] font-semibold text-fuchsia-700 border border-fuchsia-200">
            Festas &amp; eventos
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar serviço para festas e eventos
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Buffets, bolos, doces, decoração, DJ, som, luz, foto, vídeo,
            espaços para festas e tudo o que seu evento precisa na Região
            dos Lagos.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          <FormularioEventos />
        </div>
      </section>
    </main>
  );
}
