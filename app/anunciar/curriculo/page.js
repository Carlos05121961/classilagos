"use client";

import { useEffect, useState } from "react";
import FormularioCurriculo from "../../components/forms/FormularioCurriculo";

function getSrcFromUrl() {
  try {
    const qs = new URLSearchParams(window.location.search);
    return (qs.get("src") || "").toLowerCase();
  } catch {
    return "";
  }
}

export default function AnunciarCurriculoPage() {
  const [ready, setReady] = useState(false);
  const [isLand, setIsLand] = useState(false);

  useEffect(() => {
    const isLandNow = getSrcFromUrl() === "land";
    setIsLand(isLandNow);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">Preparando seu acesso…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Anuncie gratuitamente {isLand ? "• Modo campanha" : ""}
        </p>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Enviar currículo para empresas da Região dos Lagos
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl">
          Preencha suas informações profissionais ou envie seu currículo em PDF.
          Empresas da região poderão encontrar seu perfil facilmente.
        </p>
      </header>

      <section className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
        <FormularioCurriculo />
      </section>
    </main>
  );
}
