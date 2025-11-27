"use client";

import FormularioServicos from "../../components/forms/FormularioServicos";

export default function AnunciarServicosPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
            Anuncie gratuitamente
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar serviço na Região dos Lagos
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Cadastre seu serviço em saúde, festas &amp; eventos ou como
            profissional liberal. Seu anúncio ficará visível para milhares de
            pessoas em todas as cidades da Região dos Lagos.
          </p>
        </div>

        {/* Card geral com formulário */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          <FormularioServicos />
        </div>
      </section>
    </main>
  );
}
