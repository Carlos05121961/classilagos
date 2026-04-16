"use client";

import { useEffect, useState } from "react";
import FormularioProfissionais from "../../../components/forms/FormularioProfissionais";

function getSrc() {
  try {
    const qs = new URLSearchParams(window.location.search);
    return (qs.get("src") || "").toLowerCase();
  } catch {
    return "";
  }
}

export default function AnunciarProfissionaisPage() {
  const [ready, setReady] = useState(false);
  const [isCampanha, setIsCampanha] = useState(false);

  useEffect(() => {
    const campanhaNow = getSrc() === "campanha";
    setIsCampanha(campanhaNow);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="bg-slate-50 min-h-screen pb-12">
        <section className="max-w-5xl mx-auto px-4 pt-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Preparando seu acesso…</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-12">
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-200">
            Profissionais &amp; serviços gerais {isCampanha ? "• Campanha" : ""}
          </span>

          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Anunciar serviço profissional
          </h1>

          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Divulgue seus serviços como eletricista, encanador, diarista,
            professor, consultor, designer, técnico e muito mais em toda a
            Região dos Lagos.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-6">
          <FormularioProfissionais />
        </div>
      </section>
    </main>
  );
}
