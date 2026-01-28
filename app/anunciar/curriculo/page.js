"use client";

import { Suspense } from "react";
import PrefillEmailFromQuery from "../../components/PrefillEmailFromQuery";
import FormularioCurriculo from "../../components/forms/FormularioCurriculo";

export default function AnunciarCurriculoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* ✅ precisa de Suspense por causa do useSearchParams */}
      <Suspense fallback={null}>
        <PrefillEmailFromQuery />
      </Suspense>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie gratuitamente
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Enviar currículo para empresas da Região dos Lagos
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl">
          Preencha suas informações profissionais ou envie seu currículo em PDF.
          Empresas da região poderão encontrar seu perfil facilmente.
        </p>
      </header>

      <FormularioCurriculo />
    </main>
  );
}
