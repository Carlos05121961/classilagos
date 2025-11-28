"use client";

import FormularioEmpregos from "../../components/forms/FormularioEmpregos";

export default function AnunciarEmpregoPage() {
  return (
    <main className="min-h-screen bg-[#F5FBFF] pb-10">
      {/* TOPO DA PÁGINA */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-5">
          <p className="text-[11px] text-slate-500 mb-1">
            Classilagos • Empregos
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Publicar vaga de emprego
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-2xl">
            Divulgue gratuitamente a vaga da sua empresa e receba candidatos das
            nove cidades da Região dos Lagos. Preencha os dados abaixo com o
            máximo de detalhes.
          </p>
        </div>
      </section>

      {/* FORMULÁRIO DE VAGAS */}
      <section className="max-w-4xl mx-auto px-4 pt-6">
        <div className="rounded-3xl bg-white border border-slate-200 px-4 py-6 md:px-6 md:py-7 shadow-sm">
          <FormularioEmpregos />
        </div>
      </section>
    </main>
  );
}

