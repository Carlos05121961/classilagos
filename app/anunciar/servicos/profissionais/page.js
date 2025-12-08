"use client";

import FormularioServicos from "../../components/forms/FormularioServicos";

export default function AnunciarServicosPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 border border-blue-200">
            Serviços em geral
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar um serviço
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Divulgue seus serviços profissionais, de saúde, eventos ou outras
            atividades para toda a Região dos Lagos através do Classilagos.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          <FormularioServicos />
        </div>
      </section>
    </main>
  );
}
