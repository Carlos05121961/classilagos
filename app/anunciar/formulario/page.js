"use client";

import { useSearchParams } from "next/navigation";

// IMPORTS DOS FORMULÁRIOS
import FormularioImoveis from "../../components/forms/FormularioImoveis";
import FormularioVeiculos from "../../components/forms/FormularioVeiculos";
import FormularioNautica from "../../components/forms/FormularioNautica";
import FormularioPets from "../../components/forms/FormularioPets";

export default function AnunciarFormularioPage() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");

  function renderFormulario() {
    switch (tipo) {
      case "imoveis":
        return <FormularioImoveis />;
      case "veiculos":
        return <FormularioVeiculos />;
      case "nautica":
        return <FormularioNautica />;
      case "pets":
        return <FormularioPets />;
      default:
        return (
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Escolha uma categoria válida
            </h1>
            <p className="text-slate-600 text-sm">
              Volte ao menu “Anuncie grátis” e escolha uma seção válida.
            </p>
          </div>
        );
    }
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        {renderFormulario()}
      </section>
    </main>
  );
}
