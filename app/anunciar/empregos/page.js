"use client";

import FormularioEmpregos from "../../components/forms/FormularioEmpregos";

export default function AnunciarEmpregosPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie gratuitamente
        </p>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Publicar vaga de emprego
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl">
          Divulgue uma oportunidade de trabalho para milhares de candidatos das
          nove cidades da Região dos Lagos.
        </p>
      </header>

      {/* Formulário REAL de vagas */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioEmpregos />
      </section>

    </main>
  );
}
