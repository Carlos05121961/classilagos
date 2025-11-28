"use client";

import FormularioCurriculo from "../../components/forms/FormularioCurriculo";

export default function CurriculoPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* Cabeçalho */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-5">
          <p className="text-[11px] text-slate-500 mb-1">
            Classilagos • Empregos
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Cadastrar meu currículo
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-600 max-w-2xl">
            Preencha seus dados e faça parte do banco de talentos do
            Classilagos para as nove cidades da Região dos Lagos.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="rounded-3xl bg-white shadow-sm border border-slate-200 px-4 py-5 md:px-6 md:py-6">
          <FormularioCurriculo />
        </div>
      </section>
    </main>
  );
}
